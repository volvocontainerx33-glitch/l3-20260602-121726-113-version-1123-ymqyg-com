import { H as Hls } from './hls-vendor.js';

function bootPlayer(player) {
  var video = player.querySelector('video');
  var button = player.querySelector('[data-play-button]');
  var overlay = player.querySelector('[data-play-overlay]');
  var status = player.querySelector('[data-player-status]');
  var source = player.getAttribute('data-source');
  var initialized = false;

  function setStatus(message) {
    if (status) {
      status.textContent = message;
    }
  }

  function init() {
    if (initialized) {
      video.play();
      return;
    }

    initialized = true;
    setStatus('正在载入播放源...');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.addEventListener('loadedmetadata', function () {
        video.play();
      });
    } else if (Hls && Hls.isSupported()) {
      var hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play();
      });
      hls.on(Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          setStatus('播放源载入失败，请确认以本地服务器方式打开页面。');
        }
      });
    } else {
      video.src = source;
      video.play().catch(function () {
        setStatus('当前浏览器不支持 HLS 播放，请使用支持 HLS 的浏览器访问。');
      });
    }
  }

  if (button) {
    button.addEventListener('click', function () {
      init();
    });
  }

  video.addEventListener('play', function () {
    if (overlay) {
      overlay.style.display = 'none';
    }
    setStatus('正在播放');
  });

  video.addEventListener('pause', function () {
    setStatus('已暂停');
  });

  video.addEventListener('ended', function () {
    setStatus('播放结束');
  });
}

document.querySelectorAll('[data-hls-player]').forEach(bootPlayer);
