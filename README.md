# 🥗 Nutrition Assistant

An AI-powered nutrition assistant web application that helps you track meals and monitor your nutritional intake using Claude AI for intelligent food analysis.

## Features

✨ **Intelligent Food Recognition** - Describe what you ate in natural language, and the AI agent analyzes it to extract nutritional information

📊 **Nutrition Tracking** - Track macronutrients (protein, carbs, fat) and fiber with visual progress bars

📅 **Meal Diary** - Log all your meals with timestamps and nutritional breakdown

📈 **Visual Dashboards** - Beautiful charts and visualizations showing your daily macro breakdown and nutrition summary

🔍 **Smart Search** - Integrates with USDA FoodData Central API to find accurate nutritional data

💾 **Local Storage** - All your meal data is stored locally in your browser and backend (no cloud dependency)

## Tech Stack

### Backend
- **Node.js + Express** - REST API server
- **Claude AI API** - Intelligent food analysis and agent logic
- **USDA FoodData Central API** - Nutrition data lookup
- **JSON file storage** - Local persistent storage

### Frontend
- **React 18** - Modern UI framework
- **Recharts** - Beautiful data visualizations
- **Date-fns** - Date handling
- **CSS3** - Responsive, gradient-based styling

## Project Structure

```
nutrition-assistant/
├── backend/
│   ├── agents/
│   │   └── nutritionAgent.js       # Claude AI nutrition analysis agent
│   ├── services/
│   │   └── nutritionSearch.js      # USDA API integration
│   ├── storage/
│   │   └── mealStorage.js          # Local JSON file storage
│   ├── server.js                   # Express server
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FoodInputForm.jsx   # Food input interface
│   │   │   ├── MealDiary.jsx       # Meal list display
│   │   │   ├── NutritionDashboard.jsx # Daily summary & progress bars
│   │   │   └── DailyNutritionChart.jsx # Macro breakdown pie chart
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── public/
│   └── package.json
├── package.json                    # Root package.json for easy setup
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- Anthropic API key (for Claude)

### 1. Clone and Setup

```bash
# Install all dependencies
npm run install-all
```

### 2. Configure Environment

```bash
# Create .env file in backend directory
cd backend
cp .env.example .env

# Edit .env and add your Anthropic API key
# ANTHROPIC_API_KEY=your_api_key_here
```

### 3. Run the Application

**Option A: Run both frontend and backend together**
```bash
npm run dev
```

**Option B: Run separately in different terminals**

Terminal 1 - Backend:
```bash
npm run backend
# Backend runs on http://localhost:5000
```

Terminal 2 - Frontend:
```bash
npm run frontend
# Frontend runs on http://localhost:3000
```

## Usage

1. **Open the app** - Navigate to http://localhost:3000
2. **Select a date** - Use the date picker to choose which date to log meals for
3. **Add food** - Describe what you ate in natural language:
   - "grilled chicken breast with rice and broccoli"
   - "two eggs with toast and coffee with milk"
   - "pasta with olive oil and garlic"
4. **Review analysis** - The AI will detect the foods and show nutritional breakdown
5. **Add to diary** - Click "Add to Diary" to log the meal
6. **View summary** - See your daily nutrition totals and macros at a glance

## API Endpoints

### Food Analysis
- `POST /api/analyze-food` - Analyze food input using Claude AI
  ```json
  {
    "foodInput": "description of what you ate"
  }
  ```

### Meal Management
- `POST /api/meals` - Add meal to diary
- `GET /api/meals` - Get all meals
- `GET /api/meals/:date` - Get meals for specific date
- `DELETE /api/meals/:id` - Delete a meal
- `GET /api/nutrition-summary/:date` - Get daily nutrition summary
- `GET /api/health` - Health check

## Configuration

### Daily Nutrition Targets (in NutritionDashboard.jsx)
Customize daily targets:
```javascript
const targets = {
  calories: 2000,
  protein: 50,
  carbs: 225,
  fat: 65,
  fiber: 25
};
```

## Data Storage

Your meal data is stored locally:
- **Backend**: `backend/data/meals.json`
- **Frontend**: Can be synced via API

Meals include:
- Food name and quantity
- Macronutrients (protein, carbs, fat)
- Fiber content
- Calorie count
- Timestamp

## How the AI Agent Works

1. User inputs food description
2. Claude AI (via agentic flow) parses the input
3. System attempts to search USDA database for reference data
4. Claude provides accurate nutritional estimates based on:
   - Your description
   - USDA reference data (if available)
   - Standard nutrition databases knowledge
5. Returns structured data with individual foods and totals
6. Data is stored locally and displayed in the diary

## Customization

### Adding Macro Targets
Edit the `targets` object in `NutritionDashboard.jsx` to adjust daily targets based on your dietary goals.

### Styling
All components use CSS modules and gradients. Main color scheme uses purple gradients (`#667eea`, `#764ba2`). Customize in component `.css` files.

### Nutrition Database
The app uses USDA FoodData Central API. You can also integrate other nutrition APIs by modifying `backend/services/nutritionSearch.js`.

## Troubleshooting

### "Failed to analyze food" error
- Check your `ANTHROPIC_API_KEY` is set correctly
- Ensure backend is running on port 5000
- Check CORS is enabled (it is in server.js)

### Meals not saving
- Verify `backend/data/` directory exists
- Check file permissions on the data directory
- Look at backend console for storage errors

### Chart not displaying
- Ensure frontend has meals logged for the selected date
- Clear browser cache if styles look wrong

## License

MIT

## Support

For issues or questions about Claude Code or this project, visit:
- Claude Code docs: https://docs.claude.com/en/docs/claude-code/
- Create an issue on GitHub if problems arise