/* ============================================================
   Vanilla JavaScript — no external libraries or frameworks.
   APIs used: IntersectionObserver, classList, dataset
   MDN: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────────────────
     SCROLL REVEAL
     Watches every .reveal element and adds .visible when it
     enters the viewport, triggering the CSS transition in
     main.css (.reveal opacity + translateY).
  ────────────────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  // Immediately reveal anything already in the viewport on load
  revealEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    }
  });

  // Watch remaining elements as the user scrolls
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // fire once only
      }
    });
  }, { threshold: 0.08 }); // lowered threshold for better reliability

  revealEls.forEach(el => {
    if (!el.classList.contains('visible')) {
      revealObserver.observe(el);
    }
  });


  /* ──────────────────────────────────────────────────────────
     ACTIVE NAV LINK HIGHLIGHT ON SCROLL  (index.html)
     Watches each section[id] and toggles .active on the
     matching nav link as sections scroll into view.
  ────────────────────────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (sections.length > 0 && navLinks.length > 0) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === '#' + entry.target.id
            );
          });
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(s => sectionObserver.observe(s));
  }


  /* ──────────────────────────────────────────────────────────
     PROJECT FILTER BAR  (projects.html)
     Reads data-filter on each .filter-btn and compares it to
     data-category on each .card. Toggles .hidden on cards that
     do not match, and .active on the selected button.
     Only runs when filter buttons are present on the page.
  ────────────────────────────────────────────────────────── */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.cards-grid .card');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        // Highlight only the clicked button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Show cards that match; hide the rest
        projectCards.forEach(card => {
          const matches = filter === 'all' || card.dataset.category === filter;
          card.classList.toggle('hidden', !matches);
          // Re-reveal cards being shown in case they haven't animated yet
          if (matches && !card.classList.contains('visible')) {
            card.classList.add('visible');
          }
        });
      });
    });
  }

});