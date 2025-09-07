import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getWorkoutComments, commentOnWorkout, likeComment, unlikeComment } from '../../api/social';
import { getCurrentUserId } from '../../api/auth';

export default function Comments({ route, navigation }) {
  const { sharedWorkoutId } = route.params;
  const [userId, setUserId] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showReactions, setShowReactions] = useState(null);
  const flatListRef = useRef(null);
  const heartAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const id = await getCurrentUserId();
      setUserId(id);
      if (id) {
        loadComments();
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadComments = async () => {
    try {
      const commentsData = await getWorkoutComments(sharedWorkoutId);
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
      Alert.alert('Error', 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    
    try {
      setSending(true);
      const commentData = {
        text: commentText.trim(),
        replyTo: replyingTo?.id || null
      };
      
      await commentOnWorkout(userId, sharedWorkoutId, commentData);
      
      // Refresh comments
      const newComments = await getWorkoutComments(sharedWorkoutId);
      setComments(newComments);
      
      // Clear input and reply state
      setCommentText('');
      setReplyingTo(null);
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', error.message || 'Failed to add comment');
    } finally {
      setSending(false);
    }
  };

  const handleLikeComment = async (commentId, isLiked) => {
    try {
      if (isLiked) {
        await unlikeComment(userId, commentId);
      } else {
        await likeComment(userId, commentId);
        
        // Heart animation
        Animated.sequence([
          Animated.timing(heartAnimation, {
            toValue: 1.3,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(heartAnimation, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
      }
      
      // Update local state
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === commentId 
            ? { 
                ...comment, 
                isLiked: !isLiked,
                likesCount: isLiked ? comment.likesCount - 1 : comment.likesCount + 1
              }
            : comment
        )
      );
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleReply = (comment) => {
    setReplyingTo(comment);
    setCommentText(`@${comment.user_name} `);
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setCommentText('');
  };

  const renderCommentItem = ({ item }) => {
    const formattedDate = new Date(item.created_at).toLocaleString();
    const timeAgo = getTimeAgo(new Date(item.created_at));
    const isCurrentUser = userId === item.user_id;
    const isLiked = item.isLiked || false;
    const likesCount = item.likesCount || 0;
    
    return (
      <View style={[
        styles.commentBubble,
        isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
      ]}>
        <View style={styles.commentHeader}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.user_name}</Text>
            <Text style={styles.commentDate}>{timeAgo}</Text>
          </View>
          <TouchableOpacity 
            style={styles.moreButton}
            onPress={() => setShowReactions(showReactions === item.id ? null : item.id)}
          >
            <Ionicons name="ellipsis-horizontal" size={16} color="#666" />
          </TouchableOpacity>
        </View>
        
        {item.replyTo && (
          <View style={styles.replyIndicator}>
            <Ionicons name="return-up-left" size={14} color="#666" />
            <Text style={styles.replyText}>Replying to {item.replyTo.user_name}</Text>
          </View>
        )}
        
        <Text style={styles.commentText}>{item.comment || item.text}</Text>
        
        <View style={styles.commentActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleLikeComment(item.id, isLiked)}
          >
            <Animated.View style={{ transform: [{ scale: heartAnimation }] }}>
              <Ionicons 
                name={isLiked ? "heart" : "heart-outline"} 
                size={16} 
                color={isLiked ? "#e91e63" : "#666"} 
              />
            </Animated.View>
            {likesCount > 0 && (
              <Text style={[styles.actionText, isLiked && styles.likedText]}>
                {likesCount}
              </Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleReply(item)}
          >
            <Ionicons name="chatbubble-outline" size={16} color="#666" />
            <Text style={styles.actionText}>Reply</Text>
          </TouchableOpacity>
        </View>
        
        {showReactions === item.id && (
          <View style={styles.reactionsContainer}>
            <TouchableOpacity style={styles.reactionButton}>
              <Text style={styles.reactionEmoji}>👍</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reactionButton}>
              <Text style={styles.reactionEmoji}>❤️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reactionButton}>
              <Text style={styles.reactionEmoji}>😂</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.reactionButton}>
              <Text style={styles.reactionEmoji}>🔥</Text>
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

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comments</Text>
        <View style={{ width: 40 }} />
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E53935" />
          <Text style={styles.loadingText}>Loading comments...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={comments}
          renderItem={renderCommentItem}
          keyExtractor={item => (item.id || item._id || Math.random()).toString()}
          contentContainerStyle={styles.commentsList}
          inverted={false}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubble-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No comments yet</Text>
              <Text style={styles.emptySubtext}>Be the first to comment</Text>
            </View>
          }
        />
      )}
      
      <View style={styles.inputContainer}>
        {replyingTo && (
          <View style={styles.replyBar}>
            <View style={styles.replyInfo}>
              <Ionicons name="return-up-left" size={16} color="#E53935" />
              <Text style={styles.replyText}>Replying to {replyingTo.user_name}</Text>
            </View>
            <TouchableOpacity onPress={cancelReply}>
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder={replyingTo ? `Reply to ${replyingTo.user_name}...` : "Write a comment..."}
            value={commentText}
            onChangeText={setCommentText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              (!commentText.trim() || sending) && styles.disabledButton
            ]}
            onPress={handleAddComment}
            disabled={!commentText.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
        
        <Text style={styles.characterCount}>
          {commentText.length}/500
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  commentsList: {
    padding: 15,
    flexGrow: 1,
  },
  commentBubble: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    maxWidth: '80%',
  },
  currentUserBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#0097e6',
  },
  otherUserBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f2f5',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  commentDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  replyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 8,
  },
  replyText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontStyle: 'italic',
  },
  commentActions: {
    flexDirection: 'row',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    paddingVertical: 4,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  likedText: {
    color: '#e91e63',
    fontWeight: 'bold',
  },
  reactionsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  reactionButton: {
    marginRight: 12,
    padding: 4,
  },
  reactionEmoji: {
    fontSize: 18,
  },
  commentText: {
    fontSize: 16,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 10,
  },
  replyBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  replyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    minHeight: 40,
    fontSize: 16,
    marginRight: 8,
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});