// store.js — tiny localStorage data layer for Alexander's Photo Store
// All app state lives under a single namespaced key so we can wipe/inspect easily.

const ROOT_KEY = 'aps:v1';

const DEFAULTS = {
  users: {},            // username -> { name, parentEmail, passwordHash, signupDate, coins, coupons:[], myPictures:[], dailyLimits:{} }
  currentUser: null,    // username string or null
  customOrders: [],     // [{ id, username, title, description, style, createdAt, status:'pending'|'fulfilled', fulfilledImage?:dataUrl }]
  purchases: [],        // [{ id, username, pictureId, title, imageUrl, purchasedAt, coinsSpent }]
  admin: {              // { passwordHash?: string }
    passwordHash: null,
  },
  cart: {},             // username -> [pictureId, ...]   (guest cart under '__guest__')
};

function readAll() {
  try {
    const raw = localStorage.getItem(ROOT_KEY);
    if (!raw) return structuredClone(DEFAULTS);
    const parsed = JSON.parse(raw);
    // Merge defaults so missing top-level keys still work after upgrades
    return { ...structuredClone(DEFAULTS), ...parsed };
  } catch (e) {
    console.error('store: failed to read state, resetting', e);
    return structuredClone(DEFAULTS);
  }
}

function writeAll(state) {
  localStorage.setItem(ROOT_KEY, JSON.stringify(state));
}

// ===== Generic helpers =====
export function getState() {
  return readAll();
}

export function update(mutator) {
  const state = readAll();
  mutator(state);
  writeAll(state);
  notify();
  return state;
}

export function resetAll() {
  localStorage.removeItem(ROOT_KEY);
  notify();
}

// ===== Subscriptions =====
const listeners = new Set();
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function notify() {
  for (const fn of listeners) {
    try { fn(); } catch (e) { console.error(e); }
  }
}

// ===== Users =====
export function getCurrentUser() {
  const state = readAll();
  if (!state.currentUser) return null;
  return state.users[state.currentUser] || null;
}

export function setCurrentUser(username) {
  update(s => { s.currentUser = username; });
}

export function logout() {
  update(s => { s.currentUser = null; });
}

export function getUser(username) {
  return readAll().users[username] || null;
}

export function saveUser(user) {
  update(s => { s.users[user.username] = user; });
}

// ===== Coins =====
export function addCoins(username, amount, reason = '') {
  update(s => {
    const u = s.users[username];
    if (!u) return;
    u.coins = (u.coins || 0) + amount;
    if (reason) console.log(`[coins] ${username} +${amount} (${reason})`);
  });
}

export function spendCoins(username, amount) {
  let ok = false;
  update(s => {
    const u = s.users[username];
    if (!u) return;
    if ((u.coins || 0) < amount) return;
    u.coins -= amount;
    ok = true;
  });
  return ok;
}

// ===== Coupons =====
export function addCoupon(username, coupon) {
  update(s => {
    const u = s.users[username];
    if (!u) return;
    u.coupons = u.coupons || [];
    u.coupons.push(coupon);
  });
}

export function hasCoupon(username, code) {
  const u = getUser(username);
  return !!(u && u.coupons && u.coupons.some(c => c.code === code));
}

export function consumeCoupon(username, code) {
  update(s => {
    const u = s.users[username];
    if (!u || !u.coupons) return;
    u.coupons = u.coupons.filter(c => c.code !== code);
  });
}

// ===== My Pictures =====
export function addMyPicture(username, picture) {
  // picture = { id, title, dataUrl, source:'sketch'|'purchase'|'custom', createdAt }
  update(s => {
    const u = s.users[username];
    if (!u) return;
    u.myPictures = u.myPictures || [];
    u.myPictures.push(picture);
  });
}

export function removeMyPicture(username, pictureId) {
  update(s => {
    const u = s.users[username];
    if (!u || !u.myPictures) return;
    u.myPictures = u.myPictures.filter(p => p.id !== pictureId);
  });
}

// ===== Cart =====
export function getCart(username) {
  const key = username || '__guest__';
  return readAll().cart[key] || [];
}

export function addToCart(username, pictureId) {
  const key = username || '__guest__';
  update(s => {
    s.cart[key] = s.cart[key] || [];
    s.cart[key].push(pictureId);
  });
}

export function removeFromCart(username, pictureId) {
  const key = username || '__guest__';
  update(s => {
    if (!s.cart[key]) return;
    const idx = s.cart[key].indexOf(pictureId);
    if (idx >= 0) s.cart[key].splice(idx, 1);
  });
}

export function clearCart(username) {
  const key = username || '__guest__';
  update(s => { s.cart[key] = []; });
}

// ===== Custom orders =====
export function addCustomOrder(order) {
  update(s => { s.customOrders.push(order); });
}

export function getCustomOrders(opts = {}) {
  const all = readAll().customOrders;
  if (opts.username) return all.filter(o => o.username === opts.username);
  if (opts.status) return all.filter(o => o.status === opts.status);
  return all;
}

export function fulfillCustomOrder(orderId, dataUrl) {
  update(s => {
    const o = s.customOrders.find(x => x.id === orderId);
    if (!o) return;
    o.status = 'fulfilled';
    o.fulfilledImage = dataUrl;
    o.fulfilledAt = Date.now();
    // Also add to that user's myPictures
    const u = s.users[o.username];
    if (u) {
      u.myPictures = u.myPictures || [];
      u.myPictures.push({
        id: 'pic_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
        title: o.title,
        dataUrl,
        source: 'custom',
        createdAt: Date.now(),
      });
    }
  });
}

// ===== Purchases =====
export function addPurchase(purchase) {
  update(s => { s.purchases.push(purchase); });
}

// ===== Daily limits (for game caps) =====
export function getDailyLimit(username, key) {
  const u = getUser(username);
  if (!u || !u.dailyLimits) return { day: null, value: 0 };
  return u.dailyLimits[key] || { day: null, value: 0 };
}

export function bumpDailyLimit(username, key, amount = 1) {
  const today = new Date().toISOString().slice(0, 10);
  update(s => {
    const u = s.users[username];
    if (!u) return;
    u.dailyLimits = u.dailyLimits || {};
    const cur = u.dailyLimits[key];
    if (!cur || cur.day !== today) {
      u.dailyLimits[key] = { day: today, value: amount };
    } else {
      cur.value += amount;
    }
  });
}

// ===== Admin =====
export function getAdminPasswordHash() {
  return readAll().admin.passwordHash;
}

export function setAdminPasswordHash(hash) {
  update(s => { s.admin.passwordHash = hash; });
}

// ===== Util =====
export function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}
