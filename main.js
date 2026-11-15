/* Velmont Studio interactions */
document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle && navLinks) {
        const setMenuOpen = (isOpen) => {
            navLinks.classList.toggle('active', isOpen);
            mobileToggle.setAttribute('aria-expanded', String(isOpen));
            const iconPath = mobileToggle.querySelector('svg path');
            if (iconPath) iconPath.setAttribute('d', isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16');
        };
        mobileToggle.addEventListener('click', () => setMenuOpen(mobileToggle.getAttribute('aria-expanded') !== 'true'));
        navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && mobileToggle.getAttribute('aria-expanded') === 'true') {
                setMenuOpen(false);
                mobileToggle.focus();
            }
        });
    }

    const revealElements = document.querySelectorAll('.reveal');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
        revealElements.forEach(el => el.classList.add('visible'));
    } else {
        const observer = new IntersectionObserver((entries, currentObserver) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    currentObserver.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -40px 0px', threshold: 0.15 });
        revealElements.forEach(el => observer.observe(el));
    }

    const contactForm = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');
    if (contactForm && feedback) {
        contactForm.addEventListener('submit', async event => {
            event.preventDefault();
            feedback.hidden = false;
            feedback.className = 'form-feedback';
            feedback.textContent = 'Sending your inquiry…';
            const submit = contactForm.querySelector('[type="submit"]');
            submit.disabled = true;
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { Accept: 'application/json' }
                });
                if (!response.ok) throw new Error('Form submission failed');
                feedback.classList.add('success');
                feedback.textContent = 'Your inquiry was sent successfully. Thank you for reaching out.';
                contactForm.reset();
            } catch (error) {
                feedback.classList.add('error');
                feedback.textContent = 'We could not send your inquiry. Please try again or email us directly.';
            } finally {
                submit.disabled = false;
            }
        });
    }
});
