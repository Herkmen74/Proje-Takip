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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AccountingService from '../database/models/AccountingService';
import { useFocusEffect } from '@react-navigation/native';

const AccountingScreen = ({ navigation }) => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState({ income: 0, expense: 0, profit: 0 });

  const loadRecords = async () => {
    try {
      const data = await AccountingService.getAllRecords();
      setRecords(data);
      filterRecords(data, searchQuery, selectedType);
      
      // Bu ayki özet
      const today = new Date();
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const summaryData = await AccountingService.getSummary(
        monthStart.toISOString().split('T')[0],
        today.toISOString().split('T')[0]
      );
      setSummary(summaryData);
    } catch (error) {
      console.error('Kayıtlar yüklenemedi:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecords();
    setRefreshing(false);
  };

  const filterRecords = (recordsData, query, type) => {
    let filtered = recordsData;

    if (type !== 'all') {
      filtered = filtered.filter(record => record.type === type);
    }

    if (query.trim() !== '') {
      filtered = filtered.filter(record =>
        record.description?.toLowerCase().includes(query.toLowerCase()) ||
        record.patient_name?.toLowerCase().includes(query.toLowerCase()) ||
        record.category?.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredRecords(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterRecords(records, query, selectedType);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    filterRecords(records, searchQuery, type);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const renderRecordCard = ({ item }) => {
    const isIncome = item.type === 'income';

    return (
      <TouchableOpacity>
        <Card style={styles.recordCard}>
          <View style={styles.cardContent}>
            <View style={[
              styles.typeIndicator,
              { backgroundColor: isIncome ? '#4CAF50' : '#f44336' }
            ]}>
              <Icon 
                name={isIncome ? 'cash-plus' : 'cash-minus'} 
                size={24} 
                color="#fff" 
              />
            </View>

            <View style={styles.recordInfo}>
              <Text style={styles.amount}>
                {isIncome ? '+' : '-'} {formatCurrency(item.amount)}
              </Text>
              
              {item.description && (
                <Text style={styles.description} numberOfLines={2}>
                  {item.description}
                </Text>
              )}

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Icon name="calendar" size={12} color="#666" />
                  <Text style={styles.metaText}>
                    {new Date(item.date).toLocaleDateString('tr-TR')}
                  </Text>
                </View>

                {item.category && (
                  <Chip style={styles.categoryChip} textStyle={styles.categoryChipText} compact>
                    {item.category}
                  </Chip>
                )}
              </View>

              {item.patient_name && (
                <View style={styles.patientRow}>
                  <Icon name="account" size={14} color="#6200ee" />
                  <Text style={styles.patientText}>{item.patient_name}</Text>
                </View>
              )}

              {item.payment_method && (
                <View style={styles.paymentRow}>
                  <Icon name="credit-card" size={12} color="#999" />
                  <Text style={styles.paymentText}>{item.payment_method}</Text>
                </View>
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
      {/* Özet Kartı */}
      <Card style={styles.summaryCard}>
        <View style={styles.summaryContent}>
          <View style={styles.summaryItem}>
            <Icon name="trending-up" size={24} color="#4CAF50" />
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryLabel}>Gelir</Text>
              <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
                {formatCurrency(summary.income)}
              </Text>
            </View>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryItem}>
            <Icon name="trending-down" size={24} color="#f44336" />
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryLabel}>Gider</Text>
              <Text style={[styles.summaryValue, { color: '#f44336' }]}>
                {formatCurrency(summary.expense)}
              </Text>
            </View>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryItem}>
            <Icon name="chart-line" size={24} color="#2196F3" />
            <View style={styles.summaryTextContainer}>
              <Text style={styles.summaryLabel}>Net</Text>
              <Text style={[
                styles.summaryValue,
                { color: summary.profit >= 0 ? '#4CAF50' : '#f44336' }
              ]}>
                {formatCurrency(summary.profit)}
              </Text>
            </View>
          </View>
        </View>
      </Card>

      <Searchbar
        placeholder="Kayıt ara..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />

      <SegmentedButtons
        value={selectedType}
        onValueChange={handleTypeChange}
        buttons={[
          { value: 'all', label: 'Tümü', icon: 'format-list-bulleted' },
          { value: 'income', label: 'Gelir', icon: 'cash-plus' },
          { value: 'expense', label: 'Gider', icon: 'cash-minus' }
        ]}
        style={styles.segmentedButtons}
      />

      {filteredRecords.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="cash-off" size={80} color="#ccc" />
          <Text style={styles.emptyText}>
            {searchQuery || selectedType !== 'all'
              ? 'Kayıt bulunamadı'
              : 'Henüz kayıt eklenmemiş'}
          </Text>
          {!searchQuery && selectedType === 'all' && (
            <Text style={styles.emptySubtext}>
              Yeni kayıt eklemek için + butonuna tıklayın
            </Text>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredRecords}
          renderItem={renderRecordCard}
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
        onPress={() => navigation.navigate('AddAccounting')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  summaryCard: {
    margin: 10,
    elevation: 3
  },
  summaryContent: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-around'
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  summaryTextContainer: {
    marginLeft: 8
  },
  summaryLabel: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 10
  },
  searchBar: {
    margin: 10,
    marginTop: 0,
    elevation: 2
  },
  segmentedButtons: {
    margin: 10,
    marginTop: 0
  },
  listContainer: {
    padding: 10
  },
  recordCard: {
    marginBottom: 10,
    elevation: 2
  },
  cardContent: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center'
  },
  typeIndicator: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15
  },
  recordInfo: {
    flex: 1
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4
  },
  categoryChip: {
    height: 20,
    backgroundColor: '#e3f2fd'
  },
  categoryChipText: {
    fontSize: 10,
    marginVertical: 0
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3
  },
  patientText: {
    fontSize: 12,
    color: '#6200ee',
    marginLeft: 5,
    fontWeight: '600'
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  paymentText: {
    fontSize: 11,
    color: '#999',
    marginLeft: 4,
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

export default AccountingScreen;
