import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { getCurrentUserId } from '../api/auth';
import { deleteUserProfile } from '../api/deleteProfile';

export default function SettingsPage({ navigation }) {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    loadSettings();
    loadUserId();
  }, []);

  const loadUserId = async () => {
    try {
      const id = await getCurrentUserId();
      setUserId(id);
    } catch (error) {
      console.error('Error loading user ID:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('appSettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setNotifications(parsed.notifications ?? true);
        setWorkoutReminders(parsed.workoutReminders ?? true);
        setSoundEffects(parsed.soundEffects ?? true);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      const settings = await AsyncStorage.getItem('appSettings');
      const currentSettings = settings ? JSON.parse(settings) : {};
      const updatedSettings = { ...currentSettings, ...newSettings };
      await AsyncStorage.setItem('appSettings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.multiRemove(['token', 'userId']);
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  const handleDeleteProfile = () => {
    Alert.alert(
      'Delete Profile',
      'This will permanently delete your account and all data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (userId) {
                await deleteUserProfile(userId);
                await AsyncStorage.multiRemove(['token', 'userId', 'appSettings']);
                Alert.alert('Success', 'Profile deleted successfully', [
                  {
                    text: 'OK',
                    onPress: () => navigation.reset({
                      index: 0,
                      routes: [{ name: 'Login' }],
                    })
                  }
                ]);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete profile. Please try again.');
            }
          },
        },
      ]
    );
  };

  const SettingItem = ({ icon, title, subtitle, onPress, rightComponent }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color={theme.colors.secondary} />
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: theme.colors.text }]}>{title}</Text>
          {subtitle && <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.colors.statusBar} />
      
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Appearance */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Appearance</Text>
          
          <SettingItem
            icon="moon"
            title="Dark Mode"
            subtitle="Switch between light and dark theme"
            rightComponent={
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: '#767577', true: theme.colors.secondary }}
                thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
              />
            }
          />
        </View>

        {/* Notifications */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Notifications</Text>
          
          <SettingItem
            icon="notifications"
            title="Push Notifications"
            subtitle="Receive app notifications"
            rightComponent={
              <Switch
                value={notifications}
                onValueChange={(value) => {
                  setNotifications(value);
                  saveSettings({ notifications: value });
                }}
                trackColor={{ false: '#767577', true: theme.colors.secondary }}
                thumbColor={notifications ? '#fff' : '#f4f3f4'}
              />
            }
          />
          
          <SettingItem
            icon="alarm"
            title="Workout Reminders"
            subtitle="Daily workout reminders"
            rightComponent={
              <Switch
                value={workoutReminders}
                onValueChange={(value) => {
                  setWorkoutReminders(value);
                  saveSettings({ workoutReminders: value });
                }}
                trackColor={{ false: '#767577', true: theme.colors.secondary }}
                thumbColor={workoutReminders ? '#fff' : '#f4f3f4'}
              />
            }
          />
        </View>

        {/* Audio */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Audio</Text>
          
          <SettingItem
            icon="volume-high"
            title="Sound Effects"
            subtitle="App sounds and feedback"
            rightComponent={
              <Switch
                value={soundEffects}
                onValueChange={(value) => {
                  setSoundEffects(value);
                  saveSettings({ soundEffects: value });
                }}
                trackColor={{ false: '#767577', true: theme.colors.secondary }}
                thumbColor={soundEffects ? '#fff' : '#f4f3f4'}
              />
            }
          />
        </View>

        {/* Account */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Account</Text>
          
          <SettingItem
            icon="person"
            title="Edit Profile"
            subtitle="Update your profile information"
            onPress={() => Alert.alert('Profile', 'Navigate to profile edit')}
          />
          
          <SettingItem
            icon="shield-checkmark"
            title="Privacy"
            subtitle="Privacy settings and data"
            onPress={() => Alert.alert('Privacy', 'Privacy settings coming soon')}
          />
          
          <SettingItem
            icon="key"
            title="Change Password"
            subtitle="Update your password"
            onPress={() => Alert.alert('Password', 'Password change coming soon')}
          />
        </View>

        {/* Support */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Support</Text>
          
          <SettingItem
            icon="help-circle"
            title="Help & FAQ"
            subtitle="Get help and find answers"
            onPress={() => Alert.alert('Help', 'Help section coming soon')}
          />
          
          <SettingItem
            icon="mail"
            title="Contact Us"
            subtitle="Send feedback or report issues"
            onPress={() => Alert.alert('Contact', 'Contact form coming soon')}
          />
          
          <SettingItem
            icon="information-circle"
            title="About"
            subtitle="App version and information"
            onPress={() => Alert.alert('About', 'MacroMuscles v1.0.0')}
          />
        </View>

        {/* Logout */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={24} color={theme.colors.error} />
            <Text style={[styles.logoutText, { color: theme.colors.error }]}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Delete Profile */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteProfile}>
            <Ionicons name="trash" size={24} color={theme.colors.error} />
            <Text style={[styles.deleteText, { color: theme.colors.error }]}>Delete Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});