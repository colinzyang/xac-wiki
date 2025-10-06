# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Flask-based website for the XJTLU iGEM Team 2025 that uses Jinja2 template inheritance. The site is built to be frozen into static files for deployment using Frozen-Flask. It combines dynamic Flask templating with static file generation for optimal performance and deployment.

## Development Commands

**Local development**:
- `python app.py` - Run Flask development server on port 8080
- `flask serve` - Alternative development server using Frozen-Flask
- `pip install -r dependencies.txt` - Install Python dependencies

**Build and deployment**:
- `FLASK_APP=app.py flask freeze` - Generate static files to `/public` directory
- GitLab CI automatically builds and deploys on main branch

**Dependencies**:
- Python 3.6+ required
- Flask and Frozen-Flask (see `dependencies.txt`)

## Architecture & Structure

### Flask Template System
The site uses Flask with Jinja2 template inheritance:
- **Flask app**: `app.py` - Main application with routes and Frozen-Flask configuration
- **Template directory**: `/wiki/` (configured in Flask app)
- **Base template**: `wiki/layout.html` - Main layout with CSS/JS includes
- **Template inheritance**: Uses `{% extends %}`, `{% include %}`, and `{% block %}` patterns

### Component Templates
- **Base layout**: `layout.html` - Main HTML structure, CSS imports, and JavaScript includes
- **Shared components**: 
  - `menu.html` - Responsive navigation menu (included in layout)
  - `footer.html` - Site footer (included in layout)
- **Page templates**: All in `/wiki/pages/` directory, extend base layout

### Route System
- **Home route**: `/` → `pages/home.html`
- **Dynamic routes**: `/<page>` → `pages/<page>.html` (case-insensitive)
- **Static files**: Served from `/static/` directory via Flask
- **Frozen output**: Generated to `/public/` directory for deployment

### Frontend JavaScript System
- **Main functionality**: `static/main.js` - Core site functionality and navigation
- **Article system**: `static/article.js` - Article-specific features and sidebar navigation
- **Navigation behavior**: Responsive menu with scroll animations and dark mode toggle
- **Component loading**: JavaScript-based dynamic content loading for enhanced UX

### Dark Mode Implementation
- **Toggle mechanism**: Managed by `initDarkMode()` in `static/main.js`
- **Persistence**: Uses localStorage to remember user preference
- **Theme switching**: CSS classes and asset swapping (logos, icons)
- **Accessibility**: Proper alt text and ARIA labels for mode indicators

### Page Structure
```
/wiki/pages/ (flat structure)
├── home.html (Main homepage)
├── members.html (Team Members)
├── attributions.html (Team Attributions)
├── description.html (Project Description)
├── engineering.html (Project Engineering) 
├── contribution.html (Project Contribution)
├── safety.html (Project Safety)
├── model.html (Model Overview)
├── database.html (Model Database)
├── predictor.html (Model Predictor)
├── webapp.html (Model Webapp)
├── wetlab-design.html (Wetlab Overview)
├── protocol.html (Wetlab Protocol)
├── notebook.html (Wetlab Notebook)
├── human-practices.html (Activities Human Practices)
├── education.html (Activities Education)
└── sustainability.html (Activities Sustainability)
```

### Styling System
- **Main styles**: `static/style.css` - Base typography, layout, dark mode, responsive design
- **Navigation styles**: `static/glass-menu.css` - Glass-morphism menu styling with shrink animation
- **Article styles**: `static/article.css` - Styling for content pages with sidebar navigation
- **Font definitions**: `static/fonts.css` - Font declarations and unified CSS variable system
- **Responsive design**: Mobile-first approach with breakpoints at 768px and 480px
- **Color scheme**: Consistent blue theme (#004F94 primary) with CSS variables for unified colors
- **Component styling**: Feature cards, page headers, and hero sections with glass-morphism effects

### Asset Organization
```
/static/assets/
├── fonts/ (Web fonts - Source Sans Pro recommended)
├── icons/ (UI icons for dark mode toggle)
├── images/ (Content images)
└── logos/ (Brand assets with light/dark variants)
```

### Typography System
- **Primary Font**: Source Sans Pro (科学学术网站的理想选择)
- **Font Loading**: `static/fonts.css` with @font-face declarations and CSS variables
- **CSS Variable**: `--font-primary` for consistent font family usage
- **Weight Usage**: 
  - Light (300): 描述文本
  - Regular (400): 正文内容  
  - Medium (500): 导航栏
  - SemiBold (600): 标题
  - Bold (700): 强调文本
- **Performance**: font-display: swap for fast text rendering
- **Unified Color System**: All colors defined as CSS variables in `static/fonts.css`

## Key Implementation Details

### Template Development Pattern
- **New pages**: Create in `/wiki/pages/` directory following existing naming conventions
- **Template inheritance**: All pages should extend `layout.html` base template
- **Block structure**: Use `{% block title %}`, `{% block page_content %}` for content areas
- **Static file references**: Use `{{ url_for('static', filename='...') }}` for assets

### GitLab CI/CD Pipeline
- **Build process**: Automated on main branch commits using Python 3.6 Docker image
- **Freeze command**: `FLASK_APP=app.py flask freeze` generates static site
- **Output**: Static files deployed to GitLab Pages from `/public` directory
- **Dependencies**: Installed from `dependencies.txt` during build

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