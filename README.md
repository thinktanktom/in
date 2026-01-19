# Thomas Cyriac - Portfolio Website

A modern, interactive portfolio website showcasing Thomas Cyriac's work as a Senior Product Architect and Blockchain Developer.

## 🎯 Features

- **Animated Hero Section** with full name "THOMAS CYRIAC" prominently displayed
- **3D Project Carousel** featuring BankX Protocol, CtrlBit, and Nord Finance
- **Blog Section** highlighting technical articles and projects
- **Skills Visualization** with animated progress bars
- **Custom Cursor** and particle background effects
- **Fully Responsive** design for all devices
- **Dark Theme** with neon accents

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:5173` to see your portfolio.

### Build

```bash
# Build for production
npm run build
```

The built files will be in the `dist/` folder.

### Deploy to GitHub Pages

1. Make sure you have a GitHub repository set up
2. Update the `base` path in `vite.config.js` to match your repo name:
   ```js
   base: '/your-repo-name/'
   ```
3. Build and deploy:
   ```bash
   npm run build
   npm run deploy
   ```

Your site will be live at `https://yourusername.github.io/your-repo-name/`

## 📝 Customization

### Update Personal Information

The main component is located at `src/components/ThomasPortfolio.jsx`. Update the following sections:

#### Projects Data (line ~250)
```jsx
const projects = [
  {
    name: 'Your Project',
    role: 'Your Role',
    period: 'Time Period',
    description: 'Description...',
    tech: ['Tech1', 'Tech2'],
    color: '#00ff88'
  }
];
```

#### Blog Posts (line ~275)
```jsx
const blogs = [
  {
    title: 'Your Article Title',
    excerpt: 'Brief description...',
    date: '2024',
    category: 'Category',
    color: '#00ff88',
    link: 'https://your-link.com'
  }
];
```

#### Skills (line ~310)
```jsx
const skills = [
  { name: 'Skill Name', level: 95 }
];
```

### Update Contact Links

Search for:
- LinkedIn URL: `https://www.linkedin.com/in/thomas-c-7a8ba3184/`
- Upwork URL: `https://www.upwork.com/freelancers/~018a1dbf1094588c7e`
- GitHub URL: `https://github.com/thinktanktom`
- Email: `thinktanktom@proton.me`

Replace with your own links.

### Color Scheme

The portfolio uses three accent colors:
- Primary: `#00ff88` (green)
- Secondary: `#00d4ff` (blue)
- Accent: `#ff0066` (pink)

You can update these throughout the component file.

## 🎨 Design Elements

- **Logo**: "T.C" monogram in navigation and footer (intentional branding)
- **Hero Name**: Full name "THOMAS CYRIAC" with animated reveal
- **Custom Cursor**: Interactive cursor that follows mouse movement
- **Particle Grid**: Animated background with connecting particles
- **3D Carousel**: Rotating project showcase
- **Scroll Animations**: Smooth reveals as you scroll

## 📦 Technologies Used

- **React** - UI framework
- **Vite** - Build tool
- **Canvas API** - Particle animations
- **CSS Animations** - Custom animations and transitions
- **Google Fonts** - Outfit & Space Mono fonts

## 🔧 Project Structure

```
thomas-portfolio/
├── src/
│   ├── components/
│   │   └── ThomasPortfolio.jsx    # Main portfolio component
│   ├── App.jsx                     # App wrapper
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles
├── index.html                      # HTML template
├── vite.config.js                  # Vite configuration
└── package.json                    # Dependencies
```

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## 📄 License

All rights reserved © 2025 Thomas Cyriac

---

**Note**: The "T.C" logo is an intentional design choice for brand identity. The full name "THOMAS CYRIAC" is prominently displayed in the hero section with an animated reveal effect.

For any questions or issues, please reach out through the contact links on the portfolio.
