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

  useEffect(() => {
    loadUserData();
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
      const feedData = await getSocialFeed(id);
      setFeed(Array.isArray(feedData) ? feedData : []);
    } catch (error) {
      console.error('Error loading feed:', error);
      Alert.alert('Error', 'Failed to load social feed');
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
      <View style={styles.postCard}>
        <View style={styles.postHeader}>
          <TouchableOpacity 
            style={styles.userInfo}
            onPress={() => viewProfile(item.user_id)}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.user_name.charAt(0)}</Text>
            </View>
            <View>
              <Text style={styles.userName}>{item.user_name}</Text>
              <Text style={styles.postDate}>{formattedDate}</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.postContent}>
          {item.caption ? (
            <Text style={styles.caption}>{item.caption}</Text>
          ) : null}
          
          <View style={styles.workoutInfo}>
            <Text style={styles.workoutType}>{item.workout_type}</Text>
            <View style={styles.workoutStats}>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.statText}>{item.duration} min</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="flame-outline" size={16} color="#666" />
                <Text style={styles.statText}>{item.calories_burned} cal</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.postActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleLike(item)}
          >
            <Ionicons 
              name={item.user_liked ? "heart" : "heart-outline"} 
              size={22} 
              color={item.user_liked ? "#e91e63" : "#666"} 
            />
            <Text style={styles.actionText}>
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
            <Ionicons name="chatbubble-outline" size={22} color="#666" />
            <Text style={styles.actionText}>Comment</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => viewComments(item)}
          >
            <Ionicons name="chatbubbles-outline" size={22} color="#666" />
            <Text style={styles.actionText}>
              {item.comments_count} {item.comments_count === 1 ? 'Comment' : 'Comments'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {isCommenting && (
          <View style={styles.commentInput}>
            <TextInput
              style={styles.input}
              placeholder="Write a comment..."
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
                color={commentText.trim() ? "#0097e6" : "#ccc"} 
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
        <ActivityIndicator size="large" color="#0097e6" />
        <Text style={styles.loadingText}>Loading social feed...</Text>
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
          <Ionicons name="people-outline" size={24} color="#0097e6" />
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
            colors={["#0097e6"]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color="#ccc" />
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
    backgroundColor: '#0097e6',
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
    color: '#333',
  },
  postDate: {
    fontSize: 12,
    color: '#999',
  },
  postContent: {
    marginBottom: 15,
  },
  caption: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  workoutInfo: {
    backgroundColor: '#f0f2f5',
    borderRadius: 8,
    padding: 12,
  },
  workoutType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
    color: '#666',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f2f5',
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
    backgroundColor: '#0097e6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});