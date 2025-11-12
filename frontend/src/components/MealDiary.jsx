import React from 'react';
import { format, parseISO } from 'date-fns';
import './MealDiary.css';

function MealDiary({ meals, onMealDeleted, loading }) {
  return (
    <div className="meal-diary">
      <h2>Meal Diary</h2>

      {loading ? (
        <div className="loading">Loading meals...</div>
      ) : meals && meals.length > 0 ? (
        <div className="meals-container">
          {meals.map((meal) => (
            <div key={meal.id} className="meal-entry">
              <div className="meal-header">
                <h3>{meal.foodName}</h3>
                <button
                  className="btn-delete"
                  onClick={() => onMealDeleted(meal.id)}
                  title="Delete meal"
                >
                  ✕
                </button>
              </div>

              <div className="meal-time">
                {format(parseISO(meal.timestamp), 'HH:mm')}
              </div>

              <div className="meal-nutrition">
                <div className="nutrition-badge calories">
                  <span className="badge-label">Cal</span>
                  <span className="badge-value">{Math.round(meal.nutrition.calories)}</span>
                </div>
                <div className="nutrition-badge protein">
                  <span className="badge-label">Pro</span>
                  <span className="badge-value">{Math.round(meal.nutrition.protein)}g</span>
                </div>
                <div className="nutrition-badge carbs">
                  <span className="badge-label">Carbs</span>
                  <span className="badge-value">{Math.round(meal.nutrition.carbs)}g</span>
                </div>
                <div className="nutrition-badge fat">
                  <span className="badge-label">Fat</span>
                  <span className="badge-value">{Math.round(meal.nutrition.fat)}g</span>
                </div>
                <div className="nutrition-badge fiber">
                  <span className="badge-label">Fiber</span>
                  <span className="badge-value">{Math.round(meal.nutrition.fiber)}g</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No meals logged for this date yet.</p>
          <p className="hint">Add your first meal using the form above!</p>
        </div>
      )}
    </div>
  );
}

export default MealDiary;
