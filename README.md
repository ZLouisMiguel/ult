# Ultimate Tic-Tac-Toe

A bigger **nested Tic-Tac-Toe game** built with **vanilla HTML, CSS, and JavaScript**.

Based on the version from Ben Orlin's book, _Math Games with Bad Drawings_, this game turns a simple classic into a complex tactical battle where your moves dictate your opponent's options.

This project is part of a learning focused series, emphasizing:

- nested state management
- dynamic DOM generation
- restricted move validation
- clean, modern UI with visual overlays

---

## Gameplay Features

- **Nested Logic** – Win three small boards in a row to win the global game.
- **The "Send" Rule** – Where you play in a local board determines which board the opponent must play in next.
- **Dynamic Highlighting** – Visual cues for active boards and valid move zones.
- **Big-Win Overlays** – Clear visual capture of sub-grids with giant X/O indicators.
- **Open Move Flow** – Tactical "free moves" if sent to a finished board.

---

## Tech Stack

- **HTML** – structure
- **CSS** – nested grid layouts, transitions, and pseudo-element overlays
- **JavaScript (ES Modules)** – game engine, win-detection algorithms, and state syncing

No frameworks. No fluff. Just logic.

---

## Getting Started

1. Clone the repository

   ```bash
   git clone https://github.com/your-username/ultimate-tic-tac-toe.git
   ```

2. Open `index.html` in your browser.

---

## Project Structure (Simplified)

```
js/
├─ script.js   # Main game engine, board generation, and logic
css/
├─ style.css   # Game board styling and animations
index.html     # Game container and modals
```

---

## Purpose

This project is part of a series of small game builds focused on:

- strengthening problem-solving skills
- understanding game loops and rendering
- writing maintainable code

If you're interested in more game projects, check them out here:
👉 **[Game Jam Series](https://github.com/ZLouisMiguel/game-jam-series)**

---

## Notes

This is an **educational clone** inspired by Ben Orlin's work.

Feel free to fork, experiment, or build on top of it.
