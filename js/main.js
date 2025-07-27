function loadComponent(id, url, callback) {
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`Failed to load ${url}`);
      return res.text();
    })
    .then(html => {
      const container = document.getElementById(id);
      if (container) {
        container.innerHTML = html;
        if (typeof callback === 'function') callback();
      }
    })
    .catch(err => console.error('Component loading error:', err));
}

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const navList = navbar.querySelector('.nav-list');
  if (!navList) return;

  navList.querySelectorAll('li').forEach(li => {
    const dropdown = li.querySelector('.dropdown');
    const link = li.querySelector('a');
    
    if (dropdown && link) {
      link.addEventListener('click', function(e) {
        if (window.innerWidth < 900 || 'ontouchstart' in window) {
          e.preventDefault();
          
          navList.querySelectorAll('.dropdown').forEach(d => {
            if (d !== dropdown) d.style.display = 'none';
          });
          
          dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }
      });
    }
  });

  document.addEventListener('click', function(e) {
    if (!navList.contains(e.target)) {
      navList.querySelectorAll('.dropdown').forEach(d => d.style.display = 'none');
    }
  });
}

function initScrollNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let isScrolled = false;
  let ticking = false;
  const shrinkThreshold = 80;
  const expandThreshold = 60; // 添加差异阈值防止抖动
  let lastScrollY = window.scrollY;
  
  function updateNavbar() {
    const scrollY = window.scrollY;
    const scrollDirection = scrollY > lastScrollY ? 'down' : 'up';
    
    // 计算滚动进度百分比
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollHeight = documentHeight - windowHeight;
    const scrollProgress = scrollHeight > 0 ? Math.min((scrollY / scrollHeight) * 100, 100) : 0;
    
    // 更新进度条CSS变量
    navbar.style.setProperty('--scroll-progress', `${scrollProgress}%`);
    
    // 向下滚动时使用较高阈值，向上滚动时使用较低阈值
    const threshold = scrollDirection === 'down' ? shrinkThreshold : expandThreshold;
    const shouldShrink = scrollY > threshold;
    
    if (shouldShrink && !isScrolled) {
      navbar.classList.add('shrink');
      isScrolled = true;
    } else if (!shouldShrink && isScrolled) {
      navbar.classList.remove('shrink');  
      isScrolled = false;
    }
    
    lastScrollY = scrollY;
    ticking = false;
  }
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }
  
  // 添加节流处理
  let scrollTimeout;
  function handleScroll() {
    requestTick();
    
    // 清除之前的timeout
    clearTimeout(scrollTimeout);
    
    // 设置新的timeout来处理滚动结束
    scrollTimeout = setTimeout(() => {
      navbar.style.willChange = 'auto';
    }, 200);
    
    // 开始滚动时启用硬件加速
    navbar.style.willChange = 'transform, width, height, border-radius';
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true });
}

function initDarkMode() {
  const toggleButtons = document.querySelectorAll('.dark-mode-toggle');
  
  function updateDarkMode(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    localStorage.setItem('darkMode', isDark ? '1' : '0');
    
    // 更新导航栏logo
    document.querySelectorAll('.navbar-fab-logo').forEach(img => {
      img.src = isDark ? '/assets/logos/logo-white.png' : '/assets/logos/logo-blue.png';
    });
    
    // 更新导航栏切换按钮图标
    toggleButtons.forEach(btn => {
      const icon = btn.querySelector('img');
      if (icon) {
        icon.src = isDark ? '/assets/icons/moon2.svg' : '/assets/icons/sun.svg';
        icon.alt = isDark ? 'Dark Mode' : 'Light Mode';
      }
    });
    
    // 更新Footer logo
    document.querySelectorAll('.footer-logo-adaptive').forEach(img => {
      img.src = isDark ? '/assets/logos/logo-n-white.png' : '/assets/logos/logo-n-blue.png';
    });
    
    // 更新Bluesky图标
    document.querySelectorAll('.footer-bsky-icon').forEach(img => {
      img.src = isDark ? '/assets/logos/bsky-g.svg' : '/assets/logos/bsky.svg';
    });
    
    // 更新iGEM图标
    document.querySelectorAll('.footer-igem-icon').forEach(img => {
      img.src = isDark ? '/assets/logos/Igem-logo-fullcolorwhite@1x.png' : '/assets/logos/Igem-logo-fullcolorblack@1x.png';
    });
  }

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = !document.body.classList.contains('dark-mode');
      updateDarkMode(isDark);
    });
  });

  const savedMode = localStorage.getItem('darkMode') === '1';
  updateDarkMode(savedMode);
}

document.addEventListener('DOMContentLoaded', function() {
  loadComponent('navbar-container', '/components/navbar.html', function() {
    initNavbar();
    initScrollNavbar();
    initDarkMode();
  });
  
  loadComponent('footer', '/components/footer.html');
});