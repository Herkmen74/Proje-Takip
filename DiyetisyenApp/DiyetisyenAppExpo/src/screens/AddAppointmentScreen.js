import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { TextInput, Button, SegmentedButtons, List } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import PatientService from '../database/models/PatientService';
import AppointmentService from '../database/models/AppointmentService';

const AddAppointmentScreen = ({ route, navigation }) => {
  const { appointmentId, isEdit } = route.params || {};
  
  const [patients, setPatients] = useState([]);
  const [showPatientPicker, setShowPatientPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  const [formData, setFormData] = useState({
    patient_id: null,
    patient_name: '',
    date: '',
    time: '',
    duration: '30',
    status: 'planned',
    notes: ''
  });
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPatients();
    if (isEdit && appointmentId) {
      loadAppointmentData();
    }
  }, [appointmentId, isEdit]);

  const loadPatients = async () => {
    try {
      const data = await PatientService.getAllPatients();
      setPatients(data);
    } catch (error) {
      console.error('Hastalar yüklenemedi:', error);
    }
  };

  const loadAppointmentData = async () => {
    try {
      const appointment = await AppointmentService.getAppointmentById(appointmentId);
      
      setFormData({
        patient_id: appointment.patient_id,
        patient_name: appointment.patient_name,
        date: appointment.date,
        time: appointment.time,
        duration: appointment.duration ? appointment.duration.toString() : '30',
        status: appointment.status,
        notes: appointment.notes || ''
      });

      if (appointment.date) {
        setSelectedDate(new Date(appointment.date));
      }
      
      if (appointment.time) {
        const [hours, minutes] = appointment.time.split(':');
        const timeDate = new Date();
        timeDate.setHours(parseInt(hours), parseInt(minutes));
        setSelectedTime(timeDate);
      }
    } catch (error) {
      console.error('Randevu yüklenemedi:', error);
      Alert.alert('Hata', 'Randevu bilgileri yüklenemedi.');
    }
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
      setFormData({
        ...formData,
        date: date.toISOString().split('T')[0]
      });
    }
  };

  const handleTimeChange = (event, time) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (time) {
      setSelectedTime(time);
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      setFormData({
        ...formData,
        time: `${hours}:${minutes}`
      });
    }
  };

  const selectPatient = (patient) => {
    setFormData({
      ...formData,
      patient_id: patient.id,
      patient_name: patient.name
    });
    setShowPatientPicker(false);
  };

  const validateForm = () => {
    if (!formData.patient_id) {
      Alert.alert('Uyarı', 'Lütfen bir hasta seçin.');
      return false;
    }
    
    if (!formData.date) {
      Alert.alert('Uyarı', 'Lütfen randevu tarihi seçin.');
      return false;
    }
    
    if (!formData.time) {
      Alert.alert('Uyarı', 'Lütfen randevu saati seçin.');
      return false;
    }
    
    if (!formData.duration || isNaN(parseInt(formData.duration))) {
      Alert.alert('Uyarı', 'Geçerli bir süre giriniz.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const appointmentData = {
        patient_id: formData.patient_id,
        date: formData.date,
        time: formData.time,
        duration: parseInt(formData.duration),
        status: formData.status,
        notes: formData.notes.trim() || null
      };
      
      if (isEdit && appointmentId) {
        await AppointmentService.updateAppointment(appointmentId, appointmentData);
        Alert.alert('Başarılı', 'Randevu güncellendi.');
      } else {
        await AppointmentService.addAppointment(appointmentData);
        Alert.alert('Başarılı', 'Randevu oluşturuldu.');
      }
      
      navigation.goBack();
    } catch (error) {
      console.error('Randevu kaydedilemedi:', error);
      Alert.alert('Hata', 'Randevu kaydedilemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {/* Hasta Seçimi */}
        <Button
          mode="outlined"
          onPress={() => setShowPatientPicker(!showPatientPicker)}
          style={styles.selectButton}
          icon="account">
          {formData.patient_name || 'Hasta Seçin *'}
        </Button>

        {showPatientPicker && (
          <View style={styles.patientList}>
            {patients.map((patient) => (
              <List.Item
                key={patient.id}
                title={patient.name}
                description={patient.phone}
                left={props => <List.Icon {...props} icon="account" />}
                onPress={() => selectPatient(patient)}
                style={styles.patientItem}
              />
            ))}
          </View>
        )}

        {/* Tarih Seçimi */}
        <Button
          mode="outlined"
          onPress={() => setShowDatePicker(true)}
          style={styles.selectButton}
          icon="calendar">
          {formData.date 
            ? new Date(formData.date).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })
            : 'Tarih Seçin *'}
        </Button>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}

        {/* Saat Seçimi */}
        <Button
          mode="outlined"
          onPress={() => setShowTimePicker(true)}
          style={styles.selectButton}
          icon="clock-outline">
          {formData.time || 'Saat Seçin *'}
        </Button>

        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={handleTimeChange}
          />
        )}

        {/* Süre */}
        <TextInput
          label="Süre (dakika) *"
          value={formData.duration}
          onChangeText={(text) => setFormData({ ...formData, duration: text })}
          mode="outlined"
          style={styles.input}
          keyboardType="number-pad"
          placeholder="30"
        />

        {/* Durum */}
        <Text style={styles.label}>Durum</Text>
        <SegmentedButtons
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value })}
          buttons={[
            { value: 'planned', label: 'Planlandı', icon: 'calendar-clock' },
            { value: 'completed', label: 'Tamamlandı', icon: 'check-circle' },
            { value: 'cancelled', label: 'İptal', icon: 'close-circle' }
          ]}
          style={styles.segmentedButtons}
        />

        {/* Notlar */}
        <TextInput
          label="Notlar"
          value={formData.notes}
          onChangeText={(text) => setFormData({ ...formData, notes: text })}
          mode="outlined"
          style={styles.input}
          multiline
          numberOfLines={4}
          placeholder="Randevuya ait notlar..."
        />

        {/* Butonlar */}
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
  selectButton: {
    marginBottom: 15,
    borderColor: '#6200ee',
    justifyContent: 'center',
    height: 56
  },
  patientList: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
    maxHeight: 300
  },
  patientItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10
  },
  segmentedButtons: {
    marginBottom: 15
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

export default AddAppointmentScreen;
