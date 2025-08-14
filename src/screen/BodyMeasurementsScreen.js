import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BodyMeasurementsScreen({ navigation }) {
  const [measurements, setMeasurements] = useState({
    weight: { current: 75.2, previous: 75.7, unit: 'kg' },
    bodyFat: { current: 18.5, previous: 19.7, unit: '%' },
    muscleMass: { current: 32.8, previous: 32.1, unit: 'kg' },
    bmi: { current: 22.4, previous: 22.6, unit: '' },
    chest: { current: 102, previous: 101, unit: 'cm' },
    waist: { current: 84, previous: 86, unit: 'cm' },
    hips: { current: 96, previous: 97, unit: 'cm' },
    arms: { current: 35, previous: 34, unit: 'cm' },
    thighs: { current: 58, previous: 57, unit: 'cm' },
  });

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [newValue, setNewValue] = useState('');

  const getChangeColor = (current, previous) => {
    if (current < previous) return '#44bd32';
    if (current > previous) return '#E53935';
    return '#666';
  };

  const getChangeIcon = (current, previous) => {
    if (current < previous) return 'trending-down';
    if (current > previous) return 'trending-up';
    return 'remove';
  };

  const getChangeText = (current, previous, unit) => {
    const diff = (current - previous).toFixed(1);
    const sign = diff > 0 ? '+' : '';
    return `${sign}${diff}${unit}`;
  };

  const handleAddMeasurement = () => {
    if (!newValue.trim()) {
      Alert.alert('Error', 'Please enter a value');
      return;
    }

    const value = parseFloat(newValue);
    if (isNaN(value)) {
      Alert.alert('Error', 'Please enter a valid number');
      return;
    }

    setMeasurements(prev => ({
      ...prev,
      [selectedMetric]: {
        ...prev[selectedMetric],
        previous: prev[selectedMetric].current,
        current: value,
      }
    }));

    setAddModalVisible(false);
    setNewValue('');
    setSelectedMetric(null);
    Alert.alert('Success', 'Measurement added successfully!');
  };

  const MeasurementCard = ({ title, data, icon, color = '#0097e6' }) => (
    <TouchableOpacity style={styles.measurementCard}>
      <View style={styles.cardHeader}>
        <View style={[styles.cardIcon, { backgroundColor: color }]}>
          <Ionicons name={icon} size={20} color="#fff" />
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            setSelectedMetric(title.toLowerCase().replace(' ', ''));
            setAddModalVisible(true);
          }}
        >
          <Ionicons name="add" size={16} color="#0097e6" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.cardTitle}>{title}</Text>
      
      <View style={styles.valueContainer}>
        <Text style={styles.currentValue}>
          {data.current}{data.unit}
        </Text>
        <View style={[styles.changeContainer, { backgroundColor: getChangeColor(data.current, data.previous) + '20' }]}>
          <Ionicons 
            name={getChangeIcon(data.current, data.previous)} 
            size={12} 
            color={getChangeColor(data.current, data.previous)} 
          />
          <Text style={[styles.changeText, { color: getChangeColor(data.current, data.previous) }]}>
            {getChangeText(data.current, data.previous, data.unit)}
          </Text>
        </View>
      </View>
      
      <Text style={styles.previousValue}>
        Previous: {data.previous}{data.unit}
      </Text>
    </TouchableOpacity>
  );

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { text: 'Underweight', color: '#f39c12' };
    if (bmi < 25) return { text: 'Normal', color: '#44bd32' };
    if (bmi < 30) return { text: 'Overweight', color: '#f39c12' };
    return { text: 'Obese', color: '#E53935' };
  };

  const bmiCategory = getBMICategory(measurements.bmi.current);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Body Measurements</Text>
        <TouchableOpacity onPress={() => Alert.alert('Export', 'Export measurements data')}>
          <Ionicons name="download-outline" size={24} color="#0097e6" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.overviewSection}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.overviewGrid}>
            <MeasurementCard title="Weight" data={measurements.weight} icon="scale-outline" color="#E53935" />
            <MeasurementCard title="Body Fat" data={measurements.bodyFat} icon="fitness-outline" color="#f39c12" />
            <MeasurementCard title="Muscle Mass" data={measurements.muscleMass} icon="barbell-outline" color="#44bd32" />
            <MeasurementCard title="BMI" data={measurements.bmi} icon="calculator-outline" color={bmiCategory.color} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BMI Analysis</Text>
          <View style={styles.bmiContainer}>
            <View style={styles.bmiValue}>
              <Text style={styles.bmiNumber}>{measurements.bmi.current}</Text>
              <View style={[styles.bmiCategory, { backgroundColor: bmiCategory.color }]}>
                <Text style={styles.bmiCategoryText}>{bmiCategory.text}</Text>
              </View>
            </View>
            <View style={styles.bmiScale}>
              <View style={[styles.bmiBar, { backgroundColor: '#f39c12', width: '25%' }]} />
              <View style={[styles.bmiBar, { backgroundColor: '#44bd32', width: '25%' }]} />
              <View style={[styles.bmiBar, { backgroundColor: '#f39c12', width: '25%' }]} />
              <View style={[styles.bmiBar, { backgroundColor: '#E53935', width: '25%' }]} />
              <View style={[styles.bmiIndicator, { left: `${(measurements.bmi.current / 40) * 100}%` }]} />
            </View>
            <View style={styles.bmiLabels}>
              <Text style={styles.bmiLabel}>Under</Text>
              <Text style={styles.bmiLabel}>Normal</Text>
              <Text style={styles.bmiLabel}>Over</Text>
              <Text style={styles.bmiLabel}>Obese</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Body Measurements</Text>
          <View style={styles.measurementsGrid}>
            <MeasurementCard title="Chest" data={measurements.chest} icon="body-outline" color="#8e44ad" />
            <MeasurementCard title="Waist" data={measurements.waist} icon="ellipse-outline" color="#e67e22" />
            <MeasurementCard title="Hips" data={measurements.hips} icon="ellipse-outline" color="#16a085" />
            <MeasurementCard title="Arms" data={measurements.arms} icon="fitness-outline" color="#2980b9" />
            <MeasurementCard title="Thighs" data={measurements.thighs} icon="walk-outline" color="#27ae60" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goals & Targets</Text>
          <View style={styles.goalsList}>
            <View style={styles.goalItem}>
              <View style={styles.goalIcon}>
                <Ionicons name="flag" size={16} color="#0097e6" />
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Target Weight</Text>
                <Text style={styles.goalValue}>72.0 kg</Text>
              </View>
              <View style={styles.goalProgress}>
                <Text style={styles.goalProgressText}>68% Complete</Text>
                <View style={styles.goalProgressBar}>
                  <View style={[styles.goalProgressFill, { width: '68%' }]} />
                </View>
              </View>
            </View>
            
            <View style={styles.goalItem}>
              <View style={styles.goalIcon}>
                <Ionicons name="flag" size={16} color="#f39c12" />
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>Target Body Fat</Text>
                <Text style={styles.goalValue}>15.0%</Text>
              </View>
              <View style={styles.goalProgress}>
                <Text style={styles.goalProgressText}>42% Complete</Text>
                <View style={styles.goalProgressBar}>
                  <View style={[styles.goalProgressFill, { width: '42%', backgroundColor: '#f39c12' }]} />
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={addModalVisible} onRequestClose={() => setAddModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Measurement</Text>
            <Text style={styles.modalSubtitle}>
              {selectedMetric && selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)}
            </Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Enter value"
              value={newValue}
              onChangeText={setNewValue}
              keyboardType="numeric"
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setAddModalVisible(false);
                  setNewValue('');
                  setSelectedMetric(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddMeasurement}
              >
                <Text style={styles.saveButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  overviewSection: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  overviewGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  measurementCard: { backgroundColor: '#fff', borderRadius: 12, padding: 15, width: '48%', marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardIcon: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  addButton: { padding: 4 },
  cardTitle: { fontSize: 14, color: '#666', marginBottom: 8 },
  valueContainer: { marginBottom: 8 },
  currentValue: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  changeContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, alignSelf: 'flex-start' },
  changeText: { fontSize: 11, fontWeight: '600', marginLeft: 2 },
  previousValue: { fontSize: 11, color: '#999' },
  section: { backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 20, borderRadius: 12, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  bmiContainer: { alignItems: 'center' },
  bmiValue: { alignItems: 'center', marginBottom: 20 },
  bmiNumber: { fontSize: 48, fontWeight: 'bold', color: '#333' },
  bmiCategory: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 8 },
  bmiCategoryText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  bmiScale: { flexDirection: 'row', width: '100%', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 8, position: 'relative' },
  bmiBar: { height: '100%' },
  bmiIndicator: { position: 'absolute', top: -4, width: 16, height: 16, backgroundColor: '#333', borderRadius: 8, transform: [{ translateX: -8 }] },
  bmiLabels: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  bmiLabel: { fontSize: 10, color: '#666' },
  measurementsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  goalsList: { marginTop: 10 },
  goalItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  goalIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f8f9fa', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  goalInfo: { flex: 1 },
  goalTitle: { fontSize: 14, fontWeight: '600', color: '#333' },
  goalValue: { fontSize: 12, color: '#666', marginTop: 2 },
  goalProgress: { alignItems: 'flex-end' },
  goalProgressText: { fontSize: 11, color: '#0097e6', fontWeight: '600', marginBottom: 4 },
  goalProgressBar: { width: 60, height: 4, backgroundColor: '#f0f0f0', borderRadius: 2 },
  goalProgressFill: { height: '100%', backgroundColor: '#0097e6', borderRadius: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '85%', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 15, elevation: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5, textAlign: 'center' },
  modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center' },
  modalInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 16, textAlign: 'center' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  modalButton: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  cancelButton: { backgroundColor: '#f0f0f0', marginRight: 8 },
  cancelButtonText: { color: '#666' },
  saveButton: { backgroundColor: '#0097e6', marginLeft: 8 },
  saveButtonText: { color: 'white', fontWeight: '600' },
});