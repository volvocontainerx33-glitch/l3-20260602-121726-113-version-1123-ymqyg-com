(function () {
  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    if (!slides.length) {
      return;
    }
    var index = 0;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });
    window.setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  function initPageFilter() {
    var input = document.querySelector('[data-filter-input]');
    var yearSelect = document.querySelector('[data-year-filter]');
    var list = document.querySelector('[data-filter-list]');
    if (!list || (!input && !yearSelect)) {
      return;
    }
    var items = Array.prototype.slice.call(list.children);
    items.forEach(function (item) {
      item.setAttribute('data-filter-item', '');
      if (!item.getAttribute('data-title')) {
        item.setAttribute('data-title', item.textContent || '');
      }
      if (!item.getAttribute('data-keywords')) {
        item.setAttribute('data-keywords', item.textContent || '');
      }
    });
    function apply() {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var year = yearSelect ? yearSelect.value : '';
      items.forEach(function (item) {
        var text = ((item.getAttribute('data-title') || '') + ' ' + (item.getAttribute('data-keywords') || '') + ' ' + item.textContent).toLowerCase();
        var itemYear = item.getAttribute('data-year') || text;
        var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchedYear = !year || itemYear.indexOf(year) !== -1;
        item.classList.toggle('hidden', !(matchedKeyword && matchedYear));
      });
    }
    if (input) {
      input.addEventListener('input', apply);
    }
    if (yearSelect) {
      yearSelect.addEventListener('change', apply);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHero();
    initPageFilter();
  });
})();
