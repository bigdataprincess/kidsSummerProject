// ===== Authentication Management =====
let currentUser = null;

const authManager = {
  // Initialize user from localStorage
  init() {
    const savedUser = localStorage.getItem('bcgold_user');
    if (savedUser) {
      currentUser = JSON.parse(savedUser);
      this.updateUI();
    }
  },

  // Login or signup
  login(username) {
    if (!username.trim()) {
      toast.show('Please enter a username!');
      return false;
    }

    // Create or load user
    const existingUser = this.loadUser(username);
    if (existingUser) {
      currentUser = existingUser;
      toast.show(`Welcome back, ${username}!`);
    } else {
      currentUser = {
        username: username.trim(),
        coins: 500,
        cart: [],
        orderHistory: [],
        fridge: []
      };
      toast.show(`Welcome, ${username}! You have 500 coins to start!`);
    }

    this.saveUser();
    this.updateUI();
    return true;
  },

  // Save current user
  saveUser() {
    if (currentUser) {
      localStorage.setItem('bcgold_user', JSON.stringify(currentUser));
      window.currentUser = currentUser;
    }
  },

  // Load user from storage
  loadUser(username) {
    const allUsers = JSON.parse(localStorage.getItem('bcgold_users') || '{}');
    return allUsers[username];
  },

  // Logout
  logout() {
    localStorage.removeItem('bcgold_user');
    currentUser = null;
    window.currentUser = null;
    this.updateUI();
    toast.show('Logged out successfully');
  },

  // Update UI to show user info
  updateUI() {
    const userPill = document.getElementById('user-pill');
    const loginForm = document.getElementById('login-form');
    const accountInfo = document.getElementById('account-info');

    if (currentUser) {
      userPill.removeAttribute('hidden');
      document.getElementById('user-pill-name').textContent = currentUser.username;
      document.getElementById('user-pill-coins').textContent = currentUser.coins;

      loginForm.setAttribute('hidden', '');
      accountInfo.removeAttribute('hidden');

      document.getElementById('profile-username').textContent = currentUser.username;
      document.getElementById('profile-coins').textContent = currentUser.coins;
    } else {
      userPill.setAttribute('hidden', '');
      loginForm.removeAttribute('hidden');
      accountInfo.setAttribute('hidden', '');
    }
  },

  // Add coins
  addCoins(amount) {
    if (currentUser) {
      currentUser.coins += amount;
      this.saveUser();
      this.updateUI();
    }
  },

  // Deduct coins
  deductCoins(amount) {
    if (currentUser && currentUser.coins >= amount) {
      currentUser.coins -= amount;
      this.saveUser();
      this.updateUI();
      return true;
    }
    return false;
  }
};

// ===== Setup Auth Handlers =====
function setupAuth() {
  authManager.init();

  const loginBtn = document.getElementById('login-btn');
  const usernameInput = document.getElementById('username-input');
  const logoutBtn = document.getElementById('logout-btn');

  loginBtn.addEventListener('click', () => {
    const username = usernameInput.value;
    if (authManager.login(username)) {
      usernameInput.value = '';
      showView('home');
    }
  });

  usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      loginBtn.click();
    }
  });

  logoutBtn.addEventListener('click', () => {
    authManager.logout();
    showView('account');
  });
}
