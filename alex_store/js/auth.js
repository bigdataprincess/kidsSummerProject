// auth.js — signup, login, logout, account view, 3-week coupon
import * as store from './store.js';

const THREE_WEEK_DAYS = 21;
const THREE_WEEK_COUPON_CODE = 'THREE_WEEK_FAN';
const THREE_WEEK_COUPON_COINS = 50;

// ===== Password hashing (light obfuscation only; not real security) =====
export async function hashPassword(password, salt = 'aps-static-salt') {
  const data = new TextEncoder().encode(salt + ':' + password);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function daysBetween(msA, msB) {
  return Math.floor((msB - msA) / (1000 * 60 * 60 * 24));
}

// ===== Coupon check (runs on login + when account view opens) =====
function maybeGrantThreeWeekCoupon(username) {
  const u = store.getUser(username);
  if (!u) return false;
  if (store.hasCoupon(username, THREE_WEEK_COUPON_CODE)) return false;
  const days = daysBetween(u.signupDate, Date.now());
  if (days < THREE_WEEK_DAYS) return false;
  store.addCoupon(username, {
    code: THREE_WEEK_COUPON_CODE,
    label: '3-Week Fan Reward',
    description: `Thanks for being with us 3 weeks! +${THREE_WEEK_COUPON_COINS} coins.`,
    coinReward: THREE_WEEK_COUPON_COINS,
    issuedAt: Date.now(),
  });
  store.addCoins(username, THREE_WEEK_COUPON_COINS, '3-week reward');
  window.__apsToast(`🎉 3-week reward unlocked! +${THREE_WEEK_COUPON_COINS} coins!`, 'good');
  return true;
}

// ===== Public API =====
export function initAuth() {
  // Run coupon check on every load if a user is already logged in
  const u = store.getCurrentUser();
  if (u) maybeGrantThreeWeekCoupon(u.username);
}

export async function signup({ name, username, parentEmail, password }) {
  if (!name || !username || !password) {
    return { ok: false, error: 'Please fill in all fields.' };
  }
  if (password.length < 4) {
    return { ok: false, error: 'Password must be at least 4 characters.' };
  }
  if (store.getUser(username)) {
    return { ok: false, error: 'That username is taken. Try another.' };
  }
  const passwordHash = await hashPassword(password);
  const user = {
    username,
    name,
    parentEmail: parentEmail || '',
    passwordHash,
    signupDate: Date.now(),
    coins: 20,           // starter coins so brand-new users can play
    coupons: [],
    myPictures: [],
    dailyLimits: {},
  };
  store.saveUser(user);
  store.setCurrentUser(username);
  window.__apsToast(`Welcome, ${name}! You got 20 starter coins.`, 'good');
  return { ok: true };
}

export async function login({ username, password }) {
  const u = store.getUser(username);
  if (!u) return { ok: false, error: 'No account with that username.' };
  const hash = await hashPassword(password);
  if (hash !== u.passwordHash) return { ok: false, error: 'Wrong password.' };
  store.setCurrentUser(username);
  maybeGrantThreeWeekCoupon(username);
  window.__apsToast(`Hi again, ${u.name}!`, 'good');
  return { ok: true };
}

export function logout() {
  store.logout();
  window.__apsToast('Logged out. See you soon!');
}

// ===== Account view =====
export function renderAccount() {
  const root = document.getElementById('account-contents');
  const u = store.getCurrentUser();
  if (!u) {
    root.innerHTML = renderAuthForms();
    bindAuthForms(root);
    return;
  }
  root.innerHTML = renderLoggedIn(u);
  bindLoggedIn(root, u);
}

function renderAuthForms() {
  return `
    <div class="account-section">
      <h2>Log In</h2>
      <form class="form" data-form="login">
        <label>Username
          <input type="text" name="username" autocomplete="username" required />
        </label>
        <label>Password
          <input type="password" name="password" autocomplete="current-password" required />
        </label>
        <button class="btn btn-primary" type="submit">Log In</button>
        <p class="form-msg" data-msg></p>
      </form>
    </div>

    <div class="account-section">
      <h2>Create an Account</h2>
      <form class="form" data-form="signup">
        <label>Your name
          <input type="text" name="name" required maxlength="40" />
        </label>
        <label>Pick a username
          <input type="text" name="username" required maxlength="20" pattern="[a-zA-Z0-9_]+" title="Letters, numbers, underscore only" />
        </label>
        <label>Parent's email (optional)
          <input type="email" name="parentEmail" />
        </label>
        <label>Password (4+ characters)
          <input type="password" name="password" required minlength="4" />
        </label>
        <button class="btn btn-primary" type="submit">Sign Up</button>
        <p class="form-msg" data-msg></p>
      </form>
    </div>
  `;
}

function renderLoggedIn(u) {
  const coupons = (u.coupons || []).map(c => `
    <div class="coupon-card">
      🎟️ <strong>${escapeHtml(c.label)}</strong><br/>
      <small>${escapeHtml(c.description || '')}</small>
    </div>
  `).join('') || '<p class="muted">No coupons yet — play games and visit often to earn rewards!</p>';

  const pictures = (u.myPictures || []).map(p => `
    <div class="my-picture" data-picture-id="${p.id}">
      <img src="${p.dataUrl}" alt="${escapeHtml(p.title)}" />
      <div class="caption">${escapeHtml(p.title)}</div>
    </div>
  `).join('') || '<p class="muted">No pictures yet — draw one or buy one!</p>';

  const days = Math.floor((Date.now() - u.signupDate) / 86400000);

  return `
    <div class="account-section">
      <h2>Hi, ${escapeHtml(u.name)}! 👋</h2>
      <p>You have <strong>🪙 ${u.coins} coins</strong>.</p>
      <p class="muted">Member for ${days} day${days === 1 ? '' : 's'}.</p>
      <button class="btn btn-secondary btn-small" data-action="logout">Log Out</button>
    </div>

    <div class="account-section">
      <h2>🎟️ Your Coupons</h2>
      ${coupons}
    </div>

    <div class="account-section">
      <h2>🖼️ My Pictures</h2>
      <p class="muted">Click a picture to frame & download it.</p>
      <div class="my-pictures">${pictures}</div>
    </div>
  `;
}

function bindAuthForms(root) {
  root.querySelector('[data-form="login"]').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const msg = e.target.querySelector('[data-msg]');
    const result = await login({
      username: fd.get('username').trim(),
      password: fd.get('password'),
    });
    if (result.ok) {
      renderAccount();
    } else {
      msg.textContent = result.error;
      msg.className = 'form-msg bad';
    }
  });

  root.querySelector('[data-form="signup"]').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const msg = e.target.querySelector('[data-msg]');
    const result = await signup({
      name: fd.get('name').trim(),
      username: fd.get('username').trim(),
      parentEmail: (fd.get('parentEmail') || '').trim(),
      password: fd.get('password'),
    });
    if (result.ok) {
      renderAccount();
    } else {
      msg.textContent = result.error;
      msg.className = 'form-msg bad';
    }
  });
}

function bindLoggedIn(root, u) {
  root.querySelector('[data-action="logout"]').addEventListener('click', () => {
    logout();
    renderAccount();
  });
  root.querySelectorAll('.my-picture').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.pictureId;
      window.__apsGoto(`#frame?picture=${encodeURIComponent(id)}`);
    });
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
