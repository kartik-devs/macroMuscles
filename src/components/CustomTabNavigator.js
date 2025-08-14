import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel || route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Get icon name based on route
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'home-outline';
              break;
            case 'Nutrition':
              iconName = 'restaurant-outline';
              break;
            case 'Add':
              iconName = 'add';
              break;
            case 'Workouts':
              iconName = 'fitness-outline';
              break;
            case 'Profile':
              iconName = 'person-outline';
              break;
            default:
              iconName = 'home-outline';
          }

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={[
                styles.tabItem,
                route.name === 'Add' && styles.centerTab
              ]}
            >
              <View style={[
                styles.iconContainer,
                route.name === 'Add' && styles.centerIconContainer,
                isFocused && route.name !== 'Add' && styles.activeIcon
              ]}>
                <Icon
                  name={iconName}
                  size={route.name === 'Add' ? 30 : 24}
                  color={
                    route.name === 'Add' 
                      ? '#FFFFFF' 
                      : isFocused 
                        ? '#FF6B35' 
                        : '#8E8E93'
                  }
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    minWidth: 300,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  centerTab: {
    marginHorizontal: 10,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  centerIconContainer: {
    backgroundColor: '#FF6B35',
    width: 50,
    height: 50,
    borderRadius: 25,
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  activeIcon: {
    backgroundColor: '#FFF0EC',
  },
});

export default CustomTabBar;

