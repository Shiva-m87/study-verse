# StudyFlow - Smart Study Planner 📚✨

A beautiful, feature-rich study planner built with React and Vite.

## Features

- 📊 Dashboard with statistics and insights
- 📚 Subject management with color coding
- ✅ Task tracking with filters and deadlines
- 📅 Weekly schedule planner
- 📈 Analytics and performance metrics
- 🌙 Dark mode support
- 💾 Local storage persistence

## Quick Start

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open http://localhost:5173 in your browser

### Build for Production

```bash
npm run build
```

## Deploy to Vercel (Recommended - Easiest)

### Option 1: Using Vercel CLI
1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts and your app will be live!

### Option 2: Using Vercel Dashboard
1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "Import Project"
4. Select your repository
5. Click "Deploy" - Vercel will auto-detect Vite!

## Deploy to Netlify

### Option 1: Drag & Drop
1. Run `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the `dist` folder to deploy

### Option 2: Using Netlify CLI
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### Option 3: Connect GitHub
1. Push code to GitHub
2. Go to https://app.netlify.com
3. Click "Add new site" → "Import an existing project"
4. Connect your repository
5. Build command: `npm run build`
6. Publish directory: `dist`

## Deploy to GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
},
"homepage": "https://yourusername.github.io/study-planner-app"
```

3. Update vite.config.js:
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/study-planner-app/'
})
```

4. Deploy:
```bash
npm run deploy
```

## Tech Stack

- ⚛️ React 18
- ⚡ Vite
- 🎨 Custom CSS with animations
- 🎯 Lucide React icons
- 💾 LocalStorage for data persistence

## License

MIT
