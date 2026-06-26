/* =====================================================================
   Arcadia — shared app logic
   Favorites + ratings in localStorage, card rendering, nav, footer, reveal.
   ===================================================================== */
(function () {
  "use strict";

  var FAV_KEY = "arcadia:favorites", RATE_KEY = "arcadia:ratings", RECENT_KEY = "arcadia:recent", FAV_EVENT = "arcadia:favchange";

  function read(k, f) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch (e) { return f; } }
  function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  var store = {
    getFavs: function () { return read(FAV_KEY, []); },
    isFav: function (id) { return store.getFavs().indexOf(id) >= 0; },
    toggleFav: function (id) { var f = store.getFavs(), i = f.indexOf(id); if (i >= 0) f.splice(i, 1); else f.push(id); write(FAV_KEY, f); window.dispatchEvent(new Event(FAV_EVENT)); return i < 0; },
    getRating: function (id) { return read(RATE_KEY, {})[id] || 0; },
    setRating: function (id, s) { var r = read(RATE_KEY, {}); r[id] = s; write(RATE_KEY, r); },
    getRecent: function () { return read(RECENT_KEY, []); },
    markRecent: function (id) { var r = store.getRecent().filter(function (x) { return x !== id; }); r.unshift(id); write(RECENT_KEY, r.slice(0, 12)); }
  };
  window.ARCADIA_STORE = store;

  var I = {
    heart: '<svg class="icon" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>',
    search: '<svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
    star: '<svg class="icon" viewBox="0 0 24 24"><polygon points="12 2 15 9 22 9.3 16.5 14 18.5 21 12 17 5.5 21 7.5 14 2 9.3 9 9 12 2"/></svg>',
    coffee: '<svg class="icon" viewBox="0 0 24 24"><path d="M4 9h13v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9z"/><path d="M17 11h2a3 3 0 0 1 0 6h-2"/></svg>',
    arrowRight: '<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    arrowLeft: '<svg class="icon" viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    x: '<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    maximize: '<svg class="icon" viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>',
    minimize: '<svg class="icon" viewBox="0 0 24 24"><path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3"/></svg>',
    sliders: '<svg class="icon icon-sm" viewBox="0 0 24 24"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/></svg>',
    gamepad: '<svg class="icon" viewBox="0 0 24 24"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="4"/></svg>',
    menu: '<svg class="icon" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>'
  };
  window.ARCADIA_ICONS = I;

  function toast(msg) {
    var w = document.querySelector(".toast-wrap"); if (!w) { w = document.createElement("div"); w.className = "toast-wrap"; document.body.appendChild(w); }
    var t = document.createElement("div"); t.className = "toast"; t.textContent = msg; w.appendChild(t);
    setTimeout(function () { t.style.opacity = "0"; t.style.transition = "opacity .25s"; }, 1600);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 2000);
  }
  window.ARCADIA_TOAST = toast;

  /* ---------- card ---------- */
  function cardEl(game) {
    var cat = window.ARCADIA.catById(game.category);
    var card = document.createElement("article");
    card.className = "card reveal";
    card.style.setProperty("--accent-c", game.accent);

    var thumb = document.createElement("div");
    thumb.className = "card-thumb";
    thumb.innerHTML = '<span class="card-cat">' + (cat ? cat.name : "") + "</span>" +
      '<span class="card-glyph">' + game.title.slice(0, 2).toUpperCase() + "</span>";
    thumb.addEventListener("click", function () { goPlay(game.id); });
    card.appendChild(thumb);

    var body = document.createElement("div");
    body.className = "card-body";
    var row = document.createElement("div");
    row.className = "card-title-row";
    var title = document.createElement("div"); title.className = "card-title"; title.textContent = game.title;
    var heart = document.createElement("button");
    heart.className = "heart-btn" + (store.isFav(game.id) ? " on" : "");
    heart.setAttribute("aria-label", store.isFav(game.id) ? "Remove from favorites" : "Add to favorites");
    heart.innerHTML = I.heart;
    heart.addEventListener("click", function (e) { e.stopPropagation(); var on = store.toggleFav(game.id); heart.classList.toggle("on", on); toast(on ? "Added to favorites" : "Removed"); });
    row.appendChild(title); row.appendChild(heart);
    body.appendChild(row);
    var desc = document.createElement("div"); desc.className = "card-desc"; desc.textContent = game.description;
    body.appendChild(desc);
    card.appendChild(body);
    return card;
  }
  window.ARCADIA_CARD = cardEl;

  function goPlay(id) { store.markRecent(id); window.location.href = "play.html?id=" + encodeURIComponent(id); }
  window.ARCADIA_GO_PLAY = goPlay;

  /* ---------- nav ---------- */
  function mountNav(active) {
    var slot = document.getElementById("nav-slot"); if (!slot) return;
    var n = store.getFavs().length;
    var nav = document.createElement("header");
    nav.className = "nav";
    nav.innerHTML =
      '<div class="nav-inner wrap">' +
        '<a class="brand" href="index.html"><span class="brand-mark">' + I.gamepad + '</span><span class="brand-name">Arcadia</span></a>' +
        '<nav class="nav-links" id="navLinks">' +
          '<a class="nav-link' + (active === "home" ? " active" : "") + '" href="index.html">Home</a>' +
          '<a class="nav-link' + (active === "games" ? " active" : "") + '" href="games.html">Browse</a>' +
          '<a class="nav-link' + (active === "favorites" ? " active" : "") + '" href="games.html?fav=1">Favorites<span class="fav-badge' + (n ? " has" : " zero") + '">' + n + "</span></a>" +
        "</nav>" +
        '<div class="nav-actions">' +
          '<a class="donate-btn" href="https://buymeacoffee.com/jeffreyscof" target="_blank" rel="noopener">' + I.coffee + "<span>Donate</span></a>" +
          '<button class="menu-btn" id="menuBtn" aria-label="Menu">' + I.menu + "</button>" +
        "</div>" +
      "</div>";
    slot.replaceWith(nav);
    nav.querySelector("#menuBtn").addEventListener("click", function () { nav.querySelector("#navLinks").classList.toggle("open"); });
    function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 8); }
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener(FAV_EVENT, function () { var c = store.getFavs().length; var b = nav.querySelector(".fav-badge"); if (b) { b.textContent = c; b.className = "fav-badge" + (c ? " has" : " zero"); } });
  }
  window.ARCADIA_NAV = mountNav;

  /* ---------- footer ---------- */
  function mountFooter() {
    var slot = document.getElementById("footer-slot"); if (!slot) return;
    var f = document.createElement("footer");
    f.className = "footer";
    f.innerHTML =
      '<div class="footer-inner">' +
        '<span class="muted">© ' + new Date().getFullYear() + " Arcadia — free browser games</span>" +
        '<div class="footer-links">' +
          '<a href="games.html">Browse</a>' +
          '<a href="games.html?fav=1">Favorites</a>' +
          '<a href="https://buymeacoffee.com/jeffreyscof" target="_blank" rel="noopener">Donate</a>' +
        "</div>" +
      "</div>";
    slot.replaceWith(f);
  }
  window.ARCADIA_FOOTER = mountFooter;

  /* ---------- reveal ---------- */
  function observeReveals(root) {
    root = root || document.body;
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { threshold: 0.06, rootMargin: "0px 0px -20px 0px" });
    function scan(el) { (el || root).querySelectorAll(".reveal:not(.in)").forEach(function (n) { io.observe(n); }); }
    scan(root);
    var mo = new MutationObserver(function (ms) { ms.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType !== 1) return; if (n.classList && n.classList.contains("reveal") && !n.classList.contains("in")) io.observe(n); scan(n); }); }); });
    mo.observe(root, { childList: true, subtree: true });
  }
  window.ARCADIA_REVEAL = observeReveals;
})();
