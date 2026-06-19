(function () {
  var input = document.querySelector('[data-site-search]');
  var results = document.querySelector('[data-site-search-results]');

  if (!input || !results || !window.MOVIE_SEARCH_DATA) {
    return;
  }

  function render(items) {
    if (!items.length) {
      results.innerHTML = '<div class="empty-state">没有找到匹配影片，请尝试更换关键词。</div>';
      return;
    }

    results.innerHTML = items.slice(0, 80).map(function (movie) {
      return [
        '<article class="card">',
        '  <a class="poster-link" href="movies/' + movie.file + '">',
        '    <img src="' + movie.cover + '" alt="' + movie.title + '" loading="lazy">',
        '    <span class="card-year">' + movie.year + '</span>',
        '  </a>',
        '  <div class="card-body">',
        '    <h3 class="card-title"><a href="movies/' + movie.file + '">' + movie.title + '</a></h3>',
        '    <div class="card-meta"><span>' + movie.region + '</span><span>·</span><span>' + movie.type + '</span></div>',
        '    <p class="card-desc">' + movie.oneLine + '</p>',
        '  </div>',
        '</article>'
      ].join('');
    }).join('');
  }

  function search() {
    var value = (input.value || '').trim().toLowerCase();
    if (!value) {
      render(window.MOVIE_SEARCH_DATA.slice(0, 40));
      return;
    }
    var matched = window.MOVIE_SEARCH_DATA.filter(function (movie) {
      return movie.search.indexOf(value) !== -1;
    });
    render(matched);
  }

  input.addEventListener('input', search);
  render(window.MOVIE_SEARCH_DATA.slice(0, 40));
})();
