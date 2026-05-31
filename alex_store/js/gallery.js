// gallery.js — renders the picture store grid.
import * as store from './store.js';
import { GALLERY, findPicture } from '../data/gallery.js';

export function renderGallery() {
  const root = document.getElementById('gallery-grid');
  if (!root) return;
  root.innerHTML = GALLERY.map(pictureCardHtml).join('');

  root.querySelectorAll('[data-action="add-to-cart"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.pictureId;
      const u = store.getCurrentUser();
      store.addToCart(u ? u.username : null, id);
      const pic = findPicture(id);
      window.__apsToast(`Added "${pic.title}" to your cart!`, 'good');
    });
  });
}

export function pictureCardHtml(pic) {
  const bg = pic.imageUrl
    ? `background-image: url('${pic.imageUrl}');`
    : `background: linear-gradient(135deg, ${pic.color1}, ${pic.color2});`;
  const fallback = pic.imageUrl ? '' : pic.emoji;
  return `
    <div class="picture-card">
      <div class="picture-thumb" style="${bg}">${fallback}</div>
      <div class="picture-info">
        <h3>${escapeHtml(pic.title)}</h3>
        <span class="picture-price">🪙 ${pic.priceCoins}</span>
      </div>
      <button class="btn btn-primary btn-small" data-action="add-to-cart" data-picture-id="${pic.id}">
        🛒 Add to Cart
      </button>
    </div>
  `;
}

export function pictureThumbStyle(pic) {
  if (pic.imageUrl) return `background-image: url('${pic.imageUrl}');`;
  return `background: linear-gradient(135deg, ${pic.color1}, ${pic.color2});`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
