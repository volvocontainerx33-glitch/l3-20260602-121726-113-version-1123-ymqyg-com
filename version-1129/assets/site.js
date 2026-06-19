(function() {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('is-open');
    });
  }

  var panels = document.querySelectorAll('[data-filter-panel]');

  panels.forEach(function(panel) {
    var root = panel.closest('[data-filter-root]') || document;
    var input = panel.querySelector('[data-search-input]');
    var controls = panel.querySelectorAll('[data-filter-control]');
    var cards = root.querySelectorAll('[data-card]');
    var empty = root.querySelector('[data-no-results]');
    var filters = {
      region: '全部',
      type: '全部',
      year: '全部'
    };

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function applyFilters() {
      var query = normalize(input ? input.value : '');
      var visible = 0;

      cards.forEach(function(card) {
        var text = normalize([
          card.dataset.title,
          card.dataset.region,
          card.dataset.type,
          card.dataset.year,
          card.textContent
        ].join(' '));
        var matchQuery = !query || text.indexOf(query) !== -1;
        var matchRegion = filters.region === '全部' || card.dataset.region === filters.region;
        var matchType = filters.type === '全部' || card.dataset.type === filters.type;
        var matchYear = filters.year === '全部' || card.dataset.year === filters.year;
        var show = matchQuery && matchRegion && matchType && matchYear;

        card.classList.toggle('is-hidden-card', !show);
        if (show) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    if (input) {
      input.addEventListener('input', applyFilters);
    }

    controls.forEach(function(control) {
      control.addEventListener('click', function() {
        var key = control.dataset.filterKey;
        var value = control.dataset.filterValue;
        filters[key] = value;

        controls.forEach(function(item) {
          if (item.dataset.filterKey === key) {
            item.classList.toggle('active', item === control);
          }
        });

        applyFilters();
      });
    });
  });
})();
