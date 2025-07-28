import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { loginStyles } from '../../style/loginStyles';
import { Ionicons } from '@expo/vector-icons';
import { forgotPassword } from '../../api/auth';

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async () => {
    setError('');
    setMessage('');
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      setMessage(res.message || 'A password reset link has been sent to your email.');
    } catch (err) {
      setError(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={loginStyles.container}>
      <TouchableOpacity style={{ position: 'absolute', top: 40, left: 20 }} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
      <View style={loginStyles.topSection}>
        <Text style={loginStyles.title}>Forgot Password</Text>
        <Text style={{ color: 'rgba(255,255,255,0.7)', marginTop: 10, textAlign: 'center' }}>
          Enter your email address and we'll send you a link to reset your password.
        </Text>
      </View>
      <View style={loginStyles.bottomSection}>
        <View style={loginStyles.inputContainer}>
          <TextInput
            style={loginStyles.input}
            placeholder="Email"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {error ? <Text style={loginStyles.errorText}>{error}</Text> : null}
          {message ? <Text style={[loginStyles.errorText, { color: '#44bd32' }]}>{message}</Text> : null}
        </View>
        <TouchableOpacity
          style={loginStyles.button}
          onPress={handleReset}
          disabled={loading}
        >
          <Text style={loginStyles.buttonText}>{loading ? 'Sending...' : 'Send Reset Link'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 