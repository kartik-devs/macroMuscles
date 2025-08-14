import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAvatarEmojis, saveProfilePicture } from '../api/profileEnhancements';

export default function ProfilePictureUpload({ visible, onClose, userId, onSuccess }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleTakePhoto = () => {
    // Placeholder for camera functionality
    Alert.alert('Camera', 'Camera functionality would be implemented here');
  };

  const handleChooseFromLibrary = () => {
    // Placeholder for image picker functionality
    Alert.alert('Gallery', 'Image picker functionality would be implemented here');
  };

  const handleUpload = async () => {
    if (!selectedImage && !selectedEmoji) {
      Alert.alert('No Selection', 'Please select an image or emoji first');
      return;
    }

    setUploading(true);
    try {
      const imageUrl = selectedEmoji ? `avatar_emoji_${selectedEmoji}` : selectedImage;
      await saveProfilePicture(userId, imageUrl);
      onSuccess(imageUrl);
      onClose();
      Alert.alert('Success', 'Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      Alert.alert('Error', 'Failed to update profile picture');
    } finally {
      setUploading(false);
    }
  };

  const handleSelectEmoji = (emoji) => {
    setSelectedEmoji(emoji);
    setSelectedImage(null);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Upload Profile Picture</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.option} onPress={handleTakePhoto}>
              <Ionicons name="camera" size={32} color="#0097e6" />
              <Text style={styles.optionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={handleChooseFromLibrary}>
              <Ionicons name="images" size={32} color="#0097e6" />
              <Text style={styles.optionText}>Choose from Library</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Or choose an emoji:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emojiContainer}>
            {getAvatarEmojis().map((emoji, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.emojiOption,
                  selectedEmoji === emoji && styles.selectedEmoji
                ]}
                onPress={() => handleSelectEmoji(emoji)}
              >
                <Text style={styles.emoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {(selectedImage || selectedEmoji) && (
            <View style={styles.previewContainer}>
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              ) : (
                <View style={styles.previewEmoji}>
                  <Text style={styles.previewEmojiText}>{selectedEmoji}</Text>
                </View>
              )}
              <TouchableOpacity 
                style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]} 
                onPress={handleUpload}
                disabled={uploading}
              >
                <Text style={styles.uploadButtonText}>
                  {uploading ? 'Updating...' : 'Update Profile Picture'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  closeButton: {
    padding: 4,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  option: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    minWidth: 120,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  emojiContainer: {
    marginBottom: 20,
  },
  emojiOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedEmoji: {
    borderColor: '#0097e6',
    backgroundColor: '#e3f2fd',
  },
  emoji: {
    fontSize: 24,
  },
  previewEmoji: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewEmojiText: {
    fontSize: 40,
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  optionText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  previewContainer: {
    alignItems: 'center',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  uploadButton: {
    backgroundColor: '#0097e6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});