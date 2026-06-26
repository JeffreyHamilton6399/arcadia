/* =====================================================================
   Arcadia — play page logic
   Reads ?id=, renders iframe (sandboxed) or redirect launch screen,
   star rating (localStorage), related games, fullscreen toggle.
   ===================================================================== */
(function () {
  "use strict";
  var S = window.ARCADIA_STORE, A = window.ARCADIA, I = window.ARCADIA_ICONS, toast = window.ARCADIA_TOAST;

  function qs(name) { var m = new RegExp("[?&]" + name + "=([^&]*)").exec(location.search); return m ? decodeURIComponent(m[1]) : null; }

  function init() {
    window.ARCADIA_NAV("play");
    window.ARCADIA_FOOTER();

    var id = qs("id");
    var game = A.gameById(id);
    var main = document.getElementById("main");

    if (!game) {
      main.innerHTML =
        '<div class="wrap" style="text-align:center;padding:80px 20px">' +
          '<div class="brand-mark" style="margin:0 auto 16px">' + I.gamepad + "</div>" +
          "<h1 style='font-size:30px;margin-bottom:8px'>Game not found</h1>" +
          "<p class='muted' style='margin-bottom:20px'>We couldn't find that game. It may have wandered off into another arcade.</p>" +
          '<a class="btn btn-primary" href="index.html">Back home</a> ' +
          '<a class="btn btn-ghost" href="games.html">Browse games</a>' +
        "</div>";
      window.ARCADIA_REVEAL(main);
      return;
    }

    document.title = game.title + " — Arcadia";

    var cat = A.catById(game.category);
    var rating = S.getRating(game.id);
    var related = A.related(game, 5);
    S.markRecent(game.id);

    // header buttons
    var backBtn = '<a class="btn btn-ghost" href="games.html' + (game.category ? "?cat=" + game.category : "") + '">' + I.arrowLeft + "<span>Back</span></a>";
    var fsBtn = '<button class="btn btn-ghost" id="fsBtn">' + I.maximize + "<span>Fullscreen</span></button>";
    var openBtn = game.embedType === "redirect" ? "" : '<a class="btn btn-ghost" href="' + game.src + '" target="_blank" rel="noopener">' + I.external + "<span>Open original</span></a>";

    var frame;
    if (game.embedType === "redirect") {
      frame =
        '<div class="launch" style="--accent-c:' + game.accent + '">' +
          '<div class="l-grid"></div>' +
          '<div class="launch-inner">' +
            '<div class="thumb-glyph" style="font-size:48px;margin-bottom:14px;color:' + game.accent + ';text-shadow:0 0 24px ' + game.accent + '">' + game.title.slice(0, 2).toUpperCase() + "</div>" +
            "<h2>" + game.title + "</h2>" +
            "<p>This game opens in a new tab on its original site. You'll leave Arcadia to play it.</p>" +
            '<a class="btn btn-cyan" href="' + game.src + '" target="_blank" rel="noopener">' + I.play + "<span>Play now</span></a>" +
          "</div>" +
        "</div>";
    } else {
      frame =
        '<div class="frame-wrap" id="frameWrap" style="--accent-c:' + game.accent + '">' +
          '<iframe src="' + game.src + '" title="' + game.title + '" ' +
            'allow="fullscreen; gamepad; autoplay; accelerometer; gyroscope" ' +
            'sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms" ' +
            'allowfullscreen loading="eager"></iframe>' +
        "</div>";
    }

    // stars
    var stars = "";
    for (var s = 1; s <= 5; s++) {
      stars += '<button class="star' + (s <= rating ? " on" : "") + '" data-s="' + s + '" aria-label="Rate ' + s + ' star' + (s > 1 ? "s" : "") + '">' + I.star + "</button>";
    }

    var relatedItems = related.map(function (g) {
      var c = A.catById(g.category);
      return '<a class="related-item" data-id="' + g.id + '" style="--accent-c:' + g.accent + '" href="play.html?id=' + g.id + '">' +
        '<span class="related-thumb">' + g.title.slice(0, 2).toUpperCase() + "</span>" +
        '<span class="related-info"><b>' + g.title + "</b><span>" + (c ? c.name : "") + "</span></span>" +
        '<span class="related-go">Play</span>' +
      "</a>";
    }).join("");

    // Related grid cards are appended as real elements AFTER innerHTML is set,
    // so their event listeners (heart buttons) survive.

    main.innerHTML =
      '<div class="wrap" style="padding-top:20px;padding-bottom:40px">' +
        '<div class="play-top">' +
          '<div class="left">' + backBtn + "</div>" +
          '<div class="right">' + openBtn + fsBtn + "</div>" +
        "</div>" +
        '<div class="play-layout">' +
          '<div>' +
            frame +
            '<div class="play-title-row">' +
              '<span class="badge" style="--badge-c:' + (cat ? cat.accent : game.accent) + '">' + (cat ? cat.name : "") + "</span>" +
              (game.hot ? '<span class="badge hot">Hot</span>' : "") +
              (game.webgl ? '<span class="badge webgl">WebGL</span>' : "") +
            "</div>" +
            "<h1 style='margin-top:8px'>" + game.title + "</h1>" +
            '<p class="play-desc">' + game.description + "</p>" +
            '<div class="tags">' + game.tags.map(function (t) { return '<span class="tag">#' + t + "</span>"; }).join("") + "</div>" +
          "</div>" +
          '<aside class="aside">' +
            '<div class="panel"><h3>Rate this game</h3><div class="stars" id="stars">' + stars + '<span class="rate-hint" id="rateHint">' + (rating > 0 ? rating + ".0 / 5" : "Tap to rate") + "</span></div></div>" +
            '<a class="panel" style="display:flex;align-items:center;gap:12px;text-decoration:none;color:inherit;border-color:rgba(245,158,11,.2);background:linear-gradient(90deg,rgba(245,158,11,.1),rgba(249,115,22,.1))" href="https://buymeacoffee.com/jeffreyscof" target="_blank" rel="noopener">' +
              '<span style="width:40px;height:40px;border-radius:11px;background:rgba(245,158,11,.15);display:grid;place-items:center;color:#fbbf24">' + I.coffee + "</span>" +
              "<span><b style='font-size:14px'>Enjoying Arcadia?</b><br><span class='muted' style='font-size:12px'>Buy us a coffee to keep it free</span></span>" +
            "</a>" +
            (related.length ? '<div class="panel"><h3>Related games</h3><div class="related-list">' + relatedItems + "</div></div>" : "") +
          "</aside>" +
        "</div>" +
        (related.length ? '<section style="margin-top:28px"><div class="section-head"><h2><span class="grad">More to play</span></h2></div><div class="related-grid" id="relatedGrid"></div></section>' : "") +
      "</div>";

    // append related-grid cards as real elements (keeps heart listeners)
    var rg = document.getElementById("relatedGrid");
    if (rg) related.forEach(function (g) { rg.appendChild(window.ARCADIA_CARD(g)); });

    // star interactions
    var starWrap = document.getElementById("stars");
    if (starWrap) {
      var btns = starWrap.querySelectorAll(".star");
      var hint = document.getElementById("rateHint");
      btns.forEach(function (b) {
        b.addEventListener("mouseenter", function () { var v = +b.dataset.s; btns.forEach(function (x, i) { x.classList.toggle("on", i < v); }); hint.textContent = v + ".0 / 5"; });
        b.addEventListener("mouseleave", function () { var cur = S.getRating(game.id); btns.forEach(function (x, i) { x.classList.toggle("on", i < cur); }); hint.textContent = cur > 0 ? cur + ".0 / 5" : "Tap to rate"; });
        b.addEventListener("click", function () { var v = +b.dataset.s; S.setRating(game.id, v); btns.forEach(function (x, i) { x.classList.toggle("on", i < v); }); hint.textContent = v + ".0 / 5"; toast("Rated " + v + " star" + (v > 1 ? "s" : "")); });
      });
    }

    // fullscreen
    var fsBtnEl = document.getElementById("fsBtn");
    var frameWrap = document.getElementById("frameWrap");
    if (fsBtnEl && frameWrap) {
      fsBtnEl.addEventListener("click", function () {
        if (document.fullscreenElement) { document.exitFullscreen(); } else { frameWrap.requestFullscreen && frameWrap.requestFullscreen(); }
      });
      document.addEventListener("fullscreenchange", function () {
        var fs = !!document.fullscreenElement;
        fsBtnEl.innerHTML = fs ? I.minimize + "<span>Exit</span>" : I.maximize + "<span>Fullscreen</span>";
      });
    }

    window.ARCADIA_REVEAL(main);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
