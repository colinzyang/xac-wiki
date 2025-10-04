# XJTLU iGEM Team 2025 - Design System Documentation

## Unified Color System

### Primary Colors
Based on the blue theme (#0078d7) from CLAUDE.md documentation:

```css
--color-primary: #004F94;        /* Primary blue - Brand color, important elements */
--color-primary-light: #00C0DE;  /* Light blue - Hover states, emphasis elements */
--color-primary-dark: #005a9e;   /* Dark blue - Link hover, dark variants */
```

### Neutral Colors
```css
--color-white: #ffffff;
--color-black: #000000;
--color-background: #ffffff;
--color-background-dark: #18191a;
```

### Text Colors
```css
--color-text: #222222;           /* Primary text color */
--color-text-secondary: #666666; /* Secondary text color */
--color-text-light: #999999;     /* Light text color */
--color-text-dark: #333333;      /* Dark text color */
```

### Dark Mode Text Colors
```css
--color-text-dark-mode: #eeeeee;
--color-text-secondary-dark-mode: #cccccc;
```

### Borders & Shadows
```css
--color-border: rgba(0, 120, 215, 0.2);
--color-border-light: rgba(0, 120, 215, 0.1);
--color-shadow: rgba(0, 0, 0, 0.1);
--color-shadow-dark: rgba(0, 0, 0, 0.3);
```

## Typography System

### Primary Font
Source Sans Pro font system recommended by CLAUDE.md:

```css
--font-primary: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
                'Helvetica Neue', Arial, sans-serif;
```

### Font Weight Usage Guidelines
- **Light (300)**: Descriptive text
- **Regular (400)**: Body content  
- **Medium (500)**: Navigation
- **SemiBold (600)**: Headings
- **Bold (700)**: Emphasis text

### Monospace Font
```css
--font-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 
             'Courier New', monospace;
```

## Completed Unification Work

### 1. Color Variable Unification
- ✅ Defined complete color variable system in `css/fonts.css`
- ✅ Removed duplicate color variable definitions from `css/style.css`
- ✅ Replaced major hardcoded color values with CSS variables
- ✅ Updated dark mode colors to use CSS variables

### 2. Typography System Unification
- ✅ Ensured all pages use Source Sans Pro as primary font
- ✅ Updated font declarations in homepage inline CSS
- ✅ Maintained consistent font weight usage

### 3. Layout System Unification
- ✅ Implemented temple reference design article layout pattern
- ✅ Preserved original glass-morphism navbar and design aesthetics
- ✅ Unified all subpage layout structures (excluding TEAM directory)

## Usage Guidelines

### Color Usage Standards
1. **Brand Color**: Use `var(--color-primary)` for logos, important buttons, brand elements
2. **Text Colors**: Use `var(--color-text)` for primary text, `var(--color-text-secondary)` for secondary text
3. **Interactive Colors**: Use `var(--color-primary-light)` for hover states
4. **Border Colors**: Use `var(--color-border)` for dividers and borders

### Typography Usage Standards
1. **Headings**: Use SemiBold (600) or Bold (700) weight
2. **Body Text**: Use Regular (400) weight
3. **Navigation**: Use Medium (500) weight
4. **Descriptive Text**: Use Light (300) weight

### Responsive Design
- All pages support mobile adaptation
- On small screen devices, sidebar table of contents moves below content
- Font sizes automatically adjust based on screen size

## File Structure

```
css/
├── fonts.css          # Font definitions and color variables
├── style.css          # Main stylesheet
└── glass-navbar.css   # Navigation bar styles

js/
├── main.js            # Main JavaScript functionality
└── article.js         # Article layout specific functionality

pages/
├── project/           # Project pages (unified layout)
├── drylab/           # Dry lab pages (unified layout)
├── wetlab/           # Wet lab pages (unified layout)
└── activities/       # Activities pages (unified layout)
```

## Maintenance Guidelines

1. **Adding New Colors**: Add new CSS variables in the `:root` section of `css/fonts.css`
2. **Modifying Brand Colors**: Simply modify `--color-primary` related variables for site-wide effect
3. **Adding New Pages**: Use existing pages as templates, maintain same HTML structure
4. **Font Updates**: Update `@font-face` declarations in `css/fonts.css`

---

*Last Updated: January 2025*
*XJTLU iGEM Team 2025 Design System Documentation*