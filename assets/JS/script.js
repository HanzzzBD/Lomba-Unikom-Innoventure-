// JavaScript untuk SMKN 4 Bandung Landing Page

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth scrolling untuk anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('nav');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.classList.add('bg-white', 'shadow-lg');
            navbar.classList.remove('bg-white/95');
        } else {
            navbar.classList.remove('bg-white', 'shadow-lg');
            navbar.classList.add('bg-white/95');
        }
        
        lastScrollTop = scrollTop;
    });

    // Active navigation highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('text-blue-600', 'font-semibold');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('text-blue-600', 'font-semibold');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);

    // Intersection Observer untuk animasi scroll
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

    // Counter animation untuk stats
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
                    const counters = entry.target.querySelectorAll('.text-4xl');
                    counters.forEach(counter => {
                        const target = parseInt(counter.textContent);
                        animateCounter(counter, target);
                    });
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }

    // Video Background Management
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

    // Parallax effect untuk hero section
    const heroSection = document.querySelector('#beranda');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        });
    }

    // Hover effects untuk jurusan cards
    const jurusanCards = document.querySelectorAll('#jurusan .group');
    jurusanCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Form validation untuk contact form (jika ada)
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const formData = new FormData(this);
            let isValid = true;
            
            for (let [key, value] of formData.entries()) {
                if (!value.trim()) {
                    isValid = false;
                    break;
                }
            }
            
            if (isValid) {
                // Show success message
                showNotification('Pesan berhasil dikirim!', 'success');
                this.reset();
            } else {
                showNotification('Mohon lengkapi semua field!', 'error');
            }
        });
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full`;
        
        const colors = {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            info: 'bg-blue-500 text-white'
        };
        
        notification.className += ` ${colors[type]}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Lazy loading untuk images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('image-loading');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        img.classList.add('image-loading');
        imageObserver.observe(img);
    });

    // Back to top button
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

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    });

    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
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
    
    const debouncedScrollHandler = debounce(function() {
        updateActiveNav();
    }, 10);
    
    window.addEventListener('scroll', debouncedScrollHandler);

    // Initialize tooltips (jika menggunakan library tooltip)
    if (typeof tippy !== 'undefined') {
        tippy('[data-tippy-content]', {
            placement: 'top',
            animation: 'scale',
            duration: 200
        });
    }

    // Preload critical images
    const criticalImages = [
        'assets/logo-smkn4.png',
        'assets/hero-bg.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    // Service Worker registration (untuk PWA)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('SW registered: ', registration);
                })
                .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }

    // Analytics tracking (contoh)
    function trackEvent(category, action, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
    }
    
    // Track important user interactions
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="#"]')) {
            trackEvent('Navigation', 'Internal Link Click', e.target.getAttribute('href'));
        }
        
        if (e.target.matches('button')) {
            trackEvent('Button', 'Click', e.target.textContent.trim());
        }
    });

    console.log('SMKN 4 Bandung Landing Page loaded successfully!');
});
// jQuery Ripples Effect for Hero Section (Video Compatible)
$(document).ready(function() {
    // Check if device is mobile/touch
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 'ontouchstart' in window;
    
    // Check if jQuery Ripples plugin is loaded
    if (typeof $.fn.ripples === 'undefined') {
        console.warn('jQuery Ripples plugin not loaded. Loading from CDN...');
        loadJQueryRipples();
        return;
    }
    
    if (!isMobile) {
        // Initialize jQuery Ripples with video compatibility
        initializeJQueryRipples();
    }
});

function loadJQueryRipples() {
    // Load jQuery Ripples plugin dynamically
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery.ripples/0.5.3/jquery.ripples.min.js';
    script.onload = function() {
        console.log('jQuery Ripples plugin loaded successfully');
        if (!isMobile) {
            initializeJQueryRipples();
        }
    };
    script.onerror = function() {
        console.error('Failed to load jQuery Ripples plugin');
    };
    document.head.appendChild(script);
}

function initializeJQueryRipples() {
    const heroSection = $('#beranda');
    if (heroSection.length === 0) {
        console.warn('Hero section #beranda not found');
        return;
    }
    
    console.log('Initializing jQuery Ripples on #beranda...');
    
    try {
        // Configure ripples for video compatibility
        heroSection.ripples({
            resolution: 256, // Lower resolution for better performance
            dropRadius: 20,
            perturbance: 0.04,
            interactive: true,
            crossOrigin: '',
            dropAnimateTime: 600,
            dropGradientTime: 400,
            // Video compatibility settings
            imageUrl: null, // Don't use image
            imgWidth: 0,
            imgHeight: 0
        });
        
        // Add click event for manual ripple drops
        heroSection.on('click', function(e) {
            const $el = $(this);
            const x = e.pageX - $el.offset().left;
            const y = e.pageY - $el.offset().top;
            const dropRadius = 20;
            const strength = 0.04 + Math.random() * 0.04;
            
            $el.ripples('drop', x, y, dropRadius, strength);
        });
        
        // Add automatic ripple effect
        setInterval(function() {
            const $el = heroSection;
            const x = Math.random() * $el.width();
            const y = Math.random() * $el.height();
            const dropRadius = 15 + Math.random() * 10;
            const strength = 0.02 + Math.random() * 0.03;
            
            $el.ripples('drop', x, y, dropRadius, strength);
        }, 3000); // Create ripple every 3 seconds
        
        // Add mouse movement ripple effect
        heroSection.on('mousemove', function(e) {
            if (Math.random() < 0.1) { // 10% chance to create ripple on mouse move
                const $el = $(this);
                const x = e.pageX - $el.offset().left;
                const y = e.pageY - $el.offset().top;
                const dropRadius = 10 + Math.random() * 5;
                const strength = 0.01 + Math.random() * 0.02;
                
                $el.ripples('drop', x, y, dropRadius, strength);
            }
        });
        
        console.log('jQuery Ripples initialized successfully');
        
        // Test ripple effect
        setTimeout(function() {
            try {
                const $el = heroSection;
                const x = $el.width() / 2;
                const y = $el.height() / 2;
                $el.ripples('drop', x, y, 20, 0.04);
                console.log('Test ripple created successfully');
            } catch (testError) {
                console.error('Test ripple failed:', testError);
            }
        }, 1000);
        
    } catch (error) {
        console.error('jQuery Ripples failed to initialize:', error);
        // Fallback to custom ripple if jQuery Ripples fails
        createCustomRippleEffect();
    }
}

// Fallback Custom Ripple Effect (if jQuery Ripples fails)
function createCustomRippleEffect() {
    const heroSection = document.getElementById('beranda');
    if (!heroSection) return;
    
    console.log('Creating fallback custom ripple effect...');
    
    // Create ripple container
    const rippleContainer = document.createElement('div');
    rippleContainer.className = 'custom-ripple-container';
    rippleContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 25;
        overflow: hidden;
    `;
    
    heroSection.appendChild(rippleContainer);
    
    // Add click event for ripples
    heroSection.addEventListener('click', function(e) {
        createRipple(e.clientX, e.clientY);
    });
    
    // Add automatic ripples
    setInterval(() => {
        const x = Math.random() * heroSection.offsetWidth;
        const y = Math.random() * heroSection.offsetHeight;
        createRipple(x, y);
    }, 4000);
    
    function createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'custom-ripple';
        
        // Calculate position relative to hero section
        const rect = heroSection.getBoundingClientRect();
        const relativeX = x - rect.left;
        const relativeY = y - rect.top;
        
        ripple.style.cssText = `
            position: absolute;
            left: ${relativeX}px;
            top: ${relativeY}px;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            animation: ripple-animation 2s ease-out forwards;
            pointer-events: none;
        `;
        
        rippleContainer.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 2000);
    }
    
    console.log('Fallback custom ripple effect created successfully');
}
