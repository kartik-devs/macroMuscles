import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const settings = await AsyncStorage.getItem('appSettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setIsDarkMode(parsed.darkMode ?? true);
      }
    } catch (error) {
      console.error('Error loading theme settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    try {
      const settings = await AsyncStorage.getItem('appSettings');
      const parsed = settings ? JSON.parse(settings) : {};
      const newSettings = { ...parsed, darkMode: newTheme };
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving theme settings:', error);
    }
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    isLoading,
    colors: {
      // Background colors
      background: isDarkMode ? '#000000' : '#f8f9fa',
      surface: isDarkMode ? '#111111' : '#ffffff',
      surfaceSecondary: isDarkMode ? '#1a1a1a' : '#f0f0f0',
      surfaceTertiary: isDarkMode ? '#2a2a2a' : '#e0e0e0',
      
      // Text colors
      text: isDarkMode ? '#ffffff' : '#000000',
      textSecondary: isDarkMode ? '#aaaaaa' : '#666666',
      textTertiary: isDarkMode ? '#888888' : '#999999',
      textInverse: isDarkMode ? '#000000' : '#ffffff',
      
      // Border colors
      border: isDarkMode ? '#333333' : '#e0e0e0',
      borderLight: isDarkMode ? '#444444' : '#f0f0f0',
      
      // Accent colors
      primary: '#E53935',
      primaryLight: '#ff6b6b',
      secondary: '#0097e6',
      success: '#44bd32',
      warning: '#f39c12',
      error: '#E53935',
      
      // Status bar
      statusBar: isDarkMode ? 'light-content' : 'dark-content',
      
      // Tab bar
      tabBar: isDarkMode ? '#000000' : '#ffffff',
      tabBarBorder: isDarkMode ? '#111111' : '#e0e0e0',
      
      // Card colors
      card: isDarkMode ? '#111111' : '#ffffff',
      cardBorder: isDarkMode ? '#333333' : '#e0e0e0',
      
      // Input colors
      input: isDarkMode ? '#1a1a1a' : '#ffffff',
      inputBorder: isDarkMode ? '#333333' : '#e0e0e0',
      inputPlaceholder: isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
      
      // Button colors
      buttonPrimary: '#E53935',
      buttonSecondary: isDarkMode ? '#333333' : '#f0f0f0',
      buttonText: isDarkMode ? '#ffffff' : '#000000',
      
      // Shadow colors
      shadow: isDarkMode ? '#000000' : '#000000',
      
      // Overlay colors
      overlay: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)',
      
      // Calendar colors
      calendar: {
        todayTextColor: '#E53935',
        arrowColor: '#0097e6',
        textSectionTitleColor: isDarkMode ? '#aaaaaa' : '#666666',
        selectedDayBackgroundColor: '#44bd32',
        selectedDayTextColor: '#ffffff',
        dotColor: '#44bd32',
        textColor: isDarkMode ? '#ffffff' : '#000000',
        monthTextColor: isDarkMode ? '#ffffff' : '#000000',
        dayTextColor: isDarkMode ? '#ffffff' : '#000000',
        textDisabledColor: isDarkMode ? '#444444' : '#cccccc',
        calendarBackground: isDarkMode ? '#111111' : '#ffffff',
      }
    }
  };

  if (isLoading) {
    return null; // or a loading component
  }

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
