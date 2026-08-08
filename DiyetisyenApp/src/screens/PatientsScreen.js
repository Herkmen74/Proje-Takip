import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl
} from 'react-native';
import { FAB, Card, Searchbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PatientService from '../database/models/PatientService';
import { useFocusEffect } from '@react-navigation/native';

const PatientsScreen = ({ navigation }) => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadPatients = async () => {
    try {
      const data = await PatientService.getAllPatients();
      setPatients(data);
      setFilteredPatients(data);
    } catch (error) {
      console.error('Hastalar yüklenemedi:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPatients();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPatients();
    setRefreshing(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(patient =>
        patient.name.toLowerCase().includes(query.toLowerCase()) ||
        (patient.phone && patient.phone.includes(query)) ||
        (patient.email && patient.email.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredPatients(filtered);
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

  const renderPatientCard = ({ item }) => {
    const age = calculateAge(item.birthdate);
    const bmi = item.weight && item.height 
      ? (item.weight / Math.pow(item.height / 100, 2)).toFixed(1)
      : null;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('PatientDetail', { patientId: item.id })}>
        <Card style={styles.patientCard}>
          <View style={styles.cardContent}>
            <View style={styles.avatar}>
              <Icon 
                name={item.gender === 'Kadın' ? 'human-female' : 'human-male'} 
                size={40} 
                color="#6200ee" 
              />
            </View>
            
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>{item.name}</Text>
              
              <View style={styles.infoRow}>
                {age && (
                  <View style={styles.infoItem}>
                    <Icon name="cake-variant" size={14} color="#666" />
                    <Text style={styles.infoText}>{age} yaş</Text>
                  </View>
                )}
                
                {item.phone && (
                  <View style={styles.infoItem}>
                    <Icon name="phone" size={14} color="#666" />
                    <Text style={styles.infoText}>{item.phone}</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.statsRow}>
                {item.weight && (
                  <View style={styles.statBadge}>
                    <Text style={styles.statLabel}>Kilo:</Text>
                    <Text style={styles.statValue}>{item.weight} kg</Text>
                  </View>
                )}
                
                {bmi && (
                  <View style={styles.statBadge}>
                    <Text style={styles.statLabel}>BMI:</Text>
                    <Text style={styles.statValue}>{bmi}</Text>
                  </View>
                )}
                
                {item.target_weight && (
                  <View style={styles.statBadge}>
                    <Text style={styles.statLabel}>Hedef:</Text>
                    <Text style={styles.statValue}>{item.target_weight} kg</Text>
                  </View>
                )}
              </View>
            </View>
            
            <Icon name="chevron-right" size={24} color="#ccc" />
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Hasta ara..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />

      {filteredPatients.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="account-multiple-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>
            {searchQuery ? 'Hasta bulunamadı' : 'Henüz hasta eklenmemiş'}
          </Text>
          {!searchQuery && (
            <Text style={styles.emptySubtext}>
              Yeni hasta eklemek için + butonuna tıklayın
            </Text>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredPatients}
          renderItem={renderPatientCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddPatient')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  searchBar: {
    margin: 10,
    elevation: 2
  },
  listContainer: {
    padding: 10
  },
  patientCard: {
    marginBottom: 10,
    elevation: 2
  },
  cardContent: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center'
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0e6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15
  },
  patientInfo: {
    flex: 1
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  statBadge: {
    flexDirection: 'row',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  statLabel: {
    fontSize: 11,
    color: '#2e7d32',
    marginRight: 3
  },
  statValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2e7d32'
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 20,
    fontWeight: '600'
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 10,
    textAlign: 'center'
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee'
  }
});

export default PatientsScreen;
