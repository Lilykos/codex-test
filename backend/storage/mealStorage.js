import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORAGE_FILE = path.join(__dirname, '../data/meals.json');

// Ensure data directory exists
function ensureStorageDirectory() {
  const dir = path.dirname(STORAGE_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Initialize storage file if it doesn't exist
function initializeStorage() {
  ensureStorageDirectory();
  if (!fs.existsSync(STORAGE_FILE)) {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify([]), 'utf8');
  }
}

// Read all meals from storage
export function getMeals() {
  initializeStorage();
  try {
    const data = fs.readFileSync(STORAGE_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading meals:', error);
    return [];
  }
}

// Add a meal to storage
export function addMeal(foodName, nutrition, date) {
  initializeStorage();
  const meals = getMeals();

  const newMeal = {
    id: `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    foodName,
    nutrition: {
      calories: nutrition.calories || 0,
      protein: nutrition.protein || 0,
      carbs: nutrition.carbs || 0,
      fat: nutrition.fat || 0,
      fiber: nutrition.fiber || 0
    },
    date,
    timestamp: new Date().toISOString()
  };

  meals.push(newMeal);
  saveMeals(meals);

  return newMeal;
}

// Delete a meal from storage
export function deleteMeal(id) {
  initializeStorage();
  const meals = getMeals();
  const initialLength = meals.length;
  const filtered = meals.filter(meal => meal.id !== id);

  if (filtered.length < initialLength) {
    saveMeals(filtered);
    return true;
  }

  return false;
}

// Save meals to storage
function saveMeals(meals) {
  ensureStorageDirectory();
  fs.writeFileSync(STORAGE_FILE, JSON.stringify(meals, null, 2), 'utf8');
}

// Get nutrition summary for a date
export function getNutritionSummary(date) {
  const meals = getMeals();
  const dateMeals = meals.filter(meal => meal.date === date);

  return {
    date,
    meals: dateMeals,
    totals: {
      calories: dateMeals.reduce((sum, meal) => sum + (meal.nutrition.calories || 0), 0),
      protein: dateMeals.reduce((sum, meal) => sum + (meal.nutrition.protein || 0), 0),
      carbs: dateMeals.reduce((sum, meal) => sum + (meal.nutrition.carbs || 0), 0),
      fat: dateMeals.reduce((sum, meal) => sum + (meal.nutrition.fat || 0), 0),
      fiber: dateMeals.reduce((sum, meal) => sum + (meal.nutrition.fiber || 0), 0)
    },
    mealCount: dateMeals.length
  };
}

// Get nutrition summary for date range
export function getNutritionSummaryRange(startDate, endDate) {
  const meals = getMeals();
  const rangeMeals = meals.filter(meal => {
    return meal.date >= startDate && meal.date <= endDate;
  });

  const dateMap = {};
  rangeMeals.forEach(meal => {
    if (!dateMap[meal.date]) {
      dateMap[meal.date] = {
        date: meal.date,
        meals: [],
        totals: {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0
        },
        mealCount: 0
      };
    }
    dateMap[meal.date].meals.push(meal);
    dateMap[meal.date].totals.calories += meal.nutrition.calories || 0;
    dateMap[meal.date].totals.protein += meal.nutrition.protein || 0;
    dateMap[meal.date].totals.carbs += meal.nutrition.carbs || 0;
    dateMap[meal.date].totals.fat += meal.nutrition.fat || 0;
    dateMap[meal.date].totals.fiber += meal.nutrition.fiber || 0;
    dateMap[meal.date].mealCount += 1;
  });

  return Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));
}
