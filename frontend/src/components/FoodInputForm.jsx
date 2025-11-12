import React, { useState } from 'react';
import './FoodInputForm.css';

const API_BASE = 'http://localhost:5000/api';

function FoodInputForm({ onFoodAdded }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      setError('Please describe what you ate');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      // Analyze food
      const response = await fetch(`${API_BASE}/analyze-food`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodInput: input })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze food');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error analyzing food:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeal = (foods) => {
    onFoodAdded({ foods });
    setInput('');
    setResult(null);
  };

  return (
    <div className="food-input-form">
      <h2>Add Food</h2>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you ate... e.g., 'A grilled chicken breast with rice and broccoli'"
            disabled={loading}
            rows="3"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Analyzing...' : 'Analyze Food'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {result && (
        <div className="analysis-result">
          <h3>Detected Foods</h3>

          {result.foods && result.foods.length > 0 ? (
            <>
              <div className="foods-list">
                {result.foods.map((food, idx) => (
                  <div key={idx} className="food-item">
                    <h4>{food.name}</h4>
                    <p className="quantity">{food.quantity}</p>
                    <div className="nutrition-grid">
                      <div className="nutrition-item">
                        <span className="label">Calories</span>
                        <span className="value">{Math.round(food.nutrition.calories)}</span>
                      </div>
                      <div className="nutrition-item">
                        <span className="label">Protein</span>
                        <span className="value">{Math.round(food.nutrition.protein)}g</span>
                      </div>
                      <div className="nutrition-item">
                        <span className="label">Carbs</span>
                        <span className="value">{Math.round(food.nutrition.carbs)}g</span>
                      </div>
                      <div className="nutrition-item">
                        <span className="label">Fat</span>
                        <span className="value">{Math.round(food.nutrition.fat)}g</span>
                      </div>
                      <div className="nutrition-item">
                        <span className="label">Fiber</span>
                        <span className="value">{Math.round(food.nutrition.fiber)}g</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {result.notes && (
                <div className="notes">
                  <p><strong>Notes:</strong> {result.notes}</p>
                </div>
              )}

              <button
                type="button"
                onClick={() => handleAddMeal(result.foods)}
                className="btn-success"
              >
                Add to Diary
              </button>
            </>
          ) : (
            <p className="no-results">No foods detected</p>
          )}
        </div>
      )}
    </div>
  );
}

export default FoodInputForm;
