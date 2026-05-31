# BcGold Restaurant 🍳

A fun, interactive recipe discovery and ordering app built for kids learning web development. Learn new recipes, manage your fridge, and order food with pretend money!

## Features

✨ **Recipe Library** - Browse 12+ delicious recipes with detailed instructions
🥕 **Smart Fridge** - Add ingredients and get recipe suggestions powered by AI
🛒 **Shopping Cart** - Add recipes to cart and checkout with pretend money (coins)
💰 **Coin System** - Start with 500 coins per account, spend on orders
📱 **Fully Responsive** - Works on desktop, tablet, and mobile devices
💾 **Local Storage** - Your account and data save automatically

## How to Use

### 1. **Local Development**

No build step needed! Just open `index.html` in your browser:

```bash
# Navigate to the project folder
cd ralp_recipe_app

# Open in browser (or double-click index.html)
# On Mac: open index.html
# Or use any local server:
python -m http.server 8000
# Then visit http://localhost:8000
```

### 2. **Main Features**

**🏠 Home** - Welcome page with quick links to main features

**📚 Recipes**
- Browse all recipes
- Search by name or ingredient
- Filter by cuisine type
- Click "View" for full recipe details
- Click "Add Cart" to add to shopping cart

**🥬 My Fridge**
- Type an ingredient and click "Add to Fridge"
- Remove ingredients by clicking the X
- Click "✨ Get AI Recipe Suggestion" to get smart recommendations
- Add suggested recipes directly to cart

**🛒 Cart**
- Increase/decrease quantities with +/- buttons
- Remove individual items
- See total cost
- Click "Proceed to Checkout" to order

**📦 Orders**
- View all past orders
- See what you bought and how much you spent

**👤 Account**
- Create account with username
- View your coin balance
- See order history
- Logout anytime

## Using Claude AI (Advanced)

The app includes intelligent recipe suggestions using Claude AI. By default, it uses a smart matching algorithm to suggest recipes from the local database.

### To use Claude API directly:

1. Get your Claude API key from [api.anthropic.com](https://console.anthropic.com)

2. In your browser console, run:
```javascript
aiManager.setApiKey('your-api-key-here')
```

3. Go to My Fridge and click "Get AI Recipe Suggestion"

**⚠️ Important:** Don't commit your API key to GitHub. For production, use a backend proxy server to handle API calls securely.

## Deploying to GitHub Pages 🚀

### Step 1: Push to GitHub

```bash
# From the kidsSummerProject folder
cd /path/to/kidsSummerProject

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial BcGold app"

# Add GitHub remote (replace with your repo URL)
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git branch -M main
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - Select `main` branch
   - Select `/root` folder (or just `/`)
   - Click Save

4. GitHub will show you the URL: `https://YOUR-USERNAME.github.io/YOUR-REPO/`

### Step 3: Visit Your Live App!

Your BcGold app is now live! Share the link with uncles, aunts, and friends! 🎉

## Project Structure

```
ralp_recipe_app/
├── index.html              # Main app structure
├── css/
│   └── styles.css         # All styling
├── js/
│   ├── app.js             # Main app setup
│   ├── auth.js            # User accounts & coins
│   ├── recipes.js         # Recipe display & search
│   ├── fridge.js          # Ingredient management
│   ├── ai.js              # AI suggestions
│   ├── order.js           # Cart & checkout
│   ├── data.js            # Recipe database
│   └── utils.js           # Helper functions
└── README.md              # This file
```

## Data Storage

All data is stored in your browser using `localStorage`:
- User accounts and coin balance
- Shopping cart items
- Order history
- Fridge ingredients

Data is private to your browser and doesn't sync across devices.

## Browser Compatibility

Works in all modern browsers:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Recipes Included

1. Pasta Carbonara (Italian)
2. Tomato Soup (American)
3. Chicken Tacos (Mexican)
4. Pad Thai (Asian)
5. Butter Chicken (Indian)
6. Caesar Salad (American)
7. Pizza Margherita (Italian)
8. Chicken Stir Fry (Asian)
9. Fish Tacos (Mexican)
10. Chocolate Brownies (American)
11. Mushroom Risotto (Italian)
12. Falafel Wrap (Indian)

## Customization

### Add More Recipes

Edit `js/data.js` and add to the `recipes` array:

```javascript
{
  id: 'unique-id',
  name: 'Recipe Name',
  cuisine: 'Cuisine',
  difficulty: 'Easy/Medium/Hard',
  prepTime: 30,
  icon: '🍕',
  ingredients: ['ingredient1', 'ingredient2', ...],
  instructions: ['step1', 'step2', ...],
  cost: 10
}
```

### Change Colors

Edit `css/styles.css` root colors:

```css
:root {
  --color-primary: #ff6b6b;
  --color-secondary: #4ecdc4;
  ...
}
```

## Learning Concepts

This project teaches:
- HTML5 semantic markup
- CSS3 (flexbox, grid, animations)
- JavaScript fundamentals (DOM, events, arrays, objects)
- LocalStorage API (client-side data persistence)
- Async/await and API calls
- State management
- View routing (hash-based navigation)

## Troubleshooting

**"I deleted a recipe by accident"**
- The recipes are defined in `js/data.js`. You can restore them from the original file.

**"My data disappeared"**
- Check if you're using a private browsing window (data is cleared when closed)
- Try a regular browser window instead

**"Cart shows wrong count"**
- Refresh the page (F5 or Cmd+R)
- Check your browser's developer console for errors

**"AI suggestions not working"**
- By default, it uses matching recipes (no API key needed)
- If you want Claude suggestions, set your API key in the browser console

## Future Ideas 💡

- Add user favorites
- Meal planning (weekly menu)
- Shopping list generator
- Recipe difficulty badges
- Share recipes with friends
- User ratings on recipes
- More international cuisines
- Nutritional info display
- Print recipe feature

## Credits

Made with ❤️ as a summer learning project. Built with HTML, CSS, and JavaScript—showcasing what kids can create with AI assistance and coding!

## License

Free to use and modify for educational purposes.

---

**Happy Cooking & Coding! 👨‍💻🍽️**

Questions? Check the console (F12 → Console) for helpful tips!
