(function() {
  var scriptUrl = document.currentScript && document.currentScript.src ? document.currentScript.src : document.baseURI;
  var localHlsUrl = new URL('hls-vendor-dru42stk.js', scriptUrl).href;
  var hlsLoader = null;

  function loadRemoteHls() {
    return new Promise(function(resolve, reject) {
      if (window.Hls) {
        resolve(window.Hls);
        return;
      }

      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js';
      script.onload = function() {
        resolve(window.Hls);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function loadHls() {
    if (!hlsLoader) {
      hlsLoader = import(localHlsUrl).then(function(module) {
        return module.H || window.Hls;
      }).catch(function() {
        return loadRemoteHls();
      });
    }

    return hlsLoader;
  }

  window.initMoviePlayer = function(source) {
    var video = document.querySelector('[data-player-video]');
    var overlay = document.querySelector('[data-player-overlay]');
    var loader = document.querySelector('[data-player-loader]');
    var playButton = document.querySelector('[data-player-play]');
    var muteButton = document.querySelector('[data-player-mute]');
    var fullscreenButton = document.querySelector('[data-player-fullscreen]');
    var player = document.querySelector('[data-player]');
    var hlsInstance = null;
    var isReady = false;

    if (!video || !source) {
      return;
    }

    function markReady() {
      isReady = true;
      if (loader) {
        loader.classList.add('is-hidden');
      }
    }

    function setPlaying(isPlaying) {
      if (player) {
        player.classList.toggle('is-active', isPlaying);
      }
      if (playButton) {
        playButton.textContent = isPlaying ? '❚❚' : '▶';
      }
      if (overlay && isPlaying) {
        overlay.classList.add('is-hidden');
      }
    }

    function attachNative() {
      video.src = source;
      video.addEventListener('loadedmetadata', markReady, { once: true });
    }

    function attachHls(Hls) {
      if (Hls && Hls.isSupported && Hls.isSupported()) {
        hlsInstance = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, markReady);
        hlsInstance.on(Hls.Events.ERROR, function(event, data) {
          if (!data || !data.fatal) {
            return;
          }
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            hlsInstance.startLoad();
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            hlsInstance.recoverMediaError();
          } else {
            hlsInstance.destroy();
            attachNative();
          }
        });
      } else {
        attachNative();
      }
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      attachNative();
    } else {
      loadHls().then(attachHls).catch(attachNative);
    }

    function startPlayback() {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      if (!isReady) {
        setTimeout(function() {
          video.play().catch(function() {});
        }, 180);
      } else {
        video.play().catch(function() {});
      }
    }

    function togglePlayback() {
      if (video.paused) {
        startPlayback();
      } else {
        video.pause();
      }
    }

    if (overlay) {
      overlay.addEventListener('click', startPlayback);
    }

    if (playButton) {
      playButton.addEventListener('click', togglePlayback);
    }

    video.addEventListener('click', togglePlayback);
    video.addEventListener('play', function() {
      setPlaying(true);
    });
    video.addEventListener('pause', function() {
      setPlaying(false);
    });

    if (muteButton) {
      muteButton.addEventListener('click', function() {
        video.muted = !video.muted;
        muteButton.textContent = video.muted ? '🔇' : '🔊';
      });
    }

    if (fullscreenButton) {
      fullscreenButton.addEventListener('click', function() {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else if (player && player.requestFullscreen) {
          player.requestFullscreen();
        }
      });
    }

    window.addEventListener('pagehide', function() {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };
})();
