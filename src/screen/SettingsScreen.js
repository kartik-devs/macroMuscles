import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUserSettings, updateUserSettings } from '../api/profileEnhancements';
import { getCurrentUserId } from '../api/auth';

export default function SettingsScreen({ navigation }) {
  const [userId, setUserId] = useState(null);
  const [settings, setSettings] = useState({
    notifications_enabled: true,
    privacy_mode: 'public',
    theme: 'light',
    units: 'metric',
    language: 'en',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const id = await getCurrentUserId();
      setUserId(id);
      if (id) {
        try {
          const userSettings = await getUserSettings(id);
          setSettings(userSettings);
        } catch (apiError) {
          console.log('API not available, using defaults');
          // Use default settings if API fails
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      if (userId) {
        await updateUserSettings(userId, newSettings);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update settings');
      // Revert the change
      setSettings(settings);
    }
  };

  const SettingRow = ({ title, subtitle, children }) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {children}
    </View>
  );

  const OptionButton = ({ title, selected, onPress }) => (
    <TouchableOpacity
      style={[styles.optionButton, selected && styles.selectedOption]}
      onPress={onPress}
    >
      <Text style={[styles.optionText, selected && styles.selectedOptionText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
        <View style={styles.loadingContainer}>
          <Text>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <SettingRow
            title="Push Notifications"
            subtitle="Receive workout reminders and updates"
          >
            <Switch
              value={settings.notifications_enabled}
              onValueChange={(value) => updateSetting('notifications_enabled', value)}
              trackColor={{ false: '#ddd', true: '#0097e6' }}
            />
          </SettingRow>
        </View>

        {/* Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <SettingRow
            title="Profile Visibility"
            subtitle="Who can see your profile and workouts"
          >
            <View style={styles.optionGroup}>
              <OptionButton
                title="Public"
                selected={settings.privacy_mode === 'public'}
                onPress={() => updateSetting('privacy_mode', 'public')}
              />
              <OptionButton
                title="Friends"
                selected={settings.privacy_mode === 'friends'}
                onPress={() => updateSetting('privacy_mode', 'friends')}
              />
              <OptionButton
                title="Private"
                selected={settings.privacy_mode === 'private'}
                onPress={() => updateSetting('privacy_mode', 'private')}
              />
            </View>
          </SettingRow>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <SettingRow
            title="Theme"
            subtitle="Choose your preferred app theme"
          >
            <View style={styles.optionGroup}>
              <OptionButton
                title="Light"
                selected={settings.theme === 'light'}
                onPress={() => updateSetting('theme', 'light')}
              />
              <OptionButton
                title="Dark"
                selected={settings.theme === 'dark'}
                onPress={() => updateSetting('theme', 'dark')}
              />
            </View>
          </SettingRow>
        </View>

        {/* Units */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Units</Text>
          <SettingRow
            title="Measurement System"
            subtitle="Choose your preferred units"
          >
            <View style={styles.optionGroup}>
              <OptionButton
                title="Metric"
                selected={settings.units === 'metric'}
                onPress={() => updateSetting('units', 'metric')}
              />
              <OptionButton
                title="Imperial"
                selected={settings.units === 'imperial'}
                onPress={() => updateSetting('units', 'imperial')}
              />
            </View>
          </SettingRow>
        </View>

        {/* Language */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language</Text>
          <SettingRow
            title="App Language"
            subtitle="Choose your preferred language"
          >
            <View style={styles.optionGroup}>
              <OptionButton
                title="English"
                selected={settings.language === 'en'}
                onPress={() => updateSetting('language', 'en')}
              />
              <OptionButton
                title="Spanish"
                selected={settings.language === 'es'}
                onPress={() => updateSetting('language', 'es')}
              />
            </View>
          </SettingRow>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 12,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 10,
    color: '#0097e6',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  optionGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    marginLeft: 8,
    marginBottom: 5,
  },
  selectedOption: {
    backgroundColor: '#0097e6',
  },
  optionText: {
    fontSize: 12,
    color: '#666',
  },
  selectedOptionText: {
    color: '#fff',
  },
});