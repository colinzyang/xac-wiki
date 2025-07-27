# 字体文件说明

## Source Sans Pro

这个文件夹应该包含以下字体文件：

### 推荐下载的字重：
- `SourceSansPro-Light.woff2` / `.woff` (300)
- `SourceSansPro-Regular.woff2` / `.woff` (400) 
- `SourceSansPro-Medium.woff2` / `.woff` (500)
- `SourceSansPro-SemiBold.woff2` / `.woff` (600)
- `SourceSansPro-Bold.woff2` / `.woff` (700)

### 下载来源：
1. **Google Fonts**: https://fonts.google.com/specimen/Source+Sans+Pro
2. **Adobe Fonts**: https://fonts.adobe.com/fonts/source-sans
3. **GitHub**: https://github.com/adobe-fonts/source-sans-pro

### 使用说明：
1. 下载 WOFF2 和 WOFF 格式文件（最佳兼容性）
2. 将字体文件放入此文件夹
3. 字体已在 `css/fonts.css` 中预配置
4. 在 HTML 中引入 `fonts.css` 即可使用

### 字重使用建议：
- **Light (300)**: 副标题、描述文本
- **Regular (400)**: 正文内容
- **Medium (500)**: 导航栏、按钮
- **SemiBold (600)**: 页面标题
- **Bold (700)**: 强调文本

### 性能优化：
- 使用 `font-display: swap` 确保文本快速显示
- WOFF2 格式优先，WOFF 作为备用
- 包含系统字体备用方案