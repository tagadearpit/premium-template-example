const revealItems = document.querySelectorAll('[data-reveal]');
const counters = document.querySelectorAll('[data-count]');
const cursorGlow = document.querySelector('.cursor-glow');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 70, 420)}ms`;
  revealObserver.observe(item);
});

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const node = entry.target;
    const target = Number(node.dataset.count);
    const duration = 1100;
    const start = performance.now();

    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
    countObserver.unobserve(node);
  });
}, { threshold: 0.6 });

counters.forEach((counter) => countObserver.observe(counter));

window.addEventListener('pointermove', (event) => {
  if (!cursorGlow) return;
  cursorGlow.style.opacity = '1';
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

window.addEventListener('scroll', () => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  header.style.boxShadow = window.scrollY > 20
    ? '0 24px 70px rgba(47, 34, 86, 0.16)'
    : '0 18px 55px rgba(47, 34, 86, 0.11)';
}, { passive: true });
