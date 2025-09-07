import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Alert,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getSocialFeed, likeWorkout, unlikeWorkout, commentOnWorkout } from '../../api/social';
import { getWorkoutHistory } from '../../api/profile';
import { getCurrentUserId } from '../../api/auth';

export default function SocialFeed({ navigation }) {
  const [userId, setUserId] = useState(null);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [loadingTime, setLoadingTime] = useState(0);

  useEffect(() => {
    loadUserData();
    
    // Add loading timer
    const timer = setInterval(() => {
      setLoadingTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const loadUserData = async () => {
    try {
      const id = await getCurrentUserId();
      setUserId(id);
      if (id) {
        loadFeed(id);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadFeed = async (id) => {
    try {
      setLoading(true);
      console.log('Loading feed for user:', id);
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      const feedData = await Promise.race([
        getSocialFeed(id),
        timeoutPromise
      ]);
      
      console.log('Feed data received:', feedData);
      setFeed(Array.isArray(feedData) ? feedData : []);
      setLoadingTime(0); // Reset loading time on success
    } catch (error) {
      console.error('Error loading feed:', error);
      console.error('Error details:', error.message, error.response?.data);
      Alert.alert('Error', `Failed to load social feed: ${error.message}`);
      setFeed([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadFeed(userId);
  };

  const handleLike = async (item) => {
    if (!userId) return;
    
    try {
      if (item.user_liked) {
        await unlikeWorkout(userId, item.id);
      } else {
        await likeWorkout(userId, item.id);
      }
      
      // Update the feed item
      const updatedFeed = feed.map(post => {
        if (post.id === item.id) {
          return {
            ...post,
            likes_count: item.user_liked ? post.likes_count - 1 : post.likes_count + 1,
            user_liked: !item.user_liked
          };
        }
        return post;
      });
      
      setFeed(updatedFeed);
    } catch (error) {
      console.error('Error liking/unliking post:', error);
      Alert.alert('Error', error.message || 'Failed to like/unlike post');
    }
  };

  const handleComment = async () => {
    if (!userId || !activeCommentPost || !commentText.trim()) return;
    
    try {
      await commentOnWorkout(userId, activeCommentPost, commentText.trim());
      
      // Update the feed item
      const updatedFeed = feed.map(post => {
        if (post.id === activeCommentPost) {
          return {
            ...post,
            comments_count: post.comments_count + 1
          };
        }
        return post;
      });
      
      setFeed(updatedFeed);
      setCommentText('');
      setActiveCommentPost(null);
      
      // Show success message
      Alert.alert('Success', 'Comment added successfully');
    } catch (error) {
      console.error('Error commenting on post:', error);
      Alert.alert('Error', error.message || 'Failed to add comment');
    }
  };

  const viewComments = (item) => {
    navigation.navigate('Comments', { sharedWorkoutId: item.id });
  };

  const viewProfile = (userId) => {
    navigation.navigate('UserProfile', { userId });
  };

  const renderFeedItem = ({ item }) => {
    const formattedDate = new Date(item.created_at).toLocaleDateString();
    const timeAgo = getTimeAgo(new Date(item.created_at));
    const isCommenting = activeCommentPost === item.id;
    
    return (
      <View style={styles.postCard}>
        {/* Enhanced Header */}
        <View style={styles.postHeader}>
          <TouchableOpacity 
            style={styles.userInfo}
            onPress={() => viewProfile(item.user_id)}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.user_name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{item.user_name}</Text>
              <Text style={styles.postDate}>{timeAgo}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        
        {/* Enhanced Content */}
        <View style={styles.postContent}>
          {item.caption ? (
            <Text style={styles.caption}>{item.caption}</Text>
          ) : null}
          
          {/* Post Image */}
          {item.image_url && (
            <View style={styles.postImageContainer}>
              <Image 
                source={{ uri: item.image_url }} 
                style={styles.postImage}
                resizeMode="cover"
              />
            </View>
          )}
          
          <View style={styles.workoutCard}>
            <View style={styles.workoutHeader}>
              <View style={styles.workoutTypeContainer}>
                <Ionicons name="fitness" size={18} color="#E53935" />
                <Text style={styles.workoutType}>{item.workout_type}</Text>
              </View>
              <View style={styles.workoutBadge}>
                <Text style={styles.workoutBadgeText}>WORKOUT</Text>
              </View>
            </View>
            
            <View style={styles.workoutStats}>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.statText}>{item.duration} min</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="flame-outline" size={16} color="#666" />
                <Text style={styles.statText}>{item.calories_burned} cal</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="trophy-outline" size={16} color="#666" />
                <Text style={styles.statText}>Completed</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Enhanced Actions */}
        <View style={styles.postActions}>
          <TouchableOpacity 
            style={[styles.actionButton, item.user_liked && styles.likedButton]}
            onPress={() => handleLike(item)}
          >
            <Ionicons 
              name={item.user_liked ? "heart" : "heart-outline"} 
              size={22} 
              color={item.user_liked ? "#e91e63" : "#666"} 
            />
            <Text style={[styles.actionText, item.user_liked && styles.likedText]}>
              {item.likes_count || 0}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              if (isCommenting) {
                setActiveCommentPost(null);
              } else {
                setActiveCommentPost(item.id);
              }
            }}
          >
            <Ionicons name="chatbubble-outline" size={22} color="#666" />
            <Text style={styles.actionText}>{item.comments_count || 0}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => viewComments(item)}
          >
            <Ionicons name="share-outline" size={22} color="#666" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
        
        {/* Enhanced Comment Input */}
        {isCommenting && (
          <View style={styles.commentInput}>
            <TextInput
              style={styles.input}
              placeholder="Write a comment..."
              value={commentText}
              onChangeText={setCommentText}
              multiline
              maxLength={280}
            />
            <TouchableOpacity 
              style={[styles.sendButton, !commentText.trim() && styles.disabledSendButton]}
              onPress={handleComment}
              disabled={!commentText.trim()}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={commentText.trim() ? "#E53935" : "#ccc"} 
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E53935" />
        <Text style={styles.loadingText}>Loading social feed...</Text>
        {loadingTime > 5 && (
          <Text style={styles.loadingSubtext}>
            Taking longer than usual. Check your connection.
          </Text>
        )}
        {loadingTime > 10 && (
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setLoadingTime(0);
              loadFeed(userId);
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Social Feed</Text>
        <TouchableOpacity 
          style={styles.friendsButton}
          onPress={() => navigation.navigate('Friends')}
        >
          <Ionicons name="people-outline" size={24} color="#E53935" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={feed}
        renderItem={renderFeedItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.feedList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#E53935"]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#666" />
            <Text style={styles.emptyText}>No posts to show</Text>
            <Text style={styles.emptySubtext}>
              Connect with friends or share your workouts to see posts here
            </Text>
          </View>
        }
      />
      
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('ShareWorkout')}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  friendsButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 15,
    backgroundColor: '#E53935',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  feedList: {
    paddingVertical: 10,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  postDate: {
    fontSize: 12,
    color: '#999',
  },
  moreButton: {
    padding: 8,
  },
  postContent: {
    marginBottom: 15,
  },
  caption: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    lineHeight: 22,
  },
  postImageContainer: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  workoutCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#E53935',
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  workoutBadge: {
    backgroundColor: '#E53935',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  workoutBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  workoutStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 8,
  },
  statText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    paddingHorizontal: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 60,
    justifyContent: 'center',
  },
  likedButton: {
    backgroundColor: '#ffe6f0',
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  likedText: {
    color: '#e91e63',
    fontWeight: 'bold',
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    paddingHorizontal: 4,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
    minHeight: 40,
  },
  sendButton: {
    marginLeft: 8,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#E53935',
    minWidth: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledSendButton: {
    backgroundColor: '#ccc',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 5,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});