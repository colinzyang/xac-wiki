// Article layout functionality for XJTLU iGEM Team 2025
// Provides auto-generated table of contents and smooth scrolling

document.addEventListener('DOMContentLoaded', function() {
  initializeArticleFeatures();
});

function initializeArticleFeatures() {
  // Initialize scroll to top button
  initScrollToTop();
  
  // Initialize auto-generated catalog
  initCatalogGeneration();
  
  // Initialize smooth scrolling
  initSmoothScrolling();
  
  // Initialize active section highlighting
  initActiveSectionHighlighting();
}

function initScrollToTop() {
  const scrollBtn = document.getElementById('scroll-to-top');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

function initCatalogGeneration() {
  const catalogList = document.querySelector('.catalog-list');
  const headings = document.querySelectorAll('.article-content h2, .article-content h3, .article-content h4, .article-content h5, .article-content h6');
  
  if (!catalogList || headings.length === 0) return;
  
  // Clear existing links
  catalogList.innerHTML = '';
  
  headings.forEach(function(heading, index) {
    // Generate ID if not present
    if (!heading.id) {
      heading.id = 'heading-' + index;
    }
    
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + heading.id;
    a.textContent = heading.textContent;
    
    // Add class for sub-headings with different indentation levels
    if (heading.tagName === 'H3') {
      a.className = 'sub-heading';
      li.style.paddingLeft = '16px';
    } else if (heading.tagName === 'H4') {
      a.className = 'sub-heading-2';
      li.style.paddingLeft = '32px';
    } else if (heading.tagName === 'H5') {
      a.className = 'sub-heading-3';
      li.style.paddingLeft = '48px';
    } else if (heading.tagName === 'H6') {
      a.className = 'sub-heading-4';
      li.style.paddingLeft = '64px';
    }
    
    li.appendChild(a);
    catalogList.appendChild(li);
  });
}

function initSmoothScrolling() {
  const catalogLinks = document.querySelectorAll('.catalog-list a');
  
  catalogLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const offsetTop = targetElement.offsetTop + 240; // Account for fixed navbar
        window.scrollTo({ 
          top: offsetTop, 
          behavior: 'smooth' 
        });
      }
    });
  });
}

function initActiveSectionHighlighting() {
  const headings = document.querySelectorAll('.article-content h2, .article-content h3, .article-content h4, .article-content h5, .article-content h6');
  const catalogLinks = document.querySelectorAll('.catalog-list a');
  
  if (headings.length === 0 || catalogLinks.length === 0) return;
  
  function updateActiveSection() {
    const scrollPos = window.scrollY - 90;
    let activeHeading = null;
    
    // Find the current active heading
    headings.forEach(function(heading) {
      const sectionTop = heading.offsetTop;
      const sectionBottom = sectionTop + heading.offsetHeight;
      
      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        activeHeading = heading;
      }
    });
    
    // If no section is active, find the closest one above
    if (!activeHeading) {
      let closestHeading = null;
      let minDistance = Infinity;
      
      headings.forEach(function(heading) {
        const distance = scrollPos - heading.offsetTop;
        if (distance >= 0 && distance < minDistance) {
          minDistance = distance;
          closestHeading = heading;
        }
      });
      
      activeHeading = closestHeading;
    }
    
    // Update active state
    catalogLinks.forEach(function(link) {
      link.classList.remove('active');
    });
    
    if (activeHeading) {
      const activeLink = document.querySelector('.catalog-list a[href="#' + activeHeading.id + '"]');
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  }
  
  // Update on scroll with throttling
  let ticking = false;
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateActiveSection);
      ticking = true;
      setTimeout(() => { ticking = false; }, 100);
    }
  }
  
  window.addEventListener('scroll', requestTick);
  updateActiveSection(); // Initial call
}

// Utility function to add heading IDs based on text content
function generateHeadingId(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-'); // Remove leading/trailing hyphens
}

// Export for use in other scripts if needed
window.ArticleLayout = {
  initializeArticleFeatures,
  initScrollToTop,
  initCatalogGeneration,
  initSmoothScrolling,
  initActiveSectionHighlighting,
  generateHeadingId
};