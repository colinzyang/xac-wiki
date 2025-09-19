// 缓存已加载的组件
const componentCache = new Map();

function loadComponent(id, url, callback) {
  const container = document.getElementById(id);
  if (!container) {
    console.warn(`Container with id "${id}" not found`);
    return;
  }
  
  // 检查缓存
  if (componentCache.has(url)) {
    container.innerHTML = componentCache.get(url);
    if (typeof callback === 'function') {
      try {
        requestAnimationFrame(() => callback());
      } catch (err) {
        console.error(`Error in callback for ${id}:`, err);
      }
    }
    return;
  }
  
  // 使用AbortController防止重复请求
  if (container.dataset.loading === 'true') return;
  container.dataset.loading = 'true';
  
  fetch(url, {
    cache: 'force-cache'  // 强制使用浏览器缓存
  })
    .then(res => {
      if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status} ${res.statusText}`);
      return res.text();
    })
    .then(html => {
      // 缓存组件HTML
      componentCache.set(url, html);
      container.innerHTML = html;
      container.dataset.loading = 'false';
      
      if (typeof callback === 'function') {
        try {
          requestAnimationFrame(() => callback());
        } catch (err) {
          console.error(`Error in callback for ${id}:`, err);
        }
      }
    })
    .catch(err => {
      console.error('Component loading error:', err);
      container.innerHTML = `<div class="error-placeholder">Failed to load component</div>`;
      container.dataset.loading = 'false';
    });
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
        // 如果链接是 # 或者是移动设备，阻止默认行为并切换下拉菜单
        if (link.getAttribute('href') === '#' || window.innerWidth <= 768 || 'ontouchstart' in window) {
          e.preventDefault();
          toggleDropdown(dropdown, navList);
        }
      });
      
      // 键盘导航支持
      link.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          // 如果链接是 # 或者是移动设备，阻止默认行为并切换下拉菜单
          if (link.getAttribute('href') === '#' || window.innerWidth <= 768 || 'ontouchstart' in window) {
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
  const expandThreshold = 60;
  let lastScrollY = window.scrollY;
  
  // 使用Intersection Observer优化滚动性能
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navbar.classList.remove('shrink');
        isScrolled = false;
      }
    });
  }, { rootMargin: '0px 0px -80px 0px' });
  
  // 观察页面顶部元素
  const pageTop = document.createElement('div');
  pageTop.style.height = '80px';
  pageTop.style.position = 'absolute';
  pageTop.style.top = '0';
  pageTop.style.pointerEvents = 'none';
  document.body.prepend(pageTop);
  observer.observe(pageTop);
  
  function updateNavbar() {
    const scrollY = window.scrollY;
    const scrollDirection = scrollY > lastScrollY ? 'down' : 'up';
    
    // 减少DOM操作频率
    if (Math.abs(scrollY - lastScrollY) < 5) {
      ticking = false;
      return;
    }
    
    const threshold = scrollDirection === 'down' ? shrinkThreshold : expandThreshold;
    const shouldShrink = scrollY > threshold;
    
    if (shouldShrink && !isScrolled) {
      navbar.classList.add('shrink');
      isScrolled = true;
    } else if (!shouldShrink && isScrolled && scrollY < expandThreshold) {
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
  
  // 优化的滚动处理
  let scrollTimer;
  function handleScroll() {
    requestTick();
    
    // 减少will-change的使用
    if (!scrollTimer) {
      navbar.style.willChange = 'transform';
    }
    
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      navbar.style.willChange = 'auto';
      scrollTimer = null;
    }, 150);
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true });
}

function initDarkMode() {
  const toggleButtons = document.querySelectorAll('.dark-mode-toggle');
  
  function updateDarkMode(isDark) {
    try {
      document.body.classList.toggle('dark-mode', isDark);
      localStorage.setItem('darkMode', isDark ? '1' : '0');
      
      // 更新导航栏logo
      document.querySelectorAll('.navbar-fab-logo').forEach(img => {
        if (img) {
          img.src = isDark ? '/assets/logos/logo-white.png' : '/assets/logos/logo-blue.png';
        }
      });
      
      // 更新导航栏切换按钮图标
      toggleButtons.forEach(btn => {
        const icon = btn?.querySelector('img');
        if (icon) {
          icon.src = isDark ? '/assets/icons/moon2.svg' : '/assets/icons/sun.svg';
          icon.alt = isDark ? 'Dark Mode' : 'Light Mode';
        }
      });
      
      // 更新Footer logo
      document.querySelectorAll('.footer-logo-adaptive').forEach(img => {
        if (img) {
          img.src = isDark ? '/assets/logos/logo-n-white.png' : '/assets/logos/logo-n-blue.png';
        }
      });
      
      // 更新Bluesky图标
      document.querySelectorAll('.footer-bsky-icon').forEach(img => {
        if (img) {
          img.src = isDark ? '/assets/logos/bsky-g.svg' : '/assets/logos/bsky.svg';
        }
      });
      
      // 更新iGEM图标
      document.querySelectorAll('.footer-igem-icon').forEach(img => {
        if (img) {
          img.src = isDark ? '/assets/logos/Igem-logo-fullcolorwhite@1x.png' : '/assets/logos/Igem-logo-fullcolorblack@1x.png';
        }
      });
    } catch (err) {
      console.error('Error updating dark mode:', err);
    }
  }

  toggleButtons.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        try {
          const isDark = !document.body.classList.contains('dark-mode');
          updateDarkMode(isDark);
        } catch (err) {
          console.error('Error toggling dark mode:', err);
        }
      });
    }
  });

  // Safely get saved mode from localStorage
  let savedMode = false;
  try {
    savedMode = localStorage.getItem('darkMode') === '1';
  } catch (err) {
    console.warn('Could not access localStorage for dark mode preference:', err);
  }
  updateDarkMode(savedMode);
  
  // 返回updateDarkMode函数，供外部调用
  return updateDarkMode;
}

function initParallax() {
  const teamPhoto = document.querySelector('.team-photo');
  const teamPhotoHero = document.querySelector('.team-photo-hero');
  if (!teamPhoto && !teamPhotoHero) return;
  
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
      if (teamPhoto) {
        teamPhoto.style.transform = `translateY(${photoRate}px)`;
      }
      
      // DNA background effects - create visual illusion with scroll
      if (teamPhotoHero) {
        teamPhotoHero.style.setProperty('--dna-rotation', `${dnaRotation}deg`);
        teamPhotoHero.style.setProperty('--dna-scale', dnaScale);
        teamPhotoHero.style.setProperty('--dna-opacity', dnaOpacity);
      }
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
        if (teamPhoto) {
          teamPhoto.style.transform = 'translateY(0)';
        }
        if (teamPhotoHero) {
          teamPhotoHero.style.setProperty('--dna-rotation', '0deg');
          teamPhotoHero.style.setProperty('--dna-scale', '1');
          teamPhotoHero.style.setProperty('--dna-opacity', '1');
        }
      }
    }, 100);
  }, { passive: true });
}

function initTeamShowcase() {
  const showcaseContainers = document.querySelectorAll('.team-showcase-container');
  if (showcaseContainers.length === 0) return;
  
  // Check if device prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Mobile detection
  const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
  
  // Initialize expand animations for Leaders and Students
  initExpandAnimations();
  
  // Initialize scroll behavior
  initScrollBehavior();
  
  // Initialize wheel scroll control
  initWheelScrollControl();
  
  let ticking = false;
  
  function initExpandAnimations() {
    // Track which sections have been animated
    const animatedSections = new Set();
    
    // Create Intersection Observer for expand animations
    const expandObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = entry.target;
          const level = section.dataset.level;
          
          // Only animate leaders and students, and only once
          if ((level === 'leaders' || level === 'students') && !animatedSections.has(level)) {
            animatedSections.add(level);
            triggerExpandAnimation(section);
          }
        }
      });
    }, {
      threshold: 0.3, // 更低的阈值，更早触发
      rootMargin: '0px 0px -10% 0px' // 稍微提前触发
    });
    
    // Observe Leaders and Students sections
    const leadersSection = document.querySelector('.leaders-showcase-section');
    const studentsSection = document.querySelector('.students-showcase-section');
    
    if (leadersSection) expandObserver.observe(leadersSection);
    if (studentsSection) expandObserver.observe(studentsSection);
  }
  
  function triggerExpandAnimation(section) {
    const memberCards = section.querySelectorAll('.member-card-expand');
    const level = section.dataset.level;
    
    memberCards.forEach((card, index) => {
      let actualIndex = index;
      
      // Leaders expand from right to left (reverse order)
      if (level === 'leaders') {
        actualIndex = memberCards.length - 1 - index;
      }
      
      // Set CSS custom property for staggered delay
      card.style.setProperty('--expand-delay', actualIndex.toString());
      
      // Add expanded class with slight delay to ensure CSS is applied
      setTimeout(() => {
        card.classList.add('expanded');
      }, 100 + (actualIndex * 120)); // Faster stagger for smoother flow
    });
  }
  
  // Initialize scroll behavior
  function initScrollBehavior() {
    const scrollTracks = document.querySelectorAll('.members-scroll-track');
    
    scrollTracks.forEach(track => {
      // Enable smooth scrolling
      track.style.scrollBehavior = 'smooth';
      
      // Optional: Add scroll snap for better UX on touch devices
      if ('ontouchstart' in window) {
        track.style.scrollSnapType = 'x mandatory';
        const cards = track.querySelectorAll('.member-card-expand');
        cards.forEach(card => {
          card.style.scrollSnapAlign = 'start';
        });
      }
    });
  }
  
  // Initialize wheel scroll control
  function initWheelScrollControl() {
    const scrollContainers = document.querySelectorAll('.members-horizontal-container');
    
    scrollContainers.forEach(container => {
      const scrollTrack = container.querySelector('.members-scroll-track');
      if (!scrollTrack) return;
      
      let isScrolling = false;
      
      container.addEventListener('wheel', (e) => {
        // Prevent default vertical scroll
        e.preventDefault();
        
        // Convert vertical wheel movement to horizontal scroll
        const scrollAmount = e.deltaY * 2; // Adjust sensitivity
        
        // Smooth scroll horizontally
        scrollTrack.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        });
        
        // Throttle scrolling to prevent overwhelming
        if (!isScrolling) {
          isScrolling = true;
          setTimeout(() => {
            isScrolling = false;
          }, 50);
        }
      }, { passive: false });
    });
  }
  
  function updateTeamShowcase() {
    const currentTime = Date.now();
    const currentScrollY = window.pageYOffset;
    
    showcaseContainers.forEach(container => {
      const level = container.dataset.level;
      const rect = container.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (!isInViewport) return;
      
      // Apply floating animation to PI only
      if (level === 'pi') {
        const piAvatar = container.querySelector('.member-avatar-large');
        if (piAvatar && !prefersReducedMotion) {
          const scrollFactor = currentScrollY * 0.0005;
          const floatOffset = Math.sin(currentTime * 0.001 + scrollFactor) * 3;
          piAvatar.style.transform = `translateY(${floatOffset}px)`;
        }
      }
    });
    
    ticking = false;
  }
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateTeamShowcase);
      ticking = true;
    }
  }
  
  // Simple scroll handling for PI floating animation
  function handleScroll() {
    requestTick();
  }
  
  // Event listeners
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Handle resize - reset animations if needed
  let resizeTimeout;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Re-initialize expand animations on resize if needed
      initExpandAnimations();
    }, 100);
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', function() {
  // 早期应用暗色模式到body，避免页面闪烁
  try {
    const savedMode = localStorage.getItem('darkMode') === '1';
    document.body.classList.toggle('dark-mode', savedMode);
  } catch (err) {
    console.warn('Could not access localStorage during initialization:', err);
  }
  
  // Initialize carousel for homepage
  window.carousel = initCarousel();
  
  // Initialize parallax effects
  initParallax();
  initTeamShowcase();
  
  
  // 组件加载状态追踪
  let componentsLoaded = {
    navbar: false,
    footer: false
  };
  let darkModeUpdater = null;
  
  function applyDarkModeToFooter() {
    try {
      const isDark = document.body.classList.contains('dark-mode');
      document.querySelectorAll('.footer-logo-adaptive').forEach(img => {
        if (img) {
          img.src = isDark ? '/assets/logos/logo-n-white.png' : '/assets/logos/logo-n-blue.png';
        }
      });
      document.querySelectorAll('.footer-bsky-icon').forEach(img => {
        if (img) {
          img.src = isDark ? '/assets/logos/bsky-g.svg' : '/assets/logos/bsky.svg';
        }
      });
      document.querySelectorAll('.footer-igem-icon').forEach(img => {
        if (img) {
          img.src = isDark ? '/assets/logos/Igem-logo-fullcolorwhite@1x.png' : '/assets/logos/Igem-logo-fullcolorblack@1x.png';
        }
      });
    } catch (err) {
      console.error('Error applying dark mode to footer:', err);
    }
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
  
  // Load navbar component
  try {
    loadComponent('navbar-container', '/components/navbar.html', function() {
      try {
        initNavbar();
        initScrollNavbar();
        darkModeUpdater = initDarkMode();
        componentsLoaded.navbar = true;
        checkAndApplyDarkMode();
        
        // Initialize team interface if on team page
        if (window.location.pathname.includes('/team/')) {
          setTimeout(() => initRocheTeamInterface(), 100);
        }
      } catch (err) {
        console.error('Error initializing navbar:', err);
      }
    });
  } catch (err) {
    console.error('Error loading navbar component:', err);
  }
  
  // Load footer component
  try {
    loadComponent('footer', '/components/footer.html', function() {
      try {
        componentsLoaded.footer = true;
        checkAndApplyDarkMode();
      } catch (err) {
        console.error('Error initializing footer:', err);
      }
    });
  } catch (err) {
    console.error('Error loading footer component:', err);
  }
});

// Roche-Style Team Interface Functions
function initRocheTeamInterface() {
  // Initialize team filter functionality
  initTeamFilter();
}

function initCarousel() {
  const carousel = document.querySelector('.hero-carousel');
  if (!carousel) {
    return;
  }

  const track = carousel.querySelector('.carousel-track');
  const slides = carousel.querySelectorAll('.carousel-slide');

  if (!track) {
    return null;
  }
  
  if (slides.length === 0) {
    return null;
  }
  
  if (slides.length === 1) {
    return null;
  }


  let currentSlide = 0;
  const totalSlides = slides.length;

  // Auto-play settings
  let autoPlayInterval;
  const autoPlayDelay = 4000; // 4 seconds for faster transitions

  function updateCarousel(slideIndex) {
    
    // Update slides
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === slideIndex);
    });

    // Update track position for smooth sliding effect
    const translateX = -slideIndex * 100;
    track.style.transform = `translateX(${translateX}%)`;

    currentSlide = slideIndex;
  }

  function nextSlide() {
    const next = (currentSlide + 1) % totalSlides;
    updateCarousel(next);
  }

  function startAutoPlay() {
    // Clear any existing interval first
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
    }
    autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
  }

  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }

  // Pause auto-play when tab is not visible for performance
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  });

  // Initialize carousel - ensure first slide is active
  updateCarousel(0);
  
  // Start auto-play after a short delay to ensure DOM is ready
  setTimeout(() => {
    startAutoPlay();
  }, 500);

  // Return control functions for debugging
  return {
    next: nextSlide,
    goTo: updateCarousel,
    start: startAutoPlay,
    stop: stopAutoPlay,
    getCurrentSlide: () => currentSlide
  };
}

function initTeamFilter() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  const teamCards = document.querySelectorAll('.team-member-card');
  
  if (filterTabs.length === 0 || teamCards.length === 0) {
    return;
  }
  
  // Add click event listeners to filter tabs
  filterTabs.forEach((tab, index) => {
    tab.addEventListener('click', function(e) {
      e.preventDefault();
      const filter = this.getAttribute('data-filter');
      
      // Update active tab
      filterTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Filter team cards
      filterTeamCards(teamCards, filter);
    });
    
    // Keyboard support
    tab.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
}

function filterTeamCards(cards, filter) {
  cards.forEach((card, index) => {
    const categories = card.getAttribute('data-category').split(' ');
    const shouldShow = filter === 'all' || categories.includes(filter);
    
    if (shouldShow) {
      card.classList.remove('hidden');
      card.style.opacity = '1';
      card.style.transform = 'none';
    } else {
      card.classList.add('hidden');
    }
  });
}

