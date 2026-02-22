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

    // Nav active: highlight link for the section currently in view
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

    // Timeline: reveal items and update line progress when in view
    if (timelineItems.length && timelineLine) {
      var timeline = timelineLine.parentElement;
      var timelineRect = timeline.getBoundingClientRect();
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
})();
