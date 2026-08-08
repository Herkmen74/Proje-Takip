import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { FAB, Card, Searchbar, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MealService } from '../database/models/MealService';
import { useFocusEffect } from '@react-navigation/native';

const MealsScreen = ({ navigation }) => {
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const categories = [
    { label: 'Tümü', value: 'all' },
    { label: 'Kahvaltı', value: 'Kahvaltı' },
    { label: 'Öğle', value: 'Öğle' },
    { label: 'Akşam', value: 'Akşam' },
    { label: 'Atıştırmalık', value: 'Atıştırmalık' },
    { label: 'Tatlı', value: 'Tatlı' }
  ];

  const loadMeals = async () => {
    try {
      const data = await MealService.getAllMeals();
      setMeals(data);
      filterMeals(data, searchQuery, selectedCategory);
    } catch (error) {
      console.error('Yemekler yüklenemedi:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadMeals();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMeals();
    setRefreshing(false);
  };

  const filterMeals = (mealsData, query, category) => {
    let filtered = mealsData;

    if (category !== 'all') {
      filtered = filtered.filter(meal => meal.category === category);
    }

    if (query.trim() !== '') {
      filtered = filtered.filter(meal =>
        meal.name.toLowerCase().includes(query.toLowerCase()) ||
        (meal.description && meal.description.toLowerCase().includes(query.toLowerCase()))
      );
    }

    setFilteredMeals(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterMeals(meals, query, selectedCategory);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterMeals(meals, searchQuery, category);
  };

  const renderMealCard = ({ item }) => {
    const totalNutrition = item.calories + item.protein + item.carbs + item.fat;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('MealDetail', { mealId: item.id })}>
        <Card style={styles.mealCard}>
          <View style={styles.cardContent}>
            <View style={styles.mealIcon}>
              <Icon name="food-apple" size={40} color="#6200ee" />
            </View>

            <View style={styles.mealInfo}>
              <Text style={styles.mealName}>{item.name}</Text>
              
              {item.description && (
                <Text style={styles.mealDescription} numberOfLines={2}>
                  {item.description}
                </Text>
              )}

              <View style={styles.nutritionRow}>
                <View style={styles.nutritionBadge}>
                  <Icon name="fire" size={14} color="#FF5722" />
                  <Text style={styles.nutritionText}>{item.calories} kcal</Text>
                </View>
                
                <View style={styles.nutritionBadge}>
                  <Icon name="food-steak" size={14} color="#F44336" />
                  <Text style={styles.nutritionText}>{item.protein}g protein</Text>
                </View>
              </View>

              <View style={styles.nutritionRow}>
                <View style={styles.nutritionBadge}>
                  <Icon name="bread-slice" size={14} color="#FFC107" />
                  <Text style={styles.nutritionText}>{item.carbs}g karb.</Text>
                </View>
                
                <View style={styles.nutritionBadge}>
                  <Icon name="water" size={14} color="#4CAF50" />
                  <Text style={styles.nutritionText}>{item.fat}g yağ</Text>
                </View>
              </View>

              {item.category && (
                <Chip
                  style={styles.categoryChip}
                  textStyle={styles.categoryChipText}
                  compact>
                  {item.category}
                </Chip>
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
        placeholder="Yemek ara..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />

      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item.value}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Chip
              selected={selectedCategory === item.value}
              onPress={() => handleCategoryChange(item.value)}
              style={styles.categoryFilterChip}
              textStyle={styles.categoryFilterText}>
              {item.label}
            </Chip>
          )}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      {filteredMeals.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="food-off" size={80} color="#ccc" />
          <Text style={styles.emptyText}>
            {searchQuery || selectedCategory !== 'all' 
              ? 'Yemek bulunamadı' 
              : 'Henüz yemek eklenmemiş'}
          </Text>
          {!searchQuery && selectedCategory === 'all' && (
            <Text style={styles.emptySubtext}>
              Yeni yemek eklemek için + butonuna tıklayın
            </Text>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredMeals}
          renderItem={renderMealCard}
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
        onPress={() => navigation.navigate('AddMeal')}
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
  categoryContainer: {
    marginBottom: 5
  },
  categoryList: {
    paddingHorizontal: 10,
    gap: 8
  },
  categoryFilterChip: {
    marginRight: 8
  },
  categoryFilterText: {
    fontSize: 12
  },
  listContainer: {
    padding: 10
  },
  mealCard: {
    marginBottom: 10,
    elevation: 2
  },
  cardContent: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center'
  },
  mealIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0e6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15
  },
  mealInfo: {
    flex: 1
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5
  },
  mealDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18
  },
  nutritionRow: {
    flexDirection: 'row',
    marginBottom: 5,
    gap: 10
  },
  nutritionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  nutritionText: {
    fontSize: 11,
    color: '#555',
    marginLeft: 3,
    fontWeight: '600'
  },
  categoryChip: {
    alignSelf: 'flex-start',
    marginTop: 8,
    height: 24,
    backgroundColor: '#e3f2fd'
  },
  categoryChipText: {
    fontSize: 10,
    marginVertical: 0
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

export default MealsScreen;
