# Font Files Guide

## Source Sans Pro

This folder should contain the following font files:

### Recommended Font Weights:
- `SourceSansPro-Light.woff2` / `.woff` (300)
- `SourceSansPro-Regular.woff2` / `.woff` (400) 
- `SourceSansPro-Medium.woff2` / `.woff` (500)
- `SourceSansPro-SemiBold.woff2` / `.woff` (600)
- `SourceSansPro-Bold.woff2` / `.woff` (700)

### Download Sources:
1. **Google Fonts**: https://fonts.google.com/specimen/Source+Sans+Pro
2. **Adobe Fonts**: https://fonts.adobe.com/fonts/source-sans
3. **GitHub**: https://github.com/adobe-fonts/source-sans-pro

### Usage Instructions:
1. Download WOFF2 and WOFF format files (best compatibility)
2. Place font files in this folder
3. Fonts are pre-configured in `css/fonts.css`
4. Include `fonts.css` in HTML to use

### Font Weight Usage Guidelines:
- **Light (300)**: Subtitles, descriptive text
- **Regular (400)**: Body content
- **Medium (500)**: Navigation, buttons
- **SemiBold (600)**: Page headings
- **Bold (700)**: Emphasis text

### Performance Optimization:
- Use `font-display: swap` for fast text rendering
- WOFF2 format priority, WOFF as fallback
- Include system font fallback options