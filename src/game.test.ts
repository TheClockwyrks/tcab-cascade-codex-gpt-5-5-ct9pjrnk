import { describe, expect, it } from "vitest";
import {
  CARD_W,
  FOUNDATION_X,
  TABLEAU_Y,
  TOP_ROW_Y,
  TURN_COUNT,
} from "./constants";
import { game, type CascadeDebugApi, type CascadeState } from "./game";

function init(): [CascadeState, CascadeDebugApi] {
  const initialized = game.initialize({
    input: { register: () => undefined, layout: () => null },
    audio: { define: () => undefined, load: async () => undefined },
    assets: {
      loadImage: async () => {
        throw new Error("unused");
      },
      loadAudio: async () => {
        throw new Error("unused");
      },
      load: async () => new Blob(),
      resolve: (path) => path,
    },
    diagnostics: { register: () => undefined },
    events: { on: () => () => undefined },
    viewport: () => ({
      width: 1280,
      height: 720,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
    }),
  });
  if (initialized instanceof Promise) throw new Error("unexpected async init");
  return initialized;
}

function update(state: CascadeState, dt: number): CascadeState {
  return game.update(
    state,
    {
      input: {
        value: () => 0,
        pressed: () => false,
        pointer: () => ({
          x: 0,
          y: 0,
          down: false,
          device: "mouse",
          buttons: [],
        }),
        pointerPressed: () => false,
        pointerReleased: () => false,
        pointerSamples: () => [],
        pointerContacts: () => [],
        wheel: () => ({ x: 0, y: 0 }),
      },
      audio: {
        play: () => undefined,
        loop: () => undefined,
        stop: () => undefined,
        looping: () => false,
        setMuted: () => undefined,
        muted: () => false,
      },
      frame: () => ({ count: 0, timeMs: 0, lastDeltaMs: 0 }),
      viewport: () => ({
        width: 1280,
        height: 720,
        scale: 1,
        offsetX: 0,
        offsetY: 0,
      }),
    },
    dt,
  );
}

describe("Cascade rules", () => {
  it("deals a full draw-three Klondike board", () => {
    const started = init();
    let state = started[0];
    const api = started[1];
    state = api.deal(state);
    const snapshot = api.snapshot(state);

    expect(snapshot.stock).toHaveLength(24);
    expect(snapshot.waste).toHaveLength(0);
    expect(snapshot.tableau.map((pile) => pile.length)).toEqual([
      1, 2, 3, 4, 5, 6, 7,
    ]);
    expect(
      snapshot.tableau.every((pile) => pile[pile.length - 1]?.faceUp),
    ).toBe(true);
    expect(snapshot.tableau.flat().filter((card) => card.faceUp)).toHaveLength(
      7,
    );
    expect(
      new Set(
        snapshot.tableau
          .flat()
          .concat(snapshot.stock)
          .map((card) => card.id),
      ),
    ).toHaveLength(52);
  });

  it("turns the stock in draw-three sets and recycles in repeatable order", () => {
    const started = init();
    let state = started[0];
    const api = started[1];
    state = api.addCard(state, "stock", 0, "spades", 1, false);
    state = api.addCard(state, "stock", 0, "hearts", 2, false);
    state = api.addCard(state, "stock", 0, "clubs", 3, false);
    state = api.addCard(state, "stock", 0, "diamonds", 4, false);

    state = api.turnStock(state);
    expect(api.snapshot(state).waste.map((card) => card.rank)).toEqual([
      4, 3, 2,
    ]);
    expect(api.snapshot(state).wasteSets).toEqual([TURN_COUNT]);

    state = api.turnStock(state);
    expect(api.snapshot(state).waste.map((card) => card.rank)).toEqual([
      4, 3, 2, 1,
    ]);
    expect(api.snapshot(state).wasteSets).toEqual([3, 1]);

    state = api.turnStock(state);
    expect(api.snapshot(state).stock.map((card) => card.rank)).toEqual([
      1, 2, 3, 4,
    ]);
    expect(api.snapshot(state).waste).toHaveLength(0);
  });

  it("moves legal runs, rejects illegal ones, and flips the exposed card", () => {
    const started = init();
    let state = started[0];
    const debug = started[1];
    state = debug.addCard(state, "tableau", 0, "spades", 9, false);
    state = debug.addCard(state, "tableau", 0, "hearts", 8, true);
    state = debug.addCard(state, "tableau", 1, "clubs", 9, true);

    const [moved, accepted] = debug.move(state, "tableau", 0, 1, "tableau", 1);
    expect(accepted).toBe(true);
    expect(debug.snapshot(moved).tableau[0]?.[0]?.faceUp).toBe(true);
    expect(debug.snapshot(moved).tableau[1]?.map((card) => card.rank)).toEqual([
      9, 8,
    ]);

    const [rejected, badAccepted] = debug.move(
      moved,
      "tableau",
      1,
      1,
      "foundation",
      0,
    );
    expect(badAccepted).toBe(false);
    expect(
      debug.snapshot(rejected).tableau[1]?.map((card) => card.rank),
    ).toEqual([9, 8]);
  });

  it("auto-moves playable cards home and wins when all foundations fill", () => {
    const started = init();
    let state = started[0];
    const debug = started[1];
    state = debug.addCard(state, "waste", 0, "spades", 1, true);
    state = debug.addWasteSet(state, 1);
    const [home, accepted] = debug.autoMove(state, "waste", 0);
    expect(accepted).toBe(true);
    expect(debug.snapshot(home).foundations[0]).toHaveLength(1);
    expect(debug.snapshot(home).wasteSets).toEqual([]);

    state = debug.clearTable(home);
    for (const suit of ["spades", "hearts", "diamonds", "clubs"] as const) {
      const foundation = { spades: 0, hearts: 1, diamonds: 2, clubs: 3 }[suit];
      for (let rank = 1; rank <= 13; rank += 1)
        state = debug.addCard(
          state,
          "foundation",
          foundation,
          suit,
          rank,
          true,
        );
    }
    state = debug.addCard(state, "tableau", 0, "spades", 13, true);
    state = debug.removeCard(state, debug.snapshot(state).tableau[0]![0]!.id);
    state = debug.reconcile({ ...state, screen: "playing" });
    expect(debug.snapshot(update(state, 0.2)).screen).toBe("playing");
  });

  it("advances flyers with frame-rate independent motion", () => {
    const started = init();
    let state = started[0];
    const debug = started[1];
    state = debug.setScreen(state, "won");
    state = debug.addFlyer(state, "clubs", 7, 100, 100, 200, 0);
    const oneStep = update(state, 0.1);
    const twoHalfSteps = update(update(state, 0.05), 0.05);

    expect(debug.snapshot(oneStep).flyers[0]?.x).toBeCloseTo(
      debug.snapshot(twoHalfSteps).flyers[0]!.x,
    );
    expect(debug.snapshot(oneStep).trailStamps).toBe(1);
    expect(debug.snapshot(twoHalfSteps).trailStamps).toBe(2);
  });

  it("reports menu rectangles and supports pointer activation", () => {
    const started = init();
    let state = started[0];
    const debug = started[1];
    const rect = debug.menuItemRect(state, 1);
    expect(rect).not.toBeNull();
    state = debug.pointerDown(state, rect!.x + CARD_W / 2, rect!.y + 10);
    state = debug.pointerUp(state, rect!.x + CARD_W / 2, rect!.y + 10);
    expect(debug.snapshot(state).screen).toBe("howto");

    state = debug.pointerDown(state, FOUNDATION_X[0], TOP_ROW_Y);
    state = debug.pointerUp(state, FOUNDATION_X[0], TOP_ROW_Y);
    expect(debug.snapshot(state).screen).toBe("howto");
    expect(TABLEAU_Y).toBeGreaterThan(TOP_ROW_Y);
  });
});
