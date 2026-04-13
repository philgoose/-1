'use strict';

const printBtn = document.getElementById('printBtn');

if (printBtn) {
  printBtn.addEventListener('click', () => {
    window.print();
  });
}

const launcher = document.querySelector('.app-launcher');
if (launcher) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    launcher.classList.add('visible');
  } else {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            launcher.classList.add('visible');
            obs.unobserve(launcher);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -24px 0px' }
    );
    obs.observe(launcher);
  }
}
