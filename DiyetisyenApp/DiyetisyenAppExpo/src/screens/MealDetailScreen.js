import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import { Card, Title, Divider, Button, Chip } from 'react-native-paper';
import Icon from '@expo/vector-icons';
const Icon = MaterialCommunityIcons;
import { MealService, IngredientService } from '../database/models/MealService';

const MealDetailScreen = ({ route, navigation }) => {
  const { mealId } = route.params;
  const [meal, setMeal] = useState(null);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    loadMealData();
  }, [mealId]);

  const loadMealData = async () => {
    try {
      const mealData = await MealService.getMealWithIngredients(mealId);
      setMeal(mealData);
      setIngredients(mealData.ingredients || []);
    } catch (error) {
      console.error('Yemek verileri yüklenemedi:', error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Yemeği Sil',
      'Bu yemeği silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await MealService.deleteMeal(mealId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Hata', 'Yemek silinemedi.');
            }
          }
        }
      ]
    );
  };

  if (!meal) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  const NutritionCard = ({ icon, label, value, color }) => (
    <View style={styles.nutritionCard}>
      <Icon name={icon} size={32} color={color} />
      <Text style={styles.nutritionValue}>{value}</Text>
      <Text style={styles.nutritionLabel}>{label}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Başlık ve Kategori */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerSection}>
            <View style={styles.iconLarge}>
              <Icon name="food-apple" size={60} color="#6200ee" />
            </View>
            <Title style={styles.mealTitle}>{meal.name}</Title>
            {meal.category && (
              <Chip style={styles.categoryChipLarge}>{meal.category}</Chip>
            )}
          </View>
          
          {meal.description && (
            <>
              <Divider style={styles.divider} />
              <Text style={styles.description}>{meal.description}</Text>
            </>
          )}
        </Card.Content>
      </Card>

      {/* Besin Değerleri */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Besin Değerleri</Title>
          {meal.serving_size && (
            <Text style={styles.servingText}>
              Porsiyon: {meal.serving_size} {meal.serving_unit || ''}
            </Text>
          )}
          
          <View style={styles.nutritionGrid}>
            <NutritionCard
              icon="fire"
              label="Kalori"
              value={`${meal.calories} kcal`}
              color="#FF5722"
            />
            <NutritionCard
              icon="food-steak"
              label="Protein"
              value={`${meal.protein}g`}
              color="#F44336"
            />
            <NutritionCard
              icon="bread-slice"
              label="Karbonhidrat"
              value={`${meal.carbs}g`}
              color="#FFC107"
            />
            <NutritionCard
              icon="water"
              label="Yağ"
              value={`${meal.fat}g`}
              color="#4CAF50"
            />
            {meal.fiber > 0 && (
              <NutritionCard
                icon="grain"
                label="Lif"
                value={`${meal.fiber}g`}
                color="#795548"
              />
            )}
          </View>
        </Card.Content>
      </Card>

      {/* Malzemeler */}
      {ingredients.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Malzemeler</Title>
            <View style={styles.ingredientsList}>
              {ingredients.map((ingredient, index) => (
                <View key={ingredient.id} style={styles.ingredientItem}>
                  <Icon name="checkbox-marked-circle" size={20} color="#6200ee" />
                  <Text style={styles.ingredientText}>
                    {ingredient.name} - {ingredient.quantity} {ingredient.unit}
                  </Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Tarif */}
      {meal.recipe && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Tarif</Title>
            <Text style={styles.recipeText}>{meal.recipe}</Text>
          </Card.Content>
        </Card>
      )}

      {/* Hazırlık ve Pişirme Süresi */}
      {(meal.preparation_time || meal.cooking_time) && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Süre Bilgisi</Title>
            <View style={styles.timeRow}>
              {meal.preparation_time && (
                <View style={styles.timeItem}>
                  <Icon name="clock-outline" size={24} color="#6200ee" />
                  <View style={styles.timeTextContainer}>
                    <Text style={styles.timeLabel}>Hazırlık</Text>
                    <Text style={styles.timeValue}>{meal.preparation_time} dk</Text>
                  </View>
                </View>
              )}
              
              {meal.cooking_time && (
                <View style={styles.timeItem}>
                  <Icon name="fire" size={24} color="#FF5722" />
                  <View style={styles.timeTextContainer}>
                    <Text style={styles.timeLabel}>Pişirme</Text>
                    <Text style={styles.timeValue}>{meal.cooking_time} dk</Text>
                  </View>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* İşlem Butonları */}
      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          icon="pencil"
          onPress={() => navigation.navigate('AddMeal', { 
            mealId, 
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
    paddingVertical: 10
  },
  iconLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0e6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15
  },
  mealTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10
  },
  categoryChipLarge: {
    backgroundColor: '#e3f2fd'
  },
  divider: {
    marginVertical: 15
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    textAlign: 'center'
  },
  servingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    marginBottom: 15,
    fontStyle: 'italic'
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 15
  },
  nutritionCard: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 20
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4
  },
  ingredientsList: {
    marginTop: 15
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8
  },
  ingredientText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
    flex: 1
  },
  recipeText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 24,
    marginTop: 10
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    flex: 0.45
  },
  timeTextContainer: {
    marginLeft: 10
  },
  timeLabel: {
    fontSize: 12,
    color: '#666'
  },
  timeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2
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

export default MealDetailScreen;
