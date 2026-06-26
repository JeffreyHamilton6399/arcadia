/* =====================================================================
   Arcadia — shared app logic
   Favorites + ratings in localStorage, card rendering, reveal-on-scroll,
   navbar behavior, search/filter. Pure vanilla JS, no dependencies.
   ===================================================================== */
(function () {
  "use strict";

  var FAV_KEY = "arcadia:favorites";
  var RATE_KEY = "arcadia:ratings";
  var RECENT_KEY = "arcadia:recent";
  var FAV_EVENT = "arcadia:favchange";

  /* ---------- storage ---------- */
  function read(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function write(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

  var store = {
    getFavs: function () { return read(FAV_KEY, []); },
    isFav: function (id) { return store.getFavs().indexOf(id) >= 0; },
    toggleFav: function (id) {
      var f = store.getFavs();
      var i = f.indexOf(id);
      if (i >= 0) f.splice(i, 1); else f.push(id);
      write(FAV_KEY, f);
      window.dispatchEvent(new Event(FAV_EVENT));
      return i < 0; // true if now favorited
    },
    getRating: function (id) { var r = read(RATE_KEY, {}); return r[id] || 0; },
    setRating: function (id, stars) { var r = read(RATE_KEY, {}); r[id] = stars; write(RATE_KEY, r); },
    getRecent: function () { return read(RECENT_KEY, []); },
    markRecent: function (id) {
      var r = store.getRecent().filter(function (x) { return x !== id; });
      r.unshift(id); r = r.slice(0, 12);
      write(RECENT_KEY, r);
    }
  };
  window.ARCADIA_STORE = store;

  /* ---------- icons (inline SVG, lucide-style) ---------- */
  var ICONS = {
    heart: '<svg class="icon" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
    play: '<svg class="icon" viewBox="0 0 24 24"><polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none"/></svg>',
    search: '<svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
    star: '<svg class="icon" viewBox="0 0 24 24"><polygon points="12 2 15 9 22 9.3 16.5 14 18.5 21 12 17 5.5 21 7.5 14 2 9.3 9 9 12 2"/></svg>',
    coffee: '<svg class="icon" viewBox="0 0 24 24"><path d="M4 9h13v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9z"/><path d="M17 11h2a3 3 0 0 1 0 6h-2"/><path d="M7 2v3M11 2v3M15 2v3"/></svg>',
    chevronLeft: '<svg class="icon" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>',
    chevronRight: '<svg class="icon" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>',
    arrowRight: '<svg class="icon" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    arrowLeft: '<svg class="icon" viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    x: '<svg class="icon" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    maximize: '<svg class="icon" viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>',
    minimize: '<svg class="icon" viewBox="0 0 24 24"><path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3"/></svg>',
    external: '<svg class="icon" viewBox="0 0 24 24"><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>',
    sliders: '<svg class="icon" viewBox="0 0 24 24"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>',
    gamepad: '<svg class="icon" viewBox="0 0 24 24"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="4"/></svg>',
    menu: '<svg class="icon" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>'
  };
  window.ARCADIA_ICONS = ICONS;

  /* ---------- toast ---------- */
  function toast(msg) {
    var wrap = document.querySelector(".toast-wrap");
    if (!wrap) { wrap = document.createElement("div"); wrap.className = "toast-wrap"; document.body.appendChild(wrap); }
    var t = document.createElement("div"); t.className = "toast"; t.textContent = msg;
    wrap.appendChild(t);
    setTimeout(function () { t.style.opacity = "0"; t.style.transition = "opacity .3s"; }, 1800);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 2200);
  }
  window.ARCADIA_TOAST = toast;

  /* ---------- card rendering ---------- */
  function cardEl(game, opts) {
    opts = opts || {};
    var cat = window.ARCADIA.catById(game.category);
    var card = document.createElement("article");
    card.className = "card reveal";
    card.style.setProperty("--accent-c", game.accent);
    card.setAttribute("role", "article");
    card.setAttribute("aria-label", game.title + " — " + (cat ? cat.name : "game"));

    var thumb = document.createElement("div");
    thumb.className = "card-thumb";
    thumb.innerHTML =
      '<div class="thumb-bg"></div>' +
      '<div class="thumb-grid"></div>' +
      '<div class="thumb-glyph">' + game.title.slice(0, 2).toUpperCase() + '</div>' +
      '<div class="badges">' +
        '<span class="badge" style="--badge-c:' + (cat ? cat.accent : game.accent) + '">' + (cat ? cat.name : "") + '</span>' +
        (game.webgl ? '<span class="badge webgl">WebGL</span>' : "") +
        (game.hot ? '<span class="badge hot">Hot</span>' : "") +
      '</div>' +
      '<div class="play-overlay"><span class="play-pill">' + ICONS.play + "Play now</span></div>";
    thumb.addEventListener("click", function () { goPlay(game.id); });
    card.appendChild(thumb);

    var body = document.createElement("div");
    body.className = "card-body";

    var titleRow = document.createElement("div");
    titleRow.className = "card-title-row";
    var title = document.createElement("div");
    title.className = "card-title"; title.textContent = game.title;
    var heart = document.createElement("button");
    heart.className = "heart-btn" + (store.isFav(game.id) ? " on" : "");
    heart.setAttribute("aria-label", store.isFav(game.id) ? "Remove from favorites" : "Add to favorites");
    heart.setAttribute("aria-pressed", store.isFav(game.id));
    heart.innerHTML = ICONS.heart;
    heart.addEventListener("click", function (e) { e.stopPropagation(); var nowFav = store.toggleFav(game.id); heart.classList.toggle("on", nowFav); heart.setAttribute("aria-pressed", nowFav); toast(nowFav ? "Added to favorites" : "Removed from favorites"); });
    titleRow.appendChild(title); titleRow.appendChild(heart);
    body.appendChild(titleRow);

    var desc = document.createElement("div");
    desc.className = "card-desc"; desc.textContent = game.description;
    body.appendChild(desc);

    var foot = document.createElement("div");
    foot.className = "card-foot";
    foot.innerHTML = '<span class="card-plays">' + window.ARCADIA.fmtPlays(game.plays) + '</span><span class="card-go">Play</span>';
    body.appendChild(foot);

    card.appendChild(body);
    return card;
  }
  window.ARCADIA_CARD = cardEl;

  /* ---------- navigation ---------- */
  function goPlay(id) {
    store.markRecent(id);
    window.location.href = "play.html?id=" + encodeURIComponent(id);
  }
  window.ARCADIA_GO_PLAY = goPlay;
  function goGames(cat) { window.location.href = "games.html" + (cat && cat !== "all" ? "?cat=" + encodeURIComponent(cat) : ""); }
  window.ARCADIA_GO_GAMES = goGames;
  function goHome() { window.location.href = "index.html"; }
  window.ARCADIA_GO_HOME = goHome;

  /* ---------- navbar (shared) ---------- */
  function buildNav(activeView) {
    var favCount = store.getFavs().length;
    var nav = document.createElement("header");
    nav.className = "nav";
    nav.innerHTML =
      '<div class="nav-inner wrap">' +
        '<a class="brand" href="index.html" aria-label="Arcadia home">' +
          '<span class="brand-mark">' + ICONS.gamepad + "</span>" +
          '<span class="brand-name">Arcadia</span>' +
        "</a>" +
        '<nav class="nav-links" id="navLinks">' +
          '<a class="nav-link' + (activeView === "home" ? " active" : "") + '" href="index.html">Home</a>' +
          '<a class="nav-link' + (activeView === "games" ? " active" : "") + '" href="games.html">Browse Games</a>' +
          '<a class="nav-link' + (activeView === "favorites" ? " active" : "") + '" href="games.html?fav=1">Favorites<span class="fav-badge' + (favCount ? "" : " zero") + '">' + favCount + "</span></a>" +
        "</nav>" +
        '<div class="nav-actions">' +
          '<a class="donate-btn" href="https://buymeacoffee.com/jeffreyscof" target="_blank" rel="noopener">' + ICONS.coffee + "<span>Donate</span></a>" +
          '<button class="icon-btn menu-btn" id="menuBtn" aria-label="Toggle menu">' + ICONS.menu + "</button>" +
        "</div>" +
      "</div>";
    return nav;
  }
  function mountNav(activeView) {
    var slot = document.getElementById("nav-slot");
    if (!slot) return;
    var nav = buildNav(activeView);
    slot.replaceWith(nav);
    var menuBtn = nav.querySelector("#menuBtn");
    if (menuBtn) menuBtn.addEventListener("click", function () { nav.querySelector("#navLinks").classList.toggle("open"); });
    function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 8); }
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener(FAV_EVENT, function () {
      var c = store.getFavs().length;
      var b = nav.querySelector(".fav-badge");
      if (b) { b.textContent = c; b.classList.toggle("zero", !c); }
    });
  }
  window.ARCADIA_NAV = mountNav;

  /* ---------- footer (shared) ---------- */
  function mountFooter() {
    var slot = document.getElementById("footer-slot");
    if (!slot) return;
    var f = document.createElement("footer");
    f.className = "footer";
    var cats = window.ARCADIA.cats.slice(0, 8);
    var catLinks = cats.map(function (c) {
      return '<li><a href="games.html?cat=' + c.id + '"><span class="cat-dot" style="color:' + c.accent + '"></span>' + c.name + "</a></li>";
    }).join("");
    f.innerHTML =
      '<div class="footer-inner">' +
        '<div><div class="brand" style="margin-bottom:12px"><span class="brand-mark">' + ICONS.gamepad + '</span><span class="brand-name">Arcadia</span></div>' +
          '<p class="muted" style="font-size:14px;max-width:340px">' + window.ARCADIA.all.length + " free browser games, fully self-hosted. No downloads, no signups, no friction. Just press play.</p>" +
          '<a class="btn btn-cyan" style="margin-top:14px" href="https://buymeacoffee.com/jeffreyscof" target="_blank" rel="noopener">' + ICONS.coffee + "Support Arcadia</a>" +
        "</div>" +
        '<div><h4>Categories</h4><ul>' + catLinks + "</ul></div>" +
        '<div><h4>Explore</h4><ul>' +
          '<li><a href="index.html">Home</a></li>' +
          '<li><a href="games.html">All Games</a></li>' +
          '<li><a href="games.html?fav=1">Favorites</a></li>' +
          '<li><a href="https://buymeacoffee.com/jeffreyscof" target="_blank" rel="noopener">Donate</a></li>' +
        "</ul></div>" +
      "</div>" +
      '<div class="footer-bottom"><span>© ' + new Date().getFullYear() + " Arcadia. All games belong to their respective owners.</span><span>Built for gamers everywhere</span></div>";
    slot.replaceWith(f);
  }
  window.ARCADIA_FOOTER = mountFooter;

  /* ---------- reveal on scroll (IntersectionObserver + MutationObserver) ---------- */
  function observeReveals(root) {
    root = root || document.body;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });
    function scan(el) { (el || root).querySelectorAll(".reveal:not(.in)").forEach(function (n) { io.observe(n); }); }
    scan(root);
    var mo = new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        m.addedNodes.forEach(function (n) {
          if (n.nodeType !== 1) return;
          if (n.classList && n.classList.contains("reveal") && !n.classList.contains("in")) io.observe(n);
          scan(n);
        });
      });
    });
    mo.observe(root, { childList: true, subtree: true });
    return { io: io, mo: mo };
  }
  window.ARCADIA_REVEAL = observeReveals;

  /* ---------- bootstrap common bits ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    // mark body so page-specific scripts can run
  });
})();
