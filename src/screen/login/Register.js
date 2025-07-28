import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { loginStyles } from '../../style/loginStyles';
import { registerUser } from '../../api/auth';

export default function Register({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleRegister = async () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      
      // Call API to register user
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };
      
      const response = await registerUser(userData);
      
      // Show success message
      Alert.alert(
        "Registration Successful",
        "Your account has been created successfully. Please login.",
        [
          { text: "Login Now", onPress: () => navigation.navigate('Login') }
        ]
      );
      
    } catch (error) {
      // More detailed error handling
      if (error.message === 'Email already in use') {
        setError('This email is already registered. Please use a different email or login.');
      } else if (error.message && error.message.includes('Network')) {
        setError('Network error. Please check your internet connection.');
      } else {
        setError(error.message || 'Registration failed. Please try again.');
      }
      console.log('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={loginStyles.Registercontainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={loginStyles.registertopSection}>
          <Image
            source={require('../../assets/logo.jpg')}
            style={loginStyles.logo}
          />
        </View>
        <View style={loginStyles.bottomSection}>
          <Text style={loginStyles.title}>Create Account</Text>

          <View style={loginStyles.inputContainer}>
            <TextInput
              style={loginStyles.input}
              placeholder="Full Name"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={formData.name}
              onChangeText={(value) => handleChange('name', value)}
              autoCapitalize="words"
            />
            <TextInput
              style={loginStyles.input}
              placeholder="Email"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <TextInput
              style={loginStyles.input}
              placeholder="Password"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
              secureTextEntry
              autoCapitalize="none"
            />
            <TextInput
              style={loginStyles.input}
              placeholder="Confirm Password"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={formData.confirmPassword}
              onChangeText={(value) => handleChange('confirmPassword', value)}
              secureTextEntry
              autoCapitalize="none"
            />
            {error ? <Text style={loginStyles.errorText}>{error}</Text> : null}
          </View>

          <TouchableOpacity
            style={loginStyles.button}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={loginStyles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <View style={loginStyles.footer}>
            <Text style={loginStyles.registerfooterText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={loginStyles.registerfooterLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
} 