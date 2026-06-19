document.addEventListener('DOMContentLoaded', function () {
  var video = document.getElementById('videoPlayer');
  var button = document.querySelector('[data-play-button]');
  var status = document.querySelector('[data-player-status]');

  if (!video || !button) {
    return;
  }

  var source = video.getAttribute('data-src');
  var initialized = false;

  function setStatus(message) {
    if (status) {
      status.textContent = message;
    }
  }

  function initializePlayer() {
    if (initialized) {
      video.play().catch(function () {});
      return;
    }

    initialized = true;
    button.classList.add('hidden');
    setStatus('正在加载播放源...');

    if (!source) {
      setStatus('未检测到播放源。');
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.addEventListener('loadedmetadata', function () {
        video.play().catch(function () {});
      }, { once: true });
      setStatus('播放器已初始化。');
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        setStatus('播放器已初始化。');
        video.play().catch(function () {});
      });
      hls.on(window.Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          setStatus('播放源加载失败，请稍后重试。');
        }
      });
      return;
    }

    video.src = source;
    video.play().catch(function () {});
    setStatus('播放器已初始化。');
  }

  button.addEventListener('click', initializePlayer);
});
