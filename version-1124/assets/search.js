(function () {
  function getQuery() {
    return new URLSearchParams(window.location.search).get('q') || '';
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function renderCard(movie) {
    return [
      '<article class="movie-card">',
      '  <a class="poster-wrap" href="' + escapeHtml(movie.url) + '">',
      '    <img class="poster-img" src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '封面" loading="lazy" onerror="this.classList.add(\'is-missing\')">',
      '    <span class="score-badge">' + escapeHtml(movie.score) + '</span>',
      '    <span class="year-badge">' + escapeHtml(movie.year) + '</span>',
      '  </a>',
      '  <div class="movie-card-body">',
      '    <h3><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h3>',
      '    <p class="meta-line">' + escapeHtml(movie.region) + ' · ' + escapeHtml(movie.type) + ' · ' + escapeHtml(movie.genre) + '</p>',
      '    <p class="card-desc">' + escapeHtml(movie.summary) + '</p>',
      '    <div class="tag-row"><span>' + escapeHtml(movie.category) + '</span></div>',
      '  </div>',
      '</article>'
    ].join('\n');
  }

  function runSearch(keyword) {
    var data = window.MOVIE_SEARCH_DATA || [];
    var normalized = keyword.trim().toLowerCase();
    if (!normalized) {
      return data.slice(0, 80);
    }
    return data.filter(function (movie) {
      var haystack = [movie.title, movie.year, movie.region, movie.type, movie.genre, movie.tags, movie.summary, movie.category].join(' ').toLowerCase();
      return haystack.indexOf(normalized) !== -1;
    }).slice(0, 180);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var input = document.getElementById('searchInput');
    var result = document.getElementById('searchResults');
    var title = document.getElementById('searchTitle');
    var form = document.querySelector('.search-page-form');
    if (!input || !result) {
      return;
    }
    var initialQuery = getQuery();
    input.value = initialQuery;

    function update() {
      var keyword = input.value;
      var list = runSearch(keyword);
      title.textContent = keyword.trim() ? '搜索结果：' + keyword.trim() : '最新影片';
      result.innerHTML = list.length ? list.map(renderCard).join('\n') : '<p class="content-card">没有找到匹配影片，请换一个关键词。</p>';
    }

    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var url = new URL(window.location.href);
        url.searchParams.set('q', input.value.trim());
        window.history.replaceState({}, '', url.toString());
        update();
      });
    }
    input.addEventListener('input', update);
    update();
  });
})();
