// ====================================
// ELEGANT PORTFOLIO JAVASCRIPT REFINED
// Harmony between logic and presentation
// ====================================

/**
 * Standalone utility to throttle function execution.
 * @param {Function} func The function to throttle.
 * @param {number} limit The throttle limit in milliseconds.
 * @returns {Function} The throttled function.
 */
const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Standalone utility to debounce function execution.
 * @param {Function} func The function to debounce.
 * @param {number} wait The debounce wait time in milliseconds.
 * @returns {Function} The debounced function.
 */
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * @class ElegantPortfolio
 * @description Manages all interactive elements and animations for the portfolio.
 */
class ElegantPortfolio {
  constructor() {
    // Centralized DOM element references
    this.navBar = document.querySelector('.nav-bar');
    this.navToggle = document.querySelector('.nav-toggle');
    this.navMenu = document.querySelector('.nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('.section[id]');
    
    this.typingIndex = 0;

    this._init();
  }

  /**
   * Initializes all portfolio functionalities.
   * @private
   */
  _init() {
    this._setupEventListeners();
    this._initTypingAnimation();
    this._initObservers();
    this._initSmoothScrolling();
    this._initSkillsTabs();
    this._initButtonRipples();
    this._initHeroTilt();

    // Graceful page load
    window.addEventListener('load', () => {
      document.body.classList.add('loaded');
    }, { once: true });
  }
  
  /**
   * Sets up all core event listeners.
   * @private
   */
  _setupEventListeners() {
    window.addEventListener('scroll', throttle(() => this._handleScroll(), 16));
    window.addEventListener('resize', debounce(() => this._handleResize(), 250));

    // Mobile navigation toggle
    if (this.navToggle && this.navMenu) {
      this.navToggle.addEventListener('click', () => {
        this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
      });
    }

    // Close mobile menu on link click
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.navToggle?.classList.remove('active');
        this.navMenu?.classList.remove('active');
      });
    });
  }

  /**
   * Initializes the hero section's typing animation.
   * @private
   */
  _initTypingAnimation() {
    const textLines = document.querySelectorAll('.typing-text .text-line');
    if (!textLines.length) return;

    const showText = (index) => {
      textLines.forEach(line => line.classList.remove('active'));
      if (textLines[index]) {
        textLines[index].classList.add('active');
      }
    };

    showText(0); // Show first text immediately
    setInterval(() => {
      this.typingIndex = (this.typingIndex + 1) % textLines.length;
      showText(this.typingIndex);
    }, 3000);
  }

  /**
   * Initializes IntersectionObservers for scroll-triggered animations.
   * @private
   */
  _initObservers() {
    const animationObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Set delay from data-attribute if it exists
          const delay = entry.target.dataset.animateDelay || '0s';
          entry.target.style.transitionDelay = delay;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    // Observe any element with [data-animate]
    document.querySelectorAll('[data-animate]').forEach(el => animationObserver.observe(el));

    // Observer for animated stats
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this._animateStatNumber(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.8 });

    document.querySelectorAll('.stat-number[data-target]').forEach(stat => statsObserver.observe(stat));
  }
  
  /**
   * Handles scroll-related UI changes like header background and nav highlighting.
   * @private
   */
  _handleScroll() {
    const scrollY = window.scrollY;

    // Update nav background opacity
    if (this.navBar) {
      const opacity = Math.min(scrollY / 100, 1);
      this.navBar.style.backgroundColor = `rgba(10, 10, 15, ${0.8 + opacity * 0.2})`;
    }

    // Hide/show scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.style.opacity = scrollY > 100 ? '0' : '1';
    }
    
    // Update active nav link
    this._updateActiveNav();
    this._handleParallax();
  }
  
  /**
   * Updates the active navigation link based on scroll position.
   * @private
   */
  _updateActiveNav() {
    const scrollPos = window.scrollY + (this.navBar?.offsetHeight || 80) + 20;

    this.sections.forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        this.navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${section.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  /**
   * Handles hero parallax effect on scroll.
   * @private
   */
  _handleParallax() {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');
    const profileRings = document.querySelectorAll('.ring');

    shapes.forEach((shape, index) => {
      const speed = 0.1 + (index * 0.05);
      shape.style.transform = `translateY(${scrolled * speed}px)`;
    });

    profileRings.forEach((ring, index) => {
      const rotation = scrolled * (0.05 + index * 0.02);
      ring.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
    });
  }
  
  /**
   * Handles window resize events, like closing the mobile menu.
   * @private
   */
  _handleResize() {
    if (window.innerWidth > 768) {
      this.navToggle?.classList.remove('active');
      this.navMenu?.classList.remove('active');
    }
  }

  /**
   * Initializes smooth scrolling for all internal anchor links.
   * @private
   */
  _initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          const offsetTop = targetElement.offsetTop - (this.navBar?.offsetHeight || 80);
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /**
   * Initializes tab functionality for the skills section.
   * @private
   */
  _initSkillsTabs() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const skillGroups = document.querySelectorAll('.skill-group');

    categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetCategory = tab.dataset.category;

        categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        skillGroups.forEach(group => {
          group.classList.remove('active');
          if (group.dataset.category === targetCategory) {
            group.classList.add('active');
          }
        });
      });
    });
  }

  /**
   * Animates a single stat number from 0 to its target value.
   * @param {HTMLElement} element The stat number element.
   * @private
   */
  _animateStatNumber(element) {
    const target = parseInt(element.dataset.target, 10);
    const duration = 2000;
    let start = 0;
    const stepTime = 16; // roughly 60fps

    const step = () => {
      start += target / (duration / stepTime);
      if (start >= target) {
        element.textContent = target;
      } else {
        element.textContent = Math.floor(start);
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }
  
  /**
   * Initializes the ripple effect for all elements with a .btn class.
   * @private
   */
  _initButtonRipples() {
    document.querySelectorAll('.btn').forEach(button => {
      button.addEventListener('click', (e) => {
        // Ensure ripple element exists
        let ripple = button.querySelector('.btn-ripple');
        if (!ripple) {
          ripple = document.createElement('span');
          ripple.className = 'btn-ripple';
          button.appendChild(ripple);
        }
        
        // Remove old animation class
        ripple.classList.remove('animate');
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        // Trigger animation
        ripple.classList.add('animate');
      });
    });
  }
}


/**
 * @class ParticleBackground
 * @description Creates an interactive Three.js particle background.
 */
class ParticleBackground {
  constructor() {
    // Only run on larger screens and if Three.js is loaded
    if (typeof THREE === 'undefined' || window.innerWidth <= 768) return;

    this.mouse = new THREE.Vector2();
    this.init();
  }

  init() {
    this._createScene();
    this._createParticles();
    this._setupEventListeners();
    this._animate();
  }
  
  _createScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);

    const canvas = this.renderer.domElement;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);
  }

  _createParticles() {
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const geometry = new THREE.BufferGeometry();

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;
      
      const baseColor = new THREE.Color(0x6a82fb); // A nice base violet-blue
      baseColor.offsetHSL(Math.random() * 0.2 - 0.1, 0.1, Math.random() * 0.2 - 0.1);
      colors[i3] = baseColor.r;
      colors[i3 + 1] = baseColor.g;
      colors[i3 + 2] = baseColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  _setupEventListeners() {
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('resize', debounce(() => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }, 100));
  }

  _animate() {
    requestAnimationFrame(() => this._animate());

    const elapsedTime = new Date().getTime() * 0.0001;
    this.particles.rotation.y = elapsedTime;
    
    // Gentle mouse follow
    this.camera.position.x += (this.mouse.x * 0.5 - this.camera.position.x) * 0.02;
    this.camera.position.y += (-this.mouse.y * 0.5 - this.camera.position.y) * 0.02;
    this.camera.lookAt(this.scene.position);

    this.renderer.render(this.scene, this.camera);
  }
}

// ====================================
// APP INITIALIZATION
// ====================================
document.addEventListener('DOMContentLoaded', () => {
  new ElegantPortfolio();
  
  // Optional: Activate particles with a query parameter e.g., yoursite.com?particles=true
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('particles')) {
    new ParticleBackground();
  }

  // Inject necessary CSS for animations.
  // In a real project, this should be in your main CSS file.
  const style = document.createElement('style');
  style.textContent = `
    [data-animate] {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.8s cubic-bezier(0.165, 0.84, 0.44, 1), transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
    [data-animate="fade-in-left"] { transform: translateX(-30px); }
    [data-animate="fade-in-right"] { transform: translateX(30px); }
    
    [data-animate].is-visible {
      opacity: 1;
      transform: translate(0, 0);
    }
    
    .btn {
      position: relative;
      overflow: hidden;
    }
    .btn-ripple {
      position: absolute;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      pointer-events: none;
    }
    .btn-ripple.animate {
      animation: ripple 0.6s ease-out;
    }
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
});
  _initHeroTilt() {
    const heroVisual = document.querySelector('.hero-visual');
    if (!heroVisual) return;

    heroVisual.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = (y - rect.height / 2) / 15;
      const rotateY = -(x - rect.width / 2) / 15;
      heroVisual.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    heroVisual.addEventListener('mouseleave', () => {
      heroVisual.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  }
