// ===== Fridge Management =====
const fridgeManager = {
  init() {
    this.setupEventListeners();
    this.renderFridgeItems();
  },

  setupEventListeners() {
    const addBtn = document.getElementById('add-ingredient-btn');
    const input = document.getElementById('ingredient-input');
    const suggestBtn = document.getElementById('suggest-recipe-btn');

    addBtn.addEventListener('click', () => {
      this.addIngredient(input.value);
      input.value = '';
      input.focus();
    });

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.addIngredient(input.value);
        input.value = '';
      }
    });

    suggestBtn.addEventListener('click', () => {
      this.suggestRecipe();
    });
  },

  addIngredient(ingredient) {
    if (!currentUser) {
      toast.show('Please login first!');
      return;
    }

    ingredient = ingredient.trim().toLowerCase();
    if (!ingredient) {
      toast.show('Please enter an ingredient!');
      return;
    }

    if (currentUser.fridge.includes(ingredient)) {
      toast.show('Already in fridge!');
      return;
    }

    currentUser.fridge.push(ingredient);
    authManager.saveUser();
    this.renderFridgeItems();
    toast.show(`Added ${ingredient} to fridge!`);
  },

  removeIngredient(ingredient) {
    const index = currentUser.fridge.indexOf(ingredient);
    if (index > -1) {
      currentUser.fridge.splice(index, 1);
      authManager.saveUser();
      this.renderFridgeItems();
      toast.show(`Removed ${ingredient} from fridge`);
    }
  },

  renderFridgeItems() {
    const container = document.getElementById('fridge-items');
    container.innerHTML = '';

    if (!currentUser || currentUser.fridge.length === 0) {
      container.innerHTML = '<p style="color: #999; text-align: center; width: 100%;">Your fridge is empty. Add some ingredients!</p>';
      return;
    }

    currentUser.fridge.forEach(ingredient => {
      const tag = document.createElement('div');
      tag.className = 'ingredient-tag';
      tag.innerHTML = `
        ${ingredient}
        <button type="button">&times;</button>
      `;

      tag.querySelector('button').addEventListener('click', () => {
        this.removeIngredient(ingredient);
      });

      container.appendChild(tag);
    });
  },

  async suggestRecipe() {
    if (!currentUser) {
      toast.show('Please login first!');
      return;
    }

    if (currentUser.fridge.length === 0) {
      toast.show('Add ingredients to your fridge first!');
      return;
    }

    // Show loading state
    const btn = document.getElementById('suggest-recipe-btn');
    const originalText = btn.textContent;
    btn.textContent = '✨ Thinking...';
    btn.disabled = true;

    try {
      const suggestion = await aiManager.getRecipeSuggestion(currentUser.fridge);
      this.displaySuggestion(suggestion);
      toast.show('Recipe suggestion ready!');
    } catch (error) {
      console.error('Error getting suggestion:', error);
      // Fallback: suggest a random recipe with matching ingredients
      const matching = this.findMatchingRecipes();
      if (matching.length > 0) {
        const recipe = matching[Math.floor(Math.random() * matching.length)];
        this.displayRecipeSuggestion(recipe);
        toast.show('Here\'s a recipe with your ingredients!');
      } else {
        toast.show('No recipes found with your ingredients. Try adding more!');
        this.displayErrorSuggestion();
      }
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  },

  findMatchingRecipes() {
    const allRecipes = getAllRecipes();
    return allRecipes.filter(recipe => {
      const hasIngredient = recipe.ingredients.some(ing =>
        currentUser.fridge.some(fridgeIng =>
          ing.toLowerCase().includes(fridgeIng) || fridgeIng.includes(ing.toLowerCase())
        )
      );
      return hasIngredient;
    });
  },

  displaySuggestion(suggestion) {
    const card = document.getElementById('ai-suggestion');
    card.innerHTML = `
      <div class="suggestion-title">🎯 AI Suggested Recipe</div>
      <div class="suggestion-text">
        ${suggestion}
      </div>
      <button class="btn btn-primary" style="margin-top: 1rem; width: 100%; justify-content: center;" onclick="
        const matching = fridgeManager.findMatchingRecipes();
        if (matching.length > 0) {
          recipeManager.addToCart(matching[0]);
        }
      ">Add Suggested Item to Cart</button>
    `;
    card.removeAttribute('hidden');
  },

  displayRecipeSuggestion(recipe) {
    const card = document.getElementById('ai-suggestion');
    card.innerHTML = `
      <div class="suggestion-title">🎯 ${recipe.name}</div>
      <div class="suggestion-text">
        <p><strong>Why this recipe?</strong> It uses ${recipe.ingredients.filter(ing =>
          currentUser.fridge.some(fridgeIng =>
            ing.toLowerCase().includes(fridgeIng) || fridgeIng.includes(ing.toLowerCase())
          )
        ).join(', ')} from your fridge!</p>
        <p><strong>Cuisine:</strong> ${recipe.cuisine}</p>
        <p><strong>Difficulty:</strong> ${recipe.difficulty}</p>
        <p><strong>Time:</strong> ${recipe.prepTime} minutes</p>
        <p><strong>Cost:</strong> ${formatCost(recipe.cost)}</p>
      </div>
      <button class="btn btn-primary" style="margin-top: 1rem; width: 100%; justify-content: center;" onclick="recipeManager.addToCart(getRecipeById('${recipe.id}'))">Add to Cart</button>
    `;
    card.removeAttribute('hidden');
  },

  displayErrorSuggestion() {
    const card = document.getElementById('ai-suggestion');
    card.innerHTML = `
      <div class="suggestion-title">💭 Try Adding More</div>
      <div class="suggestion-text">
        <p>I couldn't find a perfect recipe yet. Try adding more ingredients like:</p>
        <ul style="margin: 1rem 0 0 1.5rem;">
          <li>Pasta, rice, or noodles</li>
          <li>Chicken, fish, or eggs</li>
          <li>Tomato sauce or cream</li>
          <li>Spices like garlic or ginger</li>
        </ul>
      </div>
    `;
    card.removeAttribute('hidden');
  }
};

// Keep track of initialization
let fridgeInitialized = false;

// Initialize when the fridge view is shown
function watchFridgeView() {
  const mainEl = document.querySelector('.app-main');
  const observer = new MutationObserver(() => {
    const fridgeView = document.querySelector('[data-view="fridge"]');
    if (fridgeView && !fridgeView.hasAttribute('hidden') && !fridgeInitialized) {
      fridgeInitialized = true;
      fridgeManager.init();
    }
  });

  observer.observe(mainEl, { subtree: true, attributes: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', watchFridgeView);
} else {
  watchFridgeView();
}
