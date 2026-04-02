/**
 * NOR PERFUME — main.js
 * Core site interactions: Lenis smooth scroll, navbar, mobile menu,
 * search overlay, newsletter form, marquee, cart count
 */

/* ─── Lenis Smooth Scroll ─── */
let lenis;
if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
        duration: 1.35,
        easing: t => 1 - Math.pow(1 - t, 5),
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.8,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
} else if (typeof window !== 'undefined') {
    // Mild fallback
    document.documentElement.style.scrollBehavior = 'smooth';
}

/* ─── Navbar ─── */
const navbar = document.getElementById('navbar');
if (navbar) {
    let lastScrollY = 0;
    let ticking = false;

    function handleNavbar() {
        const y = window.scrollY;
        navbar.classList.toggle('scrolled', y > 60);
        ticking = false;
        lastScrollY = y;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(handleNavbar);
            ticking = true;
        }
    }, { passive: true });
}

/* ─── Mobile Menu ─── */
(function initMobileMenu() {
    const toggleBtn = document.querySelector('.nav-menu-label');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeBtn = document.getElementById('mm-close');

    if (!toggleBtn || !mobileMenu) return;

    function openMenu() {
        mobileMenu.classList.add('active');
        toggleBtn.classList.add('active');
        document.body.style.overflow = 'hidden';
        toggleBtn.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');
    }

    function closeMenu() {
        mobileMenu.classList.remove('active');
        toggleBtn.classList.remove('active');
        document.body.style.overflow = '';
        toggleBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
    }

    toggleBtn.addEventListener('click', () => {
        mobileMenu.classList.contains('active') ? closeMenu() : openMenu();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    // Close on overlay click
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) closeMenu();
    });

    // Swipe left to close
    let touchStartX = 0;
    mobileMenu.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    mobileMenu.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (diff > 60) closeMenu();
    }, { passive: true });

    // Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) closeMenu();
    });
})();

/* ─── Search Overlay ─── */
(function initSearch() {
    const searchBtn = document.getElementById('search-btn');
    const overlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('search-input');
    const searchClose = document.getElementById('search-close');

    if (!searchBtn || !overlay) return;

    function openSearch() {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => searchInput && searchInput.focus(), 100);
    }

    function closeSearch() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    searchBtn.addEventListener('click', openSearch);
    if (searchClose) searchClose.addEventListener('click', closeSearch);

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeSearch();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSearch();
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            overlay.classList.contains('active') ? closeSearch() : openSearch();
        }
    });

    // Search input filter
    if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                filterSearchResults(searchInput.value.trim().toLowerCase());
            }, 200);
        });
    }

    function filterSearchResults(query) {
        const grid = document.getElementById('search-results-grid');
        if (!grid) return;
        const cards = grid.querySelectorAll('.search-product-card');
        let anyVisible = false;
        cards.forEach(card => {
            const name = (card.querySelector('h4')?.textContent || '').toLowerCase();
            const visible = !query || name.includes(query);
            card.style.display = visible ? '' : 'none';
            if (visible) anyVisible = true;
        });
        const noResults = grid.querySelector('.no-results');
        if (noResults) noResults.style.display = anyVisible || !query ? 'none' : '';
    }
})();

/* ─── Newsletter Form ─── */
(function initNewsletter() {
    document.querySelectorAll('.nl-form').forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = form.querySelector('input[type="email"]');
            const btn = form.querySelector('button[type="submit"]');
            const successEl = form.closest('.nl-box')?.querySelector('.nl-success');
            const email = input?.value?.trim();
            if (!email) return;

            btn.textContent = '...';
            btn.disabled = true;

            await new Promise(r => setTimeout(r, 800)); // simulate

            // Show success
            if (successEl) {
                form.style.display = 'none';
                successEl.classList.add('visible');
            } else {
                btn.textContent = '✓ Subscribed!';
                btn.style.background = 'var(--c-success)';
                setTimeout(() => {
                    btn.textContent = 'Subscribe';
                    btn.disabled = false;
                    btn.style.background = '';
                    if (input) input.value = '';
                }, 3000);
            }

            // Optional: send to Klaviyo/Mailchimp endpoint
            try {
                await fetch('/api/newsletter', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
            } catch {}
        });
    });
})();

/* ─── Cart Count ─── */
function updateCartCount(count) {
    document.querySelectorAll('.cart-count').forEach(el => {
        const n = parseInt(count) || 0;
        el.textContent = n;
        el.style.display = n > 0 ? 'flex' : 'none';
        if (n > 0) {
            el.animate([
                { transform: 'scale(1.4)', opacity: 0.7 },
                { transform: 'scale(1)', opacity: 1 }
            ], { duration: 300, easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' });
        }
    });
}

// Initial hide if 0
document.querySelectorAll('.cart-count').forEach(el => {
    if (!parseInt(el.textContent)) el.style.display = 'none';
});

/* ─── Footer Shop List (populated by shopify-integration.js) ─── */
// Products are injected dynamically via shopify-integration.js

/* ─── Mega Menu (desktop hover) ─── */
(function initMegaMenu() {
    const menuLabel = document.querySelector('.nav-menu-label');
    const megaMenu = document.querySelector('.mega-menu');
    if (!menuLabel || !megaMenu) return;

    // Only on desktop
    if (window.matchMedia('(max-width: 992px)').matches) return;

    let closeTimer;

    function openMega() {
        clearTimeout(closeTimer);
        megaMenu.classList.add('active');
    }

    function closeMega() {
        closeTimer = setTimeout(() => {
            megaMenu.classList.remove('active');
        }, 120);
    }

    menuLabel.addEventListener('mouseenter', openMega);
    menuLabel.addEventListener('mouseleave', closeMega);
    megaMenu.addEventListener('mouseenter', openMega);
    megaMenu.addEventListener('mouseleave', closeMega);
})();

/* ─── Anchor Link Smooth Scroll ─── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        if (lenis) {
            lenis.scrollTo(target, { duration: 1.4 });
        } else {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
