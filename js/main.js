// Navigation: mobile toggle + active link
(function() {
  var toggle = document.querySelector('.nav__toggle');
  var links  = document.querySelector('.nav__links');
  if (toggle && links) {
    toggle.addEventListener('click', function(){ links.classList.toggle('open'); });
    document.addEventListener('click', function(e){
      if (!e.target.closest('.nav')) links.classList.remove('open');
    });
  }

  // Mark active nav link
  var current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(function(a) {
    var href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Accordion (patients page)
  document.querySelectorAll('.accordion__trigger').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var body = btn.nextElementSibling;
      var isOpen = btn.classList.contains('open');
      document.querySelectorAll('.accordion__trigger').forEach(function(b) {
        b.classList.remove('open');
        b.nextElementSibling.classList.remove('open');
      });
      if (!isOpen) {
        btn.classList.add('open');
        body.classList.add('open');
      }
    });
  });
})();

// Info Tiles — expand panels
(function() {
  var NAV_H = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;

  function scrollToPanel(panel) {
    var top = window.pageYOffset + panel.getBoundingClientRect().top - NAV_H - 16;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  document.querySelectorAll('.info-tile').forEach(function(tile) {
    tile.addEventListener('click', function(e) {
      if (e.target.closest('.info-tile-panel__close')) return;
      var panelId = tile.dataset.panel;
      var panel = document.getElementById(panelId);
      if (!panel) return;

      var isOpen = tile.classList.contains('active');

      // Close everything in this section
      var section = tile.closest('section');
      if (section) {
        section.querySelectorAll('.info-tile').forEach(function(t){ t.classList.remove('active'); });
        section.querySelectorAll('.info-tile-panel').forEach(function(p){ p.classList.remove('open'); });
      }

      if (!isOpen) {
        tile.classList.add('active');
        panel.classList.add('open');
        // Re-trigger flash animation
        panel.style.animation = 'none';
        panel.offsetHeight; // reflow
        panel.style.animation = '';
        setTimeout(function(){ scrollToPanel(panel); }, 60);
      }
    });
  });

  // Close button — scroll back up to the tile
  document.querySelectorAll('.info-tile-panel__close').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var panel = btn.closest('.info-tile-panel');
      if (!panel) return;
      var panelId = panel.id;
      var tile = document.querySelector('.info-tile[data-panel="' + panelId + '"]');
      panel.classList.remove('open');
      if (tile) {
        tile.classList.remove('active');
        setTimeout(function(){
          var top = window.pageYOffset + tile.getBoundingClientRect().top - NAV_H - 16;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }, 30);
      }
    });
  });
})();

// Reveal archive items in groups of four
(function() {
  document.querySelectorAll('[data-reveal-list]').forEach(function(list) {
    var items = Array.prototype.slice.call(list.querySelectorAll('[data-reveal-item]'));
    if (!items.length) return;

    var initialCount = parseInt(list.getAttribute('data-reveal-initial'), 10) || 4;
    var stepCount = parseInt(list.getAttribute('data-reveal-step'), 10) || 4;
    var visibleCount = initialCount;
    var moreButton = document.querySelector('[data-reveal-more="' + list.id + '"]');
    var lessButton = document.querySelector('[data-reveal-less="' + list.id + '"]');
    var countTarget = document.querySelector('[data-reveal-count="' + list.id + '"]');

    function render() {
      items.forEach(function(item, index) {
        item.classList.toggle('is-hidden', index >= visibleCount);
      });

      if (countTarget) {
        countTarget.textContent = Math.min(visibleCount, items.length) + ' of ' + items.length + ' items visible';
      }

      if (moreButton) {
        moreButton.hidden = visibleCount >= items.length;
      }

      if (lessButton) {
        lessButton.hidden = visibleCount <= initialCount;
      }
    }

    if (moreButton) {
      moreButton.addEventListener('click', function() {
        visibleCount = Math.min(visibleCount + stepCount, items.length);
        render();
      });
    }

    if (lessButton) {
      lessButton.addEventListener('click', function() {
        visibleCount = initialCount;
        render();
        list.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    render();
  });
})();
