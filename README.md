# Arcadia

A free browser games arcade — like Cool Math Games, but good-looking and not covered in ads. Dark, clean, fast. People come here to play games; Arcadia gets out of their way.

**Every game is self-hosted** in this repo under `/games/<id>/index.html` and served from your own Vercel domain, so school filters can't block individual game sites — they'd have to block your whole domain.

- **Stack:** Pure HTML, CSS, vanilla JavaScript. No frameworks, no build step, no npm.
- **Games:** 31 total — 28 fully self-hosted HTML5 games + 3 external (redirect launch screens).
- **Persistence:** Favorites and star ratings saved to `localStorage`. No backend.
- **School-friendly:** No Flash, no plugins, no downloads. Pure HTML5/JS/WebGL.
- **Responsive:** Mobile-first, works on Chromebooks and phones.

---

## Quick start (local)

Arcadia is just static files. Open `index.html` in a browser — but because games load in sandboxed iframes from the same origin, you'll want a local server so paths resolve correctly:

```bash
# Python 3
python3 -m http.server 8080
# then open http://localhost:8080/

# or Node
npx serve

# or Bun
bunx serve
```

No install, no build — that's it.

---

## Deploy to Vercel (60 seconds)

1. **Push to GitHub** — clone this repo, commit everything, push to a GitHub repository.
2. **Import on Vercel** — go to [vercel.com/new](https://vercel.com/new), pick your repo.
3. **Settings** — Vercel auto-detects a static site. No build command, no output directory needed (root is the site root). The included `vercel.json` handles clean URLs.
4. **Deploy** — click Deploy. You're live.

`vercel.json` gives you:
- Clean URLs: `/games`, `/home`, `/play/polytrack` (rewritten to `play.html?id=polytrack`)
- Security headers on game assets

---

## Project structure

```
arcadia/
├── index.html          # Home — hero, search, trending row, category shortcuts, recently added
├── games.html          # Browse — grid with search, category tabs, sort, favorites toggle
├── play.html           # Play — sandboxed iframe (or redirect launch), rating, related games
├── css/style.css       # All styles (dark theme, glassmorphism, responsive)
├── js/
│   ├── games.js        # Master game catalog (the single source of truth)
│   ├── app.js          # Shared logic: favorites, ratings, cards, nav, footer, reveal
│   └── player.js       # Play-page logic: iframe, fullscreen, star rating, related
├── vercel.json         # Clean URLs + headers
├── README.md           # This file
└── games/              # Self-hosted games — one folder per game
    ├── 2048/index.html
    ├── snake/index.html
    ├── tetris/index.html
    ├── ... (28 total, see below)
```

---

## The games catalog

All 28 self-hosted games live in `games/<id>/index.html`. Each is a single self-contained HTML file with inline CSS and JS — no external resources, no CDNs, no frameworks. They run inside a sandboxed iframe (`sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"`) with `allow="fullscreen; gamepad"`.

| Game | Category | Notes |
|------|----------|-------|
| 2048 | Puzzle | Merge tiles, best score saved |
| Snake | Classic | Grid snake, swipe + keys |
| Tetris | Classic | All 7 tetrominoes, ghost piece, next preview |
| Flappy Bird | Arcade | Tap to flap |
| Minesweeper | Puzzle | 10×10, 15 mines, first-click safe |
| Pac-Man | Classic | Maze, dots, power pellet, 3 ghosts |
| Word Hunt | Word | Wordle-style 5-letter, on-screen keyboard |
| Cookie Clicker | Idle | Auto-production, upgrades, save state |
| Breakout | Arcade | Bricks, 3 lives |
| Pong | Classic | vs AI, first to 7 |
| Memory Match | Casual | 8 pairs, flip cards |
| 15 Puzzle | Puzzle | Sliding tiles |
| Sudoku | Puzzle | Conflict highlighting |
| Tic-Tac-Toe | Strategy | vs unbeatable minimax AI |
| Connect Four | Strategy | vs minimax AI |
| Simon | Rhythm | Color/sound sequence |
| Whack-a-Mole | Casual | 30-second timed |
| Aim Trainer | Action | 30-second target clicking |
| Reaction Time | Casual | Green-light ms test |
| Stack | Arcade | Tower stacking |
| Doodle Jump | Arcade | Endless bouncer |
| Slope | Endless Runner | Neon track, **WebGL badge** |
| Geometry Dash | Rhythm | One-button spike runner |
| Run 3 | Endless Runner | Space runner, double-jump |
| PolyTrack | Racing | Top-down 3-lap racer |
| Crossy Road | Action | Frogger-style traffic hop |
| Slither | Multiplayer | Snake vs bots |
| Helix Jump | Arcade | Rotate tower, drop ball |

Plus 3 **redirect** games (Retro Bowl, 1v1.LOL, BitLife) that show a launch screen and open the original site in a new tab — these can't be self-hosted.

---

## How to add a new self-hosted game

1. **Create the game folder:** `games/mygame/index.html`. Put a complete, self-contained HTML5 game in it (inline CSS/JS, no external resources, no `alert`/`prompt`, no top-window navigation — it must work in a sandboxed iframe).

2. **Add an entry to the catalog** in `js/games.js`:

   ```js
   {
     id: "mygame",                  // must match the folder name
     title: "My Game",
     description: "A one-line description.",
     category: "puzzle",            // see ARCADIA_CATEGORIES for valid ids
     tags: ["fun", "casual"],
     accent: "#22D3EE",             // card accent color
     hot: false,                    // show "Hot" badge
     added: "2025-02-01",           // ISO date for "newest" sort
     plays: 12345,                  // relative popularity for "popular" sort
     embedType: "iframe",           // "iframe" = self-hosted, "redirect" = external
     src: "/games/mygame/"          // path to the game's index.html
   }
   ```

3. **That's it.** The game appears on the home page (if trending/recent), in Browse, and is playable at `play.html?id=mygame` (or `/play/mygame` via the clean URL rewrite).

### Game requirements (for self-hosted games)

- Runs as a **standalone HTML file** with no server required.
- **No external resources** — no CDNs, no web fonts, no remote images. Everything inline.
- Works in a **sandboxed iframe** (`allow-scripts allow-same-origin allow-pointer-lock allow-forms`). Don't use `alert()`/`prompt()`/`confirm()` — use on-screen overlays. Don't navigate the top window.
- **No Flash, no plugins, no download prompts.** Pure HTML5/JS/Canvas/WebGL.
- **Responsive** — works in a phone-sized iframe (~360px) and desktop.
- **Touch + keyboard** controls so it works on Chromebooks and phones.
- If it uses **WebGL**, set `webgl: true` in the catalog entry so a "WebGL" badge shows on the card.

### Adding a redirect (external) game

For games that can't be self-hosted (e.g. they're proprietary or only playable on their origin):

```js
{ id: "retro-bowl", title: "Retro Bowl", ..., embedType: "redirect", src: "https://example.com/game" }
```

The play page shows a launch screen with a "Play now" button that opens `src` in a new tab.

---

## Where to find more open-source HTML5 games to add

Good sources for self-hostable games (check each license before committing):

- **itch.io** — many devs export HTML5 builds you can download; filter by "HTML5" + "Open Source" or check the license. Download the build, drop the files in `games/<id>/`.
- **GitHub** — search `html5 game` / `canvas game` / `js13k` topics. Look for MIT / Apache-2.0 / CC0 / ISC licenses. Clone, copy the build files into your `games/` folder.
- **js13kGames** — annual compo of <13KB games, nearly all open-source on GitHub. Great source of tiny self-contained games.
- **OpenGameArt.org** — assets (sprites, sounds) under CC licenses, useful for building your own.
- **Phaser examples** — the Phaser engine has many MIT-licensed example games; export and host the build.
- **Glitch.com** — remixable web games; check each project's license.

**Before adding any game, verify:**
1. It is **open source** or freely redistributable (read the license).
2. It runs as a **standalone HTML file** with no server.
3. It works in a **sandboxed iframe**.
4. **No Flash, no download prompts.**

---

## How it works

- **`js/games.js`** is the single source of truth — the `ARCADIA_GAMES` array drives the home page, browse page, and play page. Add a game there and it appears everywhere.
- **`js/app.js`** handles shared concerns: favorites + ratings in `localStorage`, card rendering, the navbar/footer (injected into `#nav-slot` / `#footer-slot`), reveal-on-scroll via `IntersectionObserver`, and toast notifications.
- **`js/player.js`** reads `?id=`, looks up the game, and renders either a sandboxed iframe (self-hosted) or a redirect launch screen, plus a star rating and related games.
- **Favorites** are stored in `localStorage` under `arcadia:favorites` (an array of game ids). The navbar favorites badge updates live.
- **Ratings** are stored under `arcadia:ratings` (an object `{ id: 1..5 }`).
- **Recently played** is tracked under `arcadia:recent` (used to power "continue playing" if you add it).

---

## Credits

Arcadia is built for gamers. All self-hosted games are original implementations or open-source homages written for this project. "Redirect" games link to their original creators. If you own a linked game and want it removed, open an issue.

Enjoy Arcadia? [Buy us a coffee](https://buymeacoffee.com/jeffreyscof) to keep it free.
