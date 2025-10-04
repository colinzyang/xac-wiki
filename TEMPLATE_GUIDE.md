# 文章页面模板使用指南

基于DATABASE页面设计的标准化文章模板，包含完整的导航、响应式设计和交互功能。

## 快速开始

1. 复制 `template-article.html` 文件
2. 替换以下占位符：
   - `[PAGE_TITLE]` - 页面标题
   - `[PAGE_CLASS]` - 页面CSS类名（如 description, design, protocol 等）
   - `[PAGE_DESCRIPTION]` - 页面描述

## 模板结构

### 1. 页面头部
```html
<body class="article-page [PAGE_CLASS]-page">
```
- `[PAGE_CLASS]` 用于特定页面的CSS样式

### 2. 文章头部
```html
<header class="article-header">
  <div class="container">
    <h1>[PAGE_TITLE]</h1>
    <p>[PAGE_DESCRIPTION]</p>
  </div>
</header>
```

### 3. 侧边栏导航
- 支持多级目录结构
- 自动展开/折叠动画
- 智能激活检测

### 4. 主要内容
- 标准化标题层次（h2, h3, h4, h5）
- 所有标题必须有 `id` 属性
- 支持特殊组件（徽章、图片画廊等）

## 添加背景图片

在 `css/style.css` 中添加：

```css
/* [PAGE_CLASS] Page Specific Styles */
.[PAGE_CLASS]-page .article-header {
  background-image: url('/assets/images/Background/[IMAGE_NAME].png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.[PAGE_CLASS]-page .article-header .container {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  padding: 40px;
  margin: 0 auto;
  max-width: 800px;
}

body.dark-mode .[PAGE_CLASS]-page .article-header .container {
  background: rgba(26, 26, 26, 0.9);
}
```

## 特殊组件

### GitHub徽章
```html
<h3 id="project-repo">Project Repository <a href="https://github.com/username/repo"><img src="https://img.shields.io/badge/GitHub-RepoName-black?logo=github" alt="GitHub Repo" style="margin-left: 8px; vertical-align: middle;"></a></h3>
```

### 图片画廊
```html
<div class="structure-gallery">
  <div class="structure-item">
    <img src="/assets/images/example1.png" alt="Example 1" class="structure-image">
    <p class="structure-id">Example 1</p>
  </div>
  <div class="structure-item">
    <img src="/assets/images/example2.png" alt="Example 2" class="structure-image">
    <p class="structure-id">Example 2</p>
  </div>
</div>
```

## 侧边栏结构

### 简单章节
```html
<li><a href="#section-id">1. Section Title</a></li>
```

### 带子章节
```html
<li><a href="#section-id">2. Section Title</a>
  <ul class="sub-catalog">
    <li><a href="#subsection-id" class="sub-heading">2.1 Subsection Title</a></li>
    <li><a href="#subsection-id-2" class="sub-heading">2.2 Subsection Title</a></li>
  </ul>
</li>
```

## 内容标题规范

### 主标题 (h2)
```html
<h2 id="section-id">1. Section Title</h2>
```

### 子标题 (h3)
```html
<h3 id="subsection-id">1.1 Subsection Title</h3>
```

### 更深层级 (h4, h5)
```html
<h4 id="subsubsection-id">1.1.1 Sub-subsection Title</h4>
```

## 功能特性

✅ **响应式设计** - 移动端自动适配  
✅ **智能导航** - 子章节展开/折叠  
✅ **滚动激活** - 实时高亮当前章节  
✅ **平滑滚动** - 点击导航平滑跳转  
✅ **暗色模式** - 完整主题支持  
✅ **短段落优化** - 智能检测范围扩展  
✅ **返回顶部** - 固定位置工具按钮  

## 已应用页面示例

- `pages/drylab/database.html` - DATABASE页面（原版）
- `pages/project/description.html` - Project Description页面（已改造）

## 下一步应用建议

推荐按以下优先级应用模板：

1. **项目页面**：
   - `pages/project/design.html`
   - `pages/project/engineering.html`
   - `pages/project/safety.html`

2. **实验页面**：
   - `pages/wetlab/protocol.html`
   - `pages/wetlab/notebook.html`
   - `pages/wetlab/result.html`

3. **分析页面**：
   - `pages/drylab/design.html`
   - `pages/drylab/model.html`
   - `pages/drylab/webapp.html`

4. **活动页面**：
   - `pages/activities/human-practices.html`
   - `pages/activities/education.html`
   - `pages/activities/community.html`
   - `pages/activities/sustainable.html`

每个页面建议使用对应的背景图片和合适的页面类名。