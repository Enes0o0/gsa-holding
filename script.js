// Optimized JavaScript for FA Group Website
document.addEventListener('DOMContentLoaded', function() {
  // Utility functions
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Unified hamburger menu for all pages
  const hamburgerMenu = $('#hamburgerMenu');
  const fullscreenMenu = $('#fullscreenMenu');
  const closeMenu = $('#closeMenu');

  if (hamburgerMenu && fullscreenMenu) {
    // Open menu
    hamburgerMenu.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      hamburgerMenu.classList.add('active');
      fullscreenMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    // Close menu function
    const menuItems = $$('.menu-item');
    const pressedClass = 'is-pressed';
    const clearPressedStates = () => {
      menuItems.forEach(item => item.classList.remove(pressedClass));
    };
    const closeMenuHandler = () => {
      hamburgerMenu.classList.remove('active');
      fullscreenMenu.classList.remove('active');
      document.body.style.overflow = '';
      clearPressedStates();
    };

    // Close button
    if (closeMenu) {
      closeMenu.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeMenu.classList.add('closing');
        setTimeout(() => {
          closeMenuHandler();
          closeMenu.classList.remove('closing');
        }, 100);
      });
    }
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && fullscreenMenu.classList.contains('active')) {
        closeMenuHandler();
      }
    });

    // Close when clicking outside menu content
    fullscreenMenu.addEventListener('click', (e) => {
      if (e.target === fullscreenMenu) {
        closeMenuHandler();
      }
    });

    // Enhanced menu item interactions with smooth transitions
    menuItems.forEach(item => {
      let pressTimer = null;
      let isNavigating = false;

      // Smooth navigation with minimal visual feedback
      const smoothNavigate = (e) => {
        if (isNavigating) return;
        isNavigating = true;

        e.preventDefault();
        
        // Get href for navigation
        const href = item.getAttribute('href');
        if (!href || href === '#') {
          isNavigating = false;
          return;
        }
        
        // Subtle scale feedback only
        item.style.transform = 'translate3d(0, 0, 0) scale(0.97)';
        item.style.opacity = '0.7';
        
        // Quick feedback then navigate immediately
        setTimeout(() => {
          // Navigate immediately without waiting for menu animation
          window.location.href = href;
        }, 60); // Very short feedback, no menu close wait
      };

      // Touch interactions - simplified
      item.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'mouse') return;
        
        clearTimeout(pressTimer);
        // Just add subtle visual feedback, no ripple
        item.style.transform = 'translate3d(0, -1px, 0) scale(0.98)';
      });

      // Click handler with smooth transition
      item.addEventListener('click', smoothNavigate);

      const releasePress = () => {
        clearTimeout(pressTimer);
        if (!isNavigating) {
          // Reset to normal state
          item.style.transform = 'translate3d(0, 0, 0) scale(1)';
          item.style.opacity = '1';
        }
      };
      
      ['pointerup', 'pointercancel', 'pointerleave', 'blur'].forEach(evt => {
        item.addEventListener(evt, releasePress);
      });
    });
  }

  // Smooth scroll navigation
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = $(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Hero slider (index.html only)
  const heroSlider = $('.hero-slider');
  if (heroSlider) {
    const slides = $$('.slide');
    const dots = $$('.dot');
    const prevBtn = $('.prev-btn');
    const nextBtn = $('.next-btn');
    let currentSlide = 0;
    // Autoplay kapalı (isteğe göre açılabilir)
    let autoPlay = null;

    const slideData = [
      {
        title: 'CONSTRUCTION',
        image: 'images/villalalar.png',
        link: 'construction.html'
      },
      {
        title: 'ENERGY',
        image: 'images/energy_2.png',
        link: 'energy.html'
      },
      {
        title: 'TRADE',
        image: 'images/transportation-logistics-container-cargo-ship-cargo-plane-3d-rendering-illustration.jpg',
        link: 'trade.html'
      }
    ];

    function updateSlideContent() {
      const titleEl = $('#heroTitle');
      const linkEl = $('#viewDetailsBtn');

      if (titleEl) titleEl.textContent = slideData[currentSlide].title;
      if (linkEl) linkEl.href = slideData[currentSlide].link;
    }

    function showSlide(n) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === n);
      });
      dots.forEach((dot, i) => dot.classList.toggle('active', i === n));

      // Update sector navigation active state
      const sectorCards = $$('.sector-card');
      sectorCards.forEach((card, i) => {
        card.classList.toggle('active', i === n);
      });

      currentSlide = n;
      updateSlideContent();
    }

    function nextSlide() { showSlide((currentSlide + 1) % slides.length); }
    function prevSlide() { showSlide((currentSlide - 1 + slides.length) % slides.length); }

    // Event listeners (dots/prev/next not used in current UI but kept safe)
    prevBtn?.addEventListener('click', prevSlide);
    nextBtn?.addEventListener('click', nextSlide);
    dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    });

    // Auto-play
    function startAutoPlay() {}
    function stopAutoPlay() {}

    // İlk yüklemede Construction aktif (0. index)
    showSlide(0);
  }

  // Newsletter form
  const newsletterForm = $('#newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = $('#email')?.value?.trim();
      const consent = $('#consent')?.checked;
      const msg = $('.form-message');

      if (/.+@.+\..+/.test(email) && consent) {
        msg.textContent = 'Teşekkürler! Kaydınız alındı.';
        msg.style.color = '#0a7f2e';
        newsletterForm.reset();
      } else {
        msg.textContent = 'Lütfen geçerli bir e-posta girin ve onay kutusunu işaretleyin.';
        msg.style.color = '#b00000';
      }
    });
  }

  // Contact form
  const contactForm = $('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = $('.contact-message');
      msg.textContent = 'Mesajınız alındı. Teşekkürler!';
      msg.style.color = '#0a7f2e';
      contactForm.reset();
    });
  }

  // About slider
  const aboutSlider = $('#aboutSlider');
  if (aboutSlider) {
    const aboutSlides = $$('.about-slide', aboutSlider);
    const prevBtn = $('.about-prev', aboutSlider);
    const nextBtn = $('.about-next', aboutSlider);
    // Label element removed
    const counterCurrent = $('.about-counter-current', aboutSlider);
    const counterTotal = $('.about-counter-total', aboutSlider);
    const liveRegion = $('#aboutLiveRegion');
    const progressBar = $('.about-progress-bar', aboutSlider);

    const resolveDuration = () => {
      const raw = getComputedStyle(aboutSlider).getPropertyValue('--about-duration').trim();
      if (!raw) return 7000;
      if (raw.endsWith('ms')) return parseFloat(raw);
      if (raw.endsWith('s')) return parseFloat(raw) * 1000;
      const parsed = parseFloat(raw);
      return Number.isFinite(parsed) ? parsed : 7000;
    };

    const AUTOPLAY_DELAY = resolveDuration();
    const totalSlides = aboutSlides.length;
    let idx = 0;
    let autoTimer = null;
    let progressAnimation = null;
    let touchStartX = null;

    if (counterTotal) {
      counterTotal.textContent = String(totalSlides).padStart(2, '0');
    }

    const animateProgress = () => {
      // Progress animation disabled
      return;
    };

    const updateAccessibility = (label) => {
      aboutSlides.forEach((slide, slideIndex) => {
        slide.setAttribute('aria-hidden', slideIndex === idx ? 'false' : 'true');
      });

      if (liveRegion) {
        const readableLabel = label || '';
        liveRegion.textContent = `${readableLabel} slayt ${String(idx + 1).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`.trim();
      }
    };

    const setAboutSlide = (target) => {
      idx = (target + totalSlides) % totalSlides;

      aboutSlides.forEach((slide, slideIndex) => {
        slide.classList.toggle('active', slideIndex === idx);
      });

      const activeSlide = aboutSlides[idx];
      const activeLabel = activeSlide?.dataset.label || activeSlide?.querySelector('.about-tag')?.textContent?.trim() || '';

      if (counterCurrent) {
        counterCurrent.textContent = String(idx + 1).padStart(2, '0');
      }

      // Label update removed

      updateAccessibility(activeLabel);
    };

    const stopAutoplay = () => {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
      progressAnimation?.cancel?.();
      progressAnimation = null;
    };

    const startAutoplay = () => {
      // Auto-play disabled for professional appearance
      return;
    };

    const goToSlide = (target, { resume = false } = {}) => {
      stopAutoplay();
      setAboutSlide(target);
      // Auto-resume disabled
    };

    prevBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      goToSlide(idx - 1);
    });

    nextBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      goToSlide(idx + 1);
    });

    // Auto-play event listeners removed for manual control only

    aboutSlider.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToSlide(idx - 1);
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToSlide(idx + 1);
      }
    });

    aboutSlider.addEventListener('touchstart', (event) => {
      touchStartX = event.touches[0].clientX;
      stopAutoplay();
    }, { passive: true });

    aboutSlider.addEventListener('touchmove', (event) => {
      if (touchStartX === null) return;
      const deltaX = event.touches[0].clientX - touchStartX;
      if (Math.abs(deltaX) > 60) {
        goToSlide(deltaX > 0 ? idx - 1 : idx + 1, { resume: false });
        touchStartX = null;
      }
    }, { passive: true });

    const resumeAfterTouch = () => {
      touchStartX = null;
      // Auto-play disabled
    };

    aboutSlider.addEventListener('touchend', resumeAfterTouch);
    aboutSlider.addEventListener('touchcancel', resumeAfterTouch);

    setAboutSlide(0);
    // Auto-play disabled - manual control only
  }

  // Sector navigation functionality
  const sectorCards = $$('.sector-card');
  if (sectorCards.length > 0) {
    sectorCards.forEach((card, index) => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Change slide and title (showSlide will update active states)
        showSlide(index);

        // Update hero title
        const heroTitle = $('#heroTitle');
        if (heroTitle) {
          heroTitle.textContent = slideData[index].title;
        }
      });
    });
  }



  // Update footer year
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
