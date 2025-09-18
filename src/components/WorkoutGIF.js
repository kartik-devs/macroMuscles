import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const WorkoutGIF = ({ 
  images, 
  duration = 1500, 
  loop = true, 
  autoPlay = true,
  showControls = true,
  style,
  onAnimationComplete,
  exerciseName = "Exercise"
}) => {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying && images && images.length > 0) {
      startAnimation();
    } else {
      stopAnimation();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, images, duration]);

  const startAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % images.length;
        
        // Scale and fade animation
        Animated.sequence([
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 0.7,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 0.95,
              duration: 150,
              useNativeDriver: true,
            })
          ]),
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            })
          ])
        ]).start();

        // If we've completed one full cycle and not looping
        if (nextIndex === 0 && !loop) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          setIsPlaying(false);
          if (onAnimationComplete) {
            onAnimationComplete();
          }
        }

        return nextIndex;
      });
    }, duration);
  };

  const stopAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const toggleAnimation = () => {
    setIsPlaying(!isPlaying);
  };

  const resetAnimation = () => {
    setCurrentIndex(0);
    fadeAnim.setValue(1);
    scaleAnim.setValue(1);
  };

  if (!images || images.length === 0) {
    return (
      <View style={[{ 
        width: '100%', 
        height: 200, 
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12
      }, style]}>
        <Ionicons name="image-outline" size={48} color={colors.textTertiary} />
      </View>
    );
  }

  return (
    <View style={[{ width: '100%', height: '100%' }, style]}>
      <Animated.View 
        style={{ 
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }}
      >
        <Image
          source={images[currentIndex]}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
        />
      </Animated.View>
      
      {showControls && (
        <View style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.7)',
          borderRadius: 20,
          paddingHorizontal: 12,
          paddingVertical: 6,
        }}>
          <TouchableOpacity onPress={toggleAnimation}>
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={20} 
              color="white" 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={resetAnimation} style={{ marginLeft: 8 }}>
            <Ionicons name="refresh" size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}
      
      {/* Progress indicator */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.3)',
      }}>
        <Animated.View style={{
          height: '100%',
          width: `${((currentIndex + 1) / images.length) * 100}%`,
          backgroundColor: colors.primary,
        }} />
      </View>
    </View>
  );
};

export default WorkoutGIF;
