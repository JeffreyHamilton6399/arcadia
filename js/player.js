/* =====================================================================
   Arcadia — play page
   Reads ?id=, renders sandboxed iframe (or redirect launch), rating, related.
   ===================================================================== */
(function () {
  "use strict";
  var S = window.ARCADIA_STORE, A = window.ARCADIA, I = window.ARCADIA_ICONS, toast = window.ARCADIA_TOAST;
  function qs(n) { var m = new RegExp("[?&]" + n + "=([^&]*)").exec(location.search); return m ? decodeURIComponent(m[1]) : null; }

  function init() {
    window.ARCADIA_NAV("play");
    window.ARCADIA_FOOTER();
    var id = qs("id"), game = A.gameById(id), main = document.getElementById("main");

    if (!game) {
      main.innerHTML = '<div class="wrap" style="text-align:center;padding:90px 20px"><h1 style="font-size:26px;margin-bottom:8px">Game not found</h1><p class="muted" style="margin-bottom:18px">We couldn’t find that one.</p><a class="btn btn-ghost" href="games.html">Browse games</a></div>';
      window.ARCADIA_REVEAL(main);
      return;
    }
    document.title = game.title + " — Arcadia";
    var cat = A.catById(game.category), rating = S.getRating(game.id), related = A.related(game, 8);
    S.markRecent(game.id);

    var frame;
    if (game.embedType === "redirect") {
      frame = '<div class="frame-wrap" style="display:grid;place-items:center;text-align:center;background:var(--surface)">' +
        '<div style="padding:24px;max-width:380px">' +
        '<div class="card-glyph" style="font-size:34px;margin-bottom:14px;color:' + game.accent + '">' + game.title.slice(0, 2).toUpperCase() + '</div>' +
        '<h1 style="font-size:22px;margin-bottom:8px">' + game.title + '</h1>' +
        '<p class="muted" style="font-size:14px;margin-bottom:20px">This game opens in a new tab on its original site.</p>' +
        '<a class="btn btn-primary" href="' + game.src + '" target="_blank" rel="noopener">Play now</a>' +
        '</div></div>';
    } else {
      frame = '<div class="frame-wrap" id="frameWrap"><iframe src="' + game.src + '" title="' + game.title + '" allow="fullscreen; gamepad; autoplay; accelerometer; gyroscope" sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms" allowfullscreen loading="eager"></iframe></div>';
    }

    var stars = "";
    for (var s = 1; s <= 5; s++) stars += '<button class="star' + (s <= rating ? " on" : "") + '" data-s="' + s + '" aria-label="Rate ' + s + '">' + I.star + "</button>";

    main.innerHTML =
      '<div class="wrap" style="padding-top:22px;padding-bottom:48px">' +
        '<div class="play-top"><a class="btn btn-ghost" href="games.html' + (game.category ? "?cat=" + game.category : "") + '">' + I.arrowLeft + "<span>Back</span></a>" +
          '<div class="right"><button class="btn btn-ghost" id="fsBtn">' + I.maximize + "<span>Fullscreen</span></button></div></div>" +
        frame +
        '<div class="play-meta">' +
          '<div class="play-meta-left">' +
            '<span class="cat-label"><span class="dot" style="background:' + (cat ? cat.accent : game.accent) + '"></span>' + (cat ? cat.name : "") + "</span>" +
            "<h1>" + game.title + "</h1>" +
            '<p class="play-desc">' + game.description + "</p>" +
          "</div>" +
          '<div class="play-meta-right"><div class="stars" id="stars">' + stars + '<span class="rate-hint" id="rateHint">' + (rating > 0 ? rating + "/5" : "Rate") + "</span></div></div>" +
        "</div>" +
        (related.length ? '<h2 class="related-head">More games</h2><div class="related-row" id="relRow"></div>' : "") +
      "</div>";

    var relRow = document.getElementById("relRow");
    if (relRow) related.forEach(function (g) { relRow.appendChild(window.ARCADIA_CARD(g)); });

    var starWrap = document.getElementById("stars");
    if (starWrap) {
      var btns = starWrap.querySelectorAll(".star"), hint = document.getElementById("rateHint");
      btns.forEach(function (b) {
        b.addEventListener("mouseenter", function () { var v = +b.dataset.s; btns.forEach(function (x, i) { x.classList.toggle("on", i < v); }); hint.textContent = v + "/5"; });
        b.addEventListener("mouseleave", function () { var cur = S.getRating(game.id); btns.forEach(function (x, i) { x.classList.toggle("on", i < cur); }); hint.textContent = cur > 0 ? cur + "/5" : "Rate"; });
        b.addEventListener("click", function () { var v = +b.dataset.s; S.setRating(game.id, v); btns.forEach(function (x, i) { x.classList.toggle("on", i < v); }); hint.textContent = v + "/5"; toast("Rated " + v + "/5"); });
      });
    }

    var fsBtn = document.getElementById("fsBtn"), fw = document.getElementById("frameWrap");
    if (fsBtn && fw) {
      fsBtn.addEventListener("click", function () { if (document.fullscreenElement) document.exitFullscreen(); else fw.requestFullscreen && fw.requestFullscreen(); });
      document.addEventListener("fullscreenchange", function () { var fs = !!document.fullscreenElement; fsBtn.innerHTML = fs ? I.minimize + "<span>Exit</span>" : I.maximize + "<span>Fullscreen</span>"; });
    }

    window.ARCADIA_REVEAL(main);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
