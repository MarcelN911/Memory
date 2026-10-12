# Memory

A two-player memory card game for the browser, built with TypeScript, SCSS and Vite — no framework.

Two players take turns flipping cards on the same device. Whoever finds the most pairs wins.

## Features

- **Two themes** – "Code vibes" (dark, tech logos) and "Foods" (light, food motifs), each with its own cards, colours and fonts
- **Two players** – Blue and Orange; you choose who starts
- **Three board sizes** – 16, 24 or 36 cards
- **Live preview** – the settings page shows the theme while you hover over or select it
- **Score and turn display** during the game
- **Result screens** – animated "Game over", winner and draw screens
- **Responsive** – playable on desktop, tablet and phone, portrait and landscape
- **Remembers your choices** – leaving a running game brings you back to the settings with your selection still in place

## How to play

1. Click **Play** on the start page.
2. Choose a theme, the starting player and a board size, then click **Start**.
3. Flip two cards per turn.
   - A pair gives you a point and you go again.
   - No pair: the cards turn back and the other player is up.
4. The game ends when all pairs are found. The player with more points wins; equal points are a draw.

## Getting started

You need [Node.js](https://nodejs.org/) (a current LTS version; the project was developed with v24) and npm.

```bash
# 1. Clone the repository
git clone https://github.com/MarcelN911/Memory.git
cd Memory

# 2. Install the dependencies
npm install

# 3. Start the development server
npm run dev
```

Vite prints a local address (usually `http://localhost:5173`). Open it in your browser.

### Scripts

| Command           | What it does                                                    |
| ----------------- | --------------------------------------------------------------- |
| `npm run dev`     | Starts the development server with hot reload                   |
| `npm run build`   | Type-checks the code and builds the production files to `dist/` |
| `npm run preview` | Serves the built `dist/` folder locally to check the build      |

### Deployment

`npm run build` creates a static site in `dist/`. Upload the contents of that folder to any web server or static host. All paths are relative, so the game also works from a subfolder.

## Project structure

```
Memory/
├── index.html          Start page
├── settings.html       Theme, player and board size selection
├── playground.html     The game board and result screens
├── public/assets/      Card images and graphics for both themes
├── src/
│   ├── main.ts         Start page logic
│   ├── settings.ts     Settings form, preview and saving the selection
│   ├── playground.ts   Game logic: deck, turns, score, game over
│   └── styles/
│       └── style.scss  All styles
├── vite.config.ts      Vite setup with the three HTML pages as entry points
└── tsconfig.json       TypeScript configuration
```

## Tech stack

- [TypeScript](https://www.typescriptlang.org/) – game logic, strictly typed
- [SCSS](https://sass-lang.com/) – styling
- [Vite](https://vite.dev/) – development server and build tool
- [Google Fonts](https://fonts.google.com/) – Poppins, Krona One, Patrick Hand

The selected settings are stored in the browser's `localStorage`; there is no backend.

## About

This game was created as a learning project during my training at the Developer Akademie.
