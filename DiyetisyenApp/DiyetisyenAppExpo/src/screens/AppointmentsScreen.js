import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { FAB, Card, Searchbar, Chip, SegmentedButtons } from 'react-native-paper';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import AppointmentService from '../database/models/AppointmentService';
import { useFocusEffect } from '@react-navigation/native';

const AppointmentsScreen = ({ navigation }) => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const loadAppointments = async () => {
    try {
      const data = await AppointmentService.getAllAppointments();
      setAppointments(data);
      filterAppointments(data, searchQuery, selectedFilter);
    } catch (error) {
      console.error('Randevular yüklenemedi:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAppointments();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAppointments();
    setRefreshing(false);
  };

  const filterAppointments = (apptsData, query, filter) => {
    let filtered = apptsData;

    // Durum filtresi
    if (filter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(appt => appt.date === today);
    } else if (filter === 'upcoming') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(appt => appt.date >= today && appt.status !== 'cancelled');
    } else if (filter === 'past') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(appt => appt.date < today);
    } else if (filter === 'completed') {
      filtered = filtered.filter(appt => appt.status === 'completed');
    } else if (filter === 'cancelled') {
      filtered = filtered.filter(appt => appt.status === 'cancelled');
    }

    // Arama filtresi
    if (query.trim() !== '') {
      filtered = filtered.filter(appt =>
        appt.patient_name.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterAppointments(appointments, query, selectedFilter);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    filterAppointments(appointments, searchQuery, filter);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'planned':
        return '#2196F3';
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#f44336';
      default:
        return '#999';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'planned':
        return 'Planlandı';
      case 'completed':
        return 'Tamamlandı';
      case 'cancelled':
        return 'İptal';
      default:
        return 'Bekliyor';
    }
  };

  const renderAppointmentCard = ({ item }) => {
    const appointmentDate = new Date(item.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    appointmentDate.setHours(0, 0, 0, 0);
    
    const isPast = appointmentDate < today;
    const isToday = appointmentDate.getTime() === today.getTime();

    return (
      <TouchableOpacity>
        <Card style={[
          styles.appointmentCard,
          isToday && styles.todayCard
        ]}>
          <View style={styles.cardContent}>
            <View style={[styles.statusBar, { backgroundColor: getStatusColor(item.status) }]} />
            
            <View style={styles.appointmentIcon}>
              <Icon 
                name={isPast ? 'calendar-check' : isToday ? 'calendar-star' : 'calendar-clock'} 
                size={40} 
                color={isToday ? '#FF9800' : '#6200ee'} 
              />
            </View>

            <View style={styles.appointmentInfo}>
              <Text style={styles.patientName}>{item.patient_name}</Text>
              
              <View style={styles.infoRow}>
                <Icon name="calendar" size={14} color="#666" />
                <Text style={styles.infoText}>
                  {new Date(item.date).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Icon name="clock-outline" size={14} color="#666" />
                <Text style={styles.infoText}>
                  {item.time} ({item.duration} dk)
                </Text>
              </View>

              {item.patient_phone && (
                <View style={styles.infoRow}>
                  <Icon name="phone" size={14} color="#666" />
                  <Text style={styles.infoText}>{item.patient_phone}</Text>
                </View>
              )}

              <Chip
                style={[styles.statusChip, { backgroundColor: getStatusColor(item.status) + '20' }]}
                textStyle={[styles.statusChipText, { color: getStatusColor(item.status) }]}
                compact>
                {getStatusText(item.status)}
              </Chip>

              {item.notes && (
                <Text style={styles.notesText} numberOfLines={2}>
                  {item.notes}
                </Text>
              )}
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

      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={[
            { label: 'Tümü', value: 'all' },
            { label: 'Bugün', value: 'today' },
            { label: 'Yaklaşan', value: 'upcoming' },
            { label: 'Geçmiş', value: 'past' },
            { label: 'Tamamlanan', value: 'completed' },
            { label: 'İptal', value: 'cancelled' }
          ]}
          keyExtractor={(item) => item.value}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Chip
              selected={selectedFilter === item.value}
              onPress={() => handleFilterChange(item.value)}
              style={styles.filterChip}
              textStyle={styles.filterChipText}>
              {item.label}
            </Chip>
          )}
          contentContainerStyle={styles.filterList}
        />
      </View>

      {filteredAppointments.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="calendar-blank-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>
            {searchQuery || selectedFilter !== 'all'
              ? 'Randevu bulunamadı'
              : 'Henüz randevu eklenmemiş'}
          </Text>
          {!searchQuery && selectedFilter === 'all' && (
            <Text style={styles.emptySubtext}>
              Yeni randevu eklemek için + butonuna tıklayın
            </Text>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredAppointments}
          renderItem={renderAppointmentCard}
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
        onPress={() => navigation.navigate('AddAppointment')}
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
  filterContainer: {
    marginBottom: 5
  },
  filterList: {
    paddingHorizontal: 10,
    gap: 8
  },
  filterChip: {
    marginRight: 8
  },
  filterChipText: {
    fontSize: 12
  },
  listContainer: {
    padding: 10
  },
  appointmentCard: {
    marginBottom: 10,
    elevation: 2,
    overflow: 'hidden'
  },
  todayCard: {
    borderWidth: 2,
    borderColor: '#FF9800'
  },
  cardContent: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center'
  },
  statusBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4
  },
  appointmentIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0e6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    marginLeft: 4
  },
  appointmentInfo: {
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
    alignItems: 'center',
    marginBottom: 4
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5
  },
  statusChip: {
    alignSelf: 'flex-start',
    marginTop: 8,
    height: 24
  },
  statusChipText: {
    fontSize: 10,
    marginVertical: 0,
    fontWeight: 'bold'
  },
  notesText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic'
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

export default AppointmentsScreen;
