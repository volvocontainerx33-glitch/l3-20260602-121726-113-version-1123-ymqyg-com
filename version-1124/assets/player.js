function initMoviePlayer(videoId, src) {
  var video = document.getElementById(videoId);
  if (!video) {
    return;
  }
  var source = src || video.getAttribute('data-src');
  var overlay = document.querySelector('[data-play-button]');
  var hlsInstance = null;

  function attachSource() {
    if (!source) {
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      return;
    }
    video.src = source;
  }

  function playVideo() {
    attachSource();
    if (overlay) {
      overlay.classList.add('hidden');
    }
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        if (overlay) {
          overlay.classList.remove('hidden');
        }
      });
    }
  }

  if (overlay) {
    overlay.addEventListener('click', playVideo);
  }
  video.addEventListener('play', function () {
    if (overlay) {
      overlay.classList.add('hidden');
    }
  });
  video.addEventListener('pause', function () {
    if (video.currentTime === 0 && overlay) {
      overlay.classList.remove('hidden');
    }
  });
  video.addEventListener('error', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
}
