import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions
} from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart, PieChart } from 'react-native-chart-kit';
import PatientService from '../database/models/PatientService';
import AppointmentService from '../database/models/AppointmentService';
import AccountingService from '../database/models/AccountingService';
import { useFocusEffect } from '@react-navigation/native';

const DashboardScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    upcomingAppointments: 0,
    todayIncome: 0,
    weeklyIncome: 0,
    monthlyIncome: 0,
    weeklyExpense: 0
  });
  const [todayAppointments, setTodayAppointments] = useState([]);

  const loadDashboardData = async () => {
    try {
      // Hasta sayısı
      const patients = await PatientService.getAllPatients();
      
      // Bugünün randevuları
      const todayAppts = await AppointmentService.getTodayAppointments();
      
      // Yaklaşan randevular (7 gün)
      const upcoming = await AppointmentService.getUpcomingAppointments(7);
      
      // Bugünün geliri
      const today = new Date().toISOString().split('T')[0];
      const todayRecords = await AccountingService.getTodayRecords();
      const todayInc = todayRecords
        .filter(r => r.type === 'income')
        .reduce((sum, r) => sum + r.amount, 0);
      
      // Haftalık özet
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);
      const weeklySummary = await AccountingService.getSummary(
        weekStart.toISOString().split('T')[0],
        today
      );
      
      // Aylık gelir
      const monthStart = new Date();
      monthStart.setDate(1);
      const monthlySummary = await AccountingService.getSummary(
        monthStart.toISOString().split('T')[0],
        today
      );
      
      setStats({
        totalPatients: patients.length,
        todayAppointments: todayAppts.length,
        upcomingAppointments: upcoming.length,
        todayIncome: todayInc,
        weeklyIncome: weeklySummary.income,
        monthlyIncome: monthlySummary.income,
        weeklyExpense: weeklySummary.expense
      });
      
      setTodayAppointments(todayAppts.slice(0, 5));
    } catch (error) {
      console.error('Dashboard veri yükleme hatası:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const StatCard = ({ title, value, icon, color, onPress }) => (
    <TouchableOpacity 
      style={[styles.statCard, { borderLeftColor: color }]}
      onPress={onPress}>
      <View style={styles.statCardContent}>
        <Icon name={icon} size={40} color={color} />
        <View style={styles.statCardText}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      
      <View style={styles.header}>
        <Title style={styles.welcomeText}>Diyetisyen Panosu</Title>
        <Paragraph style={styles.dateText}>
          {new Date().toLocaleDateString('tr-TR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Paragraph>
      </View>

      {/* İstatistik Kartları */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Toplam Hasta"
          value={stats.totalPatients}
          icon="account-multiple"
          color="#2196F3"
          onPress={() => navigation.navigate('PatientsTab')}
        />
        <StatCard
          title="Bugünkü Randevu"
          value={stats.todayAppointments}
          icon="calendar-today"
          color="#4CAF50"
          onPress={() => navigation.navigate('AppointmentsTab')}
        />
      </View>

      {/* Finansal Özet */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Finansal Özet</Title>
          <View style={styles.financialRow}>
            <View style={styles.financialItem}>
              <Icon name="cash" size={24} color="#4CAF50" />
              <Text style={styles.financialLabel}>Bugün</Text>
              <Text style={styles.financialValue}>
                {formatCurrency(stats.todayIncome)}
              </Text>
            </View>
            <View style={styles.financialItem}>
              <Icon name="cash-multiple" size={24} color="#2196F3" />
              <Text style={styles.financialLabel}>Bu Hafta</Text>
              <Text style={styles.financialValue}>
                {formatCurrency(stats.weeklyIncome)}
              </Text>
            </View>
            <View style={styles.financialItem}>
              <Icon name="chart-line" size={24} color="#9C27B0" />
              <Text style={styles.financialLabel}>Bu Ay</Text>
              <Text style={styles.financialValue}>
                {formatCurrency(stats.monthlyIncome)}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.viewMoreButton}
            onPress={() => navigation.navigate('AccountingTab')}>
            <Text style={styles.viewMoreText}>Detaylı Görüntüle</Text>
            <Icon name="chevron-right" size={20} color="#6200ee" />
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* Bugünkü Randevular */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title>Bugünkü Randevular</Title>
            <TouchableOpacity onPress={() => navigation.navigate('AppointmentsTab')}>
              <Text style={styles.seeAllText}>Tümü</Text>
            </TouchableOpacity>
          </View>
          
          {todayAppointments.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="calendar-blank" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Bugün randevu yok</Text>
            </View>
          ) : (
            todayAppointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentItem}>
                <View style={styles.appointmentTime}>
                  <Icon name="clock-outline" size={20} color="#6200ee" />
                  <Text style={styles.appointmentTimeText}>{appointment.time}</Text>
                </View>
                <View style={styles.appointmentInfo}>
                  <Text style={styles.appointmentPatient}>
                    {appointment.patient_name}
                  </Text>
                  <Text style={styles.appointmentStatus}>
                    {appointment.status === 'planned' ? 'Planlandı' :
                     appointment.status === 'completed' ? 'Tamamlandı' :
                     appointment.status === 'cancelled' ? 'İptal' : 'Bekliyor'}
                  </Text>
                </View>
              </View>
            ))
          )}
        </Card.Content>
      </Card>

      {/* Hızlı İşlemler */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Hızlı İşlemler</Title>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('PatientsTab', {
                screen: 'AddPatient'
              })}>
              <Icon name="account-plus" size={32} color="#6200ee" />
              <Text style={styles.quickActionText}>Yeni Hasta</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('AppointmentsTab', {
                screen: 'AddAppointment'
              })}>
              <Icon name="calendar-plus" size={32} color="#6200ee" />
              <Text style={styles.quickActionText}>Randevu Al</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('MealsTab', {
                screen: 'AddMeal'
              })}>
              <Icon name="food-apple" size={32} color="#6200ee" />
              <Text style={styles.quickActionText}>Yeni Yemek</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('AccountingTab', {
                screen: 'AddAccounting'
              })}>
              <Icon name="cash-plus" size={32} color="#6200ee" />
              <Text style={styles.quickActionText}>Gelir/Gider</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#6200ee',
    padding: 20,
    paddingTop: 10
  },
  welcomeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5
  },
  dateText: {
    color: '#fff',
    opacity: 0.9
  },
  statsGrid: {
    flexDirection: 'row',
    padding: 10,
    gap: 10
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statCardText: {
    marginLeft: 10,
    flex: 1
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },
  card: {
    margin: 10,
    marginTop: 0,
    elevation: 2
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  seeAllText: {
    color: '#6200ee',
    fontWeight: 'bold'
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    marginBottom: 10
  },
  financialItem: {
    alignItems: 'center'
  },
  financialLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5
  },
  financialValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 3
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingVertical: 8
  },
  viewMoreText: {
    color: '#6200ee',
    fontWeight: 'bold',
    marginRight: 5
  },
  appointmentItem: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8
  },
  appointmentTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15
  },
  appointmentTimeText: {
    marginLeft: 5,
    fontWeight: 'bold',
    color: '#333'
  },
  appointmentInfo: {
    flex: 1
  },
  appointmentPatient: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  appointmentStatus: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },
  emptyState: {
    alignItems: 'center',
    padding: 30
  },
  emptyText: {
    marginTop: 10,
    color: '#999',
    fontSize: 14
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15
  },
  quickActionButton: {
    alignItems: 'center',
    padding: 10
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 12,
    color: '#333',
    textAlign: 'center'
  }
});

export default DashboardScreen;
