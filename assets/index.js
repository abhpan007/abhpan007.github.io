(function () {
  var topbar = document.getElementById('topbar');
  var navLinks = document.querySelectorAll('.topbar .nav a[href^="#"]');
  var sections = document.querySelectorAll('section[id="experience"], section[id="education"], section[id="contact"]');
  var timelineItems = document.querySelectorAll('[data-timeline]');
  var timelineLine = document.getElementById('timeline-line');

  function onScroll() {
    var y = window.scrollY;
    if (topbar) {
      topbar.classList.toggle('scrolled', y > 20);
    }

    var current = null;
    sections.forEach(function (section) {
      var rect = section.getBoundingClientRect();
      var mid = rect.top + rect.height / 2;
      if (rect.top <= 120 && mid >= 0) current = section.id;
    });
    navLinks.forEach(function (a) {
      var href = a.getAttribute('href');
      if (href === '#' + current) a.classList.add('active');
      else a.classList.remove('active');
    });

    if (timelineItems.length && timelineLine) {
      var viewportHeight = window.innerHeight;
      var lineProgress = 0;
      timelineItems.forEach(function (item, i) {
        var rect = item.getBoundingClientRect();
        if (rect.top < viewportHeight * 0.85) {
          item.classList.add('visible');
          lineProgress = (i + 1) / timelineItems.length;
        }
      });
      timelineLine.style.transform = 'translateX(-50%) scaleY(' + lineProgress + ')';
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Click for details (experience cards)
  document.querySelectorAll('.timeline-details-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = this.getAttribute('data-details');
      var details = id ? document.getElementById(id) : null;
      if (!details) return;
      var isHidden = details.hidden;
      details.hidden = !isHidden;
      this.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
      this.textContent = isHidden ? 'Hide details' : 'Click for details →';
    });
  });

  // Vanta NET background: init after load + layout so scripts and #bg-dynamic are ready
  var vantaRetries = 0;
  function initVanta() {
    var el = document.getElementById('bg-dynamic');
    if (!el) return;
    if (typeof window.VANTA === 'undefined' || typeof window.THREE === 'undefined') {
      if (vantaRetries < 15) {
        vantaRetries += 1;
        setTimeout(initVanta, 80);
      }
      return;
    }
    var instance = window.VANTA.NET({
      el: el,
      THREE: window.THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
      scale: 1,
      scaleMobile: 1,
      color: 0x6ee7ff,
      backgroundColor: 0x0b0d10,
      points: 10,
      maxDistance: 20,
      spacing: 15
    });
    if (instance) {
      window._vantaInstance = instance;
      requestAnimationFrame(function () {
        if (typeof instance.resize === 'function') instance.resize();
      });
    }
  }
  function runVantaAfterLayout() {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        setTimeout(initVanta, 80);
      });
    });
  }
  if (document.readyState === 'loading') {
    window.addEventListener('load', runVantaAfterLayout);
  } else {
    runVantaAfterLayout();
  }
})();
