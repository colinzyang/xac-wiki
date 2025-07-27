# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static HTML website for the XJTLU iGEM Team 2025. The site is built using vanilla HTML, CSS, and JavaScript without any build system or package manager. It's a multi-page website with a modular component architecture.

## Development Commands

Since this is a static website with no build system:
- **Local development**: Use a local HTTP server like `python -m http.server` or Live Server extension
- **No build process**: Files are served directly as static assets
- **No package manager**: No npm, yarn, or other dependency management

## Architecture & Structure

### Component System
The site uses a modular HTML component system loaded via JavaScript:
- **Components location**: `/components/` directory
- **Loading mechanism**: `loadComponent()` function in `js/main.js:1-11`
- **Main components**: 
  - `navbar.html` - Unified responsive navigation bar with shrink animation
  - `footer.html` - Site footer with contact info and nav links

### Navigation System
- **Single navbar system**: Navbar transforms with CSS classes on scroll (60px threshold)
- **Scroll animation**: Managed in `js/main.js:initScrollNavbar()`
- **Responsive dropdowns**: Mobile/touch-friendly dropdowns with click handling
- **Dark mode integration**: Logo and icon switching based on theme

### Dark Mode Implementation
- **Toggle mechanism**: Managed by `initDarkMode()` in `js/main.js`
- **Persistence**: Uses localStorage to remember user preference
- **Theme switching**: CSS classes and asset swapping (logos, icons)
- **Accessibility**: Proper alt text and ARIA labels for mode indicators

### Page Structure
```
/pages/
├── team/ (Members, Attributions)
├── project/ (Description, Design, Engineering, Safety)  
├── drylab/ (Design, Database, Model, Webapp)
├── wetlab/ (Design, Protocol, Notebook, Result)
└── activities/ (Human Practices, Education, Community, Sustainable)
```

### Styling System
- **Main styles**: `css/style.css` - Base typography, layout, dark mode, responsive design
- **Navigation styles**: `css/glass-navbar.css` - Glass-morphism navbar styling with shrink animation
- **Responsive design**: Mobile-first approach with breakpoints at 768px and 480px
- **Color scheme**: Consistent blue theme (#0078d7) with dark mode variants
- **Component styling**: Feature cards, page headers, and hero sections with glass-morphism effects

### Asset Organization
```
/assets/
├── fonts/ (Web fonts - Source Sans Pro recommended)
├── icons/ (UI icons for dark mode toggle)
├── images/ (Content images)
└── logos/ (Brand assets with light/dark variants)
```

### Typography System
- **Primary Font**: Source Sans Pro (科学学术网站的理想选择)
- **Font Loading**: `css/fonts.css` with @font-face declarations
- **Weight Usage**: 
  - Light (300): 描述文本
  - Regular (400): 正文内容  
  - Medium (500): 导航栏
  - SemiBold (600): 标题
  - Bold (700): 强调文本
- **Performance**: font-display: swap for fast text rendering

## Key Implementation Details

### Component Loading Pattern
Components are loaded asynchronously with error handling and proper initialization sequence. All initialization happens in `js/main.js` after DOM content is loaded.

### Mobile Considerations  
- Responsive grid layouts that stack vertically on mobile devices
- Touch-friendly dropdown menus with click-to-open behavior  
- Optimized padding and spacing for small screens
- Proper viewport meta tag for mobile rendering

### Language Support
The site uses Chinese (zh-CN) as the primary language with semantic HTML structure and proper UTF-8 encoding.

### Performance Optimizations
- Single unified JavaScript file reduces HTTP requests
- Consolidated CSS with optimized selectors
- Efficient component loading with error handling
- Minimal DOM manipulations and event delegation