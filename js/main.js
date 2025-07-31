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
      // 支持点击和键盘导航
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 || 'ontouchstart' in window) {
          e.preventDefault();
          toggleDropdown(dropdown, navList);
        }
      });
      
      // 键盘导航支持
      link.addEventListener('keydown', function(e) {
        if (window.innerWidth <= 768 || 'ontouchstart' in window) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDropdown(dropdown, navList);
          }
        }
      });
    }
  });

  // 改进的外部点击处理
  document.addEventListener('click', function(e) {
    // 确保navbar存在且已加载
    if (navList && !navList.contains(e.target)) {
      closeAllDropdowns(navList);
    }
  });
  
  // ESC键关闭下拉菜单
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeAllDropdowns(navList);
    }
  });
}

function toggleDropdown(targetDropdown, navList) {
  const isOpen = targetDropdown.classList.contains('dropdown-active');
  
  // 关闭所有其他下拉菜单
  closeAllDropdowns(navList);
  
  // 切换目标下拉菜单
  if (!isOpen) {
    targetDropdown.classList.add('dropdown-active');
  }
}

function closeAllDropdowns(navList) {
  if (navList) {
    navList.querySelectorAll('.dropdown').forEach(d => {
      d.classList.remove('dropdown-active');
    });
  }
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
  
  // 返回updateDarkMode函数，供外部调用
  return updateDarkMode;
}

function initParallax() {
  const teamPhoto = document.querySelector('.team-photo');
  const teamPhotoHero = document.querySelector('.team-photo-hero');
  if (!teamPhoto || !teamPhotoHero) return;
  
  // Check if device prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;
  
  // Disable parallax on mobile devices for better performance
  const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
  if (isMobile) return;
  
  let ticking = false;
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const viewportHeight = window.innerHeight;
    
    // Calculate parallax rate based on scroll progress
    const scrollProgress = Math.min(scrolled / viewportHeight, 1);
    const photoRate = scrolled * -0.2; // Subtle parallax for photo
    
    // DNA visual illusion rotation - scroll-driven effects
    const dnaRotation = scrolled * 0.3; // Smooth rotation based on scroll
    const dnaScale = 1 + (scrollProgress * 0.1); // Slight scale variation
    const dnaOpacity = Math.max(0.5, 1 - (scrollProgress * 0.4)); // Fade as user scrolls
    
    // Apply parallax transforms with boundaries
    if (scrollProgress <= 1.0) {
      // Photo parallax
      teamPhoto.style.transform = `translateY(${photoRate}px)`;
      
      // DNA background effects - create visual illusion with scroll
      teamPhotoHero.style.setProperty('--dna-rotation', `${dnaRotation}deg`);
      teamPhotoHero.style.setProperty('--dna-scale', dnaScale);
      teamPhotoHero.style.setProperty('--dna-opacity', dnaOpacity);
    }
    
    ticking = false;
  }
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }
  
  // Use passive scroll listener for better performance
  window.addEventListener('scroll', requestTick, { passive: true });
  
  // Handle window resize with debouncing
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const newIsMobile = window.innerWidth <= 768;
      if (newIsMobile) {
        teamPhoto.style.transform = 'translateY(0)';
        teamPhotoHero.style.setProperty('--dna-rotation', '0deg');
        teamPhotoHero.style.setProperty('--dna-scale', '1');
        teamPhotoHero.style.setProperty('--dna-opacity', '1');
      }
    }, 100);
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', function() {
  // 早期应用暗色模式到body，避免页面闪烁
  const savedMode = localStorage.getItem('darkMode') === '1';
  document.body.classList.toggle('dark-mode', savedMode);
  
  // Initialize parallax effect
  initParallax();
  
  // 组件加载状态追踪
  let componentsLoaded = {
    navbar: false,
    footer: false
  };
  let darkModeUpdater = null;
  
  function applyDarkModeToFooter() {
    const isDark = document.body.classList.contains('dark-mode');
    document.querySelectorAll('.footer-logo-adaptive').forEach(img => {
      img.src = isDark ? '/assets/logos/logo-n-white.png' : '/assets/logos/logo-n-blue.png';
    });
    document.querySelectorAll('.footer-bsky-icon').forEach(img => {
      img.src = isDark ? '/assets/logos/bsky-g.svg' : '/assets/logos/bsky.svg';
    });
    document.querySelectorAll('.footer-igem-icon').forEach(img => {
      img.src = isDark ? '/assets/logos/Igem-logo-fullcolorwhite@1x.png' : '/assets/logos/Igem-logo-fullcolorblack@1x.png';
    });
  }
  
  function checkAndApplyDarkMode() {
    if (componentsLoaded.footer) {
      if (darkModeUpdater && componentsLoaded.navbar) {
        // 使用统一的暗色模式更新函数
        const isDark = document.body.classList.contains('dark-mode');
        darkModeUpdater(isDark);
      } else {
        // 直接应用到footer
        applyDarkModeToFooter();
      }
    }
  }
  
  loadComponent('navbar-container', '/components/navbar.html', function() {
    initNavbar();
    initScrollNavbar();
    darkModeUpdater = initDarkMode();
    componentsLoaded.navbar = true;
    checkAndApplyDarkMode();
  });
  
  loadComponent('footer', '/components/footer.html', function() {
    componentsLoaded.footer = true;
    checkAndApplyDarkMode();
  });
});