import React from 'react';
import './NutritionDashboard.css';

function NutritionDashboard({ summary }) {
  const { totals, mealCount } = summary;

  // Daily targets (can be customized)
  const targets = {
    calories: 2000,
    protein: 50,
    carbs: 225,
    fat: 65,
    fiber: 25
  };

  const getPercentage = (value, target) => {
    return Math.min((value / target) * 100, 100);
  };

  const getStatus = (value, target) => {
    if (value < target * 0.8) return 'low';
    if (value > target * 1.1) return 'high';
    return 'good';
  };

  return (
    <div className="nutrition-dashboard">
      <h2>Daily Summary</h2>

      <div className="summary-info">
        <div className="meal-count">
          <span className="label">Meals Logged</span>
          <span className="value">{mealCount}</span>
        </div>
      </div>

      <div className="nutrition-tracker">
        <div className="tracker-item">
          <div className="tracker-header">
            <span className="tracker-label">Calories</span>
            <span className="tracker-value">
              {Math.round(totals.calories)} / {targets.calories}
            </span>
          </div>
          <div className="tracker-bar">
            <div
              className={`tracker-fill calories ${getStatus(totals.calories, targets.calories)}`}
              style={{ width: `${getPercentage(totals.calories, targets.calories)}%` }}
            />
          </div>
        </div>

        <div className="tracker-item">
          <div className="tracker-header">
            <span className="tracker-label">Protein</span>
            <span className="tracker-value">
              {Math.round(totals.protein)}g / {targets.protein}g
            </span>
          </div>
          <div className="tracker-bar">
            <div
              className={`tracker-fill protein ${getStatus(totals.protein, targets.protein)}`}
              style={{ width: `${getPercentage(totals.protein, targets.protein)}%` }}
            />
          </div>
        </div>

        <div className="tracker-item">
          <div className="tracker-header">
            <span className="tracker-label">Carbohydrates</span>
            <span className="tracker-value">
              {Math.round(totals.carbs)}g / {targets.carbs}g
            </span>
          </div>
          <div className="tracker-bar">
            <div
              className={`tracker-fill carbs ${getStatus(totals.carbs, targets.carbs)}`}
              style={{ width: `${getPercentage(totals.carbs, targets.carbs)}%` }}
            />
          </div>
        </div>

        <div className="tracker-item">
          <div className="tracker-header">
            <span className="tracker-label">Fat</span>
            <span className="tracker-value">
              {Math.round(totals.fat)}g / {targets.fat}g
            </span>
          </div>
          <div className="tracker-bar">
            <div
              className={`tracker-fill fat ${getStatus(totals.fat, targets.fat)}`}
              style={{ width: `${getPercentage(totals.fat, targets.fat)}%` }}
            />
          </div>
        </div>

        <div className="tracker-item">
          <div className="tracker-header">
            <span className="tracker-label">Fiber</span>
            <span className="tracker-value">
              {Math.round(totals.fiber)}g / {targets.fiber}g
            </span>
          </div>
          <div className="tracker-bar">
            <div
              className={`tracker-fill fiber ${getStatus(totals.fiber, targets.fiber)}`}
              style={{ width: `${getPercentage(totals.fiber, targets.fiber)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="tracker-legend">
        <div className="legend-item">
          <div className="legend-color low"></div>
          <span>Below 80% of target</span>
        </div>
        <div className="legend-item">
          <div className="legend-color good"></div>
          <span>On track</span>
        </div>
        <div className="legend-item">
          <div className="legend-color high"></div>
          <span>Above 110% of target</span>
        </div>
      </div>
    </div>
  );
}

export default NutritionDashboard;
