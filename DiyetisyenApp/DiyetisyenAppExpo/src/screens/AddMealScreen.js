import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity
} from 'react-native';
import { TextInput, Button, SegmentedButtons, List } from 'react-native-paper';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { MealService, IngredientService } from '../database/models/MealService';

const AddMealScreen = ({ route, navigation }) => {
  const { mealId, isEdit } = route.params || {};
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    recipe: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    fiber: '',
    serving_size: '',
    serving_unit: 'porsiyon',
    category: 'Öğle',
    preparation_time: '',
    cooking_time: ''
  });
  
  const [ingredients, setIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    quantity: '',
    unit: 'gram'
  });
  const [showIngredientForm, setShowIngredientForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = [
    'Kahvaltı',
    'Öğle',
    'Akşam',
    'Atıştırmalık',
    'Tatlı'
  ];

  useEffect(() => {
    if (isEdit && mealId) {
      loadMealData();
    }
  }, [mealId, isEdit]);

  const loadMealData = async () => {
    try {
      const meal = await MealService.getMealWithIngredients(mealId);
      setFormData({
        name: meal.name || '',
        description: meal.description || '',
        recipe: meal.recipe || '',
        calories: meal.calories ? meal.calories.toString() : '',
        protein: meal.protein ? meal.protein.toString() : '',
        carbs: meal.carbs ? meal.carbs.toString() : '',
        fat: meal.fat ? meal.fat.toString() : '',
        fiber: meal.fiber ? meal.fiber.toString() : '',
        serving_size: meal.serving_size || '',
        serving_unit: meal.serving_unit || 'porsiyon',
        category: meal.category || 'Öğle',
        preparation_time: meal.preparation_time ? meal.preparation_time.toString() : '',
        cooking_time: meal.cooking_time ? meal.cooking_time.toString() : ''
      });
      setIngredients(meal.ingredients || []);
    } catch (error) {
      console.error('Yemek yüklenemedi:', error);
      Alert.alert('Hata', 'Yemek bilgileri yüklenemedi.');
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Uyarı', 'Yemek adı zorunludur.');
      return false;
    }
    
    if (formData.calories && isNaN(parseFloat(formData.calories))) {
      Alert.alert('Uyarı', 'Geçerli bir kalori değeri giriniz.');
      return false;
    }
    
    return true;
  };

  const addIngredient = () => {
    if (!newIngredient.name.trim()) {
      Alert.alert('Uyarı', 'Malzeme adı giriniz.');
      return;
    }
    
    if (!newIngredient.quantity || isNaN(parseFloat(newIngredient.quantity))) {
      Alert.alert('Uyarı', 'Geçerli bir miktar giriniz.');
      return;
    }
    
    setIngredients([
      ...ingredients,
      {
        id: Date.now(),
        name: newIngredient.name,
        quantity: parseFloat(newIngredient.quantity),
        unit: newIngredient.unit
      }
    ]);
    
    setNewIngredient({ name: '', quantity: '', unit: 'gram' });
    setShowIngredientForm(false);
  };

  const removeIngredient = (ingredientId) => {
    setIngredients(ingredients.filter(ing => ing.id !== ingredientId));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const mealData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        recipe: formData.recipe.trim() || null,
        calories: formData.calories ? parseFloat(formData.calories) : 0,
        protein: formData.protein ? parseFloat(formData.protein) : 0,
        carbs: formData.carbs ? parseFloat(formData.carbs) : 0,
        fat: formData.fat ? parseFloat(formData.fat) : 0,
        fiber: formData.fiber ? parseFloat(formData.fiber) : 0,
        serving_size: formData.serving_size.trim() || null,
        serving_unit: formData.serving_unit,
        category: formData.category,
        preparation_time: formData.preparation_time ? parseInt(formData.preparation_time) : null,
        cooking_time: formData.cooking_time ? parseInt(formData.cooking_time) : null
      };
      
      let savedMealId;
      
      if (isEdit && mealId) {
        await MealService.updateMeal(mealId, mealData);
        await IngredientService.deleteIngredientsByMealId(mealId);
        savedMealId = mealId;
        Alert.alert('Başarılı', 'Yemek güncellendi.');
      } else {
        savedMealId = await MealService.addMeal(mealData);
        Alert.alert('Başarılı', 'Yemek eklendi.');
      }
      
      // Malzemeleri kaydet
      for (const ingredient of ingredients) {
        await IngredientService.addIngredient({
          meal_id: savedMealId,
          name: ingredient.name,
          quantity: ingredient.quantity,
          unit: ingredient.unit
        });
      }
      
      navigation.goBack();
    } catch (error) {
      console.error('Yemek kaydedilemedi:', error);
      Alert.alert('Hata', 'Yemek kaydedilemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          label="Yemek Adı *"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          mode="outlined"
          style={styles.input}
          placeholder="Örn: Izgara Tavuk Salata"
        />

        <TextInput
          label="Açıklama"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          mode="outlined"
          style={styles.input}
          multiline
          numberOfLines={2}
          placeholder="Kısa açıklama..."
        />

        <View style={styles.sectionTitle}>
          <Icon name="food-apple" size={20} color="#6200ee" />
          <Text style={styles.sectionText}>Besin Değerleri</Text>
        </View>

        <View style={styles.row}>
          <TextInput
            label="Kalori (kcal)"
            value={formData.calories}
            onChangeText={(text) => setFormData({ ...formData, calories: text })}
            mode="outlined"
            style={[styles.input, styles.halfWidth]}
            keyboardType="decimal-pad"
            placeholder="250"
          />

          <TextInput
            label="Protein (g)"
            value={formData.protein}
            onChangeText={(text) => setFormData({ ...formData, protein: text })}
            mode="outlined"
            style={[styles.input, styles.halfWidth]}
            keyboardType="decimal-pad"
            placeholder="20"
          />
        </View>

        <View style={styles.row}>
          <TextInput
            label="Karbonhidrat (g)"
            value={formData.carbs}
            onChangeText={(text) => setFormData({ ...formData, carbs: text })}
            mode="outlined"
            style={[styles.input, styles.halfWidth]}
            keyboardType="decimal-pad"
            placeholder="30"
          />

          <TextInput
            label="Yağ (g)"
            value={formData.fat}
            onChangeText={(text) => setFormData({ ...formData, fat: text })}
            mode="outlined"
            style={[styles.input, styles.halfWidth]}
            keyboardType="decimal-pad"
            placeholder="10"
          />
        </View>

        <TextInput
          label="Lif (g)"
          value={formData.fiber}
          onChangeText={(text) => setFormData({ ...formData, fiber: text })}
          mode="outlined"
          style={styles.input}
          keyboardType="decimal-pad"
          placeholder="5"
        />

        <View style={styles.sectionTitle}>
          <Icon name="set-none" size={20} color="#6200ee" />
          <Text style={styles.sectionText}>Porsiyon Bilgisi</Text>
        </View>

        <View style={styles.row}>
          <TextInput
            label="Porsiyon Miktarı"
            value={formData.serving_size}
            onChangeText={(text) => setFormData({ ...formData, serving_size: text })}
            mode="outlined"
            style={[styles.input, styles.halfWidth]}
            placeholder="1"
          />

          <TextInput
            label="Birim"
            value={formData.serving_unit}
            onChangeText={(text) => setFormData({ ...formData, serving_unit: text })}
            mode="outlined"
            style={[styles.input, styles.halfWidth]}
            placeholder="porsiyon"
          />
        </View>

        <View style={styles.sectionTitle}>
          <Icon name="shape" size={20} color="#6200ee" />
          <Text style={styles.sectionText}>Kategori</Text>
        </View>

        <SegmentedButtons
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
          buttons={categories.map(cat => ({ value: cat, label: cat }))}
          style={styles.segmentedButtons}
        />

        <View style={styles.sectionTitle}>
          <Icon name="clock-outline" size={20} color="#6200ee" />
          <Text style={styles.sectionText}>Süre</Text>
        </View>

        <View style={styles.row}>
          <TextInput
            label="Hazırlık (dk)"
            value={formData.preparation_time}
            onChangeText={(text) => setFormData({ ...formData, preparation_time: text })}
            mode="outlined"
            style={[styles.input, styles.halfWidth]}
            keyboardType="number-pad"
            placeholder="15"
          />

          <TextInput
            label="Pişirme (dk)"
            value={formData.cooking_time}
            onChangeText={(text) => setFormData({ ...formData, cooking_time: text })}
            mode="outlined"
            style={[styles.input, styles.halfWidth]}
            keyboardType="number-pad"
            placeholder="30"
          />
        </View>

        <View style={styles.sectionTitle}>
          <Icon name="format-list-bulleted" size={20} color="#6200ee" />
          <Text style={styles.sectionText}>Malzemeler</Text>
        </View>

        {ingredients.map((ingredient) => (
          <View key={ingredient.id} style={styles.ingredientItem}>
            <View style={styles.ingredientInfo}>
              <Text style={styles.ingredientName}>{ingredient.name}</Text>
              <Text style={styles.ingredientAmount}>
                {ingredient.quantity} {ingredient.unit}
              </Text>
            </View>
            <TouchableOpacity onPress={() => removeIngredient(ingredient.id)}>
              <Icon name="close-circle" size={24} color="#f44336" />
            </TouchableOpacity>
          </View>
        ))}

        {showIngredientForm ? (
          <View style={styles.ingredientForm}>
            <TextInput
              label="Malzeme Adı"
              value={newIngredient.name}
              onChangeText={(text) => setNewIngredient({ ...newIngredient, name: text })}
              mode="outlined"
              style={styles.input}
              placeholder="Örn: Tavuk göğsü"
            />
            
            <View style={styles.row}>
              <TextInput
                label="Miktar"
                value={newIngredient.quantity}
                onChangeText={(text) => setNewIngredient({ ...newIngredient, quantity: text })}
                mode="outlined"
                style={[styles.input, styles.halfWidth]}
                keyboardType="decimal-pad"
                placeholder="200"
              />
              
              <TextInput
                label="Birim"
                value={newIngredient.unit}
                onChangeText={(text) => setNewIngredient({ ...newIngredient, unit: text })}
                mode="outlined"
                style={[styles.input, styles.halfWidth]}
                placeholder="gram"
              />
            </View>

            <View style={styles.ingredientFormButtons}>
              <Button
                mode="outlined"
                onPress={() => {
                  setShowIngredientForm(false);
                  setNewIngredient({ name: '', quantity: '', unit: 'gram' });
                }}
                style={styles.cancelButton}>
                İptal
              </Button>
              <Button
                mode="contained"
                onPress={addIngredient}
                style={styles.addIngredientButton}>
                Ekle
              </Button>
            </View>
          </View>
        ) : (
          <Button
            mode="outlined"
            icon="plus"
            onPress={() => setShowIngredientForm(true)}
            style={styles.addButton}>
            Malzeme Ekle
          </Button>
        )}

        <View style={styles.sectionTitle}>
          <Icon name="book-open-variant" size={20} color="#6200ee" />
          <Text style={styles.sectionText}>Tarif</Text>
        </View>

        <TextInput
          label="Hazırlanışı"
          value={formData.recipe}
          onChangeText={(text) => setFormData({ ...formData, recipe: text })}
          mode="outlined"
          style={styles.input}
          multiline
          numberOfLines={6}
          placeholder="Yemeğin hazırlanış tarifi..."
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
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15
  },
  sectionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },
  halfWidth: {
    flex: 1
  },
  segmentedButtons: {
    marginBottom: 15
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1
  },
  ingredientInfo: {
    flex: 1
  },
  ingredientName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  ingredientAmount: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },
  ingredientForm: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8
  },
  ingredientFormButtons: {
    flexDirection: 'row',
    gap: 10
  },
  addIngredientButton: {
    flex: 1,
    backgroundColor: '#6200ee'
  },
  addButton: {
    marginBottom: 15,
    borderColor: '#6200ee'
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

export default AddMealScreen;
