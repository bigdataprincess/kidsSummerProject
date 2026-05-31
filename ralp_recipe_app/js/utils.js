// ===== UI Utilities =====
const toast = {
  show(message, duration = 3000) {
    const toastEl = document.getElementById('toast');
    toastEl.textContent = message;
    toastEl.removeAttribute('hidden');
    setTimeout(() => {
      toastEl.setAttribute('hidden', '');
    }, duration);
  }
};

// ===== View Management =====
function showView(viewName) {
  // Hide all views
  document.querySelectorAll('.view').forEach(view => {
    view.setAttribute('hidden', '');
  });

  // Show selected view
  const view = document.querySelector(`[data-view="${viewName}"]`);
  if (view) {
    view.removeAttribute('hidden');
  }

  // Update nav active state
  document.querySelectorAll('.nav a').forEach(link => {
    if (link.getAttribute('data-nav') === viewName) {
      link.style.opacity = '1';
      link.style.fontWeight = '700';
    } else {
      link.style.opacity = '0.8';
      link.style.fontWeight = '500';
    }
  });
}

// ===== Navigation =====
function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const viewName = link.getAttribute('data-nav');
      if (viewName === 'home') {
        showView('home');
      } else if (window.currentUser) {
        showView(viewName);
      } else {
        toast.show('Please login first!');
        showView('account');
      }
    });
  });

  // Show home view on load
  showView('home');
}

// ===== Currency Formatting =====
function formatCost(cost) {
  return `${cost} 💰`;
}

// ===== Unique ID Generator =====
function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// ===== DOM Helpers =====
function createElement(tag, className, content) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (content) el.innerHTML = content;
  return el;
}
