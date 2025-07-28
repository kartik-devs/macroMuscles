import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { customDietTemplate } from './data/dietData';

export default function CustomDiet({ navigation }) {
  const [diet, setDiet] = useState({...customDietTemplate});
  const [editing, setEditing] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [editingMeal, setEditingMeal] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  
  // Load custom diet if it exists
  useEffect(() => {
    const loadCustomDiet = async () => {
      try {
        const savedDiet = await AsyncStorage.getItem('customDiet');
        if (savedDiet) {
          setDiet(JSON.parse(savedDiet));
        }
      } catch (error) {
        console.error('Error loading custom diet:', error);
      }
    };
    
    loadCustomDiet();
  }, []);
  
  // Save custom diet
  const saveDiet = async () => {
    try {
      await AsyncStorage.setItem('customDiet', JSON.stringify(diet));
      Alert.alert('Success', 'Custom diet saved successfully!');
    } catch (error) {
      console.error('Error saving custom diet:', error);
      Alert.alert('Error', 'Failed to save custom diet.');
    }
  };
  
  // Start editing a field
  const startEditing = (field, value) => {
    setEditingField(field);
    setEditingValue(value);
    setEditing(true);
  };
  
  // Start editing a meal item
  const startEditingMeal = (meal, index, value) => {
    setEditingMeal(meal);
    setEditingIndex(index);
    setEditingValue(value);
    setEditing(true);
  };
  
  // Save edited field
  const saveEdit = () => {
    if (editingField) {
      setDiet({
        ...diet,
        [editingField]: editingValue
      });
    } else if (editingMeal && editingIndex !== null) {
      const updatedMeals = {...diet.meals};
      updatedMeals[editingMeal][editingIndex] = editingValue;
      setDiet({
        ...diet,
        meals: updatedMeals
      });
    }
    
    setEditing(false);
    setEditingField(null);
    setEditingMeal(null);
    setEditingIndex(null);
    setEditingValue('');
  };
  
  // Add a new meal item
  const addMealItem = (meal) => {
    const updatedMeals = {...diet.meals};
    updatedMeals[meal] = [...updatedMeals[meal], 'New item'];
    setDiet({
      ...diet,
      meals: updatedMeals
    });
  };
  
  // Remove a meal item
  const removeMealItem = (meal, index) => {
    const updatedMeals = {...diet.meals};
    updatedMeals[meal] = updatedMeals[meal].filter((_, i) => i !== index);
    setDiet({
      ...diet,
      meals: updatedMeals
    });
  };
  
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
            
            {editing && editingField === 'name' ? (
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.editInput}
                  value={editingValue}
                  onChangeText={setEditingValue}
                  autoFocus
                />
                <TouchableOpacity style={styles.saveButton} onPress={saveEdit}>
                  <Ionicons name="checkmark" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => startEditing('name', diet.name)}>
                <Text style={styles.dietName}>{diet.name}</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {editing && editingField === 'description' ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.editInput}
                value={editingValue}
                onChangeText={setEditingValue}
                autoFocus
                multiline
              />
              <TouchableOpacity style={styles.saveButton} onPress={saveEdit}>
                <Ionicons name="checkmark" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => startEditing('description', diet.description)}>
              <Text style={styles.dietDesc}>{diet.description}</Text>
            </TouchableOpacity>
          )}
          
          <View style={{ flexDirection: 'row', marginVertical: 10, flexWrap: 'wrap' }}>
            {diet.features.map((f, i) => (
              <TouchableOpacity 
                key={i} 
                style={[styles.featureBadge, { backgroundColor: diet.color + '22' }]}
                onPress={() => startEditing(`features[${i}]`, f)}
              > 
                <Ionicons name="checkmark-circle" size={16} color={diet.color} />
                {editing && editingField === `features[${i}]` ? (
                  <View style={styles.editFeatureContainer}>
                    <TextInput
                      style={styles.editFeatureInput}
                      value={editingValue}
                      onChangeText={setEditingValue}
                      autoFocus
                    />
                    <TouchableOpacity style={styles.saveFeatureButton} onPress={saveEdit}>
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text style={{ color: diet.color, marginLeft: 4, fontWeight: 'bold' }}>{f}</Text>
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity 
              style={[styles.featureBadge, { backgroundColor: diet.color + '22' }]}
              onPress={() => {
                const updatedFeatures = [...diet.features, 'New feature'];
                setDiet({
                  ...diet,
                  features: updatedFeatures
                });
              }}
            >
              <Ionicons name="add-circle" size={16} color={diet.color} />
              <Text style={{ color: diet.color, marginLeft: 4, fontWeight: 'bold' }}>Add Feature</Text>
            </TouchableOpacity>
          </View>
          
          {Object.entries(diet.meals).map(([meal, items], idx) => (
            <View key={meal} style={styles.mealSection}>
              <Text style={[styles.mealTitle, { color: diet.color }]}>{meal}</Text>
              {items.map((food, i) => (
                <View key={i} style={styles.foodCard}>
                  {editing && editingMeal === meal && editingIndex === i ? (
                    <View style={styles.editMealContainer}>
                      <TextInput
                        style={styles.editMealInput}
                        value={editingValue}
                        onChangeText={setEditingValue}
                        autoFocus
                      />
                      <TouchableOpacity style={styles.saveMealButton} onPress={saveEdit}>
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      <Ionicons name="restaurant" size={18} color={diet.color} style={{ marginRight: 8 }} />
                      <Text style={{ fontSize: 15, flex: 1 }}>{food}</Text>
                      <TouchableOpacity onPress={() => startEditingMeal(meal, i, food)}>
                        <Ionicons name="create-outline" size={18} color="#666" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={{ marginLeft: 10 }}
                        onPress={() => removeMealItem(meal, i)}
                      >
                        <Ionicons name="trash-outline" size={18} color="#E53935" />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              ))}
              <TouchableOpacity 
                style={styles.addItemButton}
                onPress={() => addMealItem(meal)}
              >
                <Ionicons name="add-circle-outline" size={18} color={diet.color} />
                <Text style={{ color: diet.color, marginLeft: 5 }}>Add Item</Text>
              </TouchableOpacity>
            </View>
          ))}
          
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={saveDiet}
          >
            <Text style={styles.saveButtonText}>Save Custom Diet</Text>
          </TouchableOpacity>
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
  editContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#3498db',
    fontSize: 16,
    padding: 5,
  },
  editFeatureContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editFeatureInput: {
    flex: 1,
    fontSize: 14,
    padding: 2,
  },
  saveFeatureButton: {
    backgroundColor: '#3498db',
    borderRadius: 10,
    padding: 2,
    marginLeft: 5,
  },
  editMealContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editMealInput: {
    flex: 1,
    fontSize: 15,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#3498db',
  },
  saveMealButton: {
    backgroundColor: '#3498db',
    borderRadius: 12,
    padding: 4,
    marginLeft: 5,
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});