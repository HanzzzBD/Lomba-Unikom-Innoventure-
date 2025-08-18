/* ===== SMKN 4 BANDUNG LANDING PAGE JAVASCRIPT ===== */

document.addEventListener('DOMContentLoaded', function() {
    // ===== MOBILE MENU TOGGLE =====
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    function openMobileMenu() {
        mobileMenu.classList.remove('menu-bounce-in', 'menu-bounce-out');
        mobileMenu.classList.remove('hidden');
        void mobileMenu.offsetWidth; // reflow
        mobileMenu.classList.add('menu-bounce-in');
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('menu-bounce-in', 'menu-bounce-out');
        void mobileMenu.offsetWidth; // reflow to ensure animation triggers
        mobileMenu.classList.add('menu-bounce-out');
        let didHide = false;
        const onEnd = function() {
            mobileMenu.removeEventListener('animationend', onEnd);
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('menu-bounce-out');
            didHide = true;
        };
        mobileMenu.addEventListener('animationend', onEnd, { once: true });
        // Fallback in case animationend doesn't fire
        setTimeout(() => {
            if (!didHide) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('menu-bounce-out');
            }
        }, 400);
    }

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) openMobileMenu(); else closeMobileMenu();
        });
        // Click outside to close
        document.addEventListener('click', function(e) {
            const clickInsideMenu = mobileMenu.contains(e.target);
            const clickOnButton = mobileMenuButton.contains(e.target);
            if (!clickInsideMenu && !clickOnButton && !mobileMenu.classList.contains('hidden')) {
                closeMobileMenu();
            }
        });
    }

    // ===== SMOOTH SCROLLING =====
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu with animation if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    closeMobileMenu();
                }
            }
        });
    });

    // ===== LIQUID NAVIGATION SYSTEM =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.liquid-nav-link');
    const liquidIndicator = document.getElementById('liquid-indicator');
    const brandContainer = document.querySelector('.brand-liquid-container');
    
    // Initialize liquid indicator position
    function initializeLiquidIndicator() {
        if (liquidIndicator && navLinks.length > 0) {
            // Start with first nav link (Beranda) instead of brand container
            const firstNavLink = navLinks[0];
            if (firstNavLink) {
                const linkRect = firstNavLink.getBoundingClientRect();
                const containerRect = firstNavLink.closest('.nav-links-liquid-container').getBoundingClientRect();
                
                // Calculate relative position within the container
                const relativeLeft = linkRect.left - containerRect.left;
                const targetWidth = linkRect.width;
                
                liquidIndicator.style.width = `${targetWidth}px`;
                liquidIndicator.style.left = `${relativeLeft}px`;
                liquidIndicator.classList.add('active');
                
                // Set first nav link as active initially
                firstNavLink.classList.add('active');
                
                console.log('Liquid indicator initialized:', {
                    width: targetWidth,
                    left: relativeLeft,
                    linkWidth: linkRect.width,
                    containerLeft: containerRect.left
                });
            }
        }
    }
    
    // Update liquid indicator position with smooth animation
    function updateLiquidIndicator(targetLink) {
        if (!liquidIndicator || !targetLink) return;
        
        const container = targetLink.closest('.nav-links-liquid-container');
        if (!container) return;
        
        const linkRect = targetLink.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // Calculate relative position within the container
        const relativeLeft = linkRect.left - containerRect.left;
        const targetWidth = linkRect.width;
        
        console.log('Updating liquid indicator:', {
            targetLink: targetLink.textContent,
            width: targetWidth,
            left: relativeLeft,
            linkWidth: linkRect.width,
            containerLeft: containerRect.left
        });
        
        // Add bounce effect
        liquidIndicator.classList.add('active');
        
        // Animate liquid indicator
        liquidIndicator.style.width = `${targetWidth}px`;
        liquidIndicator.style.left = `${relativeLeft}px`;
        
        // Remove bounce class after animation
        setTimeout(() => {
            liquidIndicator.classList.remove('active');
        }, 600);
    }
    
    // Update active navigation with liquid effect
    function updateActiveNav() {
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
                        updateLiquidIndicator(link);
                    }
                });
                
                // Update brand container if on beranda section
                if (brandContainer) {
                    if (sectionId === 'beranda') {
                        brandContainer.classList.add('active');
                    } else {
                        brandContainer.classList.remove('active');
                    }
                }
            }
        });
    }
    
    // Initialize liquid indicator on page load
    setTimeout(initializeLiquidIndicator, 100);
    
    // Add resize listener to recalculate positions
    window.addEventListener('resize', function() {
        setTimeout(initializeLiquidIndicator, 100);
    });
    
    window.addEventListener('scroll', updateActiveNav);
    
    // Add click event for smooth liquid indicator movement
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Update liquid indicator immediately on click
                updateLiquidIndicator(this);
                
                // Smooth scroll to section
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active state
                navLinks.forEach(navLink => {
                    navLink.classList.remove('active');
                });
                this.classList.add('active');
                
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // ===== INTERSECTION OBSERVER ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements untuk animasi
    const animateElements = document.querySelectorAll('.group, .bg-white, .bg-gray-50');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // ===== COUNTER ANIMATION =====
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }
    
    // Trigger counter animation when stats section is visible
    const statsSection = document.querySelector('#tentang');
    if (statsSection) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Only look for counters if they exist
                    const counters = entry.target.querySelectorAll('.text-4xl');
                    if (counters.length > 0) {
                        counters.forEach(counter => {
                            const target = parseInt(counter.textContent);
                            if (!isNaN(target)) {
                                animateCounter(counter, target);
                            }
                        });
                    }
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }

    // ===== VIDEO BACKGROUND MANAGEMENT =====
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        // Add loading class initially
        heroVideo.classList.add('loading');
        
        // Handle video events
        heroVideo.addEventListener('loadeddata', function() {
            this.classList.remove('loading');
            this.classList.add('loaded');
        });
        
        heroVideo.addEventListener('error', function() {
            this.classList.add('error');
            console.log('Video failed to load, using fallback background');
        });
        
        // Pause video when not visible for performance
        const videoObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    heroVideo.play().catch(e => console.log('Video autoplay failed:', e));
                } else {
                    heroVideo.pause();
                }
            });
        }, { threshold: 0.1 });
        
        videoObserver.observe(heroVideo);
    }

    // ===== HOVER EFFECTS =====
    const jurusanCards = document.querySelectorAll('#jurusan .group');
    jurusanCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // ===== BACK TO TOP BUTTON =====
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopButton.className = 'fixed bottom-8 right-8 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 transform translate-y-20 opacity-0 z-40';
    backToTopButton.setAttribute('aria-label', 'Kembali ke atas');
    
    document.body.appendChild(backToTopButton);
    
    // Show/hide back to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.remove('translate-y-20', 'opacity-0');
        } else {
            backToTopButton.classList.add('translate-y-20', 'opacity-0');
        }
    });
    
    // Back to top functionality
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ===== KEYBOARD NAVIGATION =====
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
            closeMobileMenu();
        }
    });

    // ===== THEME TOGGLE FUNCTIONALITY =====
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    
    // Initialize theme from localStorage or default to light
    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        document.body.setAttribute('data-theme', savedTheme);
        
        // Update toggle button state
        if (themeToggle) themeToggle.setAttribute('data-theme', savedTheme);
        if (mobileThemeToggle) mobileThemeToggle.setAttribute('data-theme', savedTheme);
        
        console.log('Theme initialized:', savedTheme);
    }
    
    // Toggle theme function
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Update document attributes
        document.documentElement.setAttribute('data-theme', newTheme);
        document.body.setAttribute('data-theme', newTheme);
        
        // Update toggle buttons
        if (themeToggle) themeToggle.setAttribute('data-theme', newTheme);
        if (mobileThemeToggle) mobileThemeToggle.setAttribute('data-theme', newTheme);
        
        // Save to localStorage
        localStorage.setItem('theme', newTheme);
        
        // Add ripple effect to toggle
        createToggleRipple();
        
        console.log('Theme toggled to:', newTheme);
    }
    
    // Create ripple effect on toggle
    function createToggleRipple() {
        const ripple = document.createElement('div');
        ripple.className = 'toggle-ripple-effect';
        ripple.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 9999;
            animation: toggle-ripple 0.6s ease-out forwards;
        `;
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    // Add event listeners for theme toggles
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('click', toggleTheme);
    }
    
    // Initialize theme on page load
    initializeTheme();
    
    // ===== INITIALIZATION =====
    console.log('SMKN 4 Bandung Landing Page loaded successfully!');
    
    // ===== TEST RIPPLE BUTTON =====
    const testRippleBtn = document.getElementById('test-ripple-btn');
    if (testRippleBtn) {
        testRippleBtn.addEventListener('click', function() {
            console.log('Test ripple button clicked');
            
            // Try jQuery ripples first
            if (typeof $ !== 'undefined' && typeof $.fn.ripples !== 'undefined') {
                const heroSection = $('#beranda');
                if (heroSection.length > 0) {
                    const x = Math.random() * heroSection.width();
                    const y = Math.random() * heroSection.height();
                    heroSection.ripples('drop', x, y, 30, 0.1);
                    console.log('jQuery ripple triggered at:', x, y);
                }
            } else {
                // Fallback to custom ripple
                const heroSection = document.getElementById('beranda');
                if (heroSection) {
                    const x = Math.random() * heroSection.offsetWidth;
                    const y = Math.random() * heroSection.offsetHeight;
                    createRipple(x, y);
                    console.log('Custom ripple triggered at:', x, y);
                }
            }
        });
    }
});

// ===== JQUERY RIPPLES EFFECT =====
$(document).ready(function() {
    console.log('jQuery loaded:', typeof $ !== 'undefined');
    console.log('jQuery version:', $.fn.jquery);
    
    // Check if device is mobile/touch
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 'ontouchstart' in window;
    console.log('Is mobile device:', isMobile);
    
    // Check if jQuery Ripples plugin is loaded
    if (typeof $.fn.ripples === 'undefined') {
        console.warn('jQuery Ripples plugin not loaded. Loading from CDN...');
        loadJQueryRipples();
        return;
    }
    
    console.log('jQuery Ripples plugin found, initializing...');
    if (!isMobile) {
        initializeJQueryRipples();
    }
});

function loadJQueryRipples() {
    console.log('Loading jQuery Ripples plugin...');
    
    // Load jQuery Ripples plugin dynamically
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery.ripples/0.5.3/jquery.ripples.min.js';
    
    script.onload = function() {
        console.log('jQuery Ripples plugin loaded successfully');
        if (typeof $.fn.ripples !== 'undefined') {
            console.log('Plugin loaded, ripples function available');
            initializeJQueryRipples();
        } else {
            console.error('Plugin loaded but ripples function not available');
            createCustomRippleEffect();
        }
    };
    
    script.onerror = function() {
        console.error('Failed to load jQuery Ripples plugin');
        createCustomRippleEffect();
    };
    
    document.head.appendChild(script);
}

function initializeJQueryRipples() {
    console.log('Initializing jQuery Ripples...');
    
    const heroSection = $('#beranda');
    if (heroSection.length === 0) {
        console.warn('Hero section #beranda not found');
        return;
    }
    
    console.log('Hero section found:', heroSection.length);
    console.log('jQuery Ripples function available:', typeof $.fn.ripples);
    
    try {
        // Configure ripples for background image compatibility
        heroSection.ripples({
            resolution: 256,
            dropRadius: 25,
            perturbance: 0.08,
            interactive: true,
            crossOrigin: '',
            dropAnimateTime: 800,
            dropGradientTime: 600,
            imageUrl: null, // No image URL for background images
            imgWidth: 0,
            imgHeight: 0
        });
        
        console.log('jQuery Ripples initialized successfully');
        
        // Add click event for manual ripple drops
        heroSection.on('click', function(e) {
            console.log('Click event triggered');
            const $el = $(this);
            const x = e.pageX - $el.offset().left;
            const y = e.pageY - $el.offset().top;
            const dropRadius = 25;
            const strength = 0.08 + Math.random() * 0.04;
            
            $el.ripples('drop', x, y, dropRadius, strength);
        });
        
        // Add automatic ripple effect
        setInterval(function() {
            const $el = heroSection;
            const x = Math.random() * $el.width();
            const y = Math.random() * $el.height();
            const dropRadius = 20 + Math.random() * 15;
            const strength = 0.06 + Math.random() * 0.04;
            
            $el.ripples('drop', x, y, dropRadius, strength);
        }, 2500);
        
        // Add mouse movement ripple effect
        heroSection.on('mousemove', function(e) {
            if (Math.random() < 0.15) { // Increased frequency
                const $el = $(this);
                const x = e.pageX - $el.offset().left;
                const y = e.pageY - $el.offset().top;
                const dropRadius = 15 + Math.random() * 10;
                const strength = 0.04 + Math.random() * 0.03;
                
                $el.ripples('drop', x, y, dropRadius, strength);
            }
        });
        
    } catch (error) {
        console.error('jQuery Ripples failed to initialize:', error);
        createCustomRippleEffect();
    }
}

// ===== FALLBACK CUSTOM RIPPLE EFFECT =====
let globalRippleContainer = null;

function createRipple(x, y) {
    if (!globalRippleContainer) {
        console.error('Ripple container not initialized');
        return;
    }
    
    const ripple = document.createElement('div');
    ripple.className = 'custom-ripple';
    
    // Calculate position relative to hero section
    const heroSection = document.getElementById('beranda');
    if (!heroSection) return;
    
    const rect = heroSection.getBoundingClientRect();
    const relativeX = x - rect.left;
    const relativeY = y - rect.top;
    
    // Randomize ripple properties for variety
    const rippleSize = 300 + Math.random() * 200;
    const rippleColor = Math.random() > 0.5 ? 
        'rgba(59, 130, 246, 0.6)' : 
        'rgba(139, 92, 246, 0.6)';
    
    ripple.style.cssText = `
        position: absolute;
        left: ${relativeX}px;
        top: ${relativeY}px;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: ${rippleColor};
        transform: translate(-50%, -50%);
        animation: ripple-animation 2.5s ease-out forwards;
        pointer-events: none;
        --ripple-size: ${rippleSize}px;
    `;
    
    globalRippleContainer.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 2500);
}

function createCustomRippleEffect() {
    console.log('Creating fallback custom ripple effect...');
    
    const heroSection = document.getElementById('beranda');
    if (!heroSection) {
        console.error('Hero section not found for custom ripple');
        return;
    }
    
    // Create ripple container
    globalRippleContainer = document.createElement('div');
    globalRippleContainer.className = 'custom-ripple-container';
    globalRippleContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 25;
        overflow: hidden;
    `;
    
    heroSection.appendChild(globalRippleContainer);
    console.log('Ripple container created and added to hero section');
    
    // Add click event for ripples
    heroSection.addEventListener('click', function(e) {
        console.log('Custom ripple click event triggered');
        createRipple(e.clientX, e.clientY);
    });
    
    // Add automatic ripples with more variety
    const autoRippleInterval = setInterval(() => {
        const x = Math.random() * heroSection.offsetWidth;
        const y = Math.random() * heroSection.offsetHeight;
        createRipple(x, y);
    }, 2000); // More frequent ripples
    
    console.log('Fallback custom ripple effect created successfully');
    
    // Cleanup function
    return function cleanup() {
        clearInterval(autoRippleInterval);
        if (globalRippleContainer && globalRippleContainer.parentNode) {
            globalRippleContainer.parentNode.removeChild(globalRippleContainer);
            globalRippleContainer = null;
        }
    };
}
document.addEventListener('DOMContentLoaded', () => {
    if (window.AOS) {
      AOS.init({
        duration: 700,
        once: false,        // animasi bisa memutar ulang saat kembali masuk viewport
        mirror: true,       // aktifkan fade-out saat elemen keluar viewport
        offset: 80,
        easing: 'ease-out-cubic'
      });
      // Pastikan posisi awal/akhir terdeteksi dengan benar setelah semua asset termuat
      window.addEventListener('load', () => {
        AOS.refreshHard();
      });
    }

    // Force fade-out: hapus class aos-animate saat elemen keluar viewport
    const observed = Array.from(document.querySelectorAll('[data-aos]'));
    if (observed.length > 0) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
          } else {
            entry.target.classList.remove('aos-animate');
          }
        });
      }, { threshold: 0.15 });
      observed.forEach((el) => io.observe(el));
    }
});

