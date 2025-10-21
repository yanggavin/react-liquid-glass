# React Liquid Glass - Demo Examples

This directory contains demo examples showcasing all the components in the React Liquid Glass library.

## Available Demos

### 1. Web Demo (`WebDemo.tsx`)
A comprehensive web-based demo that showcases all liquid glass components in a beautiful, interactive interface.

**Features:**
- Interactive examples of all components
- Beautiful glassmorphism design
- Responsive layout
- Live component interactions
- Dark theme with gradient background

**Components Demonstrated:**
- **Action Components**: Buttons, FAB, Icon Buttons, Segmented Buttons
- **Communication**: Badges, Progress Indicators, Snackbars
- **Selection**: Checkboxes, Switches, Chips
- **Text Input**: Glass-styled text fields
- **Lists**: Interactive lists with glass styling
- **Containers**: Cards, Panels, Modals
- **Menus**: Contextual menus with glass effects

### 2. React Native Demo (`ComprehensiveShowcase.tsx`)
A React Native version of the comprehensive showcase for mobile applications.

### 3. HTML Preview (`index.html`)
A standalone HTML file that provides a preview of the demo styling and can be opened directly in a browser.

## How to Use

### For React Web Applications

1. **Import the WebDemo component:**
```tsx
import WebDemo from './examples/WebDemo';
```

2. **Include the CSS styles:**
```tsx
import './examples/WebDemo.css';
```

3. **Render the demo:**
```tsx
function App() {
  return <WebDemo />;
}
```

### For Development Preview

1. **Open the HTML file directly:**
```bash
open examples/index.html
```

2. **Or serve it with a simple HTTP server:**
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000/examples/index.html`

## Building the Demo

To build and run the full interactive demo:

1. **Ensure all dependencies are installed:**
```bash
npm install
```

2. **Build the components:**
```bash
npm run build
```

3. **Set up your React application to use the WebDemo component**

4. **Import the necessary styles and components**

## Demo Features

### Interactive Elements
- **Buttons**: Multiple variants (primary, secondary, outline) with hover effects
- **Modals & Panels**: Overlay components with backdrop blur and animations
- **Form Controls**: Checkboxes, switches, and text inputs with glass styling
- **Lists**: Interactive list items with selection states
- **Progress**: Both circular and linear progress indicators
- **Notifications**: Snackbars with actions and different variants

### Visual Effects
- **Glassmorphism**: Beautiful glass-like transparency and blur effects
- **Responsive Design**: Adapts to different screen sizes
- **Smooth Animations**: Transitions and hover effects throughout
- **Gradient Backgrounds**: Beautiful gradient overlays
- **Modern Typography**: Clean, readable text styling

### Theming
The demo showcases the components with a dark theme featuring:
- Purple gradient background
- Glass transparency effects
- White text with proper contrast
- Subtle borders and shadows
- Consistent spacing and typography

## Customization

You can customize the demo by:

1. **Modifying the CSS variables** in `WebDemo.css`
2. **Changing the background gradient** in the `.web-demo` class
3. **Adjusting component configurations** in `WebDemo.tsx`
4. **Adding your own components** to the showcase

## Browser Support

The demo uses modern CSS features including:
- `backdrop-filter` for blur effects
- CSS Grid for layouts
- Flexbox for component alignment
- CSS custom properties (variables)

For best results, use modern browsers that support these features:
- Chrome 76+
- Firefox 103+
- Safari 9+
- Edge 79+

## File Structure

```
examples/
├── WebDemo.tsx           # Main web demo component
├── WebDemo.css          # Styles for web demo
├── index.html           # Standalone HTML preview
├── README.md            # This file
├── ComprehensiveShowcase.tsx  # React Native demo
├── BasicExample.tsx     # Simple usage examples
├── ThemeExample.tsx     # Theming examples
└── index.ts             # Example exports
```