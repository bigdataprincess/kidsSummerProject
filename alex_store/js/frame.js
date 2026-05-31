// frame.js — pick a frame style, render onto a canvas, download PNG.
import * as store from './store.js';

const FRAME_STYLES = [
  { id: 'gold',    label: '🌟 Gold' },
  { id: 'wooden',  label: '🪵 Wooden' },
  { id: 'sparkle', label: '✨ Sparkle' },
  { id: 'simple',  label: '⬛ Simple' },
];

let activeStyle = 'gold';

export function renderFrame() {
  const root = document.getElementById('frame-contents');
  if (!root) return;

  const user = store.getCurrentUser();
  if (!user) {
    root.innerHTML = `<div class="account-section">
      <p>Please <a href="#account">log in</a> to frame your pictures.</p>
    </div>`;
    return;
  }

  const pictures = user.myPictures || [];
  if (pictures.length === 0) {
    root.innerHTML = `<div class="account-section">
      <p>You don't have any pictures yet.</p>
      <a class="btn btn-primary" href="#store">🖼️ Visit the Store</a>
      <a class="btn btn-secondary" href="#draw">✏️ Draw Something</a>
    </div>`;
    return;
  }

  const query = window.__apsRouteQuery();
  const requestedId = query.picture;
  const initial = pictures.find(p => p.id === requestedId) || pictures[pictures.length - 1];

  root.innerHTML = `
    <div class="account-section">
      <p>Pick one of your pictures, choose a frame, then download!</p>
      <label>
        <strong>Picture:</strong>
        <select id="frame-picture-select">
          ${pictures.map(p => `
            <option value="${p.id}" ${p.id === initial.id ? 'selected' : ''}>${escapeHtml(p.title)}</option>
          `).join('')}
        </select>
      </label>

      <div class="frame-styles">
        ${FRAME_STYLES.map(s => `
          <button type="button" class="frame-style-btn ${s.id === activeStyle ? 'active' : ''}" data-style="${s.id}">${s.label}</button>
        `).join('')}
      </div>

      <div class="frame-preview">
        <canvas id="frame-canvas" width="600" height="450"></canvas>
      </div>

      <button class="btn btn-primary" id="frame-download">⬇️ Download PNG</button>
    </div>
  `;

  const select = document.getElementById('frame-picture-select');
  const canvas = document.getElementById('frame-canvas');
  const downloadBtn = document.getElementById('frame-download');
  const styleBtns = root.querySelectorAll('.frame-style-btn');

  function render() {
    const picId = select.value;
    const pic = pictures.find(p => p.id === picId);
    if (!pic) return;
    drawFramedImage(canvas, pic.dataUrl, activeStyle);
  }

  select.addEventListener('change', render);
  styleBtns.forEach(b => {
    b.addEventListener('click', () => {
      activeStyle = b.dataset.style;
      styleBtns.forEach(x => x.classList.toggle('active', x === b));
      render();
    });
  });
  downloadBtn.addEventListener('click', () => {
    const pic = pictures.find(p => p.id === select.value);
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(pic.title || 'picture').replace(/[^\w-]+/g, '_')}_framed.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.__apsToast('Downloaded!', 'good');
  });

  render();
}

// Draws the source image onto the canvas with a frame border.
function drawFramedImage(canvas, dataUrl, style) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const img = new Image();
  img.onload = () => {
    // Background border
    drawFrameBackground(ctx, W, H, style);

    // Inner picture area
    const pad = Math.round(Math.min(W, H) * 0.08);
    const innerW = W - pad * 2;
    const innerH = H - pad * 2;

    // Fit image inside inner area preserving aspect
    const scale = Math.min(innerW / img.width, innerH / img.height);
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const dx = pad + (innerW - drawW) / 2;
    const dy = pad + (innerH - drawH) / 2;

    // White matte behind image
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(pad - 4, pad - 4, innerW + 8, innerH + 8);

    ctx.drawImage(img, dx, dy, drawW, drawH);

    // Decorative corners on top
    drawFrameCorners(ctx, W, H, style);
  };
  img.src = dataUrl;
}

function drawFrameBackground(ctx, W, H, style) {
  if (style === 'gold') {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#ffd700');
    g.addColorStop(0.5, '#ffec80');
    g.addColorStop(1, '#b8860b');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  } else if (style === 'wooden') {
    ctx.fillStyle = '#6d4c2f';
    ctx.fillRect(0, 0, W, H);
    // Wood grain lines
    ctx.strokeStyle = 'rgba(0,0,0,0.25)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      const y = Math.random() * H;
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(W / 3, y + Math.random() * 20 - 10, (2 * W) / 3, y + Math.random() * 20 - 10, W, y);
      ctx.stroke();
    }
  } else if (style === 'sparkle') {
    const g = ctx.createRadialGradient(W / 2, H / 2, 30, W / 2, H / 2, Math.max(W, H));
    g.addColorStop(0, '#ff6b9d');
    g.addColorStop(1, '#7e57c2');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    // sparkle dots
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * W;
      const y = Math.random() * H;
      const r = Math.random() * 2 + 0.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else { // simple
    ctx.fillStyle = '#2a2a3a';
    ctx.fillRect(0, 0, W, H);
  }
}

function drawFrameCorners(ctx, W, H, style) {
  if (style === 'sparkle') {
    const corners = [[10, 10], [W - 30, 10], [10, H - 30], [W - 30, H - 30]];
    ctx.font = '24px serif';
    for (const [x, y] of corners) ctx.fillText('✨', x, y + 20);
  } else if (style === 'gold') {
    ctx.fillStyle = '#fff8dc';
    ctx.font = '20px serif';
    const corners = [[6, 24], [W - 28, 24], [6, H - 8], [W - 28, H - 8]];
    for (const [x, y] of corners) ctx.fillText('❖', x, y);
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
