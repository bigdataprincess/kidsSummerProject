// ===== Recipe Database =====
const recipes = [
  {
    id: 'pasta-carbonara',
    name: 'Pasta Carbonara',
    cuisine: 'Italian',
    difficulty: 'Medium',
    prepTime: 20,
    icon: '🍝',
    image: './BcGold Cash/9.png',
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
    image: './BcGold Cash/10.png',
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
    image: './BcGold Cash/11.png',
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
    image: './BcGold Cash/12.png',
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
    image: './BcGold Cash/13.png',
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
    image: './BcGold Cash/14.png',
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
    image: './BcGold Cash/15.png',
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
    image: './BcGold Cash/16.png',
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
    image: './BcGold Cash/17.png',
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
    image: './BcGold Cash/18.png',
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
    image: './BcGold Cash/19.png',
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
    image: './BcGold Cash/20.png',
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
  },
  {
    id: 'pepper-soup',
    name: 'Pepper Soup',
    cuisine: 'Nigerian',
    difficulty: 'Easy',
    prepTime: 20,
    icon: '🌶️',
    image: './BcGold Cash/1.png',
    ingredients: ['beef', 'scotch bonnet peppers', 'onions', 'garlic', 'ginger', 'spices', 'water', 'salt'],
    instructions: [
      'Boil beef with spices until tender',
      'Finely chop scotch bonnet peppers and onions',
      'Add peppers, onions, and garlic to broth',
      'Simmer for 10 minutes',
      'Season with salt and ginger',
      'Serve hot as an appetizer'
    ],
    cost: 8
  },
  {
    id: 'egusi-soup',
    name: 'Egusi Soup',
    cuisine: 'Nigerian',
    difficulty: 'Medium',
    prepTime: 45,
    icon: '🍲',
    image: './BcGold Cash/2.png',
    ingredients: ['egusi (melon seeds)', 'spinach', 'beef', 'onions', 'palm oil', 'cloves', 'locust beans', 'salt'],
    instructions: [
      'Grind egusi seeds into powder',
      'Heat palm oil in a pot',
      'Fry onions in palm oil',
      'Add beef and cook until brown',
      'Mix egusi powder with water and add to pot',
      'Add spinach and spices, simmer 20 minutes'
    ],
    cost: 9
  },
  {
    id: 'fufu-soup',
    name: 'Fufu with Soup',
    cuisine: 'Nigerian',
    difficulty: 'Hard',
    prepTime: 45,
    icon: '🍲',
    image: './BcGold Cash/3.png',
    ingredients: ['plantain', 'cassava', 'water', 'palm oil', 'leafy vegetables', 'fish', 'onions', 'spices'],
    instructions: [
      'Peel and boil plantain and cassava',
      'Pound until smooth using mortar and pestle',
      'Make palm soup with vegetables and fish',
      'Heat soup until ready',
      'Serve fufu balls alongside hot soup',
      'Dip fufu in soup while eating'
    ],
    cost: 10
  },
  {
    id: 'eba-veg-soup',
    name: 'Eba with Vegetable Soup',
    cuisine: 'Nigerian',
    difficulty: 'Easy',
    prepTime: 25,
    icon: '🥄',
    image: './BcGold Cash/4.png',
    ingredients: ['gari (cassava granules)', 'vegetables', 'onions', 'palm oil', 'stockfish', 'pepper', 'salt', 'water'],
    instructions: [
      'Boil water and add salt',
      'Pour hot water slowly into gari while stirring',
      'Cook vegetable soup with palm oil and stockfish',
      'Add onions and peppers to soup',
      'Serve eba on one side, soup on the other',
      'Enjoy by molding eba and dipping in soup'
    ],
    cost: 7
  },
  {
    id: 'jollof-rice',
    name: 'Jollof Rice',
    cuisine: 'Nigerian',
    difficulty: 'Medium',
    prepTime: 35,
    icon: '🍚',
    image: './BcGold Cash/5.png',
    ingredients: ['rice', 'tomatoes', 'tomato paste', 'onions', 'peppers', 'butter', 'chicken stock', 'salt'],
    instructions: [
      'Blend tomatoes and peppers',
      'Fry onions in butter until golden',
      'Add tomato paste and cook 5 minutes',
      'Add blended tomatoes and tomato mixture',
      'Add rice and chicken stock',
      'Cover and cook until rice is done'
    ],
    cost: 9
  },
  {
    id: 'akara',
    name: 'Akara (Bean Cakes)',
    cuisine: 'Nigerian',
    difficulty: 'Medium',
    prepTime: 30,
    icon: '🤎',
    image: './BcGold Cash/6.png',
    ingredients: ['blackeyed beans', 'onions', 'peppers', 'eggs', 'oil for frying', 'salt', 'ginger', 'garlic'],
    instructions: [
      'Soak blackeyed beans and remove skin',
      'Blend beans with onions, peppers, and spices',
      'Beat in eggs to create batter',
      'Heat oil in a deep pot',
      'Scoop batter and drop into hot oil',
      'Fry until golden brown on both sides'
    ],
    cost: 6
  },
  {
    id: 'suya',
    name: 'Suya (Grilled Meat)',
    cuisine: 'Nigerian',
    difficulty: 'Medium',
    prepTime: 40,
    icon: '🍖',
    image: './BcGold Cash/7.png',
    ingredients: ['beef', 'suya spice powder', 'ginger', 'garlic', 'oil', 'salt', 'onions', 'skewers'],
    instructions: [
      'Cut beef into chunks and thread on skewers',
      'Season beef with salt and pepper',
      'Mix suya spice with oil to create paste',
      'Rub spice mixture on beef',
      'Grill over hot charcoal or fire',
      'Turn frequently until cooked thoroughly'
    ],
    cost: 11
  },
  {
    id: 'nigerian-beef-stew',
    name: 'Nigerian Beef Stew',
    cuisine: 'Nigerian',
    difficulty: 'Easy',
    prepTime: 40,
    icon: '🍛',
    image: './BcGold Cash/8.png',
    ingredients: ['beef', 'tomatoes', 'tomato paste', 'onions', 'peppers', 'butter', 'bay leaves', 'spices'],
    instructions: [
      'Cut beef into chunks',
      'Fry onions in butter until soft',
      'Add beef and brown on all sides',
      'Add tomato paste and cook 2 minutes',
      'Add blended tomatoes and peppers',
      'Simmer 30 minutes until beef is tender'
    ],
    cost: 8
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
