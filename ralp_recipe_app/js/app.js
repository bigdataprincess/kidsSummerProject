// ===== Main App Initialization =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  setupAuth();
  setupNavigation();
  orderManager.init();

  // Show home view on load
  showView('home');

  // Log version
  console.log('🍳 BcGold Restaurant App initialized!');
  console.log('Features: Recipes, Fridge, Orders, Shopping Cart');
  console.log('Made with ❤️ for learning');
});

// Handle hash-based routing
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.slice(1) || 'home';

  if (hash === 'home') {
    showView('home');
  } else if (currentUser) {
    showView(hash);
  } else if (hash === 'account') {
    showView('account');
  } else {
    showView('account');
    toast.show('Please login first!');
  }
});

// Update cart count when a recipe is added
const originalShowRecipeModal = recipeManager.showRecipeModal;
recipeManager.showRecipeModal = function(recipe) {
  originalShowRecipeModal.call(this, recipe);
};
