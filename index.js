const axios = require('axios');
const Potion = require('./Potion');

const INGREDIENTS_API_URL = 'https://kaotika-server.fly.dev/ingredients';

async function fetchIngredients() {
  try {
    const response = await axios.get(INGREDIENTS_API_URL);
    if (Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.error('Error: The response is not an array.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    return [];
  }
}

async function main() {
  const ingredients = await fetchIngredients();
  if (!Array.isArray(ingredients)) {
    console.error('Error: ingredients is not an array.');
    return;
  }

  const selectedIngredients = ingredients.slice(0, 3);
  console.log('Selected Ingredients:', selectedIngredients);

  const createdPotion = Potion.create(selectedIngredients, []);
  console.log('Created Potion:', createdPotion);
}

main();