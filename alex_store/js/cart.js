// cart.js — cart view, coupon application, pretend checkout.
import * as store from './store.js';
import { pictureThumbStyle } from './gallery.js';
import { findPicture } from '../data/gallery.js';

let activeCouponCode = null;

export function renderCart() {
  const root = document.getElementById('cart-contents');
  if (!root) return;
  const user = store.getCurrentUser();
  const cart = store.getCart(user ? user.username : null);

  if (cart.length === 0) {
    root.innerHTML = `
      <div class="account-section">
        <p>Your cart is empty.</p>
        <a class="btn btn-primary" href="#store">🖼️ Browse the Store</a>
      </div>
    `;
    return;
  }

  const items = cart.map(id => findPicture(id)).filter(Boolean);
  const subtotal = items.reduce((sum, p) => sum + p.priceCoins, 0);

  // Coupon
  const coupon = user && activeCouponCode
    ? (user.coupons || []).find(c => c.code === activeCouponCode)
    : null;
  const discount = coupon && coupon.coinReward
    ? Math.min(coupon.coinReward, subtotal)
    : 0;
  const total = Math.max(0, subtotal - discount);

  const couponOptions = user
    ? (user.coupons || []).map(c => `<option value="${c.code}">${escapeHtml(c.label)} (−${c.coinReward || 0} coins)</option>`).join('')
    : '';

  root.innerHTML = `
    <div class="cart-list">
      ${items.map((p, i) => `
        <div class="cart-row">
          <div class="picture-thumb" style="${pictureThumbStyle(p)}">${p.imageUrl ? '' : p.emoji}</div>
          <div class="cart-row-info">
            <strong>${escapeHtml(p.title)}</strong><br/>
            <span class="muted">🪙 ${p.priceCoins} coins</span>
          </div>
          <button class="btn btn-danger btn-small" data-action="remove" data-index="${i}" data-picture-id="${p.id}">✕</button>
        </div>
      `).join('')}
    </div>

    <div class="cart-summary">
      <div class="cart-summary-row"><span>Subtotal</span><span>🪙 ${subtotal}</span></div>

      ${user && (user.coupons || []).length > 0 ? `
        <div class="cart-summary-row">
          <label style="display:flex; gap:6px; align-items:center;">
            <span>Coupon:</span>
            <select data-action="apply-coupon">
              <option value="">— none —</option>
              ${couponOptions}
            </select>
          </label>
        </div>
      ` : ''}

      ${discount > 0 ? `<div class="cart-summary-row"><span>Coupon discount</span><span>−🪙 ${discount}</span></div>` : ''}

      <div class="cart-summary-row total"><span>Total</span><span>🪙 ${total}</span></div>

      ${user
        ? `<p class="muted">You have <strong>🪙 ${user.coins}</strong> coins.</p>
           <button class="btn btn-primary" data-action="checkout" ${user.coins < total ? 'disabled' : ''}>
             ${user.coins < total ? 'Not enough coins' : '🛒 Buy with Coins'}
           </button>`
        : `<p class="form-msg bad">Please <a href="#account">log in</a> to check out.</p>`
      }
    </div>
  `;

  // Restore selected coupon in dropdown
  if (activeCouponCode) {
    const sel = root.querySelector('[data-action="apply-coupon"]');
    if (sel) sel.value = activeCouponCode;
  }

  // Bindings
  root.querySelectorAll('[data-action="remove"]').forEach(btn => {
    btn.addEventListener('click', () => {
      store.removeFromCart(user ? user.username : null, btn.dataset.pictureId);
    });
  });

  const couponSel = root.querySelector('[data-action="apply-coupon"]');
  if (couponSel) {
    couponSel.addEventListener('change', () => {
      activeCouponCode = couponSel.value || null;
      renderCart();
    });
  }

  const checkoutBtn = root.querySelector('[data-action="checkout"]');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => doCheckout(items, total, coupon));
  }
}

function doCheckout(items, total, coupon) {
  const user = store.getCurrentUser();
  if (!user) return;
  if (user.coins < total) {
    window.__apsToast('Not enough coins.', 'bad');
    return;
  }
  if (!store.spendCoins(user.username, total)) {
    window.__apsToast('Could not spend coins.', 'bad');
    return;
  }
  // Consume coupon (one-time-use)
  if (coupon) store.consumeCoupon(user.username, coupon.code);
  activeCouponCode = null;

  // Add pictures to "my pictures"
  for (const p of items) {
    store.addMyPicture(user.username, {
      id: store.uid('pic'),
      title: p.title,
      dataUrl: pictureToDataUrl(p),
      source: 'purchase',
      createdAt: Date.now(),
    });
    store.addPurchase({
      id: store.uid('order'),
      username: user.username,
      pictureId: p.id,
      title: p.title,
      imageUrl: p.imageUrl || null,
      purchasedAt: Date.now(),
      coinsSpent: p.priceCoins,
    });
  }

  store.clearCart(user.username);
  window.__apsToast(`🎉 You got ${items.length} picture${items.length === 1 ? '' : 's'}!`, 'good');
  // Show a receipt with a "Save & Frame" link
  showReceipt(items, total);
}

function showReceipt(items, total) {
  const root = document.getElementById('cart-contents');
  root.innerHTML = `
    <div class="account-section">
      <h2>🎉 Thank you!</h2>
      <p>You bought ${items.length} picture${items.length === 1 ? '' : 's'} for <strong>🪙 ${total} coins</strong>.</p>
      <ul>
        ${items.map(p => `<li>${escapeHtml(p.title)}</li>`).join('')}
      </ul>
      <p>Your pictures are now in <a href="#account">My Pictures</a>.</p>
      <a class="btn btn-primary" href="#account">🖼️ View My Pictures</a>
      <a class="btn btn-secondary" href="#store">🛍️ Keep Shopping</a>
    </div>
  `;
}

// Build a data URL for a placeholder picture so it can be saved/framed.
function pictureToDataUrl(p) {
  if (p.imageUrl) return p.imageUrl;
  const c = document.createElement('canvas');
  c.width = 400; c.height = 300;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, c.width, c.height);
  g.addColorStop(0, p.color1);
  g.addColorStop(1, p.color2);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.font = '160px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(p.emoji || '🖼️', c.width / 2, c.height / 2);
  ctx.font = 'bold 28px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.lineWidth = 3;
  ctx.strokeText(p.title, c.width / 2, c.height - 24);
  ctx.fillText(p.title, c.width / 2, c.height - 24);
  return c.toDataURL('image/png');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
