import Anthropic from '@anthropic-ai/sdk';
import { searchNutritionInfo } from '../services/nutritionSearch.js';

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a nutrition expert assistant. Your role is to help users log their meals and extract nutritional information.

When a user describes what they ate, you should:
1. Identify individual food items and their approximate quantities
2. For each food item, extract or estimate:
   - Calories
   - Protein (in grams)
   - Carbohydrates (in grams)
   - Fat (in grams)
   - Fiber (in grams)

Always respond with a JSON object containing an array of foods with their nutritional info.

Example response format:
{
  "foods": [
    {
      "name": "Chicken breast",
      "quantity": "150g",
      "nutrition": {
        "calories": 165,
        "protein": 31,
        "carbs": 0,
        "fat": 3.6,
        "fiber": 0
      }
    }
  ],
  "notes": "Any relevant notes about the meal"
}

Be as accurate as possible. If you don't know exact values, provide reasonable estimates based on standard nutrition databases.`;

export async function nutritionAgent(foodInput) {
  try {
    // First, try to search for nutrition info online
    let searchResults = '';
    try {
      searchResults = await searchNutritionInfo(foodInput);
    } catch (error) {
      console.warn('Search failed, will use Claude estimates:', error.message);
    }

    // Call Claude with the user's input
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `${foodInput}${searchResults ? `\n\nHere's some reference information that might help:\n${searchResults}` : ''}`
        }
      ]
    });

    // Extract the text content
    const content = response.content[0].text;

    // Parse the JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse nutrition data from response');
    }

    const nutritionData = JSON.parse(jsonMatch[0]);
    return nutritionData;
  } catch (error) {
    console.error('Error in nutrition agent:', error);
    throw error;
  }
}
