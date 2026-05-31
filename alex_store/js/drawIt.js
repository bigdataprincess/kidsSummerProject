// drawIt.js — request form + in-browser sketch canvas.
import * as store from './store.js';
import { isAppropriate } from './filter.js';

const COLORS = [
  '#000000', '#ffffff', '#e74c3c', '#ff6b9d', '#ffd93d',
  '#4caf50', '#5ec8ff', '#2a9ad8', '#7e57c2', '#ff7043',
  '#8d6e63', '#90a4ae',
];

let currentColor = '#000000';
let currentSize = 6;
let strokes = [];       // [{ color, size, points: [{x,y}] }]
let drawing = false;

export function initDrawIt() {
  bindTabs();
  bindRequestForm();
  bindSketch();
}

function bindTabs() {
  const tabs = document.querySelectorAll('.tabs .tab-btn');
  const panels = document.querySelectorAll('.tab-panel');
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabs.forEach(b => b.classList.toggle('active', b === btn));
      panels.forEach(p => { p.hidden = p.dataset.panel !== target; });
    });
  });
}

// ===== Request form =====
function bindRequestForm() {
  const form = document.getElementById('draw-request-form');
  if (!form) return;
  const msg = document.getElementById('draw-request-msg');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    msg.textContent = '';
    msg.className = 'form-msg';

    const user = store.getCurrentUser();
    if (!user) {
      msg.textContent = 'Please log in or sign up first (Account tab).';
      msg.className = 'form-msg bad';
      return;
    }

    const fd = new FormData(form);
    const title = (fd.get('title') || '').toString().trim();
    const description = (fd.get('description') || '').toString().trim();
    const style = (fd.get('style') || 'cartoon').toString();

    const titleCheck = isAppropriate(title);
    const descCheck = isAppropriate(description);
    if (!titleCheck.ok || !descCheck.ok) {
      msg.textContent = "Hmm, let's try a different idea! Some words aren't a good fit. 🌈";
      msg.className = 'form-msg bad';
      return;
    }

    store.addCustomOrder({
      id: store.uid('order'),
      username: user.username,
      title,
      description,
      style,
      createdAt: Date.now(),
      status: 'pending',
    });

    msg.textContent = "✨ Request sent! We'll draw it and put it in your pictures soon.";
    msg.className = 'form-msg good';
    form.reset();
    window.__apsToast('Drawing request sent!', 'good');
  });
}

// ===== Sketch canvas =====
function bindSketch() {
  const canvas = document.getElementById('sketch-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Init: white background
  resetCanvas(ctx, canvas);

  // Color swatches
  const swatchRoot = document.getElementById('color-swatches');
  swatchRoot.innerHTML = COLORS.map(c => `
    <button type="button" class="color-swatch ${c === currentColor ? 'active' : ''}"
            style="background:${c}" data-color="${c}" aria-label="Color ${c}"></button>
  `).join('');
  swatchRoot.addEventListener('click', (e) => {
    const btn = e.target.closest('.color-swatch');
    if (!btn) return;
    currentColor = btn.dataset.color;
    swatchRoot.querySelectorAll('.color-swatch').forEach(s => {
      s.classList.toggle('active', s === btn);
    });
  });

  // Brush size
  const sizeInput = document.getElementById('brush-size');
  const sizeValue = document.getElementById('brush-size-value');
  sizeInput.addEventListener('input', () => {
    currentSize = parseInt(sizeInput.value, 10);
    sizeValue.textContent = currentSize;
  });

  // Drawing events — pointer events handle mouse + touch + stylus
  const getPos = (e) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    drawing = true;
    const pt = getPos(e);
    strokes.push({ color: currentColor, size: currentSize, points: [pt] });
    drawDot(ctx, pt, currentColor, currentSize);
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!drawing) return;
    const pt = getPos(e);
    const cur = strokes[strokes.length - 1];
    const prev = cur.points[cur.points.length - 1];
    cur.points.push(pt);
    drawLine(ctx, prev, pt, currentColor, currentSize);
  });

  const stop = () => { drawing = false; };
  canvas.addEventListener('pointerup', stop);
  canvas.addEventListener('pointercancel', stop);
  canvas.addEventListener('pointerleave', stop);

  // Buttons
  document.getElementById('sketch-undo').addEventListener('click', () => {
    if (strokes.length === 0) return;
    strokes.pop();
    redraw(ctx, canvas);
  });
  document.getElementById('sketch-clear').addEventListener('click', () => {
    strokes = [];
    redraw(ctx, canvas);
  });
  document.getElementById('sketch-save').addEventListener('click', () => {
    const user = store.getCurrentUser();
    const msg = document.getElementById('sketch-msg');
    if (!user) {
      msg.textContent = 'Please log in to save your picture (Account tab).';
      msg.className = 'form-msg bad';
      return;
    }
    const title = prompt('Name your picture:', 'My Drawing');
    if (title === null) return;
    const safeTitle = title.trim() || 'My Drawing';
    const check = isAppropriate(safeTitle);
    if (!check.ok) {
      msg.textContent = "Let's pick a different name.";
      msg.className = 'form-msg bad';
      return;
    }
    const dataUrl = canvas.toDataURL('image/png');
    store.addMyPicture(user.username, {
      id: store.uid('pic'),
      title: safeTitle,
      dataUrl,
      source: 'sketch',
      createdAt: Date.now(),
    });
    msg.textContent = `✅ Saved "${safeTitle}" to your pictures!`;
    msg.className = 'form-msg good';
    window.__apsToast('Picture saved!', 'good');
  });
}

function resetCanvas(ctx, canvas) {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawDot(ctx, pt, color, size) {
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(pt.x, pt.y, size / 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawLine(ctx, a, b, color, size) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
}

function redraw(ctx, canvas) {
  resetCanvas(ctx, canvas);
  for (const stroke of strokes) {
    if (stroke.points.length === 1) {
      drawDot(ctx, stroke.points[0], stroke.color, stroke.size);
    } else {
      for (let i = 1; i < stroke.points.length; i++) {
        drawLine(ctx, stroke.points[i - 1], stroke.points[i], stroke.color, stroke.size);
      }
    }
  }
}
