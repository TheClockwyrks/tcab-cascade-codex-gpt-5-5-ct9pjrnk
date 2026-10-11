# Cascade

Cascade is a browser Klondike solitaire game built on the Simple 2D engine. It
plays Draw Three: the stock turns three cards at a time, the waste shows the
current fan, and only the front card is playable.

Build the four foundations from Ace to King. Tableau columns build downward by
alternating color, and only a King can fill an empty column. When the last card
lands home, the foundations break into a victory cascade of flying, bouncing
cards.

## Install

```sh
npm ci
```

## Run In Development

```sh
npm run dev
```

Vite prints the local URL. Open it in a browser to play.

## Production Build

```sh
npm run build
```

The complete static site is written to `dist/`. It can be served from any static
file host.

## Controls

- Drag face-up tableau cards or runs onto legal tableau columns or foundations.
- Drag the waste's front card or a foundation's top card when it can move.
- Click the stock to turn three cards; click it again when empty to recycle the
  waste.
- Double-click a playable waste card or exposed tableau card to send it to its
  foundation when legal.
- Use the HUD buttons for a new deal, returning to the title, and sound.
- Menus support pointer/touch and keyboard: Arrow Up/Down or W/S move selection,
  Enter/Space confirms, and Escape backs out of How To Play.

## Checks

```sh
npm run typecheck
npm run lint
npm run format
npm test
```
