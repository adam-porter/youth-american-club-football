# Template Hudl Navigation

A navigation component project built with React and the shared Uniform design system styles.

## Setup

This project uses the [shared-uniform-styles](https://github.com/adam-porter/shared-uniform-styles) package for consistent design tokens and styling.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Preview production build:
   ```bash
   npm run preview
   ```

## Project Structure

```
template-hudl-navigation/
├── src/
│   ├── components/
│   │   └── Navigation.jsx    # Main navigation component with expanded/collapsed/mobile states
│   ├── App.jsx               # Root app component
│   ├── App.css              # App-specific styles
│   └── main.jsx             # Entry point with Uniform styles imports
├── index.html               # HTML template
├── vite.config.js          # Vite configuration
└── package.json            # Dependencies and scripts
```

## Navigation Component

The Navigation component implements a responsive sidebar navigation with three states:

### Features

1. **Expanded State** (200px width)
   - Full logo with "Hudl" text
   - Workspace switcher with organization info
   - Navigation items with icons and labels
   - User settings with name and avatar
   - Expand/collapse toggle button

2. **Collapsed State** (56px width)
   - Icon-only logo
   - Icon-only navigation items
   - Compact workspace switcher and user settings
   - Expand/collapse toggle button

3. **Mobile State**
   - Horizontal scrolling navigation bar
   - Icon-only items
   - Responsive layout for small screens

### Navigation Items

**Top Navigation:**
- Home (active state shown)
- Programs
- Tickets (with accordion indicator)
- Finances
- Teams
- Members
- Settings

**Bottom Navigation:**
- Calendar
- Messages
- Notifications

### Interactive Features

- Click navigation items to set active state
- Toggle between expanded/collapsed states
- Responsive design adapts to mobile screens
- Smooth transitions and animations

## Using Uniform Styles

The project imports Uniform styles in the correct order in `src/main.jsx`:

1. `uniform-design-tokens.css` - CSS custom properties (design tokens)
2. `index.css` - Global reset and utility classes
3. `uniform-design-system.css` - Uniform Web Storybook component styles

Components use CSS-in-JS with design tokens:

```jsx
const MyComponent = () => {
  return (
    <>
      <style>
        {`
          .my-component {
            padding: var(--u-space-one, 16px);
            color: var(--u-color-base-foreground, #36485c);
          }
        `}
      </style>
      <div className="my-component">Content</div>
    </>
  )
}
```

## Design Tokens

Access Uniform design tokens via CSS custom properties:

- **Colors**: `--u-color-primary`, `--u-color-base-foreground`, etc.
- **Spacing**: `--u-space-one`, `--u-space-two`, etc.
- **Typography**: `--u-font-body`, `--u-font-size-default`, etc.
- **Border Radius**: `--u-border-radius-small`, `--u-border-radius-medium`, etc.

See the [shared-uniform-styles README](https://github.com/adam-porter/shared-uniform-styles) for a complete list of available tokens.

## License

ISC

