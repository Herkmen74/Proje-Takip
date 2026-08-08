import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions
} from 'react-native';
import { Card, Title, Button, Divider } from 'react-native-paper';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { LineChart } from 'react-native-chart-kit';
import PatientService from '../database/models/PatientService';
import { WeightService } from '../database/models/WeightService';
import AppointmentService from '../database/models/AppointmentService';

const PatientDetailScreen = ({ route, navigation }) => {
  const { patientId } = route.params;
  const [patient, setPatient] = useState(null);
  const [weightHistory, setWeightHistory] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadPatientData();
  }, [patientId]);

  const loadPatientData = async () => {
    try {
      const patientData = await PatientService.getPatientById(patientId);
      const weights = await WeightService.getWeightHistory(patientId, 10);
      const appts = await AppointmentService.getAppointmentsByPatient(patientId);
      const patientStats = await PatientService.getPatientStats(patientId);
      
      setPatient(patientData);
      setWeightHistory(weights);
      setAppointments(appts.slice(0, 5));
      setStats(patientStats);
    } catch (error) {
      console.error('Hasta verileri yüklenemedi:', error);
    }
  };

  const calculateAge = (birthdate) => {
    if (!birthdate) return null;
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const calculateBMI = () => {
    if (!patient || !patient.weight || !patient.height) return null;
    return (patient.weight / Math.pow(patient.height / 100, 2)).toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return '';
    if (bmi < 18.5) return 'Zayıf';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Fazla Kilolu';
    return 'Obez';
  };

  const handleDelete = () => {
    Alert.alert(
      'Hastayı Sil',
      'Bu hastayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await PatientService.deletePatient(patientId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Hata', 'Hasta silinemedi.');
            }
          }
        }
      ]
    );
  };

  if (!patient) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  const age = calculateAge(patient.birthdate);
  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);

  // Kilo grafiği için veri hazırlama
  const weightChartData = weightHistory.length > 0 ? {
    labels: weightHistory.reverse().map(w => 
      new Date(w.date).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })
    ),
    datasets: [{
      data: weightHistory.map(w => w.weight)
    }]
  } : null;

  return (
    <ScrollView style={styles.container}>
      {/* Hasta Bilgileri Kartı */}
      <Card style={styles.card}>
        <View style={styles.headerSection}>
          <View style={styles.avatarLarge}>
            <Icon 
              name={patient.gender === 'Kadın' ? 'human-female' : 'human-male'} 
              size={60} 
              color="#6200ee" 
            />
          </View>
          <Title style={styles.patientName}>{patient.name}</Title>
          {age && <Text style={styles.ageText}>{age} yaş • {patient.gender}</Text>}
        </View>

        <Divider style={styles.divider} />

        <View style={styles.contactSection}>
          {patient.phone && (
            <View style={styles.contactItem}>
              <Icon name="phone" size={20} color="#6200ee" />
              <Text style={styles.contactText}>{patient.phone}</Text>
            </View>
          )}
          {patient.email && (
            <View style={styles.contactItem}>
              <Icon name="email" size={20} color="#6200ee" />
              <Text style={styles.contactText}>{patient.email}</Text>
            </View>
          )}
        </View>
      </Card>

      {/* Vücut Bilgileri */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Vücut Bilgileri</Title>
          <View style={styles.bodyStatsGrid}>
            <View style={styles.bodyStat}>
              <Icon name="human-male-height" size={32} color="#2196F3" />
              <Text style={styles.bodyStatValue}>{patient.height || '-'}</Text>
              <Text style={styles.bodyStatLabel}>Boy (cm)</Text>
            </View>
            <View style={styles.bodyStat}>
              <Icon name="weight-kilogram" size={32} color="#4CAF50" />
              <Text style={styles.bodyStatValue}>{patient.weight || '-'}</Text>
              <Text style={styles.bodyStatLabel}>Kilo (kg)</Text>
            </View>
            <View style={styles.bodyStat}>
              <Icon name="target" size={32} color="#FF9800" />
              <Text style={styles.bodyStatValue}>{patient.target_weight || '-'}</Text>
              <Text style={styles.bodyStatLabel}>Hedef (kg)</Text>
            </View>
            {bmi && (
              <View style={styles.bodyStat}>
                <Icon name="chart-line" size={32} color="#9C27B0" />
                <Text style={styles.bodyStatValue}>{bmi}</Text>
                <Text style={styles.bodyStatLabel}>BMI ({bmiCategory})</Text>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>

      {/* Kilo Grafiği */}
      {weightChartData && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Kilo Takibi</Title>
            <LineChart
              data={weightChartData}
              width={Dimensions.get('window').width - 60}
              height={200}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#6200ee'
                }
              }}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>
      )}

      {/* Son Randevular */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title>Son Randevular</Title>
            {appointments.length > 0 && (
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Tümü</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {appointments.length === 0 ? (
            <Text style={styles.emptyText}>Henüz randevu yok</Text>
          ) : (
            appointments.map((appt) => (
              <View key={appt.id} style={styles.appointmentItem}>
                <Icon name="calendar" size={20} color="#6200ee" />
                <View style={styles.appointmentInfo}>
                  <Text style={styles.appointmentDate}>
                    {new Date(appt.date).toLocaleDateString('tr-TR')} - {appt.time}
                  </Text>
                  <Text style={styles.appointmentStatus}>
                    {appt.status === 'planned' ? 'Planlandı' :
                     appt.status === 'completed' ? 'Tamamlandı' : 'İptal'}
                  </Text>
                </View>
              </View>
            ))
          )}
        </Card.Content>
      </Card>

      {/* Notlar */}
      {patient.notes && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Notlar</Title>
            <Text style={styles.notesText}>{patient.notes}</Text>
          </Card.Content>
        </Card>
      )}

      {/* İşlem Butonları */}
      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          icon="pencil"
          onPress={() => navigation.navigate('AddPatient', { 
            patientId, 
            isEdit: true 
          })}
          style={styles.editButton}>
          Düzenle
        </Button>
        <Button
          mode="outlined"
          icon="delete"
          onPress={handleDelete}
          style={styles.deleteButton}
          textColor="#f44336">
          Sil
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    margin: 10,
    elevation: 2
  },
  headerSection: {
    alignItems: 'center',
    padding: 20
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0e6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15
  },
  patientName: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  ageText: {
    fontSize: 16,
    color: '#666',
    marginTop: 5
  },
  divider: {
    marginVertical: 10
  },
  contactSection: {
    padding: 20,
    paddingTop: 10
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  contactText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333'
  },
  bodyStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 15
  },
  bodyStat: {
    alignItems: 'center',
    width: '45%',
    marginBottom: 20
  },
  bodyStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8
  },
  bodyStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center'
  },
  chart: {
    marginTop: 15,
    borderRadius: 16
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  seeAllText: {
    color: '#6200ee',
    fontWeight: 'bold'
  },
  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginTop: 8
  },
  appointmentInfo: {
    marginLeft: 10
  },
  appointmentDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  appointmentStatus: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 10
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginTop: 10
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 10,
    gap: 10,
    marginBottom: 20
  },
  editButton: {
    flex: 1,
    backgroundColor: '#6200ee'
  },
  deleteButton: {
    flex: 1,
    borderColor: '#f44336'
  }
});

export default PatientDetailScreen;
