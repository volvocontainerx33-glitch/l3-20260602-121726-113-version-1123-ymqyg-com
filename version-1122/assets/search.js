document.addEventListener('DOMContentLoaded', function () {
  var input = document.getElementById('siteSearchInput');
  var button = document.getElementById('siteSearchButton');
  var results = document.getElementById('searchResults');
  var summary = document.getElementById('searchSummary');
  var data = window.SEARCH_DATA || [];
  var params = new URLSearchParams(window.location.search);

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function render(list) {
    results.innerHTML = list.slice(0, 120).map(function (item) {
      return [
        '<article class="movie-card">',
        '  <a class="poster-link" href="' + escapeHtml(item.url) + '">',
        '    <img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.title) + '" loading="lazy" />',
        '    <span class="badge">' + escapeHtml(item.region) + '</span>',
        '    <span class="duration">45:00</span>',
        '  </a>',
        '  <div class="card-info">',
        '    <a class="card-title" href="' + escapeHtml(item.url) + '">' + escapeHtml(item.title) + '</a>',
        '    <p>' + escapeHtml(item.genre) + '</p>',
        '    <div class="card-meta">',
        '      <span>' + escapeHtml(item.year) + '</span>',
        '      <span>' + escapeHtml(item.type) + '</span>',
        '    </div>',
        '  </div>',
        '</article>'
      ].join('');
    }).join('');

    summary.textContent = '找到 ' + list.length + ' 部影片，当前显示前 ' + Math.min(list.length, 120) + ' 部。';
  }

  function search() {
    var query = input.value.trim().toLowerCase();
    if (!query) {
      render(data.slice(0, 80));
      summary.textContent = '共收录 ' + data.length + ' 部影片，输入关键词可继续筛选。';
      return;
    }

    var list = data.filter(function (item) {
      return String(item.text || '').toLowerCase().indexOf(query) !== -1;
    });
    render(list);
  }

  if (input) {
    input.value = params.get('q') || '';
    input.addEventListener('input', search);
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        search();
      }
    });
  }

  if (button) {
    button.addEventListener('click', search);
  }

  search();
});
