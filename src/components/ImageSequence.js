import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Animated, Dimensions } from 'react-native';

const ImageSequence = ({ 
  images, 
  duration = 2000, 
  loop = true, 
  autoPlay = true,
  style,
  onAnimationComplete 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef(null);

  useEffect(() => {
    if (autoPlay && images && images.length > 0) {
      startAnimation();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [images, duration, autoPlay]);

  const startAnimation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % images.length;
        
        // Fade out current image
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }).start(() => {
          // Fade in next image
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }).start();
        });

        // If we've completed one full cycle and not looping
        if (nextIndex === 0 && !loop) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
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

  const resetAnimation = () => {
    setCurrentIndex(0);
    fadeAnim.setValue(1);
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <View style={[{ width: '100%', height: '100%' }, style]}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image
          source={images[currentIndex]}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

export default ImageSequence;
