const mobileButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');

if (mobileButton && mobileMenu) {
  mobileButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('is-open');
  });
}

function setupHero() {
  const root = document.querySelector('[data-hero]');
  if (!root) {
    return;
  }

  const slides = Array.from(root.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(root.querySelectorAll('[data-hero-dot]'));
  const prev = root.querySelector('[data-hero-prev]');
  const next = root.querySelector('[data-hero-next]');
  let activeIndex = 0;
  let timer = null;

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('active', slideIndex === activeIndex);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === activeIndex);
    });
  }

  function restartTimer() {
    window.clearInterval(timer);
    timer = window.setInterval(() => showSlide(activeIndex + 1), 5200);
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      restartTimer();
    });
  });

  if (prev) {
    prev.addEventListener('click', () => {
      showSlide(activeIndex - 1);
      restartTimer();
    });
  }

  if (next) {
    next.addEventListener('click', () => {
      showSlide(activeIndex + 1);
      restartTimer();
    });
  }

  restartTimer();
}

function setupFilters() {
  const scopes = document.querySelectorAll('[data-filter-scope]');

  scopes.forEach((scope) => {
    const input = scope.querySelector('[data-filter-input]');
    const list = document.querySelector('[data-filter-list]');
    const count = document.querySelector('[data-result-count]');
    const selects = Array.from(scope.querySelectorAll('[data-filter-select]'));

    if (!input || !list) {
      return;
    }

    const cards = Array.from(list.querySelectorAll('.movie-card'));
    const queryParam = input.getAttribute('data-query-param');

    if (queryParam) {
      const url = new URL(window.location.href);
      const initialValue = url.searchParams.get(queryParam);
      if (initialValue) {
        input.value = initialValue;
      }
    }

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function applyFilter() {
      const q = normalize(input.value);
      const selected = Object.fromEntries(
        selects.map((select) => [select.getAttribute('data-filter-select'), normalize(select.value)])
      );
      let visible = 0;

      cards.forEach((card) => {
        const haystack = normalize([
          card.dataset.title,
          card.dataset.region,
          card.dataset.type,
          card.dataset.year,
          card.dataset.genre,
          card.textContent,
        ].join(' '));

        const matchesQuery = !q || haystack.includes(q);
        const matchesSelects = Object.entries(selected).every(([key, value]) => {
          return !value || normalize(card.dataset[key]) === value;
        });
        const isVisible = matchesQuery && matchesSelects;

        card.classList.toggle('is-filtered-out', !isVisible);
        if (isVisible) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = `共 ${visible} 部影片`;
      }
    }

    input.addEventListener('input', applyFilter);
    selects.forEach((select) => select.addEventListener('change', applyFilter));
    applyFilter();
  });
}

async function initializeHls(video, source) {
  if (!video || !source) {
    return;
  }

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
    return;
  }

  try {
    const module = await import('./hls-vendor.js');
    const Hls = module.H;

    if (Hls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      return;
    }
  } catch (error) {
    console.warn('HLS 初始化失败，尝试直接绑定播放地址。', error);
  }

  video.src = source;
}

function setupPlayers() {
  const videos = Array.from(document.querySelectorAll('video[data-hls-src]'));

  videos.forEach((video) => {
    const source = video.getAttribute('data-hls-src');
    const frame = video.closest('.video-frame');
    const button = frame ? frame.querySelector('[data-play-button]') : null;
    let initialized = false;

    async function startPlayback() {
      if (!initialized) {
        await initializeHls(video, source);
        initialized = true;
      }

      if (button) {
        button.classList.add('is-hidden');
      }

      try {
        await video.play();
      } catch (error) {
        console.warn('浏览器阻止了自动播放，可再次点击视频播放。', error);
      }
    }

    if (button) {
      button.addEventListener('click', startPlayback);
    }

    video.addEventListener('play', () => {
      if (button) {
        button.classList.add('is-hidden');
      }
    });
  });
}

setupHero();
setupFilters();
setupPlayers();
