import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import './DailyNutritionChart.css';

function DailyNutritionChart({ summary }) {
  const { totals } = summary;

  // Macro breakdown data (excluding calories as it's derived)
  const macroData = [
    {
      name: 'Protein',
      value: Math.round(totals.protein * 4), // 4 cal per gram
      calories: Math.round(totals.protein * 4),
      grams: Math.round(totals.protein),
      color: '#4ecdc4'
    },
    {
      name: 'Carbs',
      value: Math.round(totals.carbs * 4), // 4 cal per gram
      calories: Math.round(totals.carbs * 4),
      grams: Math.round(totals.carbs),
      color: '#ffe66d'
    },
    {
      name: 'Fat',
      value: Math.round(totals.fat * 9), // 9 cal per gram
      calories: Math.round(totals.fat * 9),
      grams: Math.round(totals.fat),
      color: '#a8edea'
    }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{payload[0].name}</p>
          <p className="calories">{payload[0].payload.calories} cal</p>
          <p className="grams">{payload[0].payload.grams}g</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="daily-nutrition-chart">
      <h2>Macro Breakdown</h2>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={macroData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {macroData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry) => `${value} (${entry.payload.grams}g)`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="macro-stats">
        <div className="stat-card">
          <div className="stat-color protein"></div>
          <div className="stat-content">
            <div className="stat-name">Protein</div>
            <div className="stat-value">{Math.round(totals.protein)}g</div>
            <div className="stat-detail">
              {Math.round((totals.protein * 4 / totals.calories) * 100)}% of calories
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-color carbs"></div>
          <div className="stat-content">
            <div className="stat-name">Carbs</div>
            <div className="stat-value">{Math.round(totals.carbs)}g</div>
            <div className="stat-detail">
              {Math.round((totals.carbs * 4 / totals.calories) * 100)}% of calories
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-color fat"></div>
          <div className="stat-content">
            <div className="stat-name">Fat</div>
            <div className="stat-value">{Math.round(totals.fat)}g</div>
            <div className="stat-detail">
              {Math.round((totals.fat * 9 / totals.calories) * 100)}% of calories
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-color fiber"></div>
          <div className="stat-content">
            <div className="stat-name">Fiber</div>
            <div className="stat-value">{Math.round(totals.fiber)}g</div>
            <div className="stat-detail">Dietary fiber</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderLabel(entry) {
  return `${((entry.value / (entry.value)) * 100).toFixed(0)}%`;
}

export default DailyNutritionChart;
