// games.js — Memory Match and Click-the-Target.
import * as store from './store.js';

const MEMORY_REWARD = 10;       // coins per win
const MEMORY_DAILY_CAP = 1;     // wins per day
const TARGET_DAILY_CAP = 20;    // coins per day
const TARGET_DURATION_MS = 30000;

const MEMORY_EMOJIS = ['🐱', '🐶', '🦊', '🐼', '🦁', '🐸'];

export function initGames() {
  bindMemoryGame();
  bindTargetGame();
}

// =============================================================
// Memory Match
// =============================================================
function bindMemoryGame() {
  const startBtn = document.getElementById('game-memory-start');
  const board = document.getElementById('game-memory-board');
  const status = document.getElementById('game-memory-status');
  if (!startBtn) return;

  startBtn.addEventListener('click', () => {
    if (!requireLogin(status)) return;
    startBtn.hidden = true;
    board.hidden = false;
    startMemoryGame(board, status, () => {
      startBtn.hidden = false;
      startBtn.textContent = 'Play Again';
    });
  });
}

function startMemoryGame(board, status, onEnd) {
  status.textContent = 'Find the matching pairs!';
  status.className = 'form-msg';

  const cards = shuffle([...MEMORY_EMOJIS, ...MEMORY_EMOJIS]).map((emoji, i) => ({
    id: i, emoji, flipped: false, matched: false,
  }));

  let first = null;
  let lock = false;
  let matchedCount = 0;

  board.innerHTML = cards.map(c => `
    <button class="memory-card" data-id="${c.id}" type="button">?</button>
  `).join('');

  board.querySelectorAll('.memory-card').forEach(btn => {
    btn.addEventListener('click', () => {
      if (lock) return;
      const card = cards[parseInt(btn.dataset.id, 10)];
      if (card.flipped || card.matched) return;
      flip(btn, card, true);

      if (!first) {
        first = { btn, card };
        return;
      }
      // Second flip
      if (first.card.emoji === card.emoji) {
        first.card.matched = true;
        card.matched = true;
        first.btn.classList.add('matched');
        btn.classList.add('matched');
        matchedCount += 2;
        first = null;
        if (matchedCount === cards.length) {
          finishMemoryWin(status, onEnd);
        }
      } else {
        lock = true;
        setTimeout(() => {
          flip(first.btn, first.card, false);
          flip(btn, card, false);
          first = null;
          lock = false;
        }, 800);
      }
    });
  });
}

function flip(btn, card, isFlipped) {
  card.flipped = isFlipped;
  btn.classList.toggle('flipped', isFlipped);
  btn.textContent = isFlipped ? card.emoji : '?';
}

function finishMemoryWin(status, onEnd) {
  const user = store.getCurrentUser();
  if (!user) return;
  const limit = store.getDailyLimit(user.username, 'memory_wins');
  const today = new Date().toISOString().slice(0, 10);
  const playedToday = (limit.day === today) ? limit.value : 0;
  if (playedToday >= MEMORY_DAILY_CAP) {
    status.textContent = `🎉 You won! (No coins — daily limit reached. Come back tomorrow!)`;
    status.className = 'form-msg';
  } else {
    store.bumpDailyLimit(user.username, 'memory_wins', 1);
    store.addCoins(user.username, MEMORY_REWARD, 'memory match win');
    status.textContent = `🎉 You won! +${MEMORY_REWARD} coins!`;
    status.className = 'form-msg good';
    window.__apsToast(`+${MEMORY_REWARD} coins!`, 'good');
  }
  onEnd();
}

// =============================================================
// Click the Target
// =============================================================
function bindTargetGame() {
  const startBtn = document.getElementById('game-target-start');
  const arena = document.getElementById('game-target-arena');
  const status = document.getElementById('game-target-status');
  if (!startBtn) return;

  startBtn.addEventListener('click', () => {
    if (!requireLogin(status)) return;
    startBtn.hidden = true;
    arena.hidden = false;
    startTargetGame(arena, status, () => {
      startBtn.hidden = false;
      startBtn.textContent = 'Play Again';
    });
  });
}

function startTargetGame(arena, status, onEnd) {
  const user = store.getCurrentUser();
  if (!user) return;
  const today = new Date().toISOString().slice(0, 10);
  const limit = store.getDailyLimit(user.username, 'target_coins');
  const earnedToday = (limit.day === today) ? limit.value : 0;
  const remainingToday = Math.max(0, TARGET_DAILY_CAP - earnedToday);

  if (remainingToday === 0) {
    status.textContent = `Daily cap reached (${TARGET_DAILY_CAP} coins). Come back tomorrow!`;
    status.className = 'form-msg';
    onEnd();
    arena.hidden = true;
    return;
  }

  let hits = 0;
  let coinsThisRound = 0;
  let target = null;
  let endTime = Date.now() + TARGET_DURATION_MS;
  let running = true;

  arena.innerHTML = '';
  status.textContent = `30s left — go!`;
  status.className = 'form-msg';

  function placeTarget() {
    if (!running) return;
    if (target) target.remove();
    const t = document.createElement('button');
    t.type = 'button';
    t.className = 'target';
    t.textContent = '🎯';
    const arenaRect = arena.getBoundingClientRect();
    const x = Math.random() * (arenaRect.width - 60);
    const y = Math.random() * (arenaRect.height - 60);
    t.style.left = `${x}px`;
    t.style.top = `${y}px`;
    t.addEventListener('click', () => {
      if (!running) return;
      hits += 1;
      if (coinsThisRound < remainingToday) coinsThisRound += 1;
      status.textContent = `Hits: ${hits} | Coins earnable: ${coinsThisRound}/${remainingToday}`;
      placeTarget();
    });
    arena.appendChild(t);
    target = t;
  }

  placeTarget();

  const tick = setInterval(() => {
    if (!running) return;
    const remaining = Math.max(0, endTime - Date.now());
    if (remaining <= 0) {
      finish();
    } else {
      const sec = Math.ceil(remaining / 1000);
      status.textContent = `${sec}s left — Hits: ${hits} | Coins: ${coinsThisRound}/${remainingToday}`;
    }
  }, 200);

  // Periodically move the target even if not clicked (keep it tricky)
  const move = setInterval(() => { if (running) placeTarget(); }, 1500);

  function finish() {
    running = false;
    clearInterval(tick);
    clearInterval(move);
    if (target) target.remove();
    if (coinsThisRound > 0) {
      store.bumpDailyLimit(user.username, 'target_coins', coinsThisRound);
      store.addCoins(user.username, coinsThisRound, 'target game');
      status.textContent = `⏰ Time! You hit ${hits} targets and earned +${coinsThisRound} coins!`;
      status.className = 'form-msg good';
      window.__apsToast(`+${coinsThisRound} coins!`, 'good');
    } else {
      status.textContent = `⏰ Time! You hit ${hits} targets.`;
      status.className = 'form-msg';
    }
    onEnd();
  }
}

// =============================================================
// Helpers
// =============================================================
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function requireLogin(status) {
  const u = store.getCurrentUser();
  if (!u) {
    status.textContent = 'Please log in first (Account tab).';
    status.className = 'form-msg bad';
    return false;
  }
  return true;
}
