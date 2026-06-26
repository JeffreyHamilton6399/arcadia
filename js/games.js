/* =====================================================================
   Arcadia — master game catalog
   Every game is self-hosted under /games/<id>/ on the SAME domain.
   embedType "iframe"  -> loads /games/<id>/index.html in a sandboxed iframe
   embedType "redirect"-> shows a launch screen; opens external URL in new tab
   ===================================================================== */

window.ARCADIA_CATEGORIES = [
  { id: "arcade",    name: "Arcade",       accent: "#22D3EE" },
  { id: "puzzle",    name: "Puzzle",       accent: "#EAB308" },
  { id: "classic",   name: "Classic",      accent: "#84CC16" },
  { id: "action",    name: "Action",       accent: "#F43F5E" },
  { id: "racing",    name: "Racing",       accent: "#F97316" },
  { id: "runner",    name: "Endless Runner", accent: "#7C3AED" },
  { id: "rhythm",    name: "Rhythm",       accent: "#EC4899" },
  { id: "strategy",  name: "Strategy",     accent: "#14B8A6" },
  { id: "idle",      name: "Idle",         accent: "#F59E0B" },
  { id: "word",      name: "Word",         accent: "#67E8F9" },
  { id: "casual",    name: "Casual",       accent: "#A855F7" },
  { id: "multiplayer", name: "Multiplayer", accent: "#FB7185" },
];

window.ARCADIA_GAMES = [
  // ---- Self-hosted (iframe) ----
  { id:"2048", title:"2048", description:"Slide and merge tiles to reach 2048.", category:"puzzle", tags:["numbers","merge","addictive"], accent:"#EAB308", hot:true, added:"2024-01-10", plays:3120000, embedType:"iframe", src:"games/2048/index.html" },
  { id:"snake", title:"Snake", description:"Grow your snake without biting your tail.", category:"classic", tags:["retro","arcade"], accent:"#84CC16", hot:false, added:"2024-02-05", plays:620000, embedType:"iframe", src:"games/snake/index.html" },
  { id:"tetris", title:"Tetris", description:"The timeless block-stacking classic.", category:"classic", tags:["blocks","falling","classic"], accent:"#22D3EE", hot:true, added:"2024-01-22", plays:1080000, embedType:"iframe", src:"games/tetris/index.html" },
  { id:"flappy", title:"Flappy Bird", description:"Tap to flap through the pipes.", category:"arcade", tags:["tap","hard","arcade"], accent:"#FACC15", hot:false, added:"2024-04-19", plays:1020000, embedType:"iframe", src:"games/flappy/index.html" },
  { id:"minesweeper", title:"Minesweeper", description:"Flag the mines, clear the field.", category:"puzzle", tags:["logic","retro","classic"], accent:"#EAB308", hot:false, added:"2024-02-20", plays:360000, embedType:"iframe", src:"games/minesweeper/index.html" },
  { id:"pacman", title:"Pac-Man", description:"Eat dots and dodge ghosts in the maze.", category:"classic", tags:["maze","retro","arcade"], accent:"#FACC15", hot:false, added:"2024-03-28", plays:740000, embedType:"iframe", src:"games/pacman/index.html" },
  { id:"wordle", title:"Word Hunt", description:"Guess the five-letter word in six tries.", category:"word", tags:["words","daily","logic"], accent:"#67E8F9", hot:true, added:"2025-01-18", plays:1890000, embedType:"iframe", src:"games/wordle/index.html" },
  { id:"cookieclicker", title:"Cookie Clicker", description:"Click, buy, automate, repeat forever.", category:"idle", tags:["idle","clicker","incremental"], accent:"#F59E0B", hot:true, added:"2024-09-09", plays:1340000, embedType:"iframe", src:"games/cookieclicker/index.html" },
  { id:"breakout", title:"Breakout", description:"Bounce the ball and smash every brick.", category:"arcade", tags:["ball","bricks","arcade"], accent:"#22D3EE", hot:false, added:"2024-03-15", plays:580000, embedType:"iframe", src:"games/breakout/index.html" },
  { id:"pong", title:"Pong", description:"The original. Beat the AI paddle to 7.", category:"classic", tags:["paddle","retro","1v1"], accent:"#22D3EE", hot:false, added:"2024-02-12", plays:440000, embedType:"iframe", src:"games/pong/index.html" },
  { id:"memory", title:"Memory Match", description:"Flip cards and find every matching pair.", category:"casual", tags:["memory","cards","casual"], accent:"#A855F7", hot:false, added:"2024-05-04", plays:390000, embedType:"iframe", src:"games/memory/index.html" },
  { id:"sliding-puzzle", title:"15 Puzzle", description:"Slide tiles into order, 1 through 15.", category:"puzzle", tags:["sliding","logic","classic"], accent:"#EAB308", hot:false, added:"2024-03-08", plays:280000, embedType:"iframe", src:"games/sliding-puzzle/index.html" },
  { id:"sudoku", title:"Sudoku", description:"Fill the grid. One number per row, column, box.", category:"puzzle", tags:["logic","numbers","brain"], accent:"#EAB308", hot:false, added:"2024-03-02", plays:380000, embedType:"iframe", src:"games/sudoku/index.html" },
  { id:"tictactoe", title:"Tic-Tac-Toe", description:"Three in a row against an unbeatable AI.", category:"strategy", tags:["1v1","ai","classic"], accent:"#14B8A6", hot:false, added:"2024-01-15", plays:520000, embedType:"iframe", src:"games/tictactoe/index.html" },
  { id:"connect4", title:"Connect Four", description:"Drop pieces, line up four, beat the AI.", category:"strategy", tags:["ai","board","classic"], accent:"#14B8A6", hot:false, added:"2024-02-28", plays:410000, embedType:"iframe", src:"games/connect4/index.html" },
  { id:"simon", title:"Simon", description:"Repeat the growing color sequence.", category:"rhythm", tags:["memory","sound","sequence"], accent:"#EC4899", hot:false, added:"2024-04-22", plays:330000, embedType:"iframe", src:"games/simon/index.html" },
  { id:"whackamole", title:"Whack-a-Mole", description:"Bonk as many moles as you can in 30 seconds.", category:"casual", tags:["reaction","timed","casual"], accent:"#A855F7", hot:false, added:"2024-05-12", plays:300000, embedType:"iframe", src:"games/whackamole/index.html" },
  { id:"aimtrainer", title:"Aim Trainer", description:"Click targets fast. How high can you score?", category:"action", tags:["aim","fps","timed"], accent:"#F43F5E", hot:false, added:"2024-06-18", plays:450000, embedType:"iframe", src:"games/aimtrainer/index.html" },
  { id:"reaction", title:"Reaction Time", description:"How fast can you click when it turns green?", category:"casual", tags:["reaction","timed","test"], accent:"#A855F7", hot:false, added:"2024-06-25", plays:260000, embedType:"iframe", src:"games/reaction/index.html" },
  { id:"stack", title:"Stack", description:"Drop blocks perfectly to build a tower.", category:"arcade", tags:["precision","tower","casual"], accent:"#22D3EE", hot:false, added:"2024-06-24", plays:350000, embedType:"iframe", src:"games/stack/index.html" },
  { id:"doodlejump", title:"Doodle Jump", description:"Bounce up forever. Don't miss a platform.", category:"arcade", tags:["jump","endless","platforms"], accent:"#22D3EE", hot:false, added:"2024-09-22", plays:480000, embedType:"iframe", src:"games/doodlejump/index.html" },
  { id:"slope", title:"Slope", description:"Steer a ball down an endless neon track.", category:"runner", tags:["3d","endless","neon","webgl"], accent:"#7C3AED", hot:true, added:"2024-11-02", plays:1520000, embedType:"iframe", src:"games/slope/index.html", webgl:true },
  { id:"geometrydash", title:"Geometry Dash", description:"One-button rhythm runner. Jump the spikes.", category:"rhythm", tags:["rhythm","one-button","hard"], accent:"#EC4899", hot:true, added:"2024-12-20", plays:1760000, embedType:"iframe", src:"games/geometrydash/index.html" },
  { id:"run3", title:"Run 3", description:"Endless space runner. Jump gaps, double-jump walls.", category:"runner", tags:["space","endless","jump"], accent:"#7C3AED", hot:false, added:"2024-03-19", plays:1120000, embedType:"iframe", src:"games/run3/index.html" },
  { id:"polytrack", title:"PolyTrack", description:"Top-down arcade racer. Three laps, go fast.", category:"racing", tags:["racing","laps","3d"], accent:"#F97316", hot:true, added:"2025-01-12", plays:982000, embedType:"iframe", src:"games/polytrack/index.html" },
  { id:"crossyroad", title:"Crossy Road", description:"Hop across roads. Dodge the traffic.", category:"action", tags:["hop","traffic","endless"], accent:"#F43F5E", hot:false, added:"2024-10-18", plays:670000, embedType:"iframe", src:"games/crossyroad/index.html" },
  { id:"slither", title:"Slither", description:"Grow the longest snake. Don't crash into others.", category:"multiplayer", tags:["io","snake","arena"], accent:"#FB7185", hot:false, added:"2024-02-28", plays:1290000, embedType:"iframe", src:"games/slither/index.html" },
  { id:"helix", title:"Helix Jump", description:"Rotate the tower to drop the ball through gaps.", category:"arcade", tags:["rotate","fall","casual"], accent:"#22D3EE", hot:false, added:"2024-11-25", plays:520000, embedType:"iframe", src:"games/helix/index.html" },

  // ---- Redirect (external, can't self-host) ----
  { id:"retro-bowl", title:"Retro Bowl", description:"Retro American-football management sim.", category:"strategy", tags:["football","management","retro"], accent:"#10B981", hot:true, added:"2025-01-05", plays:2210000, embedType:"redirect", src:"https://retrobowls.github.io/" },
  { id:"1v1-lol", title:"1v1.LOL", description:"Build and battle in a 1v1 arena shooter.", category:"action", tags:["shooter","building","1v1"], accent:"#EF4444", hot:true, added:"2024-10-10", plays:2040000, embedType:"redirect", src:"https://1v1.lol/" },
  { id:"bitlife", title:"BitLife", description:"Live a whole simulated life, one tap at a time.", category:"casual", tags:["life","sim","choices"], accent:"#2DD4BF", hot:false, added:"2024-06-12", plays:910000, embedType:"redirect", src:"https://html5.gamemonetize.co/9m3x7b1k2v9c5j4n6p0q8w2e8/" },
];

/* ---- helpers ---- */
window.ARCADIA = (function () {
  var G = window.ARCADIA_GAMES, C = window.ARCADIA_CATEGORIES;
  var catMap = {}; C.forEach(function (c) { catMap[c.id] = c; });
  function gameById(id) { for (var i = 0; i < G.length; i++) if (G[i].id === id) return G[i]; return null; }
  function catById(id) { return catMap[id]; }
  function trending(n) { return G.slice().sort(function (a, b) { return b.plays - a.plays; }).slice(0, n || 12); }
  function recent(n) { return G.slice().sort(function (a, b) { return new Date(b.added) - new Date(a.added); }).slice(0, n || 8); }
  function hot(n) { return G.filter(function (g) { return g.hot; }).sort(function (a, b) { return b.plays - a.plays; }).slice(0, n || 8); }
  function related(game, n) {
    n = n || 5;
    var same = G.filter(function (g) { return g.id !== game.id && g.category === game.category; });
    var tag = G.filter(function (g) { return g.id !== game.id && g.category !== game.category && g.tags.some(function (t) { return game.tags.indexOf(t) >= 0; }); });
    return same.concat(tag).slice(0, n);
  }
  function fmtPlays(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(1) + "M plays";
    if (n >= 1e3) return Math.round(n / 1e3) + "K plays";
    return n + " plays";
  }
  return { all: G, cats: C, gameById: gameById, catById: catById, trending: trending, recent: recent, hot: hot, related: related, fmtPlays: fmtPlays };
})();
