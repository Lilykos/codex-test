import axios from 'axios';

/**
 * Search for nutrition information online
 * Uses public APIs and basic web scraping to find nutritional data
 */
export async function searchNutritionInfo(foodInput) {
  try {
    // Try USDA FoodData Central API first (free, no key required for basic searches)
    const usdaResults = await searchUSDA(foodInput);
    if (usdaResults) {
      return usdaResults;
    }

    // Fallback to a simple web search format
    return `Search query: "${foodInput}"\nNote: Using Claude's knowledge base for nutritional estimates.`;
  } catch (error) {
    console.warn('Nutrition search error:', error.message);
    return `Could not fetch external nutrition data. Using estimates based on "${foodInput}".`;
  }
}

/**
 * Search USDA FoodData Central for nutrition info
 */
async function searchUSDA(foodInput) {
  try {
    // USDA FoodData Central free API
    const response = await axios.get('https://fdc.nal.usda.gov/api/foods/search', {
      params: {
        query: foodInput,
        pageSize: 3,
        sortBy: 'dataType.keyword',
        sortOrder: 'desc'
      },
      timeout: 5000
    });

    if (response.data.foods && response.data.foods.length > 0) {
      const foods = response.data.foods.slice(0, 3);
      let result = 'USDA Nutrition Database Results:\n';

      foods.forEach((food, index) => {
        result += `\n${index + 1}. ${food.description}\n`;

        // Extract key nutrients
        if (food.foodNutrients) {
          const nutrients = {};
          food.foodNutrients.forEach(nutrient => {
            if (['Energy', 'Protein', 'Carbohydrate', 'Total lipid', 'Fiber'].includes(nutrient.nutrientName)) {
              nutrients[nutrient.nutrientName] = `${nutrient.value} ${nutrient.unitName}`;
            }
          });
          result += `   Nutrients: ${JSON.stringify(nutrients)}\n`;
        }
      });

      return result;
    }

    return null;
  } catch (error) {
    console.warn('USDA search failed:', error.message);
    return null;
  }
}
