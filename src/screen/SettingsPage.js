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

export default function SettingsPage({ navigation }) {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [workoutReminders, setWorkoutReminders] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('appSettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setDarkMode(parsed.darkMode ?? true);
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
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleDarkModeToggle = (value) => {
    setDarkMode(value);
    const newSettings = { darkMode: value, notifications, workoutReminders, soundEffects };
    saveSettings(newSettings);
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

  const SettingItem = ({ icon, title, subtitle, onPress, rightComponent }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color="#0097e6" />
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: darkMode ? '#fff' : '#333' }]}>{title}</Text>
          {subtitle && <Text style={[styles.settingSubtitle, { color: darkMode ? '#888' : '#666' }]}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || <Ionicons name="chevron-forward" size={20} color={darkMode ? '#888' : '#666'} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? '#1a1a1a' : '#f8f9fa' }]}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
      
      <View style={[styles.header, { backgroundColor: darkMode ? '#1a1a1a' : '#fff' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={darkMode ? "#fff" : "#000"} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: darkMode ? '#fff' : '#000' }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Appearance */}
        <View style={[styles.section, { backgroundColor: darkMode ? '#2a2a2a' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: darkMode ? '#fff' : '#000' }]}>Appearance</Text>
          
          <SettingItem
            icon="moon"
            title="Dark Mode"
            subtitle="Switch between light and dark theme"
            rightComponent={
              <Switch
                value={darkMode}
                onValueChange={handleDarkModeToggle}
                trackColor={{ false: '#767577', true: '#0097e6' }}
                thumbColor={darkMode ? '#fff' : '#f4f3f4'}
              />
            }
          />
        </View>

        {/* Notifications */}
        <View style={[styles.section, { backgroundColor: darkMode ? '#2a2a2a' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: darkMode ? '#fff' : '#000' }]}>Notifications</Text>
          
          <SettingItem
            icon="notifications"
            title="Push Notifications"
            subtitle="Receive app notifications"
            rightComponent={
              <Switch
                value={notifications}
                onValueChange={(value) => {
                  setNotifications(value);
                  saveSettings({ darkMode, notifications: value, workoutReminders, soundEffects });
                }}
                trackColor={{ false: '#767577', true: '#0097e6' }}
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
                  saveSettings({ darkMode, notifications, workoutReminders: value, soundEffects });
                }}
                trackColor={{ false: '#767577', true: '#0097e6' }}
                thumbColor={workoutReminders ? '#fff' : '#f4f3f4'}
              />
            }
          />
        </View>

        {/* Audio */}
        <View style={[styles.section, { backgroundColor: darkMode ? '#2a2a2a' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: darkMode ? '#fff' : '#000' }]}>Audio</Text>
          
          <SettingItem
            icon="volume-high"
            title="Sound Effects"
            subtitle="App sounds and feedback"
            rightComponent={
              <Switch
                value={soundEffects}
                onValueChange={(value) => {
                  setSoundEffects(value);
                  saveSettings({ darkMode, notifications, workoutReminders, soundEffects: value });
                }}
                trackColor={{ false: '#767577', true: '#0097e6' }}
                thumbColor={soundEffects ? '#fff' : '#f4f3f4'}
              />
            }
          />
        </View>

        {/* Account */}
        <View style={[styles.section, { backgroundColor: darkMode ? '#2a2a2a' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: darkMode ? '#fff' : '#000' }]}>Account</Text>
          
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
        <View style={[styles.section, { backgroundColor: darkMode ? '#2a2a2a' : '#fff' }]}>
          <Text style={[styles.sectionTitle, { color: darkMode ? '#fff' : '#000' }]}>Support</Text>
          
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
        <View style={[styles.section, { backgroundColor: darkMode ? '#2a2a2a' : '#fff' }]}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={24} color="#e74c3c" />
            <Text style={styles.logoutText}>Logout</Text>
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
    color: '#e74c3c',
    marginLeft: 10,
  },
});