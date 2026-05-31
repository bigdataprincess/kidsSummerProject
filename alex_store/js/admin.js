// admin.js — parent-gated admin view: order queue, image upload, user overview.
import * as store from './store.js';
import { hashPassword } from './auth.js';

let unlocked = false;

export function renderAdmin() {
  const root = document.getElementById('admin-contents');
  if (!root) return;

  const adminHash = store.getAdminPasswordHash();

  if (!adminHash) {
    // First-run: parent sets password
    root.innerHTML = `
      <div class="account-section">
        <h2>🔒 First-Time Setup</h2>
        <p>Set a parent password so kids can't reach the admin view.</p>
        <form class="form" data-form="set-password">
          <label>Parent password (4+ chars)
            <input type="password" name="password" required minlength="4" />
          </label>
          <label>Confirm password
            <input type="password" name="confirm" required minlength="4" />
          </label>
          <button class="btn btn-primary" type="submit">Save Password</button>
          <p class="form-msg" data-msg></p>
        </form>
      </div>
    `;
    bindSetPassword(root);
    return;
  }

  if (!unlocked) {
    root.innerHTML = `
      <div class="account-section">
        <h2>🔒 Parent Password Required</h2>
        <form class="form" data-form="unlock">
          <label>Password
            <input type="password" name="password" required autocomplete="current-password" />
          </label>
          <button class="btn btn-primary" type="submit">Unlock</button>
          <p class="form-msg" data-msg></p>
        </form>
      </div>
    `;
    bindUnlock(root);
    return;
  }

  renderAdminDashboard(root);
}

function bindSetPassword(root) {
  root.querySelector('[data-form="set-password"]').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const password = fd.get('password');
    const confirm = fd.get('confirm');
    const msg = e.target.querySelector('[data-msg]');
    if (password !== confirm) {
      msg.textContent = "Passwords don't match.";
      msg.className = 'form-msg bad';
      return;
    }
    const hash = await hashPassword(password, 'aps-admin-salt');
    store.setAdminPasswordHash(hash);
    unlocked = true;
    window.__apsToast('Admin password set!', 'good');
    renderAdmin();
  });
}

function bindUnlock(root) {
  root.querySelector('[data-form="unlock"]').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const hash = await hashPassword(fd.get('password'), 'aps-admin-salt');
    const msg = e.target.querySelector('[data-msg]');
    if (hash === store.getAdminPasswordHash()) {
      unlocked = true;
      window.__apsToast('Welcome, parent!', 'good');
      renderAdmin();
    } else {
      msg.textContent = 'Wrong password.';
      msg.className = 'form-msg bad';
    }
  });
}

function renderAdminDashboard(root) {
  const state = store.getState();
  const pending = state.customOrders.filter(o => o.status === 'pending');
  const fulfilled = state.customOrders.filter(o => o.status === 'fulfilled');
  const users = Object.values(state.users);

  root.innerHTML = `
    <div class="account-section">
      <h2>📥 Pending Custom Orders (${pending.length})</h2>
      ${pending.length === 0 ? '<p class="muted">No pending orders. 🎉</p>' : ''}
      ${pending.map(orderCardHtml).join('')}
    </div>

    <div class="account-section">
      <h2>✅ Fulfilled Orders (${fulfilled.length})</h2>
      ${fulfilled.length === 0 ? '<p class="muted">None yet.</p>' : ''}
      ${fulfilled.slice(-5).reverse().map(orderCardHtml).join('')}
    </div>

    <div class="account-section">
      <h2>👤 Users (${users.length})</h2>
      ${users.length === 0 ? '<p class="muted">No users yet.</p>' : `
        <table style="width:100%; border-collapse: collapse;">
          <thead>
            <tr style="text-align:left; border-bottom: 2px solid #ccc;">
              <th>Name</th><th>Username</th><th>Coins</th><th>Member since</th><th>Pictures</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(u => `
              <tr style="border-bottom: 1px dashed #eee;">
                <td>${escapeHtml(u.name)}</td>
                <td>${escapeHtml(u.username)}</td>
                <td>🪙 ${u.coins || 0}</td>
                <td>${new Date(u.signupDate).toLocaleDateString()}</td>
                <td>${(u.myPictures || []).length}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
    </div>

    <div class="account-section">
      <button class="btn btn-secondary btn-small" data-action="lock">🔒 Lock Admin</button>
    </div>
  `;

  // Bind fulfill upload inputs
  root.querySelectorAll('[data-action="upload-fulfill"]').forEach(input => {
    input.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const orderId = e.target.dataset.orderId;
      const dataUrl = await fileToDataUrl(file);
      store.fulfillCustomOrder(orderId, dataUrl);
      window.__apsToast('Order fulfilled — picture sent to user!', 'good');
      renderAdmin();
    });
  });

  const lockBtn = root.querySelector('[data-action="lock"]');
  if (lockBtn) {
    lockBtn.addEventListener('click', () => {
      unlocked = false;
      renderAdmin();
    });
  }
}

function orderCardHtml(o) {
  const date = new Date(o.createdAt).toLocaleString();
  const cls = o.status === 'fulfilled' ? 'order-card fulfilled' : 'order-card';
  return `
    <div class="${cls}">
      <strong>${escapeHtml(o.title)}</strong>
      <p>${escapeHtml(o.description)}</p>
      <p class="order-meta">
        From <strong>${escapeHtml(o.username)}</strong> · ${escapeHtml(o.style)} · ${date}
      </p>
      ${o.status === 'fulfilled' && o.fulfilledImage
        ? `<img src="${o.fulfilledImage}" alt="fulfilled" style="max-width:200px; border-radius:8px; margin-top:6px;" />`
        : `<label class="btn btn-primary btn-small" style="margin-top:8px; display:inline-block;">
             📎 Upload Finished Drawing
             <input type="file" accept="image/*" data-action="upload-fulfill" data-order-id="${o.id}" hidden />
           </label>`
      }
    </div>
  `;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
