import Airtable from 'airtable';

// Airtable configuration
const apiKey = import.meta.env.VITE_APP_API_KEY;
const baseId = import.meta.env.VITE_APP_BASE_ID;
const base = new Airtable({ apiKey }).base(baseId);

// Fetch random meals
export async function fetchRandomMeals() {
  try {
    const records = await base('MealSug').select({
      maxRecords: 4,
      view: 'Grid view'
    }).all();

    const meals = records.map(record => ({
      id: record.id,
      mealName: record.fields['Meal Name'],
      mainIngredient: record.fields['Main Ingredient'],
      type: record.fields['Type'],
      cuisine: record.fields['Cuisine'],
      protein: record.fields['Protein'],
      fat: record.fields['Fat'],
      dietType: record.fields['Diet Type'],
      interestingInfo: record.fields['Interesting Info']
    }));

    return meals.sort(() => Math.random() - 0.5).slice(0, 4);

  } catch (error) {
    console.error('Fehler beim Abrufen von Daten aus Airtable:', error);
    return null;
  }
}

