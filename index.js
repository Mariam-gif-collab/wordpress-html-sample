document.addEventListener('DOMContentLoaded', () => {

      /* 1. Initialize AOS with repeat animations on scroll down */
      AOS.init({
        duration: 800,
        easing: 'ease-out-quad',
        once: false, // Re-triggers animation whenever scrolled back into view
        mirror: true, // Mirrors out animation when scrolling past
        offset: 100
      });

      /* 2. GSAP Hero Section Intro */
      gsap.from(".gsap-hero", {
        duration: 1.2,
        y: 50,
        opacity: 0,
        stagger: 0.2,
        ease: "power3.out"
      });

      /* 3. Sticky Glassmorphism Header */
      const header = document.getElementById('mainHeader');
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      });

      /* 4. Mobile navigation toggle */
      const navMenu = document.querySelector('.nav-menu');
      const menuToggle = document.querySelector('.mobile-menu-toggle');

      if (navMenu && menuToggle) {
        menuToggle.addEventListener('click', () => {
          const isOpen = navMenu.classList.toggle('is-open');
          menuToggle.classList.toggle('active', isOpen);
          menuToggle.setAttribute('aria-expanded', String(isOpen));
        });

        navMenu.querySelectorAll('a').forEach(link => {
          link.addEventListener('click', () => {
            navMenu.classList.remove('is-open');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
          });
        });
      }

      /* 5. Stat Counter that runs EVERY time scrolled into view */
      const statNumbers = document.querySelectorAll('.stat-item .number');
      let isCounting = false;

      const runStatCounter = () => {
        statNumbers.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const duration = 1800;
          const stepTime = 25;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.innerText = target + (target === 100 ? 'K+' : '+');
              clearInterval(timer);
            } else {
              counter.innerText = Math.ceil(current);
            }
          }, stepTime);
        });
      };

      const resetCounters = () => {
        statNumbers.forEach(counter => {
          counter.innerText = '0';
        });
      };

      const statsSection = document.getElementById('statsSection');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            runStatCounter();
          } else {
            resetCounters(); // Reset to zero when leaving viewport
          }
        });
      }, { threshold: 0.3 });

      if (statsSection) {
        observer.observe(statsSection);
      }

      /* 6. Full-width hero image slider */
      const heroSlider = document.getElementById('heroSlider');

      if (heroSlider) {
        const track = heroSlider.querySelector('.hero-slider-track');
        const slides = heroSlider.querySelectorAll('.hero-slide');
        const dots = heroSlider.querySelectorAll('.hero-slider-dot');
        const previousButton = heroSlider.querySelector('.hero-slider-prev');
        const nextButton = heroSlider.querySelector('.hero-slider-next');
        let currentSlide = 0;
        let autoplay;

        const showSlide = (slideIndex) => {
          currentSlide = (slideIndex + slides.length) % slides.length;
          track.style.transform = `translateX(-${currentSlide * 100}%)`;
          slides.forEach((slide, index) => slide.classList.toggle('is-active', index === currentSlide));
          dots.forEach((dot, index) => {
            const isSelected = index === currentSlide;
            dot.classList.toggle('is-active', isSelected);
            dot.setAttribute('aria-selected', String(isSelected));
          });
        };

        const startAutoplay = () => {
          clearInterval(autoplay);
          autoplay = setInterval(() => showSlide(currentSlide + 1), 5000);
        };

        previousButton.addEventListener('click', () => {
          showSlide(currentSlide - 1);
          startAutoplay();
        });
        nextButton.addEventListener('click', () => {
          showSlide(currentSlide + 1);
          startAutoplay();
        });
        dots.forEach((dot, index) => dot.addEventListener('click', () => {
          showSlide(index);
          startAutoplay();
        }));
        heroSlider.addEventListener('mouseenter', () => clearInterval(autoplay));
        heroSlider.addEventListener('mouseleave', startAutoplay);
        heroSlider.addEventListener('focusin', () => clearInterval(autoplay));
        heroSlider.addEventListener('focusout', startAutoplay);
        startAutoplay();
      }
    });


    gsap.registerPlugin(ScrollTrigger);

// Hero Entrance Animation
gsap.from(".hero-content > *", {
    y: 50,
    opacity: 0,
    duration: 1.2,
    stagger: 0.2,
    ease: "power4.out"
});

// Reveal Animations for Content Sections
gsap.utils.toArray('.gsap-reveal').forEach((element) => {
    gsap.from(element, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });
});

// Re-triggerable Counter Animations on Scroll
const counters = document.querySelectorAll('.counter');
counters.forEach((counter) => {
    const target = +counter.getAttribute('data-target');

    ScrollTrigger.create({
        trigger: counter,
        start: "top 90%",
        onEnter: () => animateCounter(counter, target),
        onEnterBack: () => animateCounter(counter, target)
    });
});

function animateCounter(counter, target) {
    gsap.fromTo(counter, 
        { innerText: 0 },
        {
            innerText: target,
            duration: 2,
            snap: { innerText: 1 },
            ease: "power2.out"
        }
    );
}

// Auto-playing Timeline Slider (2 Cards Visible)
const sliderTrack = document.getElementById('sliderTrack');
const prevBtn = document.getElementById('slidePrev');
const nextBtn = document.getElementById('slideNext');

if (sliderTrack && prevBtn && nextBtn) {
    let currentIndex = 0;
    const cards = sliderTrack.querySelectorAll('.timeline-card');
    
    function getSlideStep() {
        const card = cards[0];
        const gap = 24; // Must match CSS gap
        return card ? card.offsetWidth + gap : 0;
    }

    function getMaxIndex() {
        const visibleCards = window.innerWidth <= 768 ? 1 : 2;
        return Math.max(0, cards.length - visibleCards);
    }

    function updateSliderPosition() {
        const step = getSlideStep();
        sliderTrack.style.transform = `translateX(-${currentIndex * step}px)`;
    }

    function slideNext() {
        const maxIndex = getMaxIndex();
        if (currentIndex < maxIndex) {
            currentIndex++;
        } else {
            currentIndex = 0; // Loop back to start
        }
        updateSliderPosition();
    }

    function slidePrev() {
        const maxIndex = getMaxIndex();
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = maxIndex; // Loop to end
        }
        updateSliderPosition();
    }

    nextBtn.addEventListener('click', () => {
        slideNext();
        resetAutoplay();
    });

    prevBtn.addEventListener('click', () => {
        slidePrev();
        resetAutoplay();
    });

    // Auto-scroll loop
    let autoplayInterval = setInterval(slideNext, 3500);

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        autoplayInterval = setInterval(slideNext, 3500);
    }

    // Pause on mouse hover
    // sliderTrack.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    // sliderTrack.addEventListener('mouseleave', () => resetAutoplay());

    // Recalculate on screen resize
    window.addEventListener('resize', () => {
        if (currentIndex > getMaxIndex()) {
            currentIndex = getMaxIndex();
        }
        updateSliderPosition();
    });
}