import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { nutritionAgent } from './agents/nutritionAgent.js';
import { getMeals, addMeal, deleteMeal } from './storage/mealStorage.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Analyze food input and get nutritional info
app.post('/api/analyze-food', async (req, res) => {
  try {
    const { foodInput } = req.body;

    if (!foodInput || foodInput.trim() === '') {
      return res.status(400).json({ error: 'Food input is required' });
    }

    const result = await nutritionAgent(foodInput);
    res.json(result);
  } catch (error) {
    console.error('Error analyzing food:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all meals
app.get('/api/meals', (req, res) => {
  try {
    const meals = getMeals();
    res.json(meals);
  } catch (error) {
    console.error('Error getting meals:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get meals for specific date
app.get('/api/meals/:date', (req, res) => {
  try {
    const { date } = req.params;
    const meals = getMeals();
    const dateMeals = meals.filter(meal => meal.date === date);
    res.json(dateMeals);
  } catch (error) {
    console.error('Error getting meals:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add meal to diary
app.post('/api/meals', (req, res) => {
  try {
    const { foodName, nutrition, date } = req.body;

    if (!foodName || !nutrition || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const meal = addMeal(foodName, nutrition, date);
    res.json(meal);
  } catch (error) {
    console.error('Error adding meal:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete meal
app.delete('/api/meals/:id', (req, res) => {
  try {
    const { id } = req.params;
    const success = deleteMeal(id);

    if (!success) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting meal:', error);
    res.status(500).json({ error: error.message });
  }
});

// Calculate daily nutrition totals
app.get('/api/nutrition-summary/:date', (req, res) => {
  try {
    const { date } = req.params;
    const meals = getMeals();
    const dateMeals = meals.filter(meal => meal.date === date);

    const summary = {
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

    res.json(summary);
  } catch (error) {
    console.error('Error calculating nutrition summary:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Nutrition Assistant Backend running on port ${PORT}`);
});
