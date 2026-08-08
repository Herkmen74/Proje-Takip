import { getDatabase } from '../db';

export const MealService = {
  // Tüm yemekleri getir
  getAllMeals: async () => {
    const db = getDatabase();
    const [results] = await db.executeSql(
      'SELECT * FROM meals ORDER BY name'
    );
    return results.rows.raw();
  },

  // Kategoriye göre yemekleri getir
  getMealsByCategory: async (category) => {
    const db = getDatabase();
    const [results] = await db.executeSql(
      'SELECT * FROM meals WHERE category = ? ORDER BY name',
      [category]
    );
    return results.rows.raw();
  },

  // ID ile yemek getir
  getMealById: async (id) => {
    const db = getDatabase();
    const [results] = await db.executeSql(
      'SELECT * FROM meals WHERE id = ?',
      [id]
    );
    return results.rows.item(0);
  },

  // Yemek ara
  searchMeals: async (query) => {
    const db = getDatabase();
    const [results] = await db.executeSql(
      'SELECT * FROM meals WHERE name LIKE ? OR description LIKE ? ORDER BY name',
      [`%${query}%`, `%${query}%`]
    );
    return results.rows.raw();
  },

  // Yeni yemek ekle
  addMeal: async (meal) => {
    const db = getDatabase();
    const [result] = await db.executeSql(
      `INSERT INTO meals (name, description, recipe, calories, protein, carbs, fat, 
       fiber, serving_size, serving_unit, category, preparation_time, cooking_time)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        meal.name,
        meal.description || null,
        meal.recipe || null,
        meal.calories || 0,
        meal.protein || 0,
        meal.carbs || 0,
        meal.fat || 0,
        meal.fiber || 0,
        meal.serving_size || null,
        meal.serving_unit || null,
        meal.category || null,
        meal.preparation_time || null,
        meal.cooking_time || null
      ]
    );
    return result.insertId;
  },

  // Yemek güncelle
  updateMeal: async (id, meal) => {
    const db = getDatabase();
    await db.executeSql(
      `UPDATE meals SET name = ?, description = ?, recipe = ?, calories = ?,
       protein = ?, carbs = ?, fat = ?, fiber = ?, serving_size = ?, serving_unit = ?,
       category = ?, preparation_time = ?, cooking_time = ?
       WHERE id = ?`,
      [
        meal.name,
        meal.description || null,
        meal.recipe || null,
        meal.calories || 0,
        meal.protein || 0,
        meal.carbs || 0,
        meal.fat || 0,
        meal.fiber || 0,
        meal.serving_size || null,
        meal.serving_unit || null,
        meal.category || null,
        meal.preparation_time || null,
        meal.cooking_time || null,
        id
      ]
    );
  },

  // Yemek sil
  deleteMeal: async (id) => {
    const db = getDatabase();
    await db.executeSql('DELETE FROM meals WHERE id = ?', [id]);
  },

  // Yemek detayı (malzemeler ile)
  getMealWithIngredients: async (id) => {
    const db = getDatabase();
    
    // Yemek bilgisi
    const [mealResults] = await db.executeSql(
      'SELECT * FROM meals WHERE id = ?',
      [id]
    );
    
    // Malzemeler
    const [ingredientResults] = await db.executeSql(
      'SELECT * FROM ingredients WHERE meal_id = ? ORDER BY name',
      [id]
    );
    
    const meal = mealResults.rows.item(0);
    meal.ingredients = ingredientResults.rows.raw();
    
    return meal;
  }
};

export const IngredientService = {
  // Yemeğe ait malzemeleri getir
  getIngredientsByMealId: async (mealId) => {
    const db = getDatabase();
    const [results] = await db.executeSql(
      'SELECT * FROM ingredients WHERE meal_id = ? ORDER BY name',
      [mealId]
    );
    return results.rows.raw();
  },

  // Malzeme ekle
  addIngredient: async (ingredient) => {
    const db = getDatabase();
    const [result] = await db.executeSql(
      `INSERT INTO ingredients (meal_id, name, quantity, unit, calories, protein, carbs, fat)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ingredient.meal_id,
        ingredient.name,
        ingredient.quantity,
        ingredient.unit,
        ingredient.calories || 0,
        ingredient.protein || 0,
        ingredient.carbs || 0,
        ingredient.fat || 0
      ]
    );
    return result.insertId;
  },

  // Malzeme güncelle
  updateIngredient: async (id, ingredient) => {
    const db = getDatabase();
    await db.executeSql(
      `UPDATE ingredients SET name = ?, quantity = ?, unit = ?,
       calories = ?, protein = ?, carbs = ?, fat = ?
       WHERE id = ?`,
      [
        ingredient.name,
        ingredient.quantity,
        ingredient.unit,
        ingredient.calories || 0,
        ingredient.protein || 0,
        ingredient.carbs || 0,
        ingredient.fat || 0,
        id
      ]
    );
  },

  // Malzeme sil
  deleteIngredient: async (id) => {
    const db = getDatabase();
    await db.executeSql('DELETE FROM ingredients WHERE id = ?', [id]);
  },

  // Yemeğe ait tüm malzemeleri sil
  deleteIngredientsByMealId: async (mealId) => {
    const db = getDatabase();
    await db.executeSql('DELETE FROM ingredients WHERE meal_id = ?', [mealId]);
  }
};

export default { MealService, IngredientService };
