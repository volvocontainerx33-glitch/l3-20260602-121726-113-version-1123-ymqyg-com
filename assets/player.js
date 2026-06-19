
(function () {
  function initMoviePlayer(source, videoId, triggerId) {
    var video = document.getElementById(videoId);
    var trigger = document.getElementById(triggerId);
    if (!video || !trigger || !source) {
      return;
    }
    var attached = false;
    var hls = null;

    function attach() {
      if (attached) {
        return;
      }
      attached = true;
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else {
        video.src = source;
      }
    }

    function start() {
      attach();
      trigger.classList.add('is-hidden');
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {});
      }
    }

    trigger.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      } else {
        video.pause();
      }
    });
    video.addEventListener('play', function () {
      trigger.classList.add('is-hidden');
    });
    video.addEventListener('pause', function () {
      if (video.currentTime === 0 || video.ended) {
        trigger.classList.remove('is-hidden');
      }
    });
    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  window.initMoviePlayer = initMoviePlayer;
})();
