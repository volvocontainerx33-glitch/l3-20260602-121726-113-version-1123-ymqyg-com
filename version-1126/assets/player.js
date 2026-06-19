// HLS playback initializer. It binds real m3u8 sources to the video element after a user click.
(function () {
  function initializePlayer(stage) {
    var video = stage.querySelector('video');
    var button = stage.querySelector('.play-trigger');
    if (!video) {
      return;
    }

    var source = video.getAttribute('data-src');
    if (!source) {
      return;
    }

    function startPlayback() {
      if (button) {
        button.style.display = 'none';
      }

      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {
            video.controls = true;
          });
        });
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.play().catch(function () {
          video.controls = true;
        });
        return;
      }

      video.src = source;
      video.play().catch(function () {
        video.controls = true;
      });
    }

    if (button) {
      button.addEventListener('click', startPlayback, { once: true });
    }
    video.addEventListener('play', function () {
      if (button) {
        button.style.display = 'none';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-player-stage]').forEach(initializePlayer);
  });
})();
