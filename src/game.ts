import type {
  Game,
  InitApi,
  PointerSample,
  RenderApi,
  UpdateApi,
} from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import {
  BOUNCE_DAMP,
  CARD_H,
  CARD_W,
  CASCADE_DEBUG_VERSION,
  COLUMN_BOTTOM_LIMIT,
  COLUMN_X,
  CUES,
  DEAL_MODE,
  DEAL_MODE_LABEL,
  DECK_SIZE,
  DOUBLE_CLICK_SLOP,
  DOUBLE_CLICK_WINDOW,
  DRAG_THRESHOLD,
  FACE_DOWN_OFFSET,
  FACE_UP_OFFSET,
  FACE_UP_OFFSET_MIN,
  FLOOR_Y,
  FOUNDATION_COUNT,
  FOUNDATION_X,
  GRAVITY,
  HOWTO_BACK_LABEL,
  HUD_H,
  HUD_ITEMS,
  HUD_Y,
  LAUNCH_INTERVAL,
  LAUNCH_VX_MAX,
  LAUNCH_VX_MIN,
  LAUNCH_VY,
  MENU_BACK,
  MENU_BINDINGS,
  MENU_CONFIRM,
  MENU_DOWN,
  MENU_UP,
  RANK_MAX,
  RANK_MIN,
  STAGE_H,
  STAGE_W,
  STOCK_X,
  SUITS,
  TABLEAU_COLUMNS,
  TABLEAU_Y,
  TAGLINE_TEXT,
  TITLE_ITEMS,
  TITLE_TEXT,
  TOP_ROW_Y,
  TURN_COUNT,
  WASTE_FAN,
  WASTE_X,
  WIN_TEXT,
  type CueName,
} from "./constants";

export type Screen = "title" | "howto" | "playing" | "won";
export type Suit = "spades" | "hearts" | "diamonds" | "clubs";
export type PileKind = "stock" | "waste" | "foundation" | "tableau";

export interface CardState {
  readonly id: number;
  readonly suit: Suit;
  readonly rank: number;
  readonly faceUp: boolean;
}

export interface DragState {
  readonly cards: readonly CardState[];
  readonly fromPile: "waste" | "foundation" | "tableau";
  readonly fromIndex: number;
  readonly x: number;
  readonly y: number;
}

export interface DropTargetState {
  readonly pile: "foundation" | "tableau";
  readonly index: number;
}

export interface PointerState {
  readonly x: number;
  readonly y: number;
  readonly down: boolean;
}

export interface PressState {
  readonly x: number;
  readonly y: number;
  readonly at: number;
}

export interface FlyerState {
  readonly id: number;
  readonly suit: Suit;
  readonly rank: number;
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
}

export interface CascadeState {
  readonly screen: Screen;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly stock: readonly CardState[];
  readonly waste: readonly CardState[];
  readonly wasteSets: readonly number[];
  readonly foundations: readonly (readonly CardState[])[];
  readonly tableau: readonly (readonly CardState[])[];
  readonly drag: DragState | null;
  readonly dropTarget: DropTargetState | null;
  readonly pointer: PointerState;
  readonly lastPress: PressState | null;
  readonly autoFlip: boolean;
  readonly winDetect: boolean;
  readonly launching: boolean;
  readonly trailPainting: boolean;
  readonly launchClock: number;
  readonly launched: number;
  readonly flyers: readonly FlyerState[];
  readonly cascadeDone: boolean;
  readonly trailStamps: number;
  readonly nextId: number;
  readonly simTime: number;
  readonly muted: boolean;
}

type Rect = {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
};
type CardSnapshot = CardState & { readonly color: "red" | "black" };
type PileName = "stock" | "waste" | "foundation" | "tableau";
type MovablePile = "waste" | "foundation" | "tableau";
type ToPile = "foundation" | "tableau";
type CueSet = Set<CueName>;

export interface CascadeSnapshot {
  readonly version: number;
  readonly screen: Screen;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly dealMode: string;
  readonly turnCount: number;
  readonly dealModeLabel: string;
  readonly muted: boolean;
  readonly autoFlip: boolean;
  readonly winDetect: boolean;
  readonly launching: boolean;
  readonly trailPainting: boolean;
  readonly stock: readonly CardSnapshot[];
  readonly waste: readonly CardSnapshot[];
  readonly wasteSets: readonly number[];
  readonly wasteVisibleCount: number;
  readonly foundations: readonly (readonly CardSnapshot[])[];
  readonly tableau: readonly (readonly CardSnapshot[])[];
  readonly drag: null | {
    readonly cards: readonly CardSnapshot[];
    readonly fromPile: MovablePile;
    readonly fromIndex: number;
    readonly x: number;
    readonly y: number;
  };
  readonly dropTarget: DropTargetState | null;
  readonly pointer: PointerState;
  readonly lastPress: PressState | null;
  readonly launchClock: number;
  readonly launched: number;
  readonly flyers: readonly FlyerState[];
  readonly cascadeDone: boolean;
  readonly trailStamps: number;
  readonly simTime: number;
}

export interface CascadeDebugApi {
  readonly version: number;
  reset(state: DeepReadonly<CascadeState>): CascadeState;
  snapshot(state: DeepReadonly<CascadeState>): CascadeSnapshot;
  reconcile(state: DeepReadonly<CascadeState>): CascadeState;
  menuItemRect(state: DeepReadonly<CascadeState>, index: number): Rect | null;
  setScreen(state: DeepReadonly<CascadeState>, screen: Screen): CascadeState;
  setMenuIndex(state: DeepReadonly<CascadeState>, index: number): CascadeState;
  setTitleIndex(state: DeepReadonly<CascadeState>, index: number): CascadeState;
  addCard(
    state: DeepReadonly<CascadeState>,
    pile: PileName,
    index: number,
    suit: Suit,
    rank: number,
    faceUp: boolean,
  ): CascadeState;
  removeCard(state: DeepReadonly<CascadeState>, id: number): CascadeState;
  setCardFaceUp(
    state: DeepReadonly<CascadeState>,
    id: number,
    faceUp: boolean,
  ): CascadeState;
  clearPile(
    state: DeepReadonly<CascadeState>,
    pile: PileName,
    index: number,
  ): CascadeState;
  clearTable(state: DeepReadonly<CascadeState>): CascadeState;
  addWasteSet(state: DeepReadonly<CascadeState>, count: number): CascadeState;
  clearWasteSets(state: DeepReadonly<CascadeState>): CascadeState;
  deal(state: DeepReadonly<CascadeState>): CascadeState;
  turnStock(state: DeepReadonly<CascadeState>): CascadeState;
  move(
    state: DeepReadonly<CascadeState>,
    fromPile: MovablePile,
    fromIndex: number,
    fromRow: number,
    toPile: ToPile,
    toIndex: number,
  ): readonly [CascadeState, boolean];
  autoMove(
    state: DeepReadonly<CascadeState>,
    pile: PileName,
    index: number,
  ): readonly [CascadeState, boolean];
  pointerDown(
    state: DeepReadonly<CascadeState>,
    x: number,
    y: number,
  ): CascadeState;
  pointerMove(
    state: DeepReadonly<CascadeState>,
    x: number,
    y: number,
  ): CascadeState;
  pointerUp(
    state: DeepReadonly<CascadeState>,
    x: number,
    y: number,
  ): CascadeState;
  setAutoFlip(
    state: DeepReadonly<CascadeState>,
    enabled: boolean,
  ): CascadeState;
  setWinDetect(
    state: DeepReadonly<CascadeState>,
    enabled: boolean,
  ): CascadeState;
  setLaunching(
    state: DeepReadonly<CascadeState>,
    enabled: boolean,
  ): CascadeState;
  setTrailPainting(
    state: DeepReadonly<CascadeState>,
    enabled: boolean,
  ): CascadeState;
  addFlyer(
    state: DeepReadonly<CascadeState>,
    suit: Suit,
    rank: number,
    x: number,
    y: number,
    vx: number,
    vy: number,
  ): CascadeState;
  setFlyerPosition(
    state: DeepReadonly<CascadeState>,
    id: number,
    x: number,
    y: number,
  ): CascadeState;
  setFlyerVelocity(
    state: DeepReadonly<CascadeState>,
    id: number,
    vx: number,
    vy: number,
  ): CascadeState;
  removeFlyer(state: DeepReadonly<CascadeState>, id: number): CascadeState;
  clearFlyers(state: DeepReadonly<CascadeState>): CascadeState;
  setLaunchClock(
    state: DeepReadonly<CascadeState>,
    seconds: number,
  ): CascadeState;
  clearTrail(state: DeepReadonly<CascadeState>): CascadeState;
  drawLaunchVx(): number;
}

export const BACKGROUND = "#17523f";

const CARD_RADIUS = 10;
const RED = "#b82238";
const BLACK = "#202433";
const TABLE_DARK = "#10382f";
const TABLE_LINE = "rgba(255,255,255,0.16)";
const SLOT = "rgba(255,255,255,0.2)";
const HIGHLIGHT = "#f4d35e";
const TEXT = "#f7f1dc";
const TEXT_DIM = "rgba(247,241,220,0.72)";
const FACE = "#fffaf0";
const SHADOW = "rgba(0,0,0,0.24)";

let paintedLayer: HTMLCanvasElement | OffscreenCanvas | null = null;

function emptyState(muted = false): CascadeState {
  return {
    screen: "title",
    menuIndex: 0,
    titleIndex: 0,
    stock: [],
    waste: [],
    wasteSets: [],
    foundations: Array.from({ length: FOUNDATION_COUNT }, () => []),
    tableau: Array.from({ length: TABLEAU_COLUMNS }, () => []),
    drag: null,
    dropTarget: null,
    pointer: { x: 0, y: 0, down: false },
    lastPress: null,
    autoFlip: true,
    winDetect: true,
    launching: true,
    trailPainting: true,
    launchClock: 0,
    launched: 0,
    flyers: [],
    cascadeDone: false,
    trailStamps: 0,
    nextId: 1,
    simTime: 0,
    muted,
  };
}

function cloneCards(cards: readonly DeepReadonly<CardState>[]): CardState[] {
  return cards.map((card) => ({ ...card }));
}

function cloneState(state: DeepReadonly<CascadeState>): CascadeState {
  return {
    ...state,
    stock: cloneCards(state.stock),
    waste: cloneCards(state.waste),
    wasteSets: [...state.wasteSets],
    foundations: state.foundations.map(cloneCards),
    tableau: state.tableau.map(cloneCards),
    drag: state.drag
      ? { ...state.drag, cards: cloneCards(state.drag.cards) }
      : null,
    dropTarget: state.dropTarget ? { ...state.dropTarget } : null,
    pointer: { ...state.pointer },
    lastPress: state.lastPress ? { ...state.lastPress } : null,
    flyers: state.flyers.map((flyer) => ({ ...flyer })),
  };
}

function colorOf(suit: Suit): "red" | "black" {
  return suit === "hearts" || suit === "diamonds" ? "red" : "black";
}

function assertWhole(value: number, name: string): void {
  if (!Number.isInteger(value))
    throw new Error(`Cascade debug: ${name} must be a whole number`);
}

function assertFinite(value: number, name: string): void {
  if (!Number.isFinite(value))
    throw new Error(`Cascade debug: ${name} must be finite`);
}

function assertSuit(suit: Suit): void {
  if (!(SUITS as readonly string[]).includes(suit))
    throw new Error(`Cascade debug: invalid suit ${String(suit)}`);
}

function assertRank(rank: number): void {
  assertWhole(rank, "rank");
  if (rank < RANK_MIN || rank > RANK_MAX)
    throw new Error(`Cascade debug: invalid rank ${rank}`);
}

function rectContains(rect: Rect, x: number, y: number): boolean {
  return (
    x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h
  );
}

function stockRect(): Rect {
  return { x: STOCK_X, y: TOP_ROW_Y, w: CARD_W, h: CARD_H };
}

function wasteRect(): Rect {
  return { x: WASTE_X, y: TOP_ROW_Y, w: CARD_W, h: CARD_H };
}

function foundationRect(index: number): Rect {
  return { x: FOUNDATION_X[index] ?? 0, y: TOP_ROW_Y, w: CARD_W, h: CARD_H };
}

function faceUpOffset(column: readonly DeepReadonly<CardState>[]): number {
  if (column.length <= 1) return FACE_UP_OFFSET;
  const faceUpGaps = column.slice(0, -1).filter((card) => card.faceUp).length;
  if (faceUpGaps === 0) return FACE_UP_OFFSET;
  const fixed =
    column.slice(0, -1).filter((card) => !card.faceUp).length *
    FACE_DOWN_OFFSET;
  const available = COLUMN_BOTTOM_LIMIT - TABLEAU_Y - CARD_H - fixed;
  return Math.max(
    FACE_UP_OFFSET_MIN,
    Math.min(FACE_UP_OFFSET, available / faceUpGaps),
  );
}

function tableauOffset(
  column: readonly DeepReadonly<CardState>[],
  row: number,
): number {
  return column[row]?.faceUp ? faceUpOffset(column) : FACE_DOWN_OFFSET;
}

function cardY(
  column: readonly DeepReadonly<CardState>[],
  row: number,
): number {
  let y = TABLEAU_Y;
  for (let i = 0; i < row; i += 1) y += tableauOffset(column, i);
  return y;
}

function tableauRect(state: DeepReadonly<CascadeState>, index: number): Rect {
  const column = state.tableau[index] ?? [];
  const bottom =
    column.length === 0
      ? TABLEAU_Y + CARD_H
      : cardY(column, column.length - 1) + CARD_H;
  return {
    x: COLUMN_X[index] ?? 0,
    y: TABLEAU_Y,
    w: CARD_W,
    h: bottom - TABLEAU_Y,
  };
}

function pileDropAt(
  state: DeepReadonly<CascadeState>,
  x: number,
  y: number,
): { pile: PileName; index: number } | null {
  if (rectContains(stockRect(), x, y)) return { pile: "stock", index: 0 };
  if (rectContains(wasteRect(), x, y)) return { pile: "waste", index: 0 };
  for (let i = 0; i < FOUNDATION_COUNT; i += 1) {
    if (rectContains(foundationRect(i), x, y))
      return { pile: "foundation", index: i };
  }
  for (let i = 0; i < TABLEAU_COLUMNS; i += 1) {
    if (rectContains(tableauRect(state, i), x, y))
      return { pile: "tableau", index: i };
  }
  return null;
}

function menuCount(screen: Screen): number {
  if (screen === "title") return TITLE_ITEMS.length;
  if (screen === "howto") return 1;
  if (screen === "playing") return HUD_ITEMS.length;
  return 0;
}

function menuItemRectFor(screen: Screen, index: number): Rect | null {
  const count = menuCount(screen);
  if (index < 0 || index >= count || screen === "won") return null;
  if (screen === "title") return { x: 510, y: 410 + index * 64, w: 260, h: 46 };
  if (screen === "howto") return { x: 510, y: 600, w: 260, h: 46 };
  return { x: 224 + index * 156, y: HUD_Y + 4, w: 142, h: HUD_H - 8 };
}

function menuItemAt(screen: Screen, x: number, y: number): number | null {
  for (let i = 0; i < menuCount(screen); i += 1) {
    const rect = menuItemRectFor(screen, i);
    if (rect && rectContains(rect, x, y)) return i;
  }
  return null;
}

function shuffleDeck(): CardState[] {
  const deck: CardState[] = [];
  let id = 1;
  for (const suit of SUITS) {
    for (let rank = RANK_MIN; rank <= RANK_MAX; rank += 1) {
      deck.push({ id, suit, rank, faceUp: false });
      id += 1;
    }
  }
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j]!, deck[i]!];
  }
  return deck;
}

function dealState(state: DeepReadonly<CascadeState>): CascadeState {
  clearPaintedLayer();
  const deck = shuffleDeck();
  let cursor = 0;
  const tableau: CardState[][] = [];
  for (let col = 0; col < TABLEAU_COLUMNS; col += 1) {
    const column: CardState[] = [];
    for (let row = 0; row <= col; row += 1) {
      const card = deck[cursor++]!;
      column.push({ ...card, faceUp: row === col });
    }
    tableau.push(column);
  }
  return {
    ...cloneState(state),
    stock: deck.slice(cursor).map((card) => ({ ...card, faceUp: false })),
    waste: [],
    wasteSets: [],
    foundations: Array.from({ length: FOUNDATION_COUNT }, () => []),
    tableau,
    drag: null,
    dropTarget: null,
    launchClock: 0,
    launched: 0,
    flyers: [],
    cascadeDone: false,
    trailStamps: 0,
    nextId: DECK_SIZE + 1,
  };
}

function isRun(cards: readonly DeepReadonly<CardState>[]): boolean {
  if (cards.length === 0) return false;
  for (let i = 1; i < cards.length; i += 1) {
    const above = cards[i - 1]!;
    const below = cards[i]!;
    if (
      below.rank !== above.rank - 1 ||
      colorOf(below.suit) === colorOf(above.suit)
    )
      return false;
  }
  return true;
}

function foundationAccepts(
  pile: readonly DeepReadonly<CardState>[],
  cards: readonly DeepReadonly<CardState>[],
): boolean {
  if (cards.length !== 1) return false;
  const card = cards[0]!;
  const top = pile[pile.length - 1];
  if (!top) return card.rank === RANK_MIN;
  return top.suit === card.suit && card.rank === top.rank + 1;
}

function tableauAccepts(
  column: readonly DeepReadonly<CardState>[],
  cards: readonly DeepReadonly<CardState>[],
): boolean {
  if (!isRun(cards)) return false;
  const lead = cards[0]!;
  const top = column[column.length - 1];
  if (!top) return lead.rank === RANK_MAX;
  return (
    top.faceUp &&
    lead.rank === top.rank - 1 &&
    colorOf(lead.suit) !== colorOf(top.suit)
  );
}

function targetAccepts(
  state: DeepReadonly<CascadeState>,
  target: DropTargetState,
  cards: readonly DeepReadonly<CardState>[],
): boolean {
  return target.pile === "foundation"
    ? foundationAccepts(state.foundations[target.index] ?? [], cards)
    : tableauAccepts(state.tableau[target.index] ?? [], cards);
}

function currentDropTarget(
  state: DeepReadonly<CascadeState>,
  drag = state.drag,
): DropTargetState | null {
  if (!drag) return null;
  const pile = pileDropAt(state, drag.x + CARD_W / 2, drag.y + CARD_H / 2);
  if (!pile || (pile.pile !== "foundation" && pile.pile !== "tableau"))
    return null;
  const target: DropTargetState = { pile: pile.pile, index: pile.index };
  return targetAccepts(state, target, drag.cards) ? target : null;
}

function updateDropTarget(state: DeepReadonly<CascadeState>): CascadeState {
  const next = cloneState(state);
  return { ...next, dropTarget: currentDropTarget(next) };
}

function maybeFlipSource(
  state: CascadeState,
  fromPile: MovablePile,
  fromIndex: number,
): { state: CascadeState; flipped: boolean } {
  if (!state.autoFlip || fromPile !== "tableau")
    return { state, flipped: false };
  const column = state.tableau[fromIndex] ?? [];
  const top = column[column.length - 1];
  if (!top || top.faceUp) return { state, flipped: false };
  const tableau = state.tableau.map((pile, index) =>
    index === fromIndex
      ? [...pile.slice(0, -1), { ...top, faceUp: true }]
      : pile,
  );
  return { state: { ...state, tableau }, flipped: true };
}

function removeFromWasteSet(wasteSets: readonly number[]): number[] {
  const next = [...wasteSets];
  for (let i = next.length - 1; i >= 0; i -= 1) {
    if (next[i]! > 0) {
      next[i] = next[i]! - 1;
      break;
    }
  }
  return next.filter((count) => count > 0);
}

function completeWin(state: CascadeState): CascadeState {
  if (!state.winDetect) return state;
  const homeCount = state.foundations.reduce(
    (sum, pile) => sum + pile.length,
    0,
  );
  if (homeCount !== DECK_SIZE) return state;
  return {
    ...state,
    screen: "won",
    launchClock: LAUNCH_INTERVAL,
    cascadeDone: false,
  };
}

function getMovablePile(
  state: CascadeState,
  pile: MovablePile,
  index: number,
): CardState[] | null {
  if (pile === "waste") return index === 0 ? [...state.waste] : null;
  if (pile === "foundation")
    return state.foundations[index] ? [...state.foundations[index]!] : null;
  return state.tableau[index] ? [...state.tableau[index]!] : null;
}

function setMovablePile(
  state: CascadeState,
  pile: MovablePile,
  index: number,
  cards: readonly CardState[],
): CascadeState {
  if (pile === "waste") return { ...state, waste: [...cards] };
  if (pile === "foundation") {
    return {
      ...state,
      foundations: state.foundations.map((p, i) =>
        i === index ? [...cards] : p,
      ),
    };
  }
  return {
    ...state,
    tableau: state.tableau.map((p, i) => (i === index ? [...cards] : p)),
  };
}

function setTargetPile(
  state: CascadeState,
  pile: ToPile,
  index: number,
  cards: readonly CardState[],
): CascadeState {
  if (pile === "foundation") {
    return {
      ...state,
      foundations: state.foundations.map((p, i) =>
        i === index ? [...cards] : p,
      ),
    };
  }
  return {
    ...state,
    tableau: state.tableau.map((p, i) => (i === index ? [...cards] : p)),
  };
}

function attemptMove(
  state: DeepReadonly<CascadeState>,
  fromPile: MovablePile,
  fromIndex: number,
  fromRow: number,
  toPile: ToPile,
  toIndex: number,
  cues?: CueSet,
): readonly [CascadeState, boolean] {
  assertWhole(fromIndex, "fromIndex");
  assertWhole(fromRow, "fromRow");
  assertWhole(toIndex, "toIndex");
  const base = cloneState(state);
  const source = getMovablePile(base, fromPile, fromIndex);
  if (!source || fromRow < 0 || fromRow >= source.length) return [base, false];
  const cards = source.slice(fromRow);
  if (fromPile === "tableau" && !cards[0]?.faceUp) return [base, false];
  if (fromPile !== "tableau" && fromRow !== source.length - 1)
    return [base, false];
  const target: DropTargetState = { pile: toPile, index: toIndex };
  if (!targetAccepts(base, target, cards)) return [base, false];
  const afterRemove = setMovablePile(
    base,
    fromPile,
    fromIndex,
    source.slice(0, fromRow),
  );
  const targetPile =
    toPile === "foundation"
      ? afterRemove.foundations[toIndex]
      : afterRemove.tableau[toIndex];
  if (!targetPile) return [base, false];
  let moved = setTargetPile(afterRemove, toPile, toIndex, [
    ...targetPile,
    ...cards,
  ]);
  if (fromPile === "waste")
    moved = { ...moved, wasteSets: removeFromWasteSet(moved.wasteSets) };
  const flipped = maybeFlipSource(moved, fromPile, fromIndex);
  moved = completeWin(flipped.state);
  if (flipped.flipped) cues?.add(CUES.flip);
  cues?.add(CUES.drop);
  if (toPile === "foundation") cues?.add(CUES.home);
  if (moved.screen === "won" && base.screen !== "won") cues?.add(CUES.win);
  return [moved, true];
}

function returnDrag(state: DeepReadonly<CascadeState>): CascadeState {
  const base = cloneState(state);
  if (!base.drag) return base;
  const drag = base.drag;
  let next = base;
  const pile = getMovablePile(next, drag.fromPile, drag.fromIndex);
  if (pile)
    next = setMovablePile(next, drag.fromPile, drag.fromIndex, [
      ...pile,
      ...drag.cards,
    ]);
  return { ...next, drag: null, dropTarget: null };
}

function turnStock(
  state: DeepReadonly<CascadeState>,
  cues?: CueSet,
): CascadeState {
  const base = cloneState(state);
  if (base.stock.length > 0) {
    const count = Math.min(TURN_COUNT, base.stock.length);
    const stock = [...base.stock];
    const turned: CardState[] = [];
    for (let i = 0; i < count; i += 1) {
      const card = stock.pop()!;
      turned.push({ ...card, faceUp: true });
    }
    cues?.add(CUES.turn);
    return {
      ...base,
      stock,
      waste: [...base.waste, ...turned],
      wasteSets: [...base.wasteSets, count],
    };
  }
  if (base.waste.length > 0) {
    cues?.add(CUES.recycle);
    return {
      ...base,
      stock: [...base.waste]
        .reverse()
        .map((card) => ({ ...card, faceUp: false })),
      waste: [],
      wasteSets: [],
    };
  }
  return base;
}

function playableHomeMove(
  state: DeepReadonly<CascadeState>,
  pile: PileName,
  index: number,
  cues?: CueSet,
): readonly [CascadeState, boolean] {
  const source =
    pile === "waste"
      ? state.waste
      : pile === "tableau"
        ? state.tableau[index]
        : null;
  if (!source || source.length === 0) return [cloneState(state), false];
  if (pile === "waste" && state.wasteSets.length === 0)
    return [cloneState(state), false];
  const fromRow = source.length - 1;
  const card = source[fromRow];
  if (!card || !card.faceUp) return [cloneState(state), false];
  for (let i = 0; i < FOUNDATION_COUNT; i += 1) {
    if (foundationAccepts(state.foundations[i] ?? [], [card]))
      return attemptMove(
        state,
        pile as MovablePile,
        index,
        fromRow,
        "foundation",
        i,
        cues,
      );
  }
  return [cloneState(state), false];
}

function hitTopCard(
  state: DeepReadonly<CascadeState>,
  x: number,
  y: number,
): null | {
  pile: MovablePile;
  index: number;
  row: number;
  card: DeepReadonly<CardState>;
  cardX: number;
  cardY: number;
} {
  for (let col = TABLEAU_COLUMNS - 1; col >= 0; col -= 1) {
    const column = state.tableau[col] ?? [];
    for (let row = column.length - 1; row >= 0; row -= 1) {
      const cx = COLUMN_X[col]!;
      const cy = cardY(column, row);
      if (rectContains({ x: cx, y: cy, w: CARD_W, h: CARD_H }, x, y)) {
        return {
          pile: "tableau",
          index: col,
          row,
          card: column[row]!,
          cardX: cx,
          cardY: cy,
        };
      }
    }
  }
  if (state.wasteSets.length > 0 && state.waste.length > 0) {
    const visible = Math.min(
      state.wasteSets[state.wasteSets.length - 1] ?? 0,
      TURN_COUNT,
    );
    const start = state.waste.length - visible;
    for (let i = visible - 1; i >= 0; i -= 1) {
      const row = start + i;
      const cx = WASTE_X + i * WASTE_FAN;
      if (rectContains({ x: cx, y: TOP_ROW_Y, w: CARD_W, h: CARD_H }, x, y)) {
        return {
          pile: "waste",
          index: 0,
          row,
          card: state.waste[row]!,
          cardX: cx,
          cardY: TOP_ROW_Y,
        };
      }
    }
  }
  for (let i = FOUNDATION_COUNT - 1; i >= 0; i -= 1) {
    const pile = state.foundations[i] ?? [];
    const top = pile[pile.length - 1];
    if (top && rectContains(foundationRect(i), x, y)) {
      return {
        pile: "foundation",
        index: i,
        row: pile.length - 1,
        card: top,
        cardX: FOUNDATION_X[i]!,
        cardY: TOP_ROW_Y,
      };
    }
  }
  return null;
}

function pointerDown(
  state: DeepReadonly<CascadeState>,
  x: number,
  y: number,
  cues?: CueSet,
): CascadeState {
  let next = returnDrag(state);
  next = { ...next, pointer: { x, y, down: true } };
  if (next.screen === "won") {
    return {
      ...dealState(next),
      screen: "playing",
      menuIndex: 0,
      lastPress: { x, y, at: next.simTime },
    };
  }
  const menuHit = menuItemAt(next.screen, x, y);
  if (menuHit !== null) next = { ...next, menuIndex: menuHit };
  if (next.screen !== "playing")
    return { ...next, lastPress: { x, y, at: next.simTime } };

  const hit = hitTopCard(next, x, y);
  const isDouble =
    !!hit &&
    !!next.lastPress &&
    next.simTime - next.lastPress.at <= DOUBLE_CLICK_WINDOW &&
    Math.hypot(x - next.lastPress.x, y - next.lastPress.y) <=
      DOUBLE_CLICK_SLOP &&
    ((hit.pile === "waste" &&
      hit.row === next.waste.length - 1 &&
      next.wasteSets.length > 0) ||
      (hit.pile === "tableau" &&
        hit.row === (next.tableau[hit.index]?.length ?? 0) - 1 &&
        hit.card.faceUp));

  if (isDouble && hit) {
    const [moved] = playableHomeMove(next, hit.pile, hit.index, cues);
    return {
      ...moved,
      pointer: { x, y, down: true },
      lastPress: { x, y, at: next.simTime },
    };
  }

  if (hit && hit.card.faceUp) {
    const source = getMovablePile(next, hit.pile, hit.index);
    if (source && (hit.pile === "tableau" || hit.row === source.length - 1)) {
      const cards = source.slice(hit.row);
      next = setMovablePile(
        next,
        hit.pile,
        hit.index,
        source.slice(0, hit.row),
      );
      const drag: DragState = {
        cards,
        fromPile: hit.pile,
        fromIndex: hit.index,
        x: hit.cardX,
        y: hit.cardY,
      };
      next = { ...next, drag, dropTarget: currentDropTarget(next, drag) };
      cues?.add(CUES.lift);
    }
  }
  return { ...next, lastPress: { x, y, at: next.simTime } };
}

function pointerMove(
  state: DeepReadonly<CascadeState>,
  x: number,
  y: number,
): CascadeState {
  const previousPointer = state.pointer;
  let moved = {
    ...cloneState(state),
    pointer: { x, y, down: state.pointer.down },
  };
  const menuHit = menuItemAt(moved.screen, x, y);
  if (menuHit !== null) moved = { ...moved, menuIndex: menuHit };
  if (moved.drag && moved.lastPress) {
    const drag = {
      ...moved.drag,
      x: moved.drag.x + (x - previousPointer.x),
      y: moved.drag.y + (y - previousPointer.y),
    };
    moved = {
      ...moved,
      drag,
      dropTarget: currentDropTarget({ ...moved, drag }, drag),
    };
  }
  return moved;
}

function sourceRowForReturned(state: CascadeState, drag: DragState): number {
  const pile = getMovablePile(state, drag.fromPile, drag.fromIndex);
  return pile ? pile.length : 0;
}

function pointerUp(
  state: DeepReadonly<CascadeState>,
  x: number,
  y: number,
  cues?: CueSet,
): CascadeState {
  let next = { ...cloneState(state), pointer: { x, y, down: false } };
  const press = state.lastPress;
  const pressMenu = press ? menuItemAt(next.screen, press.x, press.y) : null;
  const releaseMenu = menuItemAt(next.screen, x, y);
  const isClick =
    !press || Math.hypot(x - press.x, y - press.y) <= DRAG_THRESHOLD;

  if (next.drag && !isClick) {
    const targetPile = pileDropAt(
      next,
      next.drag.x + CARD_W / 2,
      next.drag.y + CARD_H / 2,
    );
    if (
      targetPile &&
      (targetPile.pile === "foundation" || targetPile.pile === "tableau")
    ) {
      const sourceRow = sourceRowForReturned(next, next.drag);
      const restored = returnDrag(next);
      const [moved, accepted] = attemptMove(
        restored,
        next.drag.fromPile,
        next.drag.fromIndex,
        sourceRow,
        targetPile.pile,
        targetPile.index,
        cues,
      );
      next = accepted ? moved : returnDrag(next);
      if (!accepted) cues?.add(CUES.reject);
    } else {
      next = returnDrag(next);
      cues?.add(CUES.reject);
    }
  } else {
    next = returnDrag(next);
    if (isClick && press && rectContains(stockRect(), press.x, press.y))
      next = turnStock(next, cues);
  }
  if (pressMenu !== null && pressMenu === releaseMenu) {
    next = { ...next, menuIndex: pressMenu };
    next = activateMenu(next, cues);
  }
  return { ...next, pointer: { x, y, down: false } };
}

function activateMenu(
  state: DeepReadonly<CascadeState>,
  cues?: CueSet,
): CascadeState {
  let next = cloneState(state);
  if (next.screen === "title") {
    if (next.menuIndex === 0) {
      next = {
        ...dealState(next),
        screen: "playing",
        menuIndex: 0,
        titleIndex: 0,
      };
      cues?.add(CUES.deal);
    } else {
      next = { ...next, screen: "howto", menuIndex: 0, titleIndex: 1 };
    }
  } else if (next.screen === "howto") {
    next = { ...next, screen: "title", menuIndex: next.titleIndex };
  } else if (next.screen === "playing") {
    if (next.menuIndex === 0) {
      next = { ...dealState(next), screen: "playing", menuIndex: 0 };
      cues?.add(CUES.deal);
    } else if (next.menuIndex === 1) {
      next = { ...next, screen: "title", menuIndex: next.titleIndex };
    } else {
      next = { ...next, muted: !next.muted };
    }
  }
  return next;
}

function processKeyboard(
  state: CascadeState,
  api: UpdateApi,
  cues: CueSet,
): CascadeState {
  if (state.screen === "won") return state;
  const up = api.input.pressed(MENU_UP);
  const down = api.input.pressed(MENU_DOWN);
  const confirm = api.input.pressed(MENU_CONFIRM);
  const back = api.input.pressed(MENU_BACK);
  const count = menuCount(state.screen);
  if (count > 0 && up)
    return { ...state, menuIndex: (state.menuIndex + count - 1) % count };
  if (count > 0 && down)
    return { ...state, menuIndex: (state.menuIndex + 1) % count };
  if (confirm) return activateMenu(state, cues);
  if (back && state.screen === "howto") return activateMenu(state, cues);
  return state;
}

function processPointerSample(
  state: CascadeState,
  sample: PointerSample,
  cues: CueSet,
): CascadeState {
  if (!sample.primary) return state;
  if (sample.type === "down")
    return pointerDown(state, sample.x, sample.y, cues);
  if (sample.type === "up") return pointerUp(state, sample.x, sample.y, cues);
  return pointerMove(state, sample.x, sample.y);
}

function drawLaunchVx(): number {
  const magnitude =
    LAUNCH_VX_MIN + Math.random() * (LAUNCH_VX_MAX - LAUNCH_VX_MIN);
  return Math.random() < 0.5 ? -magnitude : magnitude;
}

function launchOne(state: CascadeState, cues?: CueSet): CascadeState {
  for (let offset = 0; offset < FOUNDATION_COUNT; offset += 1) {
    const index = (state.launched + offset) % FOUNDATION_COUNT;
    const pile = state.foundations[index] ?? [];
    const card = pile[pile.length - 1];
    if (card) {
      const foundations = state.foundations.map((p, i) =>
        i === index ? p.slice(0, -1) : p,
      );
      const flyer: FlyerState = {
        id: card.id,
        suit: card.suit,
        rank: card.rank,
        x: FOUNDATION_X[index]!,
        y: TOP_ROW_Y,
        vx: drawLaunchVx(),
        vy: LAUNCH_VY,
      };
      cues?.add(CUES.launch);
      return {
        ...state,
        foundations,
        flyers: [...state.flyers, flyer],
        launched: state.launched + 1,
      };
    }
  }
  return state;
}

function advanceCascade(
  state: DeepReadonly<CascadeState>,
  dt: number,
  cues?: CueSet,
): CascadeState {
  let next = cloneState(state);
  if (next.screen !== "won") return next;
  let stamps = next.trailStamps;
  const flyers: FlyerState[] = [];
  for (const flyer of next.flyers) {
    let vy = flyer.vy + GRAVITY * dt;
    const x = flyer.x + flyer.vx * dt;
    let y = flyer.y + vy * dt;
    if (y >= FLOOR_Y && vy > 0) {
      vy = -vy * BOUNCE_DAMP;
      y = FLOOR_Y;
    }
    if (next.trailPainting) stamps += 1;
    if (!(x + CARD_W < 0 || x > STAGE_W)) flyers.push({ ...flyer, x, y, vy });
  }
  next = { ...next, flyers, trailStamps: stamps };
  if (next.launching && next.launched < DECK_SIZE) {
    let clock = next.launchClock + dt;
    while (clock >= LAUNCH_INTERVAL && next.launched < DECK_SIZE) {
      clock -= LAUNCH_INTERVAL;
      next = launchOne(next, cues);
    }
    next = { ...next, launchClock: clock };
  }
  if (next.launched >= DECK_SIZE && next.flyers.length === 0)
    next = { ...next, cascadeDone: true };
  return next;
}

function getPaintedLayer():
  CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null {
  if (!paintedLayer) {
    if (typeof OffscreenCanvas !== "undefined")
      paintedLayer = new OffscreenCanvas(STAGE_W, STAGE_H);
    else if (typeof document !== "undefined") {
      const canvas = document.createElement("canvas");
      canvas.width = STAGE_W;
      canvas.height = STAGE_H;
      paintedLayer = canvas;
    }
  }
  return paintedLayer?.getContext("2d") ?? null;
}

function clearPaintedLayer(): void {
  const ctx = getPaintedLayer();
  ctx?.clearRect(0, 0, STAGE_W, STAGE_H);
}

function playCues(api: UpdateApi, cues: CueSet): void {
  for (const cue of cues) api.audio.play(cue);
}

export const game: Game<CascadeState, CascadeDebugApi> = {
  initialize(api: InitApi<CascadeState>): [CascadeState, CascadeDebugApi] {
    for (const [name, keys] of Object.entries(MENU_BINDINGS))
      api.input.register(name, { keys: [...keys] });
    defineCues(api);
    registerDiagnostics(api);
    return [emptyState(), createDebugApi()];
  },

  update(
    state: DeepReadonly<CascadeState>,
    api: UpdateApi,
    dt: number,
  ): CascadeState {
    const cues: CueSet = new Set();
    let next = { ...cloneState(state), simTime: state.simTime + dt };
    next = processKeyboard(next, api, cues);
    for (const sample of api.input.pointerSamples())
      next = processPointerSample(next, sample, cues);
    next = advanceCascade(next, dt, cues);
    if (next.muted !== api.audio.muted()) api.audio.setMuted(next.muted);
    next = { ...next, muted: api.audio.muted() };
    playCues(api, cues);
    return next;
  },

  render(state: DeepReadonly<CascadeState>, api: RenderApi): void {
    const ctx = api.ctx;
    drawTable(ctx);
    if (state.screen === "playing" || state.screen === "won")
      drawPiles(ctx, state);
    drawDrag(ctx, state);
    drawFlyersAndTrails(ctx, state);
    if (state.screen === "title") drawTitle(ctx, state);
    if (state.screen === "howto") drawHowTo(ctx, state);
    if (state.screen === "playing") drawHud(ctx, state);
    if (state.screen === "won") drawWon(ctx, state);
  },
};

function defineCues(api: InitApi<CascadeState>): void {
  const specs: Record<
    CueName,
    {
      wave?: "sine" | "square" | "sawtooth" | "triangle";
      freq: number;
      freqTo?: number;
      durationMs: number;
      gain?: number;
    }
  > = {
    deal: {
      wave: "triangle",
      freq: 300,
      freqTo: 520,
      durationMs: 120,
      gain: 0.16,
    },
    turn: { wave: "sine", freq: 460, freqTo: 380, durationMs: 80, gain: 0.13 },
    recycle: {
      wave: "sawtooth",
      freq: 180,
      freqTo: 260,
      durationMs: 140,
      gain: 0.11,
    },
    lift: {
      wave: "triangle",
      freq: 520,
      freqTo: 640,
      durationMs: 55,
      gain: 0.1,
    },
    drop: { wave: "sine", freq: 300, freqTo: 220, durationMs: 70, gain: 0.14 },
    reject: {
      wave: "square",
      freq: 180,
      freqTo: 110,
      durationMs: 90,
      gain: 0.09,
    },
    flip: {
      wave: "triangle",
      freq: 620,
      freqTo: 740,
      durationMs: 70,
      gain: 0.11,
    },
    home: { wave: "sine", freq: 660, freqTo: 880, durationMs: 120, gain: 0.13 },
    launch: {
      wave: "sawtooth",
      freq: 240,
      freqTo: 500,
      durationMs: 90,
      gain: 0.08,
    },
    win: {
      wave: "triangle",
      freq: 420,
      freqTo: 840,
      durationMs: 360,
      gain: 0.16,
    },
  };
  for (const [cue, spec] of Object.entries(specs)) api.audio.define(cue, spec);
}

function registerDiagnostics(api: InitApi<CascadeState>): void {
  api.diagnostics.register("screen", (s) => s.screen);
  api.diagnostics.register("deal", () => DEAL_MODE);
  api.diagnostics.register("stock", (s) => s.stock.length);
  api.diagnostics.register("waste", (s) => s.waste.length);
  for (let i = 0; i < FOUNDATION_COUNT; i += 1)
    api.diagnostics.register(`f${i}`, (s) => s.foundations[i]?.length ?? 0);
  for (let i = 0; i < TABLEAU_COLUMNS; i += 1)
    api.diagnostics.register(`c${i}`, (s) => s.tableau[i]?.length ?? 0);
  api.diagnostics.register("hand", (s) => s.drag?.cards.length ?? 0);
  api.diagnostics.register("launched", (s) =>
    s.screen === "won" ? s.launched : "",
  );
  api.diagnostics.register("flyers", (s) =>
    s.screen === "won" ? s.flyers.length : "",
  );
}

function createDebugApi(): CascadeDebugApi {
  return {
    version: CASCADE_DEBUG_VERSION,
    reset: (state) => ({ ...emptyState(state.muted), muted: state.muted }),
    snapshot: (state) => snapshot(state),
    reconcile: (state) => updateDropTarget(state),
    menuItemRect: (state, index) => menuItemRectFor(state.screen, index),
    setScreen: (state, screen) => ({ ...cloneState(state), screen }),
    setMenuIndex: (state, index) => ({
      ...cloneState(state),
      menuIndex: index,
    }),
    setTitleIndex: (state, index) => ({
      ...cloneState(state),
      titleIndex: index,
    }),
    addCard: (state, pile, index, suit, rank, faceUp) =>
      addCard(state, pile, index, suit, rank, faceUp),
    removeCard: (state, id) => removeCard(state, id),
    setCardFaceUp: (state, id, faceUp) => setCardFaceUp(state, id, faceUp),
    clearPile: (state, pile, index) => clearPile(state, pile, index),
    clearTable: (state) => ({
      ...cloneState(state),
      stock: [],
      waste: [],
      wasteSets: [],
      foundations: [[], [], [], []],
      tableau: [[], [], [], [], [], [], []],
      drag: null,
      dropTarget: null,
    }),
    addWasteSet: (state, count) => {
      assertWhole(count, "count");
      if (count < 0)
        throw new Error("Cascade debug: count must be non-negative");
      return { ...cloneState(state), wasteSets: [...state.wasteSets, count] };
    },
    clearWasteSets: (state) => ({ ...cloneState(state), wasteSets: [] }),
    deal: (state) => dealState(state),
    turnStock: (state) => turnStock(state),
    move: (state, fromPile, fromIndex, fromRow, toPile, toIndex) =>
      attemptMove(state, fromPile, fromIndex, fromRow, toPile, toIndex),
    autoMove: (state, pile, index) => playableHomeMove(state, pile, index),
    pointerDown: (state, x, y) => pointerDown(state, x, y),
    pointerMove: (state, x, y) => pointerMove(state, x, y),
    pointerUp: (state, x, y) => pointerUp(state, x, y),
    setAutoFlip: (state, enabled) => ({
      ...cloneState(state),
      autoFlip: enabled,
    }),
    setWinDetect: (state, enabled) => ({
      ...cloneState(state),
      winDetect: enabled,
    }),
    setLaunching: (state, enabled) => ({
      ...cloneState(state),
      launching: enabled,
    }),
    setTrailPainting: (state, enabled) => ({
      ...cloneState(state),
      trailPainting: enabled,
    }),
    addFlyer: (state, suit, rank, x, y, vx, vy) =>
      addFlyer(state, suit, rank, x, y, vx, vy),
    setFlyerPosition: (state, id, x, y) =>
      mapFlyer(state, id, (flyer) => ({ ...flyer, x, y })),
    setFlyerVelocity: (state, id, vx, vy) =>
      mapFlyer(state, id, (flyer) => ({ ...flyer, vx, vy })),
    removeFlyer: (state, id) => removeFlyer(state, id),
    clearFlyers: (state) => ({ ...cloneState(state), flyers: [] }),
    setLaunchClock: (state, seconds) => {
      assertFinite(seconds, "seconds");
      return { ...cloneState(state), launchClock: seconds };
    },
    clearTrail: (state) => {
      clearPaintedLayer();
      return { ...cloneState(state), trailStamps: 0 };
    },
    drawLaunchVx,
  };
}

function snapshot(state: DeepReadonly<CascadeState>): CascadeSnapshot {
  return {
    version: CASCADE_DEBUG_VERSION,
    screen: state.screen,
    menuIndex: state.menuIndex,
    titleIndex: state.titleIndex,
    dealMode: DEAL_MODE,
    turnCount: TURN_COUNT,
    dealModeLabel: DEAL_MODE_LABEL,
    muted: state.muted,
    autoFlip: state.autoFlip,
    winDetect: state.winDetect,
    launching: state.launching,
    trailPainting: state.trailPainting,
    stock: state.stock.map(cardSnapshot),
    waste: state.waste.map(cardSnapshot),
    wasteSets: [...state.wasteSets],
    wasteVisibleCount: state.wasteSets[state.wasteSets.length - 1] ?? 0,
    foundations: state.foundations.map((pile) => pile.map(cardSnapshot)),
    tableau: state.tableau.map((pile) => pile.map(cardSnapshot)),
    drag: state.drag
      ? { ...state.drag, cards: state.drag.cards.map(cardSnapshot) }
      : null,
    dropTarget: currentDropTarget(state),
    pointer: { ...state.pointer },
    lastPress: state.lastPress ? { ...state.lastPress } : null,
    launchClock: state.launchClock,
    launched: state.launched,
    flyers: state.flyers.map((flyer) => ({ ...flyer })),
    cascadeDone: state.cascadeDone,
    trailStamps: state.trailStamps,
    simTime: state.simTime,
  };
}

function cardSnapshot(card: DeepReadonly<CardState>): CardSnapshot {
  return {
    id: card.id,
    suit: card.suit,
    rank: card.rank,
    faceUp: card.faceUp,
    color: colorOf(card.suit),
  };
}

function addCard(
  state: DeepReadonly<CascadeState>,
  pile: PileName,
  index: number,
  suit: Suit,
  rank: number,
  faceUp: boolean,
): CascadeState {
  assertWhole(index, "index");
  assertSuit(suit);
  assertRank(rank);
  const card: CardState = { id: state.nextId, suit, rank, faceUp };
  const next = cloneState(state);
  if (pile === "stock" && index === 0)
    return { ...next, stock: [...next.stock, card], nextId: next.nextId + 1 };
  if (pile === "waste" && index === 0)
    return { ...next, waste: [...next.waste, card], nextId: next.nextId + 1 };
  if (pile === "foundation" && index >= 0 && index < FOUNDATION_COUNT) {
    return {
      ...next,
      foundations: next.foundations.map((p, i) =>
        i === index ? [...p, card] : p,
      ),
      nextId: next.nextId + 1,
    };
  }
  if (pile === "tableau" && index >= 0 && index < TABLEAU_COLUMNS) {
    return {
      ...next,
      tableau: next.tableau.map((p, i) => (i === index ? [...p, card] : p)),
      nextId: next.nextId + 1,
    };
  }
  throw new Error("Cascade debug: invalid pile address");
}

function removeCard(
  state: DeepReadonly<CascadeState>,
  id: number,
): CascadeState {
  assertWhole(id, "id");
  const next = cloneState(state);
  if (next.stock.some((card) => card.id === id))
    return { ...next, stock: next.stock.filter((card) => card.id !== id) };
  if (next.waste.some((card) => card.id === id))
    return {
      ...next,
      waste: next.waste.filter((card) => card.id !== id),
      wasteSets: removeFromWasteSet(next.wasteSets),
    };
  for (let i = 0; i < FOUNDATION_COUNT; i += 1) {
    if (next.foundations[i]!.some((card) => card.id === id)) {
      return {
        ...next,
        foundations: next.foundations.map((p, pi) =>
          pi === i ? p.filter((card) => card.id !== id) : p,
        ),
      };
    }
  }
  for (let i = 0; i < TABLEAU_COLUMNS; i += 1) {
    if (next.tableau[i]!.some((card) => card.id === id)) {
      return {
        ...next,
        tableau: next.tableau.map((p, pi) =>
          pi === i ? p.filter((card) => card.id !== id) : p,
        ),
      };
    }
  }
  throw new Error(`Cascade debug: no card ${id}`);
}

function setCardFaceUp(
  state: DeepReadonly<CascadeState>,
  id: number,
  faceUp: boolean,
): CascadeState {
  let found = false;
  const map = (card: CardState): CardState => {
    if (card.id !== id) return card;
    found = true;
    return { ...card, faceUp };
  };
  const next = cloneState(state);
  const updated = {
    ...next,
    stock: next.stock.map(map),
    waste: next.waste.map(map),
    foundations: next.foundations.map((pile) => pile.map(map)),
    tableau: next.tableau.map((pile) => pile.map(map)),
  };
  if (!found) throw new Error(`Cascade debug: no card ${id}`);
  return updated;
}

function clearPile(
  state: DeepReadonly<CascadeState>,
  pile: PileName,
  index: number,
): CascadeState {
  const next = cloneState(state);
  if (pile === "stock" && index === 0) return { ...next, stock: [] };
  if (pile === "waste" && index === 0)
    return { ...next, waste: [], wasteSets: [] };
  if (pile === "foundation" && index >= 0 && index < FOUNDATION_COUNT)
    return {
      ...next,
      foundations: next.foundations.map((p, i) => (i === index ? [] : p)),
    };
  if (pile === "tableau" && index >= 0 && index < TABLEAU_COLUMNS)
    return {
      ...next,
      tableau: next.tableau.map((p, i) => (i === index ? [] : p)),
    };
  throw new Error("Cascade debug: invalid pile address");
}

function addFlyer(
  state: DeepReadonly<CascadeState>,
  suit: Suit,
  rank: number,
  x: number,
  y: number,
  vx: number,
  vy: number,
): CascadeState {
  assertSuit(suit);
  assertRank(rank);
  for (const [value, name] of [
    [x, "x"],
    [y, "y"],
    [vx, "vx"],
    [vy, "vy"],
  ] as const)
    assertFinite(value, name);
  const next = cloneState(state);
  const flyer: FlyerState = { id: next.nextId, suit, rank, x, y, vx, vy };
  return { ...next, flyers: [...next.flyers, flyer], nextId: next.nextId + 1 };
}

function mapFlyer(
  state: DeepReadonly<CascadeState>,
  id: number,
  map: (flyer: FlyerState) => FlyerState,
): CascadeState {
  let found = false;
  const flyers = state.flyers.map((flyer) => {
    if (flyer.id !== id) return { ...flyer };
    found = true;
    return map({ ...flyer });
  });
  if (!found) throw new Error(`Cascade debug: no flyer ${id}`);
  return { ...cloneState(state), flyers };
}

function removeFlyer(
  state: DeepReadonly<CascadeState>,
  id: number,
): CascadeState {
  const next = cloneState(state);
  if (!next.flyers.some((flyer) => flyer.id === id))
    throw new Error(`Cascade debug: no flyer ${id}`);
  return { ...next, flyers: next.flyers.filter((flyer) => flyer.id !== id) };
}

function drawTable(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  ctx.fillStyle = "rgba(255,255,255,0.04)";
  for (let y = -80; y < STAGE_H; y += 42) ctx.fillRect(0, y, STAGE_W, 2);
  ctx.fillStyle = TABLE_DARK;
  ctx.fillRect(0, HUD_Y, STAGE_W, HUD_H);
}

function drawPiles(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CascadeState>,
): void {
  drawSlot(ctx, STOCK_X, TOP_ROW_Y, "");
  if (state.stock.length > 0)
    drawCard(ctx, state.stock[state.stock.length - 1]!, STOCK_X, TOP_ROW_Y);
  drawSlot(ctx, WASTE_X, TOP_ROW_Y, "");
  drawWaste(ctx, state);
  for (let i = 0; i < FOUNDATION_COUNT; i += 1) {
    const highlight =
      state.dropTarget?.pile === "foundation" && state.dropTarget.index === i;
    drawSlot(ctx, FOUNDATION_X[i]!, TOP_ROW_Y, highlight ? "F" : "");
    const pile = state.foundations[i];
    const top = pile?.[pile.length - 1];
    if (top) drawCard(ctx, top, FOUNDATION_X[i]!, TOP_ROW_Y);
  }
  for (let i = 0; i < TABLEAU_COLUMNS; i += 1) {
    const highlight =
      state.dropTarget?.pile === "tableau" && state.dropTarget.index === i;
    drawSlot(ctx, COLUMN_X[i]!, TABLEAU_Y, highlight ? "K" : "");
    const column = state.tableau[i] ?? [];
    for (let row = 0; row < column.length; row += 1)
      drawCard(ctx, column[row]!, COLUMN_X[i]!, cardY(column, row));
  }
}

function drawWaste(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CascadeState>,
): void {
  const visible = Math.min(
    state.wasteSets[state.wasteSets.length - 1] ?? 0,
    TURN_COUNT,
    state.waste.length,
  );
  if (visible === 0) return;
  const hidden = state.waste.length - visible;
  if (hidden > 0) drawCard(ctx, state.waste[hidden - 1]!, WASTE_X, TOP_ROW_Y);
  for (let i = 0; i < visible; i += 1)
    drawCard(ctx, state.waste[hidden + i]!, WASTE_X + i * WASTE_FAN, TOP_ROW_Y);
}

function drawSlot(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  x: number,
  y: number,
  label: string,
): void {
  roundRect(ctx, x, y, CARD_W, CARD_H, CARD_RADIUS);
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.fill();
  ctx.strokeStyle = label ? HIGHLIGHT : SLOT;
  ctx.lineWidth = label ? 4 : 2;
  ctx.stroke();
  if (label) {
    ctx.fillStyle = "rgba(244,211,94,0.16)";
    ctx.fill();
  }
}

function drawDrag(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CascadeState>,
): void {
  if (!state.drag) return;
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 22;
  ctx.shadowOffsetY = 12;
  for (let i = 0; i < state.drag.cards.length; i += 1)
    drawCard(
      ctx,
      state.drag.cards[i]!,
      state.drag.x,
      state.drag.y + i * FACE_UP_OFFSET,
    );
  ctx.restore();
}

function drawFlyersAndTrails(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CascadeState>,
): void {
  if (paintedLayer) ctx.drawImage(paintedLayer, 0, 0);
  if (state.trailPainting && state.flyers.length > 0) {
    const layer = getPaintedLayer();
    if (layer) {
      for (const flyer of state.flyers)
        drawCard(layer, { ...flyer, faceUp: true }, flyer.x, flyer.y);
    }
  }
  for (const flyer of state.flyers)
    drawCard(ctx, { ...flyer, faceUp: true }, flyer.x, flyer.y);
}

function drawCard(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  card: DeepReadonly<CardState>,
  x: number,
  y: number,
): void {
  ctx.save();
  ctx.shadowColor = SHADOW;
  ctx.shadowBlur = 5;
  ctx.shadowOffsetY = 3;
  roundRect(ctx, x, y, CARD_W, CARD_H, CARD_RADIUS);
  ctx.fillStyle = card.faceUp ? FACE : "#2353a0";
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "rgba(0,0,0,0.22)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  if (card.faceUp) drawFace(ctx, card, x, y);
  else drawBack(ctx, x, y);
  ctx.restore();
}

function drawFace(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  card: DeepReadonly<CardState>,
  x: number,
  y: number,
): void {
  const color = colorOf(card.suit) === "red" ? RED : BLACK;
  ctx.fillStyle = color;
  ctx.font = "700 24px Georgia, serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(rankLabel(card.rank), x + 10, y + 8);
  ctx.font = "700 30px Georgia, serif";
  ctx.fillText(suitSymbol(card.suit), x + 10, y + 36);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 52px Georgia, serif";
  ctx.fillText(suitSymbol(card.suit), x + CARD_W / 2, y + CARD_H / 2 + 8);
}

function drawBack(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  x: number,
  y: number,
): void {
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i += 1) {
    roundRect(
      ctx,
      x + 12 + i * 5,
      y + 14 + i * 5,
      CARD_W - 24 - i * 10,
      CARD_H - 28 - i * 10,
      6,
    );
    ctx.stroke();
  }
}

function rankLabel(rank: number): string {
  return (
    ["", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"][
      rank
    ] ?? String(rank)
  );
}

function suitSymbol(suit: Suit): string {
  return { spades: "S", hearts: "H", diamonds: "D", clubs: "C" }[suit];
}

function roundRect(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawTitle(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CascadeState>,
): void {
  veil(ctx);
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = TEXT;
  ctx.font = "700 92px Georgia, serif";
  ctx.fillText(TITLE_TEXT, STAGE_W / 2, 210);
  ctx.font = "700 24px system-ui, sans-serif";
  ctx.fillStyle = TEXT_DIM;
  ctx.fillText(TAGLINE_TEXT, STAGE_W / 2, 252);
  ctx.fillStyle = HIGHLIGHT;
  ctx.font = "700 18px system-ui, sans-serif";
  ctx.fillText(DEAL_MODE_LABEL, STAGE_W / 2, 306);
  drawMenu(ctx, state.screen, state.menuIndex);
}

function drawHowTo(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CascadeState>,
): void {
  veil(ctx);
  ctx.fillStyle = TEXT;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.font = "700 48px Georgia, serif";
  ctx.fillText("How To Play", STAGE_W / 2, 112);
  ctx.font = "24px system-ui, sans-serif";
  const lines = [
    "Build every foundation from ACE up to KING.",
    "Columns build downward by alternating red and black.",
    "Only a KING can start an empty column.",
    "Turn the STOCK for three cards; recycle it when it runs dry.",
    "Drag cards to move them, or DOUBLE-CLICK a playable card to send it home.",
  ];
  for (let i = 0; i < lines.length; i += 1)
    ctx.fillText(lines[i]!, STAGE_W / 2, 210 + i * 46);
  drawMenu(ctx, state.screen, state.menuIndex);
}

function drawHud(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CascadeState>,
): void {
  ctx.fillStyle = TABLE_DARK;
  ctx.fillRect(0, HUD_Y, STAGE_W, HUD_H);
  drawMenu(ctx, state.screen, state.menuIndex);
  ctx.fillStyle = TEXT_DIM;
  ctx.font = "700 16px system-ui, sans-serif";
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillText(
    `${DEAL_MODE_LABEL}${state.muted ? "  SOUND OFF" : ""}`,
    1076,
    HUD_Y + HUD_H / 2,
  );
}

function drawWon(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CascadeState>,
): void {
  if (!state.cascadeDone) return;
  veil(ctx);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = TEXT;
  ctx.font = "700 86px Georgia, serif";
  ctx.fillText(WIN_TEXT, STAGE_W / 2, 330);
  ctx.font = "22px system-ui, sans-serif";
  ctx.fillStyle = TEXT_DIM;
  ctx.fillText("Press anywhere for a fresh deal", STAGE_W / 2, 400);
}

function veil(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = "rgba(8,25,22,0.72)";
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
}

function drawMenu(
  ctx: CanvasRenderingContext2D,
  screen: Screen,
  selected: number,
): void {
  const labels =
    screen === "title"
      ? TITLE_ITEMS
      : screen === "howto"
        ? [HOWTO_BACK_LABEL]
        : screen === "playing"
          ? HUD_ITEMS
          : [];
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "700 18px system-ui, sans-serif";
  labels.forEach((label, index) => {
    const rect = menuItemRectFor(screen, index);
    if (!rect) return;
    roundRect(ctx, rect.x, rect.y, rect.w, rect.h, 8);
    ctx.fillStyle = index === selected ? HIGHLIGHT : "rgba(255,255,255,0.08)";
    ctx.fill();
    ctx.strokeStyle = index === selected ? "rgba(0,0,0,0.2)" : TABLE_LINE;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = index === selected ? "#172820" : TEXT;
    ctx.fillText(label, rect.x + rect.w / 2, rect.y + rect.h / 2);
  });
}
