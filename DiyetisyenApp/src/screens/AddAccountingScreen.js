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
import AccountingService from '../database/models/AccountingService';

const AddAccountingScreen = ({ route, navigation }) => {
  const { recordId, isEdit } = route.params || {};
  
  const [patients, setPatients] = useState([]);
  const [showPatientPicker, setShowPatientPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'income',
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    patient_id: null,
    patient_name: '',
    payment_method: 'Nakit',
    invoice_number: ''
  });
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const incomeCategories = [
    'Danışmanlık',
    'İlk Muayene',
    'Kontrol',
    'Diyet Planı',
    'Online Danışmanlık',
    'Diğer'
  ];

  const expenseCategories = [
    'Kira',
    'Elektrik',
    'Su',
    'İnternet',
    'Malzeme',
    'Maaş',
    'Vergi',
    'Diğer'
  ];

  const paymentMethods = ['Nakit', 'Kredi Kartı', 'Banka Havalesi', 'Diğer'];

  useEffect(() => {
    loadPatients();
    if (isEdit && recordId) {
      loadRecordData();
    }
  }, [recordId, isEdit]);

  const loadPatients = async () => {
    try {
      const data = await PatientService.getAllPatients();
      setPatients(data);
    } catch (error) {
      console.error('Hastalar yüklenemedi:', error);
    }
  };

  const loadRecordData = async () => {
    try {
      const record = await AccountingService.getRecordById(recordId);
      
      setFormData({
        type: record.type,
        amount: record.amount.toString(),
        description: record.description || '',
        category: record.category || '',
        date: record.date,
        patient_id: record.patient_id,
        patient_name: record.patient_name || '',
        payment_method: record.payment_method || 'Nakit',
        invoice_number: record.invoice_number || ''
      });

      if (record.date) {
        setSelectedDate(new Date(record.date));
      }
    } catch (error) {
      console.error('Kayıt yüklenemedi:', error);
      Alert.alert('Hata', 'Kayıt bilgileri yüklenemedi.');
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

  const selectPatient = (patient) => {
    setFormData({
      ...formData,
      patient_id: patient.id,
      patient_name: patient.name
    });
    setShowPatientPicker(false);
  };

  const validateForm = () => {
    if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      Alert.alert('Uyarı', 'Geçerli bir tutar giriniz.');
      return false;
    }
    
    if (!formData.date) {
      Alert.alert('Uyarı', 'Tarih seçiniz.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const recordData = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description.trim() || null,
        category: formData.category || null,
        date: formData.date,
        patient_id: formData.patient_id || null,
        payment_method: formData.payment_method || null,
        invoice_number: formData.invoice_number.trim() || null
      };
      
      if (isEdit && recordId) {
        await AccountingService.updateRecord(recordId, recordData);
        Alert.alert('Başarılı', 'Kayıt güncellendi.');
      } else {
        await AccountingService.addRecord(recordData);
        Alert.alert('Başarılı', 'Kayıt eklendi.');
      }
      
      navigation.goBack();
    } catch (error) {
      console.error('Kayıt kaydedilemedi:', error);
      Alert.alert('Hata', 'Kayıt kaydedilemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const categories = formData.type === 'income' ? incomeCategories : expenseCategories;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        {/* Tip Seçimi */}
        <Text style={styles.label}>İşlem Tipi *</Text>
        <SegmentedButtons
          value={formData.type}
          onValueChange={(value) => setFormData({ 
            ...formData, 
            type: value,
            category: '' 
          })}
          buttons={[
            { value: 'income', label: 'Gelir', icon: 'cash-plus' },
            { value: 'expense', label: 'Gider', icon: 'cash-minus' }
          ]}
          style={styles.segmentedButtons}
        />

        {/* Tutar */}
        <TextInput
          label="Tutar (₺) *"
          value={formData.amount}
          onChangeText={(text) => setFormData({ ...formData, amount: text })}
          mode="outlined"
          style={styles.input}
          keyboardType="decimal-pad"
          placeholder="0.00"
          left={<TextInput.Icon icon="currency-try" />}
        />

        {/* Kategori */}
        <Text style={styles.label}>Kategori</Text>
        <View style={styles.categoryButtons}>
          {categories.map((category) => (
            <Button
              key={category}
              mode={formData.category === category ? 'contained' : 'outlined'}
              onPress={() => setFormData({ ...formData, category })}
              style={styles.categoryButton}
              compact>
              {category}
            </Button>
          ))}
        </View>

        {/* Açıklama */}
        <TextInput
          label="Açıklama"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          mode="outlined"
          style={styles.input}
          multiline
          numberOfLines={3}
          placeholder="İşleme ait açıklama..."
        />

        {/* Tarih */}
        <Button
          mode="outlined"
          onPress={() => setShowDatePicker(true)}
          style={styles.selectButton}
          icon="calendar">
          {new Date(formData.date).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
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

        {/* Hasta Seçimi (sadece gelir için) */}
        {formData.type === 'income' && (
          <>
            <Text style={styles.label}>Hasta (Opsiyonel)</Text>
            <Button
              mode="outlined"
              onPress={() => setShowPatientPicker(!showPatientPicker)}
              style={styles.selectButton}
              icon="account">
              {formData.patient_name || 'Hasta Seçin'}
            </Button>

            {showPatientPicker && (
              <View style={styles.patientList}>
                <List.Item
                  title="Hasta seçme"
                  onPress={() => {
                    setFormData({
                      ...formData,
                      patient_id: null,
                      patient_name: ''
                    });
                    setShowPatientPicker(false);
                  }}
                  left={props => <List.Icon {...props} icon="close" />}
                  style={styles.patientItem}
                />
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
          </>
        )}

        {/* Ödeme Yöntemi */}
        <Text style={styles.label}>Ödeme Yöntemi</Text>
        <View style={styles.categoryButtons}>
          {paymentMethods.map((method) => (
            <Button
              key={method}
              mode={formData.payment_method === method ? 'contained' : 'outlined'}
              onPress={() => setFormData({ ...formData, payment_method: method })}
              style={styles.categoryButton}
              compact>
              {method}
            </Button>
          ))}
        </View>

        {/* Fatura Numarası */}
        <TextInput
          label="Fatura/Fiş Numarası"
          value={formData.invoice_number}
          onChangeText={(text) => setFormData({ ...formData, invoice_number: text })}
          mode="outlined"
          style={styles.input}
          placeholder="Örn: FT-2024-001"
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
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 5
  },
  segmentedButtons: {
    marginBottom: 15
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff'
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15
  },
  categoryButton: {
    marginBottom: 5
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

export default AddAccountingScreen;
