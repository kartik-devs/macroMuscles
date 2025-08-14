import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const FloatingTabBar = ({ activeTab, onTabPress }) => {
  const tabs = [
    { id: 'home', icon: 'home-outline', activeIcon: 'home' },
    { id: 'nutrition', icon: 'restaurant-outline', activeIcon: 'restaurant' },
    { id: 'add', icon: 'add', activeIcon: 'add', isCenter: true },
    { id: 'workouts', icon: 'fitness-outline', activeIcon: 'fitness' },
    { id: 'profile', icon: 'person-outline', activeIcon: 'person' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const isCenter = tab.isCenter;

          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabItem,
                isCenter && styles.centerTab
              ]}
              onPress={() => onTabPress(tab.id)}
              activeOpacity={0.7}
            >
              <Animated.View style={[
                styles.iconContainer,
                isCenter && styles.centerIconContainer,
                isActive && !isCenter && styles.activeIconContainer
              ]}>
                <Icon
                  name={isActive ? tab.activeIcon : tab.icon}
                  size={isCenter ? 28 : 24}
                  color={
                    isCenter 
                      ? '#FFFFFF' 
                      : isActive 
                        ? '#FF6B35' 
                        : '#8E8E93'
                  }
                />
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  centerTab: {
    marginHorizontal: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  centerIconContainer: {
    backgroundColor: '#FF6B35',
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#FF6B35',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 12,
  },
  activeIconContainer: {
    backgroundColor: '#FFF5F2',
    borderWidth: 2,
    borderColor: '#FFE5D9',
  },
});

export default FloatingTabBar;

