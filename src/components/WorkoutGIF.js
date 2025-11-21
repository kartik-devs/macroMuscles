import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const WorkoutGIF = ({
  images,
  duration = 1000, // animation speed
  loop = true,
  autoPlay = true,
  showControls = true,
  style,
  onAnimationComplete,
}) => {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef(null);
  const directionRef = useRef(1); // For ping-pong loop

  useEffect(() => {
    if (isPlaying && images && images.length > 1) {
      startAnimation();
    } else {
      stopAnimation();
    }

    return () => stopAnimation();
  }, [isPlaying, images, duration]);

  const startAnimation = () => {
    stopAnimation();
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prevIndex => {
        let nextIndex = prevIndex + directionRef.current;

        if (nextIndex >= images.length || nextIndex < 0) {
          directionRef.current *= -1; // reverse direction (ping-pong)
          nextIndex = prevIndex + directionRef.current;
        }

        Animated.sequence([
          Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 0.8, duration: 100, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 0.98, duration: 100, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
          ]),
        ]).start();

        return nextIndex;
      });
    }, duration);
  };

  const stopAnimation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const toggleAnimation = () => setIsPlaying(!isPlaying);

  const resetAnimation = () => {
    setCurrentIndex(0);
    fadeAnim.setValue(1);
    scaleAnim.setValue(1);
  };

  if (!images || images.length === 0) {
    return (
      <View
        style={{
          width: '100%',
          height: 200,
          backgroundColor: colors.surface,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 12,
        }}
      >
        <Ionicons name="image-outline" size={48} color={colors.textTertiary} />
      </View>
    );
  }

  return (
    <View style={[{ width: '100%', height: '100%' }, style]}>
      <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
        <Image
          source={images[currentIndex]}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
        />
      </Animated.View>

      {showControls && (
        <View
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.7)',
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}
        >
          <TouchableOpacity onPress={toggleAnimation}>
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={resetAnimation} style={{ marginLeft: 8 }}>
            <Ionicons name="refresh" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default WorkoutGIF;
