(function () {
  var menuButton = document.querySelector(".menu-toggle");
  var mobilePanel = document.querySelector(".mobile-panel");
  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", function () {
      mobilePanel.classList.toggle("open");
    });
  }

  var hero = document.querySelector("[data-hero]");
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dots button"));
    var index = 0;

    function showSlide(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === index);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        showSlide(dotIndex);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }
  }

  var filterScope = document.querySelector("[data-filter-scope]");
  if (filterScope) {
    var input = filterScope.querySelector("[data-page-filter]");
    var chips = Array.prototype.slice.call(filterScope.querySelectorAll("[data-chip]"));
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
    var activeChip = "all";

    function applyFilter() {
      var query = input ? input.value.trim().toLowerCase() : "";
      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute("data-title"),
          card.getAttribute("data-tags"),
          card.getAttribute("data-year"),
          card.getAttribute("data-region")
        ].join(" ").toLowerCase();
        var matchQuery = !query || haystack.indexOf(query) !== -1;
        var matchChip = activeChip === "all" || haystack.indexOf(activeChip.toLowerCase()) !== -1;
        card.style.display = matchQuery && matchChip ? "" : "none";
      });
    }

    if (input) {
      input.addEventListener("input", applyFilter);
    }
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        activeChip = chip.getAttribute("data-chip") || "all";
        chips.forEach(function (item) {
          item.classList.toggle("active", item === chip);
        });
        applyFilter();
      });
    });
  }

  var playerShell = document.querySelector(".player-shell");
  if (playerShell) {
    var video = playerShell.querySelector("video");
    var cover = playerShell.querySelector(".player-cover");
    var source = playerShell.getAttribute("data-video-url");
    var loaded = false;

    function loadVideo() {
      if (!video || !source || loaded) {
        return;
      }
      loaded = true;
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else {
        video.src = source;
      }
    }

    function startVideo() {
      loadVideo();
      if (cover) {
        cover.classList.add("is-hidden");
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener("click", startVideo);
    }
    if (video) {
      video.addEventListener("click", loadVideo, { once: true });
      video.addEventListener("play", function () {
        if (cover) {
          cover.classList.add("is-hidden");
        }
      });
    }
  }
})();
