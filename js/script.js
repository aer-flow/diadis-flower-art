document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Initialize Lenis Smooth Scroll (Snappier)
    const lenis = new Lenis({
        duration: 0.8, // Reduced from 1.2
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // Connect GSAP with Lenis
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time)=>{ lenis.raf(time * 1000) });
    gsap.ticker.lagSmoothing(0);

    // 2. Custom Cursor Logic
    const cursor = document.querySelector('.custom-cursor');
    if(window.matchMedia("(pointer: fine)").matches && cursor) {
        const cursorLabel = document.createElement('div');
        cursorLabel.className = 'cursor-label';
        cursorLabel.innerText = 'Detalii';
        document.body.appendChild(cursorLabel);

        const xSet = gsap.quickSetter(cursor, "x", "px");
        const ySet = gsap.quickSetter(cursor, "y", "px");
        const lxSet = gsap.quickSetter(cursorLabel, "x", "px");
        const lySet = gsap.quickSetter(cursorLabel, "y", "px");

        window.addEventListener('mousemove', (e) => {
            xSet(e.clientX);
            ySet(e.clientY);
            lxSet(e.clientX);
            lySet(e.clientY);
        });
        const hoverables = document.querySelectorAll('a, button, input, select, .ba-slider-input, .bento-item');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovered');
                if(el.classList.contains('bento-item')) {
                    cursorLabel.style.opacity = '1';
                    gsap.to(cursor, { width: 80, height: 80, duration: 0.4, ease: "liquid" });
                }
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovered');
                cursorLabel.style.opacity = '0';
                gsap.to(cursor, { width: 12, height: 12, duration: 0.4, ease: "liquid" });
            });
        });

        // Magnetic Buttons
        const magneticElements = document.querySelectorAll('.btn-gold, .nav-item, .wa-float');
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.6, ease: "power2.out" });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
            });
        });
    }

    // 3. GSAP Animations Setup
    const heroTl = gsap.timeline();
    heroTl.fromTo(".gsap-nav", { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" })
          .fromTo(".hero-img-container", 
            { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)", opacity: 0 }, 
            { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", opacity: 1, duration: 1.2, ease: "power4.inOut" }, "-=0.5")
          .fromTo(".hero-img-container img", 
            { scale: 1.2 }, 
            { scale: 1, duration: 1.8, ease: "power2.out" }, "-=1.2")
          .fromTo(".hero-title.floral-reveal .word", 
            { 
                opacity: 0, 
                filter: "blur(20px)",
                y: 30,
                scale: 0.9,
                webkitMaskPosition: "0 100%" 
            }, 
            { 
                opacity: 1, 
                filter: "blur(0px)",
                y: 0,
                scale: 1,
                webkitMaskPosition: "0 0%",
                stagger: 0.1, 
                duration: 1.5, 
                ease: "power2.out" 
            }, "-=1.0")
          .fromTo(".gsap-fade-up", { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: "power2.out" }, "-=0.6");

    gsap.to(".hero-img-container img", {
        yPercent: 10, ease: "none", // Reduced from 20
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });

    // Journey Steps (Faster)
    gsap.fromTo(".step-card", 
        { y: 20, opacity: 0, scale: 0.99 },
        { 
            y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "power2.out",
            scrollTrigger: {
                trigger: ".journey-grid",
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        }
    );

    // Generic Fade Up (Faster)
    gsap.utils.toArray('.gs-fade-up:not(.step-card)').forEach(element => {
        gsap.fromTo(element, 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power2.out",
              scrollTrigger: { trigger: element, start: "top 95%", toggleActions: "play none none reverse" }
            }
        );
    });

    // 5. Testimonial Autoscroll
    const testimonialGrid = document.querySelector('.testimonials-grid');
    if(testimonialGrid) {
        gsap.to(testimonialGrid, {
            xPercent: -50,
            ease: "none",
            duration: 120, // Significantly slowed down for readability
            repeat: -1
        });
    }

    gsap.utils.toArray('.gs-reveal-img').forEach(container => {
        let img = container.querySelector('img');
        gsap.fromTo(container,
            { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" },
            { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", duration: 0.7, ease: "power2.out",
              scrollTrigger: { 
                  trigger: container, 
                  start: "top 95%",
                  toggleActions: "play none none none"
              }
            }
        );
        if(img) {
            gsap.fromTo(img,
                { scale: 1.1, yPercent: -5 },
                { scale: 1, yPercent: 5, duration: 1, ease: "power2.out",
                  scrollTrigger: { trigger: container, start: "top 100%", end: "bottom 0%", scrub: 1 }
                }
            );
        }
    });

    // 4. Before/After Slider Engine
    const sliderInput = document.querySelector('.ba-slider-input');
    const beforeWrapper = document.querySelector('.ba-image-before-wrapper');
    const sliderButton = document.querySelector('.ba-slider-button');
    if(sliderInput) {
        sliderInput.addEventListener('input', (e) => {
            const val = e.target.value;
            beforeWrapper.style.width = `${val}%`;
            sliderButton.style.left = `${val}%`;
        });
    }

    // 5. Sparkles Particles (High Performance tsParticles)
    if (typeof tsParticles !== 'undefined') {
        tsParticles.load({
            id: "tsparticles",
            options: {
                background: { color: { value: "transparent" } },
                fullScreen: { enable: false },
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onClick: { enable: true, mode: "push" },
                        resize: { enable: true },
                    },
                    modes: {
                        push: { quantity: 4 },
                    },
                },
                particles: {
                    color: { value: "#ffffff" },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: { default: "out" },
                        random: true,
                        speed: { min: 0.1, max: 0.8 },
                        straight: false,
                    },
                    number: {
                        density: { enable: true, width: 800, height: 800 },
                        value: 160,
                    },
                    opacity: {
                        value: { min: 0.1, max: 1 },
                        animation: {
                            enable: true,
                            speed: 2,
                            sync: false,
                            startValue: "random",
                        },
                    },
                    shape: { type: "circle" },
                    size: {
                        value: { min: 1, max: 3 },
                    },
                },
                detectRetina: true,
            }
        });
    }
});
