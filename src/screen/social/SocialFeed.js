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
    const isCommenting = activeCommentPost === item.id;
    
    return (
      <View style={[styles.postCard, { backgroundColor: theme.colors.card }]}>
        <View style={styles.postHeader}>
          <TouchableOpacity 
            style={styles.userInfo}
            onPress={() => viewProfile(item.user_id)}
          >
            <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.avatarText}>{item.user_name.charAt(0)}</Text>
            </View>
            <View>
              <Text style={[styles.userName, { color: theme.colors.text }]}>{item.user_name}</Text>
              <Text style={[styles.postDate, { color: theme.colors.textTertiary }]}>{formattedDate}</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.postContent}>
          {item.caption ? (
            <Text style={[styles.caption, { color: theme.colors.text }]}>{item.caption}</Text>
          ) : null}
          
          <View style={[styles.workoutInfo, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.workoutType, { color: theme.colors.text }]}>{item.workout_type}</Text>
            <View style={styles.workoutStats}>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>{item.duration} min</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="flame-outline" size={16} color={theme.colors.textSecondary} />
                <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>{item.calories_burned} cal</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={[styles.postActions, { borderTopColor: theme.colors.border }]}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleLike(item)}
          >
            <Ionicons 
              name={item.user_liked ? "heart" : "heart-outline"} 
              size={22} 
              color={item.user_liked ? "#e91e63" : theme.colors.textSecondary} 
            />
            <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
              {item.likes_count} {item.likes_count === 1 ? 'Like' : 'Likes'}
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
            <Ionicons name="chatbubble-outline" size={22} color={theme.colors.textSecondary} />
            <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>Comment</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => viewComments(item)}
          >
            <Ionicons name="chatbubbles-outline" size={22} color={theme.colors.textSecondary} />
            <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
              {item.comments_count} {item.comments_count === 1 ? 'Comment' : 'Comments'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {isCommenting && (
          <View style={[styles.commentInput, { borderTopColor: theme.colors.border }]}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.background, color: theme.colors.text }]}
              placeholder="Write a comment..."
              placeholderTextColor={theme.colors.textTertiary}
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={handleComment}
              disabled={!commentText.trim()}
            >
              <Ionicons 
                name="send" 
                size={24} 
                color={commentText.trim() ? theme.colors.primary : theme.colors.textSecondary} 
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
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
            <Ionicons name="people-outline" size={64} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>No posts to show</Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.textTertiary }]}>
              Connect with friends or share your workouts to see posts here
            </Text>
          </View>
        }
      />
      
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
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
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  friendsButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 15,
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
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postDate: {
    fontSize: 12,
  },
  postContent: {
    marginBottom: 15,
  },
  caption: {
    fontSize: 16,
    marginBottom: 10,
  },
  workoutInfo: {
    borderRadius: 8,
    padding: 12,
  },
  workoutType: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  workoutStats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  statText: {
    marginLeft: 5,
    fontSize: 14,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    paddingTop: 10,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 14,
  },
  sendButton: {
    marginLeft: 10,
    padding: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
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
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});