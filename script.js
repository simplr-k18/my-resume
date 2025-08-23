// ====================================
// ELEGANT PORTFOLIO JAVASCRIPT
// Gentle interactions like morning light on water
// ====================================

class ElegantPortfolio {
  constructor() {
    this.isLoaded = false;
    this.currentSection = 'home';
    this.typingIndex = 0;
    this.typingTexts = [
      'Data-Driven Product Thinker',
      'Aspiring Product Manager', 
      'Analytics Architect'
    ];
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.startTypingAnimation();
    this.initScrollObserver();
    this.initNavigation();
    this.initSkillsTabs();
    this.animateStats();
    this.initSmoothScrolling();
    this.initParallaxEffect();
    
    // Mark as loaded after a short delay
    setTimeout(() => {
      this.isLoaded = true;
      document.body.classList.add('loaded');
    }, 500);
  }

  setupEventListeners() {
    // Smooth window load
    window.addEventListener('load', () => {
      this.handleWindowLoad();
    });

    // Gentle scroll handling
    window.addEventListener('scroll', this.throttle(() => {
      this.handleScroll();
    }, 16));

    // Responsive resize
    window.addEventListener('resize', this.debounce(() => {
      this.handleResize();
    }, 250));

    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
      });
    }

    // Close mobile menu when clicking nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle?.classList.remove('active');
        navMenu?.classList.remove('active');
      });
    });

    // Button ripple effects
    this.initButtonRipples();
  }

  // Smooth typing animation for hero titles
  startTypingAnimation() {
    const typingContainer = document.querySelector('.typing-text');
    const textLines = document.querySelectorAll('.text-line');
    
    if (!typingContainer || !textLines.length) return;

    const showText = (index) => {
      textLines.forEach(line => {
        line.classList.remove('active');
      });
      
      if (textLines[index]) {
        textLines[index].classList.add('active');
      }
    };

    // Start with first text
    showText(0);

    // Cycle through texts
    setInterval(() => {
      this.typingIndex = (this.typingIndex + 1) % textLines.length;
      showText(this.typingIndex);
    }, 3000);
  }

  // Smooth scroll observer for section animations
  initScrollObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '-50px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          
          // Trigger specific animations for different sections
          this.triggerSectionAnimation(entry.target);
        }
      });
    }, observerOptions);

    // Observe all sections and special elements
    document.querySelectorAll('.section, .timeline-item, .skill-card, .project-card').forEach(el => {
      observer.observe(el);
    });
  }

  triggerSectionAnimation(section) {
    const sectionId = section.getAttribute('id');
    
    switch (sectionId) {
      case 'about':
        this.animateTextReveal(section);
        break;
      case 'experience':
        this.animateTimeline(section);
        break;
      case 'skills':
        this.animateSkillCards(section);
        break;
      case 'projects':
        this.animateProjects(section);
        break;
    }
  }

  // Gentle text reveal animation
  animateTextReveal(section) {
    const textElements = section.querySelectorAll('.text-reveal');
    textElements.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 200);
    });
  }

  // Timeline flow animation
  animateTimeline(section) {
    const timelineItems = section.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      }, index * 300);
    });
  }

  // Floating skill cards animation
  animateSkillCards(section) {
    const skillCards = section.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 150);
    });
  }

  // Project cards cascade
  animateProjects(section) {
    const projectCards = section.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
      }, index * 200);
    });
  }

  // Navigation highlighting and smooth scrolling
  initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section[id]');

    // Highlight active navigation based on scroll position
    const updateActiveNav = () => {
      const scrollPos = window.scrollY + 100;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
              this.currentSection = sectionId;
            }
          });
        }
      });
    };

    window.addEventListener('scroll', this.throttle(updateActiveNav, 100));
  }

  // Skills section tab switching
  initSkillsTabs() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const skillGroups = document.querySelectorAll('.skill-group');

    categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetCategory = tab.getAttribute('data-category');

        // Update active tab
        categoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Show corresponding skill group with smooth transition
        skillGroups.forEach(group => {
          group.classList.remove('active');
          if (group.getAttribute('data-category') === targetCategory) {
            setTimeout(() => {
              group.classList.add('active');
              this.animateSkillCards(group);
            }, 150);
          }
        });
      });
    });
  }

  // Animated counters for stats
  animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    const animateNumber = (element) => {
      const target = parseInt(element.getAttribute('data-target'));
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const updateNumber = () => {
        current += step;
        if (current >= target) {
          element.textContent = target;
        } else {
          element.textContent = Math.floor(current);
          requestAnimationFrame(updateNumber);
        }
      };

      updateNumber();
    };

    // Trigger animation when stats come into view
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateNumber(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    });

    statNumbers.forEach(stat => {
      statsObserver.observe(stat);
    });
  }

  // Smooth scrolling for all internal links
  initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Subtle parallax effect for hero section
  initParallaxEffect() {
    const heroSection = document.querySelector('.hero');
    const profileRings = document.querySelectorAll('.ring');
    
    if (!heroSection) return;

    const handleParallax = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      // Move background shapes
      const shapes = document.querySelectorAll('.shape');
      shapes.forEach((shape, index) => {
        const speed = 0.2 + (index * 0.1);
        shape.style.transform = `translateY(${scrolled * speed}px)`;
      });

      // Rotate profile rings at different speeds
      profileRings.forEach((ring, index) => {
        const rotation = scrolled * (0.1 + index * 0.05);
        ring.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
      });
    };

    window.addEventListener('scroll', this.throttle(handleParallax, 16));
  }

  // Button ripple effect
  initButtonRipples() {
    document.querySelectorAll('.btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const ripple = button.querySelector('.btn-ripple');
        if (!ripple) return;

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        
        ripple.classList.add('animate');
        
        setTimeout(() => {
          ripple.classList.remove('animate');
        }, 600);
      });
    });
  }

  // Handle scroll events
  handleScroll() {
    const scrollY = window.scrollY;
    
    // Update navigation background opacity
    const nav = document.querySelector('.nav-bar');
    if (nav) {
      const opacity = Math.min(scrollY / 100, 1);
      nav.style.backgroundColor = `rgba(10, 10, 15, ${0.8 + opacity * 0.2})`;
    }

    // Hide/show scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.style.opacity = scrollY > 100 ? '0' : '1';
    }
  }

  // Handle window load
  handleWindowLoad() {
    // Fade in sections sequentially
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
      setTimeout(() => {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  // Handle window resize
  handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
      const navToggle = document.querySelector('.nav-toggle');
      const navMenu = document.querySelector('.nav-menu');
      
      navToggle?.classList.remove('active');
      navMenu?.classList.remove('active');
    }
  }

  // Utility: Throttle function
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

  // Utility: Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Enhanced Three.js Background (Optional beautiful addition)
class ParticleBackground {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.mouse = { x: 0, y: 0 };
    
    if (window.innerWidth > 768) { // Only on desktop for performance
      this.init();
    }
  }

  init() {
    // Only initialize if Three.js is available
    if (typeof THREE === 'undefined') return;

    this.createScene();
    this.createParticles();
    this.setupEventListeners();
    this.animate();
  }

  createScene() {
    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    this.camera.position.z = 5;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0);
    
    // Insert canvas as background
    const canvas = this.renderer.domElement;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    
    document.body.appendChild(canvas);
  }

  createParticles() {
    const particleCount = 100;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;
      
      // Gentle blue-purple colors
      colors[i3] = 0.4 + Math.random() * 0.4;     // Red
      colors[i3 + 1] = 0.5 + Math.random() * 0.3; // Green
      colors[i3 + 2] = 0.8 + Math.random() * 0.2; // Blue
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  setupEventListeners() {
    // Mouse movement
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Resize handling
    window.addEventListener('resize', () => {
      if (!this.camera || !this.renderer) return;
      
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  animate() {
    if (!this.particles) return;

    requestAnimationFrame(() => this.animate());

    // Gentle rotation
    this.particles.rotation.x += 0.0005;
    this.particles.rotation.y += 0.001;

    // Subtle mouse interaction
    this.particles.rotation.x += this.mouse.y * 0.0002;
    this.particles.rotation.y += this.mouse.x * 0.0002;

    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Main portfolio functionality
  const portfolio = new ElegantPortfolio();
  
  // Optional Three.js background
  if (window.location.search.includes('particles')) {
    new ParticleBackground();
  }
  
  // Add some CSS classes for enhanced animations
  const style = document.createElement('style');
  style.textContent = `
    .btn-ripple.animate {
      animation: ripple 0.6s ease-out;
    }
    
    @keyframes ripple {
      to {
        transform: translate(-50%, -50%) scale(1);
        opacity: 0;
      }
    }
    
    .animate-in {
      animation: gentleFadeIn 0.8s ease forwards;
    }
    
    @keyframes gentleFadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ElegantPortfolio, ParticleBackground };
}
