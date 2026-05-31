// ===== Claude AI Integration =====
// Note: For GitHub Pages deployment, API calls need a backend proxy
// This file shows how to integrate Claude API

const aiManager = {
  apiKey: localStorage.getItem('bcgold_api_key') || '',

  // Set API key for development (can be stored in browser for demo)
  setApiKey(key) {
    this.apiKey = key;
    localStorage.setItem('bcgold_api_key', key);
  },

  // Get recipe suggestion from Claude API
  async getRecipeSuggestion(ingredients) {
    // Try Claude API if key is available
    if (this.apiKey && this.apiKey.startsWith('sk-')) {
      try {
        return await this.callClaudeAPI(ingredients);
      } catch (error) {
        console.error('Claude API error:', error);
        // Fall back to matching recipes
        return this.fallbackSuggestion(ingredients);
      }
    }

    // Fall back to matching recipes
    return this.fallbackSuggestion(ingredients);
  },

  // Call Claude API (requires valid API key and CORS setup)
  async callClaudeAPI(ingredients) {
    const ingredientList = ingredients.join(', ');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `I have these ingredients at home: ${ingredientList}. Please suggest a delicious recipe I can make with these ingredients. Be concise and practical. Include a brief description of why this recipe works with these ingredients.`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  },

  // Fallback suggestion using local recipe database
  fallbackSuggestion(ingredients) {
    const allRecipes = getAllRecipes();
    const matched = [];

    allRecipes.forEach(recipe => {
      let matchCount = 0;
      recipe.ingredients.forEach(recipeIng => {
        if (ingredients.some(userIng =>
          recipeIng.toLowerCase().includes(userIng) ||
          userIng.includes(recipeIng.toLowerCase())
        )) {
          matchCount++;
        }
      });

      if (matchCount > 0) {
        matched.push({ recipe, matchCount });
      }
    });

    if (matched.length === 0) {
      return 'No recipes found. Try adding common ingredients like pasta, rice, eggs, or vegetables!';
    }

    // Sort by match count and pick top recipe
    matched.sort((a, b) => b.matchCount - a.matchCount);
    const recipe = matched[0].recipe;

    const matchedIngredients = recipe.ingredients.filter(recipeIng =>
      ingredients.some(userIng =>
        recipeIng.toLowerCase().includes(userIng) ||
        userIng.includes(recipeIng.toLowerCase())
      )
    ).join(', ');

    return `Based on your ingredients, I suggest making <strong>${recipe.name}</strong>! 🍽️ You already have ${matchedIngredients}. This ${recipe.difficulty.toLowerCase()} recipe takes only ${recipe.prepTime} minutes and costs ${formatCost(recipe.cost)}.`;
  }
};

// For secured API calls from a backend:
// Create a backend endpoint that:
// 1. Receives the ingredients list
// 2. Calls Claude API with the backend's API key
// 3. Returns the suggestion to the frontend
// Example backend route:
// POST /api/suggest-recipe
// { ingredients: ['eggs', 'milk', ...] }
// Response: { suggestion: '...' }

console.log('AI Manager loaded. To use Claude API:');
console.log('1. Backend approach (recommended): Set up a proxy endpoint');
console.log('2. Development: aiManager.setApiKey("your-api-key") in console');
console.log('3. Production: Use matching recipes fallback (no API key needed)');
