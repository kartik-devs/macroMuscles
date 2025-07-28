import React, { useRef, useState } from 'react';
import { View, Text, ImageBackground, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { styles } from '../../src/style/styles';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Set & Smash\nDaily Goals',
    image: require('../assets/dumbbell.jpg'),
    dotColor: '#fff',
  },
  {
    key: '2',
    title: 'Achieve\nPerfection',
    image: require('../assets/kettle.jpg'),
    dotColor: '#00BFFF',
  },
  {
    key: '3',
    title: 'Find The New\nYou',
    image: require('../assets/shirtless.jpg'),
    dotColor: '#7CFC00',
  },
];

export default function Splash({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef();

  const handleContinue = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace('Login');
    }
  };

  const handleSkip = () => {
    navigation.replace('Login');
  };

  const renderItem = ({ item, index }) => (
    <ImageBackground source={item.image} style={styles.imageBackground}>
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>{item.title}</Text>
          
          <View style={styles.indicatorContainer}>
            {slides.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.indicator,
                  {
                    backgroundColor: i === currentIndex ? slides[i].dotColor : '#555',
                    width: i === currentIndex ? 20 : 8,
                  }
                ]}
              />
            ))}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#888' }]}
              onPress={handleContinue}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.skipButton]}
              onPress={handleSkip}
            >
              <Text style={[styles.buttonText, styles.skipButtonText]}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );

  return (
    <FlatList
      ref={flatListRef}
      data={slides}
      renderItem={renderItem}
      keyExtractor={item => item.key}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onMomentumScrollEnd={ev => {
        const index = Math.round(ev.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
      }}
    />
  );
}