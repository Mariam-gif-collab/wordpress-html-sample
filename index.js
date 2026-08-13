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

      /* 4. Stat Counter that runs EVERY time scrolled into view */
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
    });