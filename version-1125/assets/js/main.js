(function () {
  var body = document.body;
  var toggle = document.querySelector('[data-mobile-toggle]');

  if (toggle) {
    toggle.addEventListener('click', function () {
      body.classList.toggle('menu-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));

  if (slides.length > 1) {
    var active = 0;

    function showSlide(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === active);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    setInterval(function () {
      showSlide(active + 1);
    }, 5200);
  }

  var filterForm = document.querySelector('[data-filter-form]');
  if (filterForm) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    var keyword = filterForm.querySelector('[data-filter-keyword]');
    var year = filterForm.querySelector('[data-filter-year]');
    var type = filterForm.querySelector('[data-filter-type]');
    var region = filterForm.querySelector('[data-filter-region]');
    var empty = document.querySelector('[data-empty-state]');

    function applyFilters() {
      var keywordValue = (keyword.value || '').trim().toLowerCase();
      var yearValue = year.value || '';
      var typeValue = type.value || '';
      var regionValue = region.value || '';
      var visibleCount = 0;

      cards.forEach(function (card) {
        var haystack = (card.getAttribute('data-search') || '').toLowerCase();
        var matched = true;

        if (keywordValue && haystack.indexOf(keywordValue) === -1) {
          matched = false;
        }
        if (yearValue && card.getAttribute('data-year') !== yearValue) {
          matched = false;
        }
        if (typeValue && card.getAttribute('data-type') !== typeValue) {
          matched = false;
        }
        if (regionValue && card.getAttribute('data-region') !== regionValue) {
          matched = false;
        }

        card.style.display = matched ? '' : 'none';
        if (matched) {
          visibleCount += 1;
        }
      });

      if (empty) {
        empty.style.display = visibleCount ? 'none' : '';
      }
    }

    [keyword, year, type, region].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });
  }
})();
