# 🎨 Alexander's Photo Store

**Draw It. Buy It. Save It. Frame It.**

A kid-friendly web app where you can browse pictures, draw your own, request
custom drawings, play games to earn coins, and frame & download your favorite
art — all running locally with **no install required**.

---

## 🚀 How to run (Windows)

1. Open this folder in File Explorer.
2. **Double-click `start.bat`** — a small window opens that runs a tiny
   local server, and your browser opens to the app automatically.
3. To stop the app, close that window.

That's it! No `npm`, no installs, no internet needed — it uses tools
already built into Windows.

> Works best in Chrome, Edge, or Firefox.
>
> **Why not just open `index.html` directly?** The app is built from
> several small JavaScript files (so each is easy to read and edit).
> Modern browsers block that when you open files directly from disk —
> they require a tiny local web server, which `start.bat` provides.

### Running on Mac / Linux

If you have Python installed, from this folder run:

```bash
python3 -m http.server 8765
```

Then open `http://localhost:8765` in your browser.

---

## 👶 For Kiddo — what you can do

- **Home** → see what the app is about
- **Store** → browse pictures and add them to your cart
- **Draw It** → ask us to draw something for you, *or* draw it yourself
- **Games** → play Memory Match and Click-the-Target to earn 🪙 coins
- **Cart** → spend your coins on pictures
- **Account** → see your coins, coupons, and your saved pictures
- After **3 weeks**, you'll unlock a special **3-Week Fan Reward** coupon! 🎉

Click any picture in **My Pictures** to add a frame and download it.

---

## 👨‍👩‍👧 For Parents — admin & fulfillment

1. Click the **Admin** tab.
2. First time only: set a parent password (kids shouldn't know it).
3. You'll see all pending custom drawing requests.
4. Draw the picture (paper, tablet, anything), take a photo, then click
   **📎 Upload Finished Drawing** on the order. The image goes straight to
   the customer's account.

You can also see all users and their coin balances here.

### Adding your own pictures to the store

1. Drop JPG/PNG files into `assets/pictures/`.
2. Open `data/gallery.js`, find the picture you want to replace, and set:
   ```js
   imageUrl: 'assets/pictures/yourfile.png'
   ```
3. Save and refresh the browser.

### Customizing

- **Colors / fonts** → `css/styles.css` (look at the `:root` block at the top)
- **Banned words list** → `js/filter.js`
- **Starter coins / coupon values** → `js/auth.js` (`THREE_WEEK_COUPON_COINS`)
- **Game rewards & caps** → `js/games.js`

---

## ✅ Manual test checklist

Run through these to make sure everything works after any change:

1. Double-click `index.html` → Home view loads, no errors in the browser
   console (`F12 → Console`).
2. **Sign up** as "Alex" with a 4+ character password → you're logged in with
   20 starter coins. Refresh the browser → still logged in.
3. **3-week coupon test**: open DevTools → Application → Local Storage →
   find the `aps:v1` key → edit `users.alex.signupDate` to a number 22+ days
   in the past (e.g., `Date.now() - 22*86400000`). Log out, log back in →
   **"🎉 3-week reward unlocked!"** toast and `THREE_WEEK_FAN` coupon visible.
4. **Store**: add 2 pictures to cart → Cart shows correct total → apply coupon
   if available → total drops → "Buy" succeeds if you have enough coins,
   shows friendly "Not enough coins" if not.
5. **Draw It → Request**: submit "a pretty cat" → success message,
   request appears in admin queue. Submit something with a banned word →
   blocked kindly.
6. **Draw It → Sketch**: draw, undo, clear, save → image appears in
   Account → My Pictures.
7. **Games**: win Memory Match → +10 coins, replay same day →
   "daily limit reached" message. Click-the-Target → coins up to daily cap.
8. **Save & Frame**: pick a picture → choose a frame → click **Download PNG**
   → image opens with frame applied.
9. **Admin**: wrong password → denied. Right password → see pending order →
   upload an image → order moves to "Fulfilled" → that picture now appears
   in the user's "My Pictures."
10. **Refresh** at any step → all state still there.

---

## 🗑️ Wiping all data

Open the browser DevTools console (`F12`) and run:
```js
localStorage.removeItem('aps:v1');
```
Then refresh. The app starts fresh.

---

## 🧱 What's in this folder

```
alex_store/
├─ start.bat              ← double-click this to launch!
├─ start.ps1              ← tiny local web server (used by start.bat)
├─ index.html             ← the app page
├─ README.md              ← you are here
├─ css/styles.css         ← colors, buttons, layout
├─ data/gallery.js        ← starter pictures
├─ assets/pictures/       ← put real artwork here
└─ js/
   ├─ app.js              ← entry point + router
   ├─ store.js            ← all data saved to localStorage
   ├─ auth.js             ← signup, login, 3-week coupon
   ├─ gallery.js          ← store grid
   ├─ cart.js             ← cart + checkout
   ├─ drawIt.js           ← request form + sketch canvas
   ├─ games.js            ← Memory Match + Click-the-Target
   ├─ frame.js            ← Save & Frame
   ├─ filter.js           ← banned-word list
   └─ admin.js            ← parent-only admin view
```

## ⚠️ A few notes

- This app stores **everything in your browser**. Different browsers (or
  different computers) are completely separate worlds.
- Passwords are **lightly obfuscated**, not properly secured. This is a
  local toy app, not a real login system.
- Coins are **pretend** — no real money is involved anywhere.
- The appropriateness filter is a simple banned-word list. Add words to
  `js/filter.js` to extend it.

Made with ❤️ for Alexander. Summer 2026.
