# Indie Dev Studio Simulator

Indie Dev Studio Simulator is a browser-based 2D management game built with plain HTML, CSS, and vanilla JavaScript. In this game, you start as a solo indie developer working from a bedroom studio and grow your game studio by creating projects, managing energy and stress, marketing titles, buying upgrades, and releasing games to earn money, fans, and reputation.

## Features

- **Project gameplay loop**: start a project, work on it, fix bugs, polish, market, and release.
- **Stats management**: track `day`, `money`, `energy`, `stress`, `fans`, and `reputation`.
- **Project variety**: choose from genres like Platformer, Puzzle, Horror, Idle, and Survival.
- **Project sizes**: Tiny, Small, and Medium projects have different progress requirements and rewards.
- **Upgrades**: purchase upgrades such as Better Keyboard, Faster PC, Better Chair, Debugging Software, and more.
- **Random events**: daily events can help or challenge your progress.
- **Released game history**: keep a log of released games, scores, earnings, and bonuses.
- **XML save/load**: save your game as an XML file and load it later to continue playing.
- **Passive income**: earn money every minute based on your fans, released games, and reputation.

## How to play

1. Open `index.html` in a browser or run a local server.
2. Start a new project using the left panel.
3. Use the action buttons on the right to:
   - Work
   - Fix Bugs
   - Polish
   - Market
   - Rest
   - Release Game
4. Watch your stats in the top bar and manage energy/stress.
5. Buy upgrades to improve your efficiency.
6. Save your progress by downloading an XML file.
7. Load a saved XML file using the `Load` button.

## Running locally

### Option 1: Open directly

Open `index.html` in a web browser.

### Option 2: Use a local web server

From the project directory run:

```bash
python3 -m http.server 4567
```

Then open:

```text
http://localhost:4567
```

## Project structure

- `index.html` — main game layout and structure
- `style.css` — game styling and responsive UI
- `js/main.js` — application entry point and event wiring
- `js/state.js` — global game state and constants
- `js/projects.js` — project actions and release logic
- `js/upgrades.js` — upgrade definitions and purchase logic
- `js/events.js` — random events system
- `js/save.js` — localStorage and XML save/load support
- `js/ui.js` — UI rendering and modal handling

## Notes

- The game is intentionally built without frameworks.
- XML save files can be shared and reloaded to continue progress.
- Passive income is generated automatically every minute.

Enjoy growing your indie studio and releasing hit games!