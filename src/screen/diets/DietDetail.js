import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function DietDetail({ route }) {
  const navigation = useNavigation();
  const { diet } = route.params;
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <TouchableOpacity style={{ marginRight: 10 }} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={28} color="#333" />
            </TouchableOpacity>
            <Ionicons name={diet.icon} size={32} color={diet.color} style={{ marginRight: 10 }} />
            <Text style={styles.dietName}>{diet.name}</Text>
          </View>
          <Text style={styles.dietDesc}>{diet.description}</Text>
          <View style={{ flexDirection: 'row', marginVertical: 10, flexWrap: 'wrap' }}>
            {diet.features.map((f, i) => (
              <View key={i} style={[styles.featureBadge, { backgroundColor: diet.color + '22' }]}> 
                <Ionicons name="checkmark-circle" size={16} color={diet.color} />
                <Text style={{ color: diet.color, marginLeft: 4, fontWeight: 'bold' }}>{f}</Text>
              </View>
            ))}
          </View>
          {Object.entries(diet.meals).map(([meal, items], idx) => (
            <View key={meal} style={styles.mealSection}>
              <Text style={[styles.mealTitle, { color: diet.color }]}>{meal}</Text>
              {items.map((food, i) => (
                <View key={i} style={styles.foodCard}>
                  <Ionicons name="restaurant" size={18} color={diet.color} style={{ marginRight: 8 }} />
                  <Text style={{ fontSize: 15 }}>{food}</Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  dietName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  dietDesc: {
    fontSize: 15,
    color: '#666',
    marginBottom: 8,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  mealSection: {
    marginTop: 18,
  },
  mealTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  foodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});