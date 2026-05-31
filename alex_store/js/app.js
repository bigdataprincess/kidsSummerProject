// app.js — entry point, hash router, global UI bindings.
import * as store from './store.js';
import { initAuth, renderAccount } from './auth.js';
import { renderGallery } from './gallery.js';
import { renderCart } from './cart.js';
import { initDrawIt } from './drawIt.js';
import { initGames } from './games.js';
import { renderAdmin } from './admin.js';
import { renderFrame } from './frame.js';

const VIEWS = ['home', 'store', 'draw', 'games', 'cart', 'account', 'admin', 'frame'];

function showView(name) {
  if (!VIEWS.includes(name)) name = 'home';
  document.querySelectorAll('.view').forEach(el => {
    el.hidden = el.dataset.view !== name;
  });
  document.querySelectorAll('.nav a').forEach(a => {
    a.classList.toggle('active', a.dataset.nav === name);
  });
  // Per-view render hooks
  if (name === 'store') renderGallery();
  if (name === 'cart') renderCart();
  if (name === 'account') renderAccount();
  if (name === 'admin') renderAdmin();
  if (name === 'frame') renderFrame();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function currentRoute() {
  const hash = window.location.hash.replace('#', '').split('?')[0];
  return hash || 'home';
}

function routeQuery() {
  const hash = window.location.hash;
  const qIdx = hash.indexOf('?');
  if (qIdx < 0) return {};
  const params = new URLSearchParams(hash.slice(qIdx + 1));
  const out = {};
  for (const [k, v] of params) out[k] = v;
  return out;
}

// Expose route query to other modules
window.__apsRouteQuery = routeQuery;
window.__apsGoto = (path) => { window.location.hash = path; };

window.addEventListener('hashchange', () => showView(currentRoute()));

// ===== Header / user pill =====
function renderHeader() {
  const pill = document.getElementById('user-pill');
  const nameEl = document.getElementById('user-pill-name');
  const coinsEl = document.getElementById('user-pill-coins');
  const cartCount = document.getElementById('cart-count');

  const u = store.getCurrentUser();
  if (u) {
    pill.hidden = false;
    nameEl.textContent = u.name || u.username;
    coinsEl.textContent = u.coins || 0;
  } else {
    pill.hidden = true;
  }
  const cart = store.getCart(u ? u.username : null);
  if (cart.length > 0) {
    cartCount.hidden = false;
    cartCount.textContent = cart.length;
  } else {
    cartCount.hidden = true;
  }
}

// ===== Toast =====
let toastTimer = null;
export function toast(message, kind = '') {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.className = 'toast' + (kind ? ' ' + kind : '');
  el.hidden = false;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 3200);
}
// Expose to other modules without importing app.js (avoid cycles)
window.__apsToast = toast;

// ===== Re-render header on any state change =====
store.subscribe(() => {
  renderHeader();
  // If the user is currently viewing a state-sensitive screen, re-render it
  const route = currentRoute();
  if (route === 'cart') renderCart();
  if (route === 'account') renderAccount();
  if (route === 'store') renderGallery();
  if (route === 'admin') renderAdmin();
});

// ===== Boot =====
function boot() {
  initAuth();
  initDrawIt();
  initGames();
  renderHeader();
  showView(currentRoute());
}

document.addEventListener('DOMContentLoaded', boot);
