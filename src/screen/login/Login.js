import React, { useState } from 'react';
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
import { loginUser } from '../../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ navigation }) {
  const [activeTab, setActiveTab] = useState('email'); // 'email' or 'phone'
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
          style={loginStyles.input}
          placeholder="Email"
          placeholderTextColor="rgba(255,255,255,0.5)"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      );
    } else {
      return (
        <TextInput
          style={loginStyles.input}
          placeholder="Phone Number"
          placeholderTextColor="rgba(255,255,255,0.5)"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      );
    }
  };

  return (
    <View style={loginStyles.container}>
      <View style={loginStyles.topSection}>
         <Image
          source={require('../../assets/logo.jpg')}
          style={loginStyles.logo}
        />
      </View>

      <View style={loginStyles.bottomSection}>
        <Text style={loginStyles.title}>Welcome Back!</Text>

        <View style={loginStyles.tabContainer}>
          <TouchableOpacity
            style={[
              loginStyles.tab,
              activeTab === 'email' && loginStyles.activeTab
            ]}
            onPress={() => setActiveTab('email')}
          >

            <Text style={[
              loginStyles.tabText,
              activeTab === 'email' && loginStyles.activeTabText
            ]}> Email </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              loginStyles.tab,
              activeTab === 'phone' && loginStyles.activeTab
            ]}
            onPress={() => setActiveTab('phone')}
          >
            <Text style={[
              loginStyles.tabText,
              activeTab === 'phone' && loginStyles.activeTabText
            ]}>Phone</Text>
          </TouchableOpacity>
        </View>

        <View style={loginStyles.inputContainer}>
          {renderInput()}

          
          <TextInput
            style={loginStyles.input}
            placeholder="Password"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {error ? <Text style={loginStyles.errorText}>{error}</Text> : null}
        </View>

        <TouchableOpacity
          style={loginStyles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={loginStyles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={loginStyles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        </View>

        <View style={loginStyles.footer}>
          <Text style={loginStyles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={loginStyles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
  );
} 