import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const UniversalWorkoutGIF = ({ animationHeight = 250, style }) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        {
          height: animationHeight,
          width: '100%',
          borderRadius: 12,
          backgroundColor: colors.surface,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Ionicons name="image-outline" size={40} color={colors.textSecondary} />
      <Text style={{ marginTop: 8, color: colors.textSecondary }}>
        Exercise preview temporarily unavailable
      </Text>
    </View>
  );
};

export default UniversalWorkoutGIF;
