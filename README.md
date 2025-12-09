# Water Plants Reminder

A super lightweight 10-day countdown website optimized for old iPads to remind you to water your plants. Features auto-reset functionality, plant-themed emoji animations, localStorage persistence, and wake lock to keep the iPad screen awake.

## Features

- ⏱️ 10-day countdown with auto-reset
- 💾 localStorage persistence (remembers countdown state)
- 🌱 Plant-themed emoji animations (🌱 🌿 🌳 💧 🌸 🍃 🌺 🌻)
- 🎉 Celebration animation when countdown resets
- 📊 Visual progress bar
- 🎨 Beautiful terracotta background with cream text
- 📱 Optimized for iPad (portrait and landscape)
- ⚡ Ultra-lightweight (no frameworks, pure HTML/CSS/JS)
- 🔋 Wake Lock API to keep iPad screen awake (with fallback for older devices)

## Performance Optimizations

- Updates every minute (not every second) for better performance
- CSS-only animations using GPU-accelerated transforms
- Minimal DOM manipulation
- Cached DOM element references
- Will-change hints for smooth animations

## Keeping iPad Awake

The website uses the Screen Wake Lock API to prevent the iPad from going to sleep. For older iPads that don't support this API, there's a fallback mechanism that keeps the page active with subtle activity. 

**Note:** For best results on older iPads, you may also want to:
- Disable Auto-Lock in iPad Settings → Display & Brightness → Auto-Lock → Never
- Keep the iPad plugged into power

## Free Hosting Options

### Option 1: GitHub Pages (Recommended)

1. Create a new repository on GitHub (e.g., `water-plan-countdown`)
2. Upload all files to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/water-plan-countdown.git
   git push -u origin main
   ```
3. Go to repository Settings → Pages
4. Under "Source", select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"
7. Your site will be available at: `https://YOUR_USERNAME.github.io/water-plan-countdown/`

### Option 2: Netlify (Drag & Drop)

1. Go to [netlify.com](https://www.netlify.com)
2. Sign up for a free account
3. Drag and drop the entire project folder onto Netlify
4. Your site will be live instantly with a random URL
5. You can customize the domain name in settings

### Option 3: Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up for a free account
3. Import your GitHub repository or upload the folder
4. Deploy with one click

## Local Testing

Simply open `index.html` in a web browser, or use a local server:

```bash
# Python 3
python3 -m http.server 8000

# Node.js (if you have http-server installed)
npx http-server

# Then open http://localhost:8000 in your browser
```

## Adding to iPad Home Screen

1. Open the website in Safari on your iPad
2. Tap the Share button
3. Select "Add to Home Screen"
4. The app will now appear as an icon on your home screen
5. It will open in fullscreen mode without browser chrome

## File Structure

```
/
├── index.html          # Main HTML file
├── styles.css          # All styling and animations
├── script.js           # Countdown logic and localStorage
└── README.md           # This file
```

## Browser Compatibility

- Safari (iOS/iPadOS) - Fully supported
- Chrome - Fully supported
- Firefox - Fully supported
- Edge - Fully supported

## Customization

### Change Countdown Days

Edit `script.js`:
```javascript
const COUNTDOWN_DAYS = 10; // Change to your desired number
```

### Change Emojis

Edit the `EMOJIS` array in `script.js`:
```javascript
const EMOJIS = ['🌱', '🌿', '🌳', '💧', '🌸', '🍃', '🌺', '🌻', '🪴', '🌾', '🌷', '🌼'];
```

### Change Update Frequency

Edit `UPDATE_INTERVAL` in `script.js`:
```javascript
const UPDATE_INTERVAL = 60000; // Milliseconds (60000 = 1 minute)
```

## License

Free to use and modify as needed.

