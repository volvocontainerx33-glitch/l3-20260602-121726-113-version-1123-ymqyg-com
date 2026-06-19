// Readable static site interactions: menu, filtering, carousel and playback helpers.
(function () {
  function ready(callback) {
    if (document.readyState !== 'loading') {
      callback();
      return;
    }
    document.addEventListener('DOMContentLoaded', callback);
  }

  function setupMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-main-nav]');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function setupFilters() {
    var panels = document.querySelectorAll('[data-filter-panel]');
    panels.forEach(function (panel) {
      var input = panel.querySelector('[data-search-input]');
      var yearSelect = panel.querySelector('[data-year-filter]');
      var typeSelect = panel.querySelector('[data-type-filter]');
      var scope = document.querySelector(panel.getAttribute('data-filter-panel')) || document;
      var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));

      function applyFilter() {
        var keyword = input ? input.value.trim().toLowerCase() : '';
        var year = yearSelect ? yearSelect.value : '';
        var type = typeSelect ? typeSelect.value : '';
        cards.forEach(function (card) {
          var searchable = [
            card.getAttribute('data-title'),
            card.getAttribute('data-year'),
            card.getAttribute('data-type'),
            card.getAttribute('data-region'),
            card.getAttribute('data-genre')
          ].join(' ').toLowerCase();
          var matchesKeyword = !keyword || searchable.indexOf(keyword) !== -1;
          var matchesYear = !year || card.getAttribute('data-year') === year;
          var matchesType = !type || card.getAttribute('data-type') === type;
          card.classList.toggle('hidden-by-filter', !(matchesKeyword && matchesYear && matchesType));
        });
      }

      [input, yearSelect, typeSelect].forEach(function (control) {
        if (control) {
          control.addEventListener('input', applyFilter);
          control.addEventListener('change', applyFilter);
        }
      });
    });
  }

  function setupHeroCarousel() {
    var hero = document.querySelector('[data-hero-carousel]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var index = 0;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }
  }

  ready(function () {
    setupMenu();
    setupFilters();
    setupHeroCarousel();
  });
})();
