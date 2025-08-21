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

export const lightTheme = {
  colors: {
    background: '#f8f9fa',
    surface: '#ffffff',
    primary: '#E53935',
    secondary: '#0097e6',
    text: '#1a1a1a',
    textSecondary: '#666666',
    textTertiary: '#999999',
    border: '#e0e0e0',
    card: '#ffffff',
    success: '#44bd32',
    warning: '#f39c12',
    error: '#e74c3c',
    overlay: 'rgba(0, 0, 0, 0.5)',
    tabBar: '#ffffff',
    statusBar: 'dark-content',
  },
};

export const darkTheme = {
  colors: {
    background: '#1a1a1a',
    surface: '#2a2a2a',
    primary: '#E53935',
    secondary: '#0097e6',
    text: '#ffffff',
    textSecondary: '#cccccc',
    textTertiary: '#888888',
    border: '#404040',
    card: '#2a2a2a',
    success: '#44bd32',
    warning: '#f39c12',
    error: '#e74c3c',
    overlay: 'rgba(0, 0, 0, 0.7)',
    tabBar: '#2a2a2a',
    statusBar: 'light-content',
  },
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const settings = await AsyncStorage.getItem('appSettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setIsDarkMode(parsed.darkMode ?? false);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    try {
      const settings = await AsyncStorage.getItem('appSettings');
      const currentSettings = settings ? JSON.parse(settings) : {};
      const newSettings = { ...currentSettings, darkMode: newTheme };
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  const value = {
    theme,
    isDarkMode,
    toggleTheme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};