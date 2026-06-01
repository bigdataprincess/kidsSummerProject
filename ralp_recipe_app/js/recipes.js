// ===== Recipe Display Management =====
const recipeManager = {
  currentFilters: {
    search: '',
    cuisine: ''
  },

  init() {
    this.renderRecipes();
    this.setupEventListeners();
  },

  setupEventListeners() {
    const searchInput = document.getElementById('recipe-search');
    const cuisineFilter = document.getElementById('cuisine-filter');

    searchInput.addEventListener('input', (e) => {
      this.currentFilters.search = e.target.value;
      this.renderRecipes();
    });

    cuisineFilter.addEventListener('change', (e) => {
      this.currentFilters.cuisine = e.target.value;
      this.renderRecipes();
    });

    document.getElementById('modal-close-btn').addEventListener('click', () => {
      this.closeRecipeModal();
    });

    // Close modal when clicking outside
    const modal = document.getElementById('recipe-modal');
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeRecipeModal();
      }
    });
  },

  renderRecipes() {
    let filtered = getAllRecipes();

    // Apply search filter
    if (this.currentFilters.search) {
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(this.currentFilters.search.toLowerCase()) ||
        r.ingredients.some(ing =>
          ing.toLowerCase().includes(this.currentFilters.search.toLowerCase())
        )
      );
    }

    // Apply cuisine filter
    if (this.currentFilters.cuisine) {
      filtered = filtered.filter(r => r.cuisine === this.currentFilters.cuisine);
    }

    const container = document.getElementById('recipes-container');
    container.innerHTML = '';

    if (filtered.length === 0) {
      container.innerHTML = '<p class="empty-state" style="grid-column: 1/-1;">No recipes found. Try a different search!</p>';
      return;
    }

    filtered.forEach(recipe => {
      const card = this.createRecipeCard(recipe);
      container.appendChild(card);
    });
  },

  createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';

    card.innerHTML = `
      <div class="recipe-image">${recipe.image ? `<img src="${recipe.image}" alt="${recipe.name}">` : recipe.icon}</div>
      <div class="recipe-info">
        <div class="recipe-name">${recipe.name}</div>
        <div class="recipe-meta">
          <span>${recipe.cuisine}</span>
          <span>⏱️ ${recipe.prepTime}m</span>
          <span>📊 ${recipe.difficulty}</span>
        </div>
        <div class="recipe-cost">${formatCost(recipe.cost)}</div>
        <div class="recipe-actions">
          <button class="btn btn-secondary view-btn" data-id="${recipe.id}">View</button>
          <button class="btn btn-primary cart-btn" data-id="${recipe.id}">Add Cart</button>
        </div>
      </div>
    `;

    card.querySelector('.view-btn').addEventListener('click', () => {
      this.showRecipeModal(recipe);
    });

    card.querySelector('.cart-btn').addEventListener('click', () => {
      this.addToCart(recipe);
    });

    return card;
  },

  addToCart(recipe) {
    if (!currentUser) {
      toast.show('Please login first!');
      return;
    }

    const existingItem = currentUser.cart.find(item => item.id === recipe.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentUser.cart.push({
        id: recipe.id,
        name: recipe.name,
        cost: recipe.cost,
        quantity: 1
      });
    }

    authManager.saveUser();
    this.updateCartCount();
    toast.show(`Added ${recipe.name} to cart!`);
  },

  showRecipeModal(recipe) {
    const modal = document.getElementById('recipe-modal');
    const content = document.getElementById('recipe-detail-content');

    content.innerHTML = `
      <div class="recipe-detail">
        ${recipe.image ? `<img src="${recipe.image}" alt="${recipe.name}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;">` : `<div style="font-size: 3rem; text-align: center; margin-bottom: 1rem;">${recipe.icon}</div>`}
        <h2>${recipe.name}</h2>
        <div class="recipe-detail-meta">
          <div class="meta-item">
            <span class="meta-label">Difficulty</span>
            <span class="meta-value">${recipe.difficulty}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Prep Time</span>
            <span class="meta-value">${recipe.prepTime}m</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Price</span>
            <span class="meta-value">${formatCost(recipe.cost)}</span>
          </div>
        </div>

        <h3>Ingredients</h3>
        <ul>
          ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
        </ul>

        <h3>Instructions</h3>
        <ol>
          ${recipe.instructions.map(inst => `<li>${inst}</li>`).join('')}
        </ol>

        <button class="btn btn-primary btn-large" onclick="recipeManager.addToCart(recipeManager.getRecipeData('${recipe.id}'))">Add to Cart</button>
      </div>
    `;

    modal.removeAttribute('hidden');
  },

  closeRecipeModal() {
    const modal = document.getElementById('recipe-modal');
    modal.setAttribute('hidden', '');
  },

  getRecipeData(id) {
    return getRecipeById(id);
  },

  updateCartCount() {
    if (!currentUser) return;

    const badge = document.getElementById('cart-count');
    if (currentUser.cart.length > 0) {
      badge.textContent = currentUser.cart.length;
      badge.removeAttribute('hidden');
    } else {
      badge.setAttribute('hidden', '');
    }
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    recipeManager.init();
  });
} else {
  recipeManager.init();
}
