// ===== Recipe Database =====
const recipes = [
  {
    id: 'pasta-carbonara',
    name: 'Pasta Carbonara',
    cuisine: 'Italian',
    difficulty: 'Medium',
    prepTime: 20,
    icon: '🍝',
    ingredients: ['pasta', 'eggs', 'bacon', 'cheese', 'salt', 'black pepper'],
    instructions: [
      'Boil pasta in salted water until al dente',
      'Cut bacon into small pieces and cook until crispy',
      'Mix eggs with grated cheese',
      'Drain pasta and mix with bacon',
      'Add egg mixture and mix quickly off heat',
      'Serve immediately with black pepper'
    ],
    cost: 8
  },
  {
    id: 'tomato-soup',
    name: 'Tomato Soup',
    cuisine: 'American',
    difficulty: 'Easy',
    prepTime: 15,
    icon: '🍅',
    ingredients: ['tomatoes', 'onion', 'garlic', 'cream', 'salt', 'pepper'],
    instructions: [
      'Sauté onion and garlic in a pot',
      'Add tomatoes and cook for 5 minutes',
      'Add cream and simmer for 10 minutes',
      'Blend until smooth',
      'Season with salt and pepper',
      'Serve hot'
    ],
    cost: 5
  },
  {
    id: 'tacos',
    name: 'chicken tacos',
    cuisine: 'Mexican',
    difficulty: 'Easy',
    prepTime: 25,
    icon: '🌮',
    ingredients: ['chicken', 'tortillas', 'lettuce', 'tomato', 'cheese', 'sour cream'],
    instructions: [
      'Cook and season chicken with spices',
      'Warm tortillas',
      'Shred lettuce and dice tomato',
      'Assemble tacos with all ingredients',
      'Top with cheese and sour cream',
      'Serve immediately'
    ],
    cost: 7
  },
  {
    id: 'pad-thai',
    name: 'Pad Thai',
    cuisine: 'Asian',
    difficulty: 'Medium',
    prepTime: 30,
    icon: '🍜',
    ingredients: ['rice noodles', 'shrimp', 'egg', 'peanuts', 'lemon', 'soy sauce'],
    instructions: [
      'Soak rice noodles in water',
      'Cook shrimp until pink',
      'Stir-fry noodles with garlic and shrimp',
      'Add egg and scramble',
      'Add soy sauce and lemon juice',
      'Top with peanuts and serve'
    ],
    cost: 9
  },
  {
    id: 'butter-chicken',
    name: 'Butter Chicken',
    cuisine: 'Indian',
    difficulty: 'Hard',
    prepTime: 45,
    icon: '🍛',
    ingredients: ['chicken', 'butter', 'cream', 'tomato', 'garlic', 'ginger', 'spices'],
    instructions: [
      'Marinate chicken in spices and yogurt',
      'Cook chicken until golden',
      'Make sauce with butter and cream',
      'Add tomato puree and spices',
      'Add cooked chicken to sauce',
      'Simmer for 20 minutes and serve'
    ],
    cost: 12
  },
  {
    id: 'caesar-salad',
    name: 'Caesar Salad',
    cuisine: 'American',
    difficulty: 'Easy',
    prepTime: 10,
    icon: '🥗',
    ingredients: ['romaine lettuce', 'parmesan cheese', 'croutons', 'egg', 'lemon', 'olive oil'],
    instructions: [
      'Wash and chop romaine lettuce',
      'Make dressing with egg, lemon, and oil',
      'Toss lettuce with dressing',
      'Add croutons and parmesan',
      'Mix well and serve immediately',
      'Optional: add grilled chicken'
    ],
    cost: 6
  },
  {
    id: 'margherita-pizza',
    name: 'Pizza Margherita',
    cuisine: 'Italian',
    difficulty: 'Medium',
    prepTime: 35,
    icon: '🍕',
    ingredients: ['flour', 'tomato sauce', 'mozzarella', 'basil', 'olive oil', 'salt'],
    instructions: [
      'Prepare pizza dough',
      'Let dough rise for 30 minutes',
      'Spread tomato sauce on dough',
      'Add torn mozzarella and basil',
      'Drizzle with olive oil',
      'Bake at 450°F for 15-20 minutes'
    ],
    cost: 8
  },
  {
    id: 'chicken-stir-fry',
    name: 'Chicken Stir Fry',
    cuisine: 'Asian',
    difficulty: 'Medium',
    prepTime: 25,
    icon: '🥘',
    ingredients: ['chicken', 'bell pepper', 'carrots', 'soy sauce', 'garlic', 'ginger', 'rice'],
    instructions: [
      'Cook rice first',
      'Cut chicken and vegetables into bite-sized pieces',
      'Heat oil in a wok or large pan',
      'Stir-fry chicken until cooked',
      'Add vegetables and cook 3-4 minutes',
      'Add soy sauce and serve over rice'
    ],
    cost: 9
  },
  {
    id: 'fish-tacos',
    name: 'Fish Tacos',
    cuisine: 'Mexican',
    difficulty: 'Medium',
    prepTime: 20,
    icon: '🌮',
    ingredients: ['white fish', 'tortillas', 'cabbage', 'lime', 'cilantro', 'avocado'],
    instructions: [
      'Season and grill fish',
      'Shred cabbage finely',
      'Warm tortillas',
      'Flake cooked fish',
      'Assemble with cabbage, cilantro, and avocado',
      'Serve with lime wedges'
    ],
    cost: 10
  },
  {
    id: 'brownies',
    name: 'Chocolate Brownies',
    cuisine: 'American',
    difficulty: 'Easy',
    prepTime: 40,
    icon: '🍫',
    ingredients: ['flour', 'butter', 'chocolate', 'eggs', 'sugar', 'vanilla'],
    instructions: [
      'Melt butter and chocolate together',
      'Mix in eggs and sugar',
      'Add flour and vanilla',
      'Pour into baking pan',
      'Bake at 350°F for 25-30 minutes',
      'Cool and cut into squares'
    ],
    cost: 6
  },
  {
    id: 'risotto',
    name: 'Mushroom Risotto',
    cuisine: 'Italian',
    difficulty: 'Hard',
    prepTime: 40,
    icon: '🍚',
    ingredients: ['arborio rice', 'mushrooms', 'butter', 'parmesan', 'white wine', 'broth'],
    instructions: [
      'Sauté mushrooms and set aside',
      'Toast rice briefly in butter',
      'Add white wine and stir',
      'Add broth gradually, stirring constantly',
      'Continue until rice is creamy',
      'Finish with butter, parmesan, and mushrooms'
    ],
    cost: 11
  },
  {
    id: 'falafel',
    name: 'Falafel Wrap',
    cuisine: 'Indian',
    difficulty: 'Medium',
    prepTime: 30,
    icon: '🌯',
    ingredients: ['chickpeas', 'pita bread', 'tomato', 'cucumber', 'tahini', 'parsley'],
    instructions: [
      'Soak and blend chickpeas with spices',
      'Form into balls and fry until golden',
      'Warm pita bread',
      'Chop vegetables finely',
      'Make tahini sauce',
      'Assemble wrap and serve with sauce'
    ],
    cost: 7
  }
];

// Function to get all recipes
function getAllRecipes() {
  return recipes;
}

// Function to get recipe by ID
function getRecipeById(id) {
  return recipes.find(r => r.id === id);
}

// Function to search recipes
function searchRecipes(query) {
  return recipes.filter(r =>
    r.name.toLowerCase().includes(query.toLowerCase()) ||
    r.cuisine.toLowerCase().includes(query.toLowerCase())
  );
}

// Function to filter by cuisine
function getRecipesByCuisine(cuisine) {
  if (!cuisine) return recipes;
  return recipes.filter(r => r.cuisine === cuisine);
}
