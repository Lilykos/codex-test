import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './App.css';
import FoodInputForm from './components/FoodInputForm';
import MealDiary from './components/MealDiary';
import NutritionDashboard from './components/NutritionDashboard';
import DailyNutritionChart from './components/DailyNutritionChart';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [meals, setMeals] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [nutritionSummary, setNutritionSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch meals for selected date
  useEffect(() => {
    fetchMealsForDate(selectedDate);
  }, [selectedDate]);

  const fetchMealsForDate = async (date) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/nutrition-summary/${date}`);
      if (!response.ok) throw new Error('Failed to fetch meals');
      const data = await response.json();
      setMeals(data.meals);
      setNutritionSummary(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching meals:', err);
      setError(err.message);
      setMeals([]);
      setNutritionSummary(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFoodAdded = async (foodData) => {
    try {
      // Add meal to diary
      const response = await fetch(`${API_BASE}/meals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodName: foodData.foods.map(f => f.name).join(', '),
          nutrition: foodData.foods.reduce(
            (acc, food) => ({
              calories: acc.calories + (food.nutrition.calories || 0),
              protein: acc.protein + (food.nutrition.protein || 0),
              carbs: acc.carbs + (food.nutrition.carbs || 0),
              fat: acc.fat + (food.nutrition.fat || 0),
              fiber: acc.fiber + (food.nutrition.fiber || 0)
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
          ),
          date: selectedDate
        })
      });

      if (!response.ok) throw new Error('Failed to add meal');

      // Refresh meals
      await fetchMealsForDate(selectedDate);
    } catch (err) {
      console.error('Error adding meal:', err);
      setError(err.message);
    }
  };

  const handleMealDeleted = async (mealId) => {
    try {
      const response = await fetch(`${API_BASE}/meals/${mealId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete meal');

      // Refresh meals
      await fetchMealsForDate(selectedDate);
    } catch (err) {
      console.error('Error deleting meal:', err);
      setError(err.message);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🥗 Nutrition Assistant</h1>
        <p>Track your meals and monitor your nutrition</p>
      </header>

      <main className="app-main">
        <div className="container">
          {error && <div className="error-banner">{error}</div>}

          <div className="date-selector">
            <label htmlFor="date-input">Select Date:</label>
            <input
              id="date-input"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="layout">
            <div className="left-panel">
              <FoodInputForm onFoodAdded={handleFoodAdded} />

              {nutritionSummary && (
                <NutritionDashboard summary={nutritionSummary} />
              )}
            </div>

            <div className="right-panel">
              {nutritionSummary && (
                <DailyNutritionChart summary={nutritionSummary} />
              )}

              <MealDiary
                meals={meals}
                onMealDeleted={handleMealDeleted}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Made with ❤️ - Your personal nutrition tracking assistant</p>
      </footer>
    </div>
  );
}

export default App;
