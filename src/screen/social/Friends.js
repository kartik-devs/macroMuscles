import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  searchUsers, 
  sendFriendRequest, 
  getFriendRequests, 
  respondToFriendRequest,
  getFriends 
} from '../../api/social';
import { getCurrentUserId } from '../../api/auth';

export default function Friends({ navigation }) {
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('friends'); // 'friends', 'requests', 'search'
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const id = await getCurrentUserId();
      setUserId(id);
      if (id) {
        await Promise.all([
          loadFriends(id),
          loadFriendRequests(id)
        ]);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFriends = async (id) => {
    try {
      const friendsData = await getFriends(id);
      setFriends(friendsData);
    } catch (error) {
      console.error('Error loading friends:', error);
      Alert.alert('Error', 'Failed to load friends');
    }
  };

  const loadFriendRequests = async (id) => {
    try {
      const requestsData = await getFriendRequests(id);
      setFriendRequests(requestsData);
    } catch (error) {
      console.error('Error loading friend requests:', error);
      Alert.alert('Error', 'Failed to load friend requests');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setSearching(true);
      const results = await searchUsers(searchQuery);
      
      // Filter out current user from results and handle MongoDB _id
      const filteredResults = results.filter(user => user._id !== userId && user.id !== userId);
      
      setSearchResults(filteredResults);
      setActiveTab('search');
      addToRecentSearches(searchQuery);
      
      if (filteredResults.length === 0) {
        // Show a helpful message when no results are found
        Alert.alert('No Results', `No users found matching "${searchQuery}". Try a different search term.`);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      Alert.alert('Search Error', error.message || 'Failed to search users');
    } finally {
      setSearching(false);
    }
  };

  // Real-time search with debouncing
  const handleSearchChange = (text) => {
    setSearchQuery(text);
    if (text.trim().length >= 2) {
      // Debounce search for better performance
      const timeoutId = setTimeout(() => {
        handleSearch();
      }, 300); // Reduced from 500ms to 300ms for better responsiveness
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setActiveTab('friends');
    }
  };

  // Add search to recent searches
  const addToRecentSearches = (query) => {
    if (query.trim()) {
      setRecentSearches(prev => {
        const filtered = prev.filter(item => item !== query);
        return [query, ...filtered].slice(0, 5); // Keep only 5 recent searches
      });
    }
  };

  // Handle recent search selection
  const handleRecentSearch = (query) => {
    setSearchQuery(query);
    handleSearch();
  };

  const handleSendFriendRequest = async (friendId) => {
    try {
      const result = await sendFriendRequest(userId, friendId);
      
      Alert.alert('Success', 'Friend request sent successfully');
      
      // Update search results to show pending status
      const updatedResults = searchResults.map(user => {
        const userId = user._id || user.id;
        if (userId === friendId) {
          return { ...user, requestSent: true };
        }
        return user;
      });
      setSearchResults(updatedResults);
    } catch (error) {
      console.error('Error sending friend request:', error);
      Alert.alert('Error', error.message || 'Failed to send friend request');
    }
  };

  const handleRespondToRequest = async (requestId, status) => {
    try {
      await respondToFriendRequest(requestId, status);
      
      // Update UI
      if (status === 'accepted') {
        // Refresh friends list
        loadFriends(userId);
      }
      
      // Remove request from list
      const updatedRequests = friendRequests.filter(req => req.id !== requestId);
      setFriendRequests(updatedRequests);
      
      Alert.alert('Success', `Friend request ${status}`);
    } catch (error) {
      console.error('Error responding to friend request:', error);
      Alert.alert('Error', `Failed to ${status} friend request`);
    }
  };

  const renderFriendItem = ({ item }) => {
    const userId = item._id || item.id;
    return (
      <View style={styles.userCard}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('UserProfile', { userId: userId })}
        >
          <Ionicons name="person" size={20} color="#E53935" />
          <Text style={[styles.actionText, { color: '#E53935' }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderRequestItem = ({ item }) => {
    const userId = item._id || item.id;
    return (
      <View style={styles.userCard}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
          </View>
        </View>
        
        <View style={styles.requestActions}>
          <TouchableOpacity 
            style={[styles.requestButton, styles.acceptButton]}
            onPress={() => handleRespondToRequest(userId, 'accepted')}
          >
            <Text style={styles.requestButtonText}>Accept</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.requestButton, styles.rejectButton]}
            onPress={() => handleRespondToRequest(userId, 'rejected')}
          >
            <Text style={[styles.requestButtonText, { color: '#e74c3c' }]}>Decline</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSearchResultItem = ({ item }) => {
    const userId = item._id || item.id;
    
    // Check if this user is already a friend
    const isFriend = friends.some(friend => (friend._id || friend.id) === userId);
    // Check if request is already sent (from updated search results)
    const requestSent = item.requestSent;
    
    return (
      <View style={styles.userCard}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
          </View>
        </View>
        
        {isFriend ? (
          <View style={styles.friendStatus}>
            <Ionicons name="checkmark-circle" size={20} color="#44bd32" />
            <Text style={{ color: '#44bd32', marginLeft: 5 }}>Friend</Text>
          </View>
        ) : requestSent ? (
          <View style={styles.friendStatus}>
            <Ionicons name="time" size={20} color="#f39c12" />
            <Text style={{ color: '#f39c12', marginLeft: 5 }}>Pending</Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => handleSendFriendRequest(userId)}
          >
            <Ionicons name="person-add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderEmptyList = (message) => (
    <View style={styles.emptyContainer}>
      <Ionicons name="people-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E53935" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Friends</Text>
      </View>
      <View style={styles.contentContainer}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for friends... (min 2 characters)"
          placeholderTextColor={'#000'}
          value={searchQuery}
          onChangeText={handleSearchChange}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={searching || !searchQuery.trim()}
        >
          {searching ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="search" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'friends' && styles.activeTab
          ]}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'friends' && styles.activeTabText
          ]}>Friends</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'requests' && styles.activeTab
          ]}
          onPress={() => setActiveTab('requests')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'requests' && styles.activeTabText
          ]}>Requests {friendRequests.length > 0 && `(${friendRequests.length})`}</Text>
        </TouchableOpacity>
        
        {searchResults.length > 0 && (
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'search' && styles.activeTab
            ]}
            onPress={() => setActiveTab('search')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'search' && styles.activeTabText
            ]}>Results ({searchResults.length})</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {activeTab === 'friends' && (
        <FlatList
          data={friends}
          renderItem={renderFriendItem}
          keyExtractor={item => (item._id || item.id).toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={() => renderEmptyList("You don't have any friends yet")}
        />
      )}
      
      {activeTab === 'requests' && (
        <FlatList
          data={friendRequests}
          renderItem={renderRequestItem}
          keyExtractor={item => (item._id || item.id).toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={() => renderEmptyList("No pending friend requests")}
        />
      )}
      
      {activeTab === 'search' && (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResultItem}
          keyExtractor={item => (item._id || item.id).toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={() => renderEmptyList("No users found")}
        />
      )}
      
      {activeTab === 'friends' && friends.length === 0 && searchQuery.trim().length === 0 && (
        <View style={styles.discoverContainer}>
          <Text style={styles.discoverTitle}>Discover People</Text>
          <Text style={styles.discoverText}>
            Start by searching for friends using their name or email address.
          </Text>
          <View style={styles.searchHint}>
            <Ionicons name="search" size={20} color="#E53935" />
            <Text style={styles.searchHintText}>Type at least 2 characters to search</Text>
          </View>
          
          {recentSearches.length > 0 && (
            <View style={styles.recentSearchesContainer}>
              <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
              <View style={styles.recentSearchesList}>
                {recentSearches.map((query, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.recentSearchItem}
                    onPress={() => handleRecentSearch(query)}
                  >
                    <Ionicons name="time-outline" size={16} color="#666" />
                    <Text style={styles.recentSearchText}>{query}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      )}
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
    justifyContent: 'center',
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
  searchContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    height: 46,
    backgroundColor: '#f0f2f5',
    borderRadius: 23,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  searchButton: {
    width: 46,
    height: 46,
    backgroundColor: '#E53935',
    borderRadius: 23,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#E53935',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#E53935',
    fontWeight: 'bold',
  },
  list: {
    flexGrow: 1,
    padding: 15,
  },
  userCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
  },
  requestActions: {
    flexDirection: 'row',
  },
  requestButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 5,
  },
  acceptButton: {
    backgroundColor: '#44bd32',
  },
  rejectButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E53935',
  },
  requestButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E53935',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  friendStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  discoverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  discoverTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  discoverText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
  },
  searchHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E53935',
  },
  searchHintText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#E53935',
    fontWeight: '500',
  },
  recentSearchesContainer: {
    marginTop: 30,
    width: '100%',
  },
  recentSearchesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  recentSearchesList: {
    alignItems: 'center',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
    minWidth: 200,
  },
  recentSearchText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
});