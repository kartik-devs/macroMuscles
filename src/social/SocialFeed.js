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
import { useTheme } from '../theme/ThemeContext';

export default function SocialFeed({ navigation }) {
  const { colors } = useTheme();
  const [userId, setUserId] = useState(null);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [expandedPost, setExpandedPost] = useState(null);
  const [comments, setComments] = useState({});
  const [loadingComments, setLoadingComments] = useState(false);

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

  const toggleExpandedPost = async (postId) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
    } else {
      setExpandedPost(postId);
      // Load comments if not already loaded
      if (!comments[postId]) {
        await loadComments(postId);
      }
    }
  };

  const loadComments = async (postId) => {
    try {
      setLoadingComments(true);
      const commentsData = await getWorkoutComments(postId);
      setComments(prev => ({
        ...prev,
        [postId]: commentsData
      }));
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleBookmark = async (item) => {
    // TODO: Implement bookmark functionality
    console.log('Bookmarking post:', item.id);
  };

  const handleShare = async (item) => {
    // TODO: Implement share functionality
    console.log('Sharing post:', item.id);
  };

  const viewProfile = (userId) => {
    navigation.navigate('UserProfile', { userId });
  };

  const renderFeedItem = ({ item }) => {
    const formattedDate = new Date(item.created_at).toLocaleDateString();
    const isCommenting = activeCommentPost === item.id;
    const isExpanded = expandedPost === item.id;
    const postComments = comments[item.id] || [];
    
    return (
      <View style={[styles.postCard, { backgroundColor: colors.surface }]}>
        <View style={styles.postHeader}>
          <TouchableOpacity 
            style={styles.userInfo}
            onPress={() => viewProfile(item.user_id)}
          >
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={[styles.avatarText, { color: colors.textInverse }]}>{item.user_name.charAt(0)}</Text>
            </View>
            <View>
              <Text style={[styles.userName, { color: colors.text }]}>{item.user_name}</Text>
              <Text style={[styles.postDate, { color: colors.textSecondary }]}>{formattedDate}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.postActions}>
            <TouchableOpacity onPress={() => handleBookmark(item)}>
              <Ionicons name="bookmark-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleShare(item)}>
              <Ionicons name="share-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.postContent}>
          {item.caption ? (
            <Text style={[styles.caption, { color: colors.text }]}>{item.caption}</Text>
          ) : null}
          
          <View style={styles.workoutInfo}>
            <Text style={[styles.workoutType, { color: colors.text }]}>{item.workout_type}</Text>
            <View style={styles.workoutStats}>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                <Text style={[styles.statText, { color: colors.textSecondary }]}>{item.duration} min</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="flame-outline" size={16} color={colors.textSecondary} />
                <Text style={[styles.statText, { color: colors.textSecondary }]}>{item.calories_burned} cal</Text>
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
              color={item.user_liked ? "#e91e63" : colors.textSecondary} 
            />
            <Text style={[styles.actionText, { color: colors.textSecondary }]}>
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
            <Ionicons name="chatbubble-outline" size={22} color={colors.textSecondary} />
            <Text style={[styles.actionText, { color: colors.textSecondary }]}>Comment</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => toggleExpandedPost(item.id)}
          >
            <Ionicons 
              name={isExpanded ? "chevron-up" : "chevron-down"} 
              size={22} 
              color={colors.textSecondary} 
            />
            <Text style={[styles.actionText, { color: colors.textSecondary }]}>
              {isExpanded ? 'Less' : 'More'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {isCommenting && (
          <View style={[styles.commentInput, { backgroundColor: colors.surfaceSecondary }]}>
            <TextInput
              style={[styles.input, { backgroundColor: colors.input, borderColor: colors.inputBorder, color: colors.text }]}
              placeholder="Write a comment..."
              placeholderTextColor={colors.inputPlaceholder}
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <TouchableOpacity 
              style={[styles.sendButton, { backgroundColor: colors.primary }]}
              onPress={handleComment}
              disabled={!commentText.trim()}
            >
              <Ionicons 
                name="send" 
                size={24} 
                color={commentText.trim() ? colors.textInverse : colors.textTertiary} 
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Expanded Section */}
        {isExpanded && (
          <View style={[styles.expandedSection, { backgroundColor: colors.surfaceSecondary }]}>
            {/* Detailed Workout Info */}
            <View style={styles.workoutDetails}>
              <Text style={[styles.detailsTitle, { color: colors.text }]}>Workout Details</Text>
              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={16} color={colors.primary} />
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Duration</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{item.duration} min</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="flame-outline" size={16} color={colors.primary} />
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Calories</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{item.calories_burned} cal</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="fitness-outline" size={16} color={colors.primary} />
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Type</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{item.workout_type}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="calendar-outline" size={16} color={colors.primary} />
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Date</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{formattedDate}</Text>
                </View>
              </View>
            </View>

            {/* Comments Section */}
            <View style={styles.commentsSection}>
              <Text style={[styles.commentsTitle, { color: colors.text }]}>
                Comments ({item.comments_count})
              </Text>
              {loadingComments ? (
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading comments...</Text>
              ) : postComments.length > 0 ? (
                <View style={styles.commentsList}>
                  {postComments.slice(0, 3).map((comment, index) => (
                    <View key={index} style={styles.commentItem}>
                      <View style={[styles.commentAvatar, { backgroundColor: colors.primary }]}>
                        <Text style={[styles.commentAvatarText, { color: colors.textInverse }]}>
                          {comment.user_name ? comment.user_name.charAt(0) : 'U'}
                        </Text>
                      </View>
                      <View style={styles.commentContent}>
                        <Text style={[styles.commentAuthor, { color: colors.text }]}>
                          {comment.user_name || 'Anonymous'}
                        </Text>
                        <Text style={[styles.commentText, { color: colors.textSecondary }]}>
                          {comment.comment}
                        </Text>
                        <Text style={[styles.commentTime, { color: colors.textTertiary }]}>
                          {new Date(comment.created_at).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  ))}
                  {postComments.length > 3 && (
                    <TouchableOpacity 
                      style={styles.viewAllComments}
                      onPress={() => viewComments(item)}
                    >
                      <Text style={[styles.viewAllText, { color: colors.primary }]}>
                        View all {postComments.length} comments
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <Text style={[styles.noCommentsText, { color: colors.textTertiary }]}>
                  No comments yet. Be the first to comment!
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
        <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading social feed...</Text>
          <Text style={[styles.timeoutText, { color: colors.textSecondary }]}>
            If this takes too long, check your internet connection
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar} backgroundColor={colors.background} />
      <View style={[styles.contentContainer, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Social Feed</Text>
        <TouchableOpacity 
          style={styles.friendsButton}
          onPress={() => navigation.navigate('Friends')}
        >
          <Ionicons name="people-outline" size={24} color={colors.primary} />
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
          <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
            <Ionicons name="people-outline" size={64} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.text }]}>No posts to show</Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Connect with friends or share your workouts to see posts here
            </Text>
          </View>
        }
      />
      
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('ShareWorkout')}
      >
        <Ionicons name="add" size={24} color={colors.textInverse} />
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
  timeoutText: {
    marginTop: 5,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  expandedSection: {
    marginTop: 8,
    padding: 16,
    borderRadius: 8,
  },
  workoutDetails: {
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
    borderRadius: 6,
  },
  detailLabel: {
    fontSize: 12,
    marginLeft: 6,
    marginRight: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  commentsSection: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 16,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  commentsList: {
    maxHeight: 200,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  commentAvatarText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 4,
  },
  commentTime: {
    fontSize: 12,
  },
  viewAllComments: {
    paddingVertical: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  noCommentsText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 10,
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