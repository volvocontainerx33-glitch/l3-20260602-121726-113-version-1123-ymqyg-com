
(function () {
  function onReady(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function setupMobileMenu() {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  function setupForms() {
    document.querySelectorAll('form[data-site-search]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        var input = form.querySelector('input[name="q"]');
        var value = input ? input.value.trim() : '';
        if (!value) {
          event.preventDefault();
          window.location.href = './search.html';
        }
      });
    });
  }

  function setupHero() {
    var slider = document.querySelector('[data-hero-slider]');
    if (!slider) {
      return;
    }
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    if (slides.length <= 1) {
      return;
    }
    var index = 0;
    var timer = null;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }
    function play() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        play();
      });
    });
    slider.addEventListener('mouseenter', function () {
      window.clearInterval(timer);
    });
    slider.addEventListener('mouseleave', play);
    play();
  }

  function setupFilters() {
    document.querySelectorAll('[data-card-filter]').forEach(function (scope) {
      var input = scope.querySelector('.filter-input');
      var year = scope.querySelector('.filter-year');
      var region = scope.querySelector('.filter-region');
      var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card, .rank-item'));
      var empty = scope.querySelector('[data-empty-state]');
      if (!cards.length || (!input && !year && !region)) {
        return;
      }
      if (scope.hasAttribute('data-search-page') && input) {
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q') || '';
        input.value = q;
      }
      function apply() {
        var q = normalize(input ? input.value : '');
        var y = normalize(year ? year.value : '');
        var r = normalize(region ? region.value : '');
        var visible = 0;
        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute('data-title'),
            card.getAttribute('data-tags'),
            card.getAttribute('data-year'),
            card.getAttribute('data-region')
          ].join(' '));
          var cardYear = normalize(card.getAttribute('data-year'));
          var cardRegion = normalize(card.getAttribute('data-region'));
          var ok = true;
          if (q && haystack.indexOf(q) === -1) {
            ok = false;
          }
          if (y && cardYear !== y) {
            ok = false;
          }
          if (r && cardRegion.indexOf(r) === -1) {
            ok = false;
          }
          card.style.display = ok ? '' : 'none';
          if (ok) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle('is-visible', visible === 0);
        }
      }
      [input, year, region].forEach(function (control) {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });
      apply();
    });
  }

  onReady(function () {
    setupMobileMenu();
    setupForms();
    setupHero();
    setupFilters();
  });
})();
