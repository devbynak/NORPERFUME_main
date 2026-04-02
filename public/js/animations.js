/**
 * NOR PERFUME — Animations Controller
 * Centralized scroll reveals, parallax, counters, 3D tilt
 * Honors prefers-reduced-motion
 */

const NorAnimations = (() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── Scroll Reveal ── */
    function initReveal() {
        document.documentElement.classList.add('reveal-ready');
        const els = document.querySelectorAll('.fade-up, .fade-left, .fade-right, .scale-up, .fade-in');
        if (!els.length) return;

        if (prefersReduced) {
            els.forEach(el => el.classList.add('visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const delay = parseFloat(entry.target.dataset.delay || 0);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        els.forEach(el => observer.observe(el));
    }

    /* ── Staggered group reveals ── */
    function initGroupStagger() {
        const groups = document.querySelectorAll('[data-stagger]');
        groups.forEach(group => {
            const children = group.children;
            Array.from(children).forEach((child, i) => {
                child.dataset.delay = String(i * (parseInt(group.dataset.stagger) || 80));
            });
        });
    }

    /* ── Stats Counter ── */
    function initCounters() {
        const counters = document.querySelectorAll('[data-count]');
        if (!counters.length) return;

        function animateCounter(el) {
            const target = parseFloat(el.dataset.count);
            const suffix = el.dataset.suffix || '';
            const prefix = el.dataset.prefix || '';
            const duration = parseInt(el.dataset.duration || 2000);
            const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
            const start = performance.now();

            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = target * eased;
                el.textContent = prefix + current.toFixed(decimals) + suffix;
                if (progress < 1) requestAnimationFrame(update);
            }

            requestAnimationFrame(update);
        }

        if (prefersReduced) {
            counters.forEach(el => {
                const t = parseFloat(el.dataset.count);
                const s = el.dataset.suffix || '';
                const p = el.dataset.prefix || '';
                const d = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
                el.textContent = p + t.toFixed(d) + s;
            });
            return;
        }

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.5 });

        counters.forEach(el => observer.observe(el));
    }

    /* ── 3D Tilt on Cards ── */
    function initTilt() {
        if (prefersReduced) return;
        // Only on non-touch devices
        if (window.matchMedia('(hover: none)').matches) return;

        const cards = document.querySelectorAll('.product-card, .review-card, .float-card');

        cards.forEach(card => {
            let frame;

            card.addEventListener('mousemove', (e) => {
                cancelAnimationFrame(frame);
                frame = requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width  - 0.5;
                    const y = (e.clientY - rect.top)  / rect.height - 0.5;
                    const tiltX = y * -8;
                    const tiltY = x * 10;
                    card.style.transform = `
                        perspective(900px)
                        rotateX(${tiltX}deg)
                        rotateY(${tiltY}deg)
                        translateY(-4px)
                        scale(1.015)
                    `;
                });
            });

            card.addEventListener('mouseleave', () => {
                cancelAnimationFrame(frame);
                card.style.transform = '';
            });
        });
    }

    /* ── Parallax Header BG ── */
    function initParallax() {
        if (prefersReduced) return;
        if (window.matchMedia('(hover: none)').matches) return;

        const heroMedia = document.querySelector('.hero-media');
        if (!heroMedia) return;

        let frame;
        let lastScrollY = window.scrollY;

        function update() {
            const scrollY = window.scrollY;
            if (Math.abs(scrollY - lastScrollY) < 1) { frame = requestAnimationFrame(update); return; }
            lastScrollY = scrollY;
            const translateY = scrollY * 0.35;
            heroMedia.style.transform = `scale(1.05) translateY(${translateY}px)`;
            frame = requestAnimationFrame(update);
        }

        window.addEventListener('scroll', () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(update);
        }, { passive: true });
    }

    /* ── Marquee duplicate content ── */
    function initMarquee() {
        const tracks = document.querySelectorAll('.marquee-track, .reviews-track');
        tracks.forEach(track => {
            // Clone if not already doubled
            if (!track.dataset.doubled) {
                const clone = track.innerHTML;
                track.innerHTML += clone;
                track.dataset.doubled = '1';
            }
        });
    }

    /* ── Page Transition ── */
    function initPageTransition() {
        if (prefersReduced) return;

        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        document.body.appendChild(overlay);

        // Reveal on load
        overlay.classList.add('leaving');
        overlay.addEventListener('animationend', () => {
            overlay.classList.remove('leaving');
        }, { once: true });

        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('mailto') ||
                href.startsWith('tel') || href.startsWith('http') ||
                link.target === '_blank') return;

            link.addEventListener('click', (e) => {
                e.preventDefault();
                overlay.classList.add('entering');
                overlay.addEventListener('animationend', () => {
                    window.location.href = href;
                }, { once: true });
            });
        });
    }

    /* ── Scroll Progress Bar ── */
    function initScrollProgress() {
        const bar = document.createElement('div');
        bar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 2px;
            width: 0%;
            background: linear-gradient(90deg, var(--c-gold), var(--c-cream));
            z-index: 99999;
            transition: width 0.1s;
            pointer-events: none;
        `;
        document.body.appendChild(bar);

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
                    bar.style.width = Math.min(progress, 100) + '%';
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /* ── Init All ── */
    function init() {
        initGroupStagger();
        initReveal();
        initCounters();
        initTilt();
        initParallax();
        initMarquee();
        initScrollProgress();
        // Page transitions disabled by default — enable if routes support it
        // initPageTransition();
    }

    return { init, initReveal, initCounters, initTilt };
})();

// Auto-init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', NorAnimations.init);
} else {
    NorAnimations.init();
}
