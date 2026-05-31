// ===== Order & Cart Management =====
const orderManager = {
  init() {
    this.setupEventListeners();
    this.updateCartDisplay();
  },

  setupEventListeners() {
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.addEventListener('click', () => {
      this.checkout();
    });

    // Watch for view changes to update display
    const mainEl = document.querySelector('.app-main');
    const observer = new MutationObserver(() => {
      const cartView = document.querySelector('[data-view="cart"]');
      const ordersView = document.querySelector('[data-view="orders"]');

      if (cartView && !cartView.hasAttribute('hidden')) {
        this.updateCartDisplay();
      }

      if (ordersView && !ordersView.hasAttribute('hidden')) {
        this.renderOrderHistory();
      }
    });

    observer.observe(mainEl, { subtree: true, attributes: true });
  },

  updateCartDisplay() {
    if (!currentUser) return;

    this.updateCartCount();

    const cartContainer = document.getElementById('cart-container');
    const summaryDiv = document.getElementById('cart-summary');

    if (currentUser.cart.length === 0) {
      cartContainer.innerHTML = '<p class="empty-state">Your cart is empty. Browse recipes to add items!</p>';
      summaryDiv.setAttribute('hidden', '');
      return;
    }

    cartContainer.innerHTML = '';

    let total = 0;

    currentUser.cart.forEach((item, index) => {
      const itemTotal = item.cost * item.quantity;
      total += itemTotal;

      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${formatCost(item.cost)} each</div>
        </div>
        <div class="cart-item-controls">
          <div class="quantity-controls">
            <button data-index="${index}" class="qty-minus">−</button>
            <span>${item.quantity}</span>
            <button data-index="${index}" class="qty-plus">+</button>
          </div>
          <button class="remove-btn" data-index="${index}">Remove</button>
        </div>
      `;

      itemEl.querySelector('.qty-minus').addEventListener('click', () => {
        this.updateQuantity(index, -1);
      });

      itemEl.querySelector('.qty-plus').addEventListener('click', () => {
        this.updateQuantity(index, 1);
      });

      itemEl.querySelector('.remove-btn').addEventListener('click', () => {
        this.removeFromCart(index);
      });

      cartContainer.appendChild(itemEl);
    });

    document.getElementById('total-price').textContent = formatCost(total);
    summaryDiv.removeAttribute('hidden');
  },

  updateQuantity(index, change) {
    if (!currentUser || !currentUser.cart[index]) return;

    currentUser.cart[index].quantity += change;

    if (currentUser.cart[index].quantity <= 0) {
      this.removeFromCart(index);
    } else {
      authManager.saveUser();
      this.updateCartDisplay();
    }
  },

  removeFromCart(index) {
    if (!currentUser) return;

    const removedItem = currentUser.cart[index];
    currentUser.cart.splice(index, 1);

    authManager.saveUser();
    this.updateCartDisplay();
    toast.show(`Removed ${removedItem.name} from cart`);
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
  },

  checkout() {
    if (!currentUser || currentUser.cart.length === 0) {
      toast.show('Cart is empty!');
      return;
    }

    // Calculate total
    const total = currentUser.cart.reduce((sum, item) => sum + (item.cost * item.quantity), 0);

    // Check if user has enough coins
    if (currentUser.coins < total) {
      toast.show(`Not enough coins! You need ${total} but have ${currentUser.coins}`);
      return;
    }

    // Process order
    const order = {
      id: generateId(),
      date: new Date().toLocaleDateString(),
      items: [...currentUser.cart],
      total: total
    };

    // Deduct coins and add order
    authManager.deductCoins(total);
    currentUser.orderHistory.push(order);
    currentUser.cart = [];

    authManager.saveUser();
    this.updateCartDisplay();

    // Show confirmation
    toast.show(`🎉 Order placed! You spent ${formatCost(total)} coins`);

    // Show order in history
    setTimeout(() => {
      showView('orders');
      this.renderOrderHistory();
    }, 1000);
  },

  renderOrderHistory() {
    if (!currentUser) return;

    const container = document.getElementById('orders-container');
    container.innerHTML = '';

    if (currentUser.orderHistory.length === 0) {
      container.innerHTML = '<p class="empty-state">No orders yet. Start shopping!</p>';
      return;
    }

    // Show orders in reverse chronological order
    [...currentUser.orderHistory].reverse().forEach(order => {
      const card = document.createElement('div');
      card.className = 'order-card';

      const itemsList = order.items.map(item =>
        `<div class="order-item"><span>${item.name} x${item.quantity}</span><span>${formatCost(item.cost * item.quantity)}</span></div>`
      ).join('');

      card.innerHTML = `
        <div class="order-header">
          <div class="order-id">Order #${order.id.slice(-6)}</div>
          <div class="order-date">${order.date}</div>
        </div>
        <div class="order-items">
          ${itemsList}
        </div>
        <div class="order-total">Total: ${formatCost(order.total)}</div>
      `;

      container.appendChild(card);
    });
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    orderManager.init();
  });
} else {
  orderManager.init();
}
