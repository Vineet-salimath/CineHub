# CineHub Frontend

Modern React + Vite application with glassmorphic design, featuring Netflix-style movie interface and secure authentication.

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Environment Setup

Create `.env` file with:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### Development Server

```bash
npm run dev
```

App runs on `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🎨 Features

- **Glassmorphic Design** - Modern frosted glass UI effect
- **Smooth Animations** - CSS transitions and keyframe animations
- **Responsive Layout** - Mobile-first design approach
- **Dark Theme** - Cinema-grade dark theme with custom colors
- **Movie Integration** - Horizontal scrolling movie sections
- **Modal Preview** - Click movies to see detailed information
- **Session Management** - JWT token storage in localStorage
- **Real-time UI** - Instant feedback on user actions

## 📱 Pages & Components

### Pages

**AuthPage** - Glassmorphic login/registration interface
- Split layout (illustration + form)
- Toggle between login and register
- Form validation
- Error handling
- Auto-login on success

**HomePage** - Netflix-style movie landing page
- Sticky navigation bar
- Hero banner with trending movie
- Multiple movie rows (Trending, Popular, Top Rated)
- Category navigation
- Logout functionality

### Components

**Navbar**
- Logo and navigation menu
- User info display
- Logout button
- Active category indicator

**MovieHero**
- Full-width banner with backdrop image
- Movie title and description
- Rating and release year
- Play and More Info buttons
- Slide animation on load

**MovieRow**
- Horizontal scrolling movie cards
- 200x300px movie posters
- Title and rating on hover
- Smooth transitions
- Responsive sizing

**MovieModal**
- Centered modal overlay
- Movie backdrop image
- Title, rating, release date
- Description and Watch button
- Close button
- Click-outside to close

## 🎬 Application Flow

```
App
├── Not Authenticated
│   └── AuthPage
│       ├── Register Tab
│       └── Login Tab
│
└── Authenticated
    └── HomePage
        ├── Navbar (with logout)
        └── Content
            ├── MovieHero
            ├── MovieRow (Trending)
            ├── MovieRow (Popular)
            ├── MovieRow (Top Rated)
            └── MovieModal (on click)
```

## 🔐 Authentication Flow

1. User opens app
2. Check localStorage for `authToken`
3. If no token → Show AuthPage
4. User registers/logs in
5. Receive JWT token from backend
6. Store token + user data in localStorage
7. Update app state → Show HomePage
8. All API requests include token in Authorization header
9. Logout → Clear localStorage → Show AuthPage

## 📊 CSS Structure

```
styles/
├── global.css       # Variables, base styles, utilities
├── auth.css         # Auth page specific styles (glassmorphism)
├── navbar.css       # Navigation bar styles
├── hero.css         # Hero banner styles
├── home.css         # Home page layout
├── movie-row.css    # Movie card and row styles
└── modal.css        # Modal dialog styles
```

## 🎨 Design System

### Colors
```css
--bg-dark: #0f0f1e       /* Primary background */
--bg-darker: #0a0a14     /* Darker background */
--glass-light: rgba(255, 255, 255, 0.1)
--glass-border: rgba(255, 255, 255, 0.2)
--text-primary: #ffffff
--text-secondary: #b0b0b0
--accent: #e50914        /* Netflix red */
--accent-light: #f5383e
```

### Typography
- Font: Poppins (Google Fonts)
- Weights: 400, 500, 600, 700
- Sizes: 12px - 56px

### Effects
- Glassmorphism with backdrop-filter
- Smooth transitions (0.3s ease)
- Button hover animations
- Card lift effect on hover
- Modal/page entrance animations

## 🔧 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── MovieHero.jsx
│   │   ├── MovieRow.jsx
│   │   └── MovieModal.jsx
│   ├── pages/
│   │   ├── AuthPage.jsx
│   │   └── HomePage.jsx
│   ├── styles/
│   │   ├── global.css
│   │   ├── auth.css
│   │   ├── navbar.css
│   │   ├── hero.css
│   │   ├── home.css
│   │   ├── movie-row.css
│   │   └── modal.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── .env
├── package.json
└── README.md
```

## 📦 Dependencies

- **react** (18.2.0) - UI library
- **react-dom** (18.2.0) - React DOM
- **axios** (1.6.2) - HTTP client
- **@vitejs/plugin-react** (4.0.0) - React plugin for Vite
- **vite** (4.4.5) - Build tool

## 🌐 API Integration

### Axios Client
```javascript
axios.post(import.meta.env.VITE_API_BASE_URL + '/auth/login', data)
```

### Movie Data
- Source: TMDB API (placeholder implementation)
- Fallback: Mock data if API unavailable
- Images: TMDB image CDN (https://image.tmdb.org/t/p/)

## 📱 Responsive Breakpoints

```css
/* Desktop: Full layout */
/* Mobile (max-width: 768px) */
- Stack layout
- Adjusted font sizes
- Single-column navigation
- Smaller modal
```

## 🎯 Form Validation

**Register Form:**
- All fields required
- Email format validation
- Password >= 6 characters
- Confirm password match
- Username uniqueness check

**Login Form:**
- Username/UserID required
- Password required
- Backend validation response

## 🚀 Performance Optimizations

- Code splitting with dynamic imports
- Lazy loading with React hooks
- CSS animations use GPU (transform, opacity)
- Image optimization with TMDB CDN
- Minimal re-renders with useCallback

## 🧪 Development Tips

### Hot Module Replacement
```bash
npm run dev
# Auto-refresh on file changes
```

### Environment Variables
```javascript
// Access in components
import.meta.env.VITE_API_BASE_URL
```

### Debugging
- React DevTools browser extension
- Network tab for API calls
- Console for error logging

## 🚀 Building for Production

```bash
# Create optimized build
npm run build

# Output in dist/ folder
# Ready for static hosting (Netlify, Vercel, etc.)
```

## 📋 Checklist for Production

- [ ] Update VITE_API_BASE_URL to production backend
- [ ] Enable HTTPS
- [ ] Configure CORS on backend
- [ ] Add analytics
- [ ] Set up error reporting
- [ ] Optimize images
- [ ] Test on multiple devices
- [ ] Implement service worker for PWA
- [ ] Add meta tags for SEO

---

**CineHub Frontend** - Modern, responsive, glass-morphic cinema experience
