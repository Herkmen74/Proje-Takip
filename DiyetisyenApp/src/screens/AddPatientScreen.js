import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { TextInput, Button, SegmentedButtons } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import PatientService from '../database/models/PatientService';

const AddPatientScreen = ({ route, navigation }) => {
  const { patientId, isEdit } = route.params || {};
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    birthdate: '',
    gender: 'Kadın',
    weight: '',
    height: '',
    target_weight: '',
    notes: ''
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && patientId) {
      loadPatientData();
    }
  }, [patientId, isEdit]);

  const loadPatientData = async () => {
    try {
      const patient = await PatientService.getPatientById(patientId);
      setFormData({
        name: patient.name || '',
        phone: patient.phone || '',
        email: patient.email || '',
        birthdate: patient.birthdate || '',
        gender: patient.gender || 'Kadın',
        weight: patient.weight ? patient.weight.toString() : '',
        height: patient.height ? patient.height.toString() : '',
        target_weight: patient.target_weight ? patient.target_weight.toString() : '',
        notes: patient.notes || ''
      });
      
      if (patient.birthdate) {
        setSelectedDate(new Date(patient.birthdate));
      }
    } catch (error) {
      console.error('Hasta yüklenemedi:', error);
      Alert.alert('Hata', 'Hasta bilgileri yüklenemedi.');
    }
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
      setFormData({
        ...formData,
        birthdate: date.toISOString().split('T')[0]
      });
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Uyarı', 'Hasta adı zorunludur.');
      return false;
    }
    
    if (formData.weight && isNaN(parseFloat(formData.weight))) {
      Alert.alert('Uyarı', 'Geçerli bir kilo giriniz.');
      return false;
    }
    
    if (formData.height && isNaN(parseFloat(formData.height))) {
      Alert.alert('Uyarı', 'Geçerli bir boy giriniz.');
      return false;
    }
    
    if (formData.target_weight && isNaN(parseFloat(formData.target_weight))) {
      Alert.alert('Uyarı', 'Geçerli bir hedef kilo giriniz.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const patientData = {
        name: formData.name.trim(),
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
        birthdate: formData.birthdate || null,
        gender: formData.gender,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        target_weight: formData.target_weight ? parseFloat(formData.target_weight) : null,
        notes: formData.notes.trim() || null
      };
      
      if (isEdit && patientId) {
        await PatientService.updatePatient(patientId, patientData);
        Alert.alert('Başarılı', 'Hasta güncellendi.');
      } else {
        await PatientService.addPatient(patientData);
        Alert.alert('Başarılı', 'Hasta eklendi.');
      }
      
      navigation.goBack();
    } catch (error) {
      console.error('Hasta kaydedilemedi:', error);
      Alert.alert('Hata', 'Hasta kaydedilemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          label="Ad Soyad *"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          mode="outlined"
          style={styles.input}
          placeholder="Örn: Ahmet Yılmaz"
        />

        <TextInput
          label="Telefon"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          mode="outlined"
          style={styles.input}
          keyboardType="phone-pad"
          placeholder="Örn: 555 123 4567"
        />

        <TextInput
          label="E-posta"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Örn: ornek@email.com"
        />

        <Button
          mode="outlined"
          onPress={() => setShowDatePicker(true)}
          style={styles.dateButton}
          icon="calendar">
          {formData.birthdate 
            ? new Date(formData.birthdate).toLocaleDateString('tr-TR')
            : 'Doğum Tarihi Seç'}
        </Button>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        <SegmentedButtons
          value={formData.gender}
          onValueChange={(value) => setFormData({ ...formData, gender: value })}
          buttons={[
            { value: 'Kadın', label: 'Kadın', icon: 'human-female' },
            { value: 'Erkek', label: 'Erkek', icon: 'human-male' }
          ]}
          style={styles.segmentedButtons}
        />

        <View style={styles.row}>
          <TextInput
            label="Boy (cm)"
            value={formData.height}
            onChangeText={(text) => setFormData({ ...formData, height: text })}
            mode="outlined"
            style={[styles.input, styles.halfWidth]}
            keyboardType="decimal-pad"
            placeholder="170"
          />

          <TextInput
            label="Kilo (kg)"
            value={formData.weight}
            onChangeText={(text) => setFormData({ ...formData, weight: text })}
            mode="outlined"
            style={[styles.input, styles.halfWidth]}
            keyboardType="decimal-pad"
            placeholder="70"
          />
        </View>

        <TextInput
          label="Hedef Kilo (kg)"
          value={formData.target_weight}
          onChangeText={(text) => setFormData({ ...formData, target_weight: text })}
          mode="outlined"
          style={styles.input}
          keyboardType="decimal-pad"
          placeholder="65"
        />

        <TextInput
          label="Notlar"
          value={formData.notes}
          onChangeText={(text) => setFormData({ ...formData, notes: text })}
          mode="outlined"
          style={styles.input}
          multiline
          numberOfLines={4}
          placeholder="Hastaya ait özel notlar..."
        />

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}>
            İptal
          </Button>
          
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.submitButton}>
            {isEdit ? 'Güncelle' : 'Kaydet'}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  form: {
    padding: 15
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff'
  },
  dateButton: {
    marginBottom: 15,
    borderColor: '#6200ee'
  },
  segmentedButtons: {
    marginBottom: 15
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },
  halfWidth: {
    flex: 1
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    marginBottom: 30
  },
  cancelButton: {
    flex: 1,
    borderColor: '#999'
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#6200ee'
  }
});

export default AddPatientScreen;
