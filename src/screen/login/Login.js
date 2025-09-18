import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { loginStyles } from '../../style/loginStyles';
import { loginUser, initAuth, getToken } from '../../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../theme/ThemeContext';

export default function Login({ navigation }) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('email'); // 'email' or 'phone'
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkExisting = async () => {
      await initAuth();
      const token = await getToken();
      const userData = await AsyncStorage.getItem('userData');
      if (token && userData) {
        navigation.reset({ index: 0, routes: [{ name: 'MainApp' }] });
      }
    };
    checkExisting();
  }, []);

  const handleLogin = async () => {
    // Clear previous errors
    setError('');
    
    // Form validation
    if (activeTab === 'email' && (!email || !password)) {
      setError('Please fill in all fields');
      return;
    }
    if (activeTab === 'phone' && (!phone || !password)) {
      setError('Please fill in all fields');
      return;
    }

    // For demo purposes, still allow admin/admin login
    if ((activeTab === 'email' && email === 'admin' && password === 'admin') || 
        (activeTab === 'phone' && phone === 'admin' && password === 'admin')) {
      // Store dummy user data for admin login
      const adminUser = {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com'
      };
      await AsyncStorage.setItem('userData', JSON.stringify(adminUser));
      
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainApp' }],
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Only email login is supported with the backend
      if (activeTab === 'email') {
        const response = await loginUser({ email, password });
        
        // Navigate to main app
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainApp' }],
        });
      } else {
        // Phone login not implemented in backend yet
        setError('Phone login is not available yet');
      }
    } catch (error) {
      // More detailed error handling
      if (error.message === 'Invalid credentials') {
        setError('Incorrect email or password. Please try again.');
      } else if (error.message && error.message.includes('Network')) {
        setError('Network error. Please check your internet connection.');
      } else {
        setError(error.message || 'Login failed. Please try again.');
      }
      console.log('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderInput = () => {
    if (activeTab === 'email') {
      return (
        <TextInput
          style={[loginStyles.input, { backgroundColor: colors.input, borderColor: colors.inputBorder, color: colors.text }]}
          placeholder="Email"
          placeholderTextColor={colors.inputPlaceholder}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      );
    } else {
      return (
        <TextInput
          style={[loginStyles.input, { backgroundColor: colors.input, borderColor: colors.inputBorder, color: colors.text }]}
          placeholder="Phone Number"
          placeholderTextColor={colors.inputPlaceholder}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      );
    }
  };

  return (
    <View style={[loginStyles.container, { backgroundColor: colors.background }]}>
      <View style={[loginStyles.topSection, { backgroundColor: colors.background }]}>
         <Image
          source={require('../../assets/logo.jpg')}
          style={loginStyles.logo}
        />
      </View>

      <View style={[loginStyles.bottomSection, { backgroundColor: colors.surface }]}>
        <Text style={[loginStyles.title, { color: colors.text }]}>Welcome Back!</Text>

        <View style={[loginStyles.tabContainer, { backgroundColor: colors.surfaceSecondary }]}>
          <TouchableOpacity
            style={[
              loginStyles.tab,
              { backgroundColor: activeTab === 'email' ? colors.primary : 'transparent' }
            ]}
            onPress={() => setActiveTab('email')}
          >

            <Text style={[
              loginStyles.tabText,
              { color: activeTab === 'email' ? colors.textInverse : colors.textSecondary }
            ]}> Email </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              loginStyles.tab,
              { backgroundColor: activeTab === 'phone' ? colors.primary : 'transparent' }
            ]}
            onPress={() => setActiveTab('phone')}
          >
            <Text style={[
              loginStyles.tabText,
              { color: activeTab === 'phone' ? colors.textInverse : colors.textSecondary }
            ]}>Phone</Text>
          </TouchableOpacity>
        </View>

        <View style={loginStyles.inputContainer}>
          {renderInput()}

          
          <TextInput
            style={[loginStyles.input, { backgroundColor: colors.input, borderColor: colors.inputBorder, color: colors.text }]}
            placeholder="Password"
            placeholderTextColor={colors.inputPlaceholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {error ? <Text style={[loginStyles.errorText, { color: colors.error }]}>{error}</Text> : null}
        </View>

        <TouchableOpacity
          style={[loginStyles.button, { backgroundColor: colors.primary }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.textInverse} size="small" />
          ) : (
            <Text style={[loginStyles.buttonText, { color: colors.textInverse }]}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={[loginStyles.forgotPasswordText, { color: colors.primary }]}>Forgot Password?</Text>
        </TouchableOpacity>

        </View>

        <View style={loginStyles.footer}>
          <Text style={[loginStyles.footerText, { color: colors.text }]}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={[loginStyles.footerLink, { color: colors.primary }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
} 