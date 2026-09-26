import { useCallback, useEffect, useRef, useState } from "react";

import rainbucksLogo from "@/assets/rainbucks-logo";

/* ============================================================
   CONFIG
   ============================================================ */
export const ROWS = 7;
export const COLS = 6;
export const GOAL = 5;
export const MATCHES_TO_END = 8;
export const FINAL_BALANCE = 4.1;
const FILLED = 26;

/* Scripted, believable payouts — motion, not a jackpot */
const PAYOUTS = [0.12, 0.18, 1.1, 0.45, 0.55, 0.45, 0.6, 0.65];
const MATCH_MESSAGES: { lines: string[]; kind?: "milestone" }[] = [
  { lines: ["+$0.12 added"] },
  { lines: ["+$0.18 · Balance $0.30"] },
  { lines: ["You're at $1.40. Keep going."] },
  { lines: ["+$0.45 added"] },
  { lines: ["+$0.55 added"] },
  {
    lines: ["Milestone hit · +$0.45", "Balance $2.85", "Nice. That's how payouts start."],
    kind: "milestone",
  },
  { lines: ["+$0.60 added"] },
  { lines: ["+$0.65 added"] },
];

type Cell = { emoji: string } | null;

const EMOJIS = ["🍒", "🍌", "🍇", "🥕", "🍆", "🍏", "🍼", "🍪", "🍗", "🌰", "🍃", "🫐"];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeBoard(): Cell[][] {
  const cells: Cell[] = [];
  const pairCount = Math.floor(FILLED / 2);
  for (let i = 0; i < pairCount; i++) {
    const e = EMOJIS[i % EMOJIS.length];
    cells.push({ emoji: e }, { emoji: e });
  }
  while (cells.length < ROWS * COLS) cells.push(null);
  const shuffled = shuffle(cells);
  const board: Cell[][] = [];
  for (let r = 0; r < ROWS; r++) board.push(shuffled.slice(r * COLS, r * COLS + COLS));
  return board;
}

/* ============================================================
   SOUND FX (Web Audio)
   ============================================================ */
let _ctx: AudioContext | null = null;
function actx() {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || (window as any).webkitAudioContext;
  if (!Ctor) return null;
  if (!_ctx) _ctx = new Ctor();
  if (_ctx.state === "suspended") void _ctx.resume();
  return _ctx;
}
function sfxPop(count: number) {
  const c = actx();
  if (!c) return;
  const n = count < 2 ? count + 1 : Math.min(count, 8);
  const step = 0.09;
  for (let o = 0; o < n; o++) {
    const t = c.currentTime + o * step;
    const last = o === n - 1;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(last ? 1050 : 700 + o * 15, t);
    g.gain.setValueAtTime(0.08, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + step * 0.85);
    osc.connect(g);
    g.connect(c.destination);
    osc.start(t);
    osc.stop(t + step * 0.85);
  }
}
function sfxWhoosh() {
  const c = actx();
  if (!c) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(650, t);
  osc.frequency.exponentialRampToValueAtTime(220, t + 0.15);
  g.gain.setValueAtTime(0.15, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.15);
}
function sfxTick() {
  const c = actx();
  if (!c) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(500, t);
  g.gain.setValueAtTime(0.1, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.08);
}
function sfxBad() {
  const c = actx();
  if (!c) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(220, t);
  osc.frequency.exponentialRampToValueAtTime(140, t + 0.12);
  g.gain.setValueAtTime(0.08, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.12);
}


const STATS = [
  { v: "255+", k: "Games" },
  { v: "4.7★", k: "Avg Rating" },
  { v: "$0", k: "To Join" },
];

export function StatsRow() {
  return (
    <div className="rg-stats">
      {STATS.map((s) => (
        <div key={s.k}>
          <p className="v">{s.v}</p>
          <p className="k">{s.k}</p>
        </div>
      ))}
    </div>
  );
}

export function RatingPill({ relative = false }: { relative?: boolean }) {
  return (
    <div className="rg-pill" style={relative ? { position: "relative" } : undefined}>
      <span className="stars">★★★★★</span>
      <span className="txt">4.7 · 24K+ player reviews</span>
    </div>
  );
}

type DragState = {
  r: number;
  c: number;
  emoji: string;
  x: number;
  y: number;
  over: { r: number; c: number } | null;
};

export function BlockGame({ offerUrl }: { offerUrl: string }) {
  const boardRef = useRef<Cell[][]>(makeBoard());
  const [version, setVersion] = useState(0);
  const [drag, setDrag] = useState<DragState | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const lockedRef = useRef(false);
  const finishedRef = useRef(false);
  const matchesRef = useRef(0);
  const balanceRef = useRef(0);
  const spawnRef = useRef<Set<string>>(new Set());

  const [balance, setBalance] = useState(0);
  const [balBump, setBalBump] = useState(false);
  const [gameBump, setGameBump] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalVis, setModalVis] = useState(false);
  const [earned, setEarned] = useState(0);
  const [started, setStarted] = useState(false);
  const [overlayGone, setOverlayGone] = useState(false);
  const [status, setStatus] = useState<{ lines: string[]; kind?: "milestone" | "bad" } | null>(null);
  const [statusKey, setStatusKey] = useState(0);

  const gridRef = useRef<HTMLDivElement | null>(null);
  const balCardRef = useRef<HTMLDivElement | null>(null);
  const timers = useRef<number[]>([]);
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  useEffect(() => {
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const rerender = useCallback(() => setVersion((v) => v + 1), []);

  const showStatus = (lines: string[], kind?: "milestone" | "bad") => {
    setStatus({ lines, kind });
    setStatusKey((k) => k + 1);
  };

  useEffect(() => {
    const onStart = () => startGame();
    window.addEventListener("rg:start-demo", onStart);
    return () => window.removeEventListener("rg:start-demo", onStart);
  });

  const applyBalance = useCallback((v: number) => {
    balanceRef.current = v;
    setBalance(v);
  }, []);

  const setDragBoth = (d: DragState | null) => {
    dragRef.current = d;
    setDrag(d);
  };

  const cellCenter = (r: number, c: number) => {
    const grid = gridRef.current;
    if (!grid) return { x: 0, y: 0 };
    const rect = grid.getBoundingClientRect();
    const w = rect.width / COLS;
    const h = rect.height / ROWS;
    return { x: rect.left + c * w + w / 2, y: rect.top + r * h + h / 2 };
  };

  const cellAtPoint = (x: number, y: number): { r: number; c: number } | null => {
    const grid = gridRef.current;
    if (!grid) return null;
    const rect = grid.getBoundingClientRect();
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) return null;
    const c = Math.min(COLS - 1, Math.floor(((x - rect.left) / rect.width) * COLS));
    const r = Math.min(ROWS - 1, Math.floor(((y - rect.top) / rect.height) * ROWS));
    return { r, c };
  };

  const flyCoins = (points: { x: number; y: number }[], amount: number) => {
    const target = balCardRef.current?.getBoundingClientRect();
    const tx = (target?.left ?? 0) + 40;
    const ty = (target?.top ?? 0) + 40;
    points.forEach((p, i) => {
      const el = document.createElement("div");
      el.className = "rg-coin";
      el.style.transform = `translate(${p.x}px,${p.y}px)`;
      document.body.appendChild(el);
      later(() => {
        el.style.transition = "transform .2s ease-in, opacity .2s";
        el.style.transform = `translate(${tx}px,${ty}px) scale(.4)`;
        el.style.opacity = "0";
        later(() => el.remove(), 250);
      }, 30 + i * 30);
    });
    sfxPop(points.length);
    setBalBump(false);
    setGameBump(false);
    later(() => {
      setBalBump(true);
      setGameBump(true);
      later(() => {
        setBalBump(false);
        setGameBump(false);
      }, 400);
    }, 10);
    later(() => applyBalance(+(balanceRef.current + amount).toFixed(2)), 500);
  };

  const emptyCells = (): [number, number][] => {
    const out: [number, number][] = [];
    const board = boardRef.current;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (!board[r][c]) out.push([r, c]);
    return out;
  };

  const spawnPair = () => {
    const empties = shuffle(emptyCells());
    if (empties.length < 2) return;
    const e = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    const [a, b] = empties;
    boardRef.current[a[0]][a[1]] = { emoji: e };
    boardRef.current[b[0]][b[1]] = { emoji: e };
    spawnRef.current = new Set([`${a[0]}-${a[1]}`, `${b[0]}-${b[1]}`]);
    rerender();
    later(() => {
      spawnRef.current = new Set();
      rerender();
    }, 350);
  };

  const finishBoard = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    later(() => {
      applyBalance(FINAL_BALANCE);
      setEarned(FINAL_BALANCE);
      setModal(true);
      requestAnimationFrame(() => setModalVis(true));
      document.body.style.overflow = "hidden";
    }, 600);
  };

  const startGame = () => {
    if (started) return;
    setStarted(true);
    sfxTick();
    later(() => setOverlayGone(true), 260);
  };

  /* ---------------- drag handling ---------------- */
  const onTileDown = (r: number, c: number, e: React.PointerEvent) => {
    if (lockedRef.current || finishedRef.current || !started) return;
    const cell = boardRef.current[r][c];
    if (!cell) return;
    actx();
    sfxTick();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setDragBoth({ r, c, emoji: cell.emoji, x: e.clientX, y: e.clientY, over: null });
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const over = cellAtPoint(e.clientX, e.clientY);
    const validOver =
      over && !(over.r === d.r && over.c === d.c) && boardRef.current[over.r][over.c]?.emoji === d.emoji
        ? over
        : null;
    setDragBoth({ ...d, x: e.clientX, y: e.clientY, over: validOver });
  };

  const onPointerUp = () => {
    const d = dragRef.current;
    if (!d) return;
    setDragBoth(null);
    if (lockedRef.current || finishedRef.current) return;

    if (!d.over) {
      if (cellAtPoint(d.x, d.y)) sfxBad();
      return;
    }

    const { r: r2, c: c2 } = d.over;
    lockedRef.current = true;
    const pts = [cellCenter(d.r, d.c), cellCenter(r2, c2)];
    const amt = payout();
    const cells = gridRef.current?.children;
    const idx = [d.r * COLS + d.c, r2 * COLS + c2];
    if (cells) idx.forEach((i) => cells[i]?.classList.add("selected"));
    later(() => {
      sfxWhoosh();
      if (cells) idx.forEach((i) => cells[i]?.classList.add("clearing"));
      later(() => {
        boardRef.current[d.r][d.c] = null;
        boardRef.current[r2][c2] = null;
        matchesRef.current++;
        flyCoins(pts, amt);
        rerender();
        lockedRef.current = false;
        if (matchesRef.current >= MATCHES_TO_END) {
          finishBoard();
        } else {
          later(spawnPair, 420);
        }
      }, 180);
    }, 120);
  };

  const closeAndClaim = () => {
    document.body.style.overflow = "";
  };

  const board = boardRef.current;
  const pct = Math.min(100, (balance / GOAL) * 100);

  return (
    <>
      {/* ================= BALANCE ================= */}
      <div ref={balCardRef} className={`rg-balance${balBump ? " bump" : ""}`}>
        <p className="rg-lbl">Your Balance</p>
        <p className="rg-amt">${balance.toFixed(2)}</p>
        <div className="rg-bar">
          <div className="rg-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <p className="rg-goal">GOAL $50 — {pct.toFixed(0)}%</p>
      </div>

      {/* ================= GAME ================= */}
      <div className={`rg-game${gameBump ? " bump" : ""}`}>
        {!overlayGone && (
          <div className={`rg-start-overlay${started ? " hide" : ""}`} onPointerDown={startGame}>
            <div className="rg-start-icon">
              <svg viewBox="0 0 24 24" fill="#fff">
                <path d="M9 11V4.5a1.5 1.5 0 013 0V11m0 0V3.5a1.5 1.5 0 013 0V11m0 0V5.5a1.5 1.5 0 013 0V13c0 4.4-3 8-7.5 8S4 17.4 4 13v-2.5a1.5 1.5 0 013 0V12" />
              </svg>
            </div>
            <div className="rg-howto">
              <h3>How to play</h3>
              <ul>
                <li>Drag a tile onto its matching pair</li>
                <li>Each match earns cash instantly</li>
                <li>Clear 8 matches to win your reward</li>
              </ul>
            </div>
            <p>Tap anywhere to play</p>
          </div>
        )}
        <div
          className="rg-grid"
          ref={gridRef}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {board.flatMap((row, r) =>
            row.map((cell, c) => {
              const key = `${version}-${r}-${c}`;
              if (!cell) return <div key={key} className="rg-cell empty" />;
              const isSrc = drag && drag.r === r && drag.c === c;
              const isTarget = drag?.over && drag.over.r === r && drag.over.c === c;
              const spawning = spawnRef.current.has(`${r}-${c}`);
              return (
                <div
                  key={key}
                  className={`rg-cell tile${isSrc ? " drag-src" : ""}${isTarget ? " match-target" : ""}${spawning ? " spawning" : ""}`}
                  onPointerDown={(e) => onTileDown(r, c, e)}
                >
                  <span className="rg-emoji">{cell.emoji}</span>
                </div>
              );
            }),
          )}
        </div>
        <p className="rg-hint">Drag a tile onto its matching tile to clear the pair</p>
      </div>

      {/* ================= DRAG GHOST ================= */}
      {drag && (
        <div
          className="rg-drag-ghost"
          style={{ transform: `translate(${drag.x}px,${drag.y}px) translate(-50%,-50%)` }}
        >
          <span className="rg-emoji">{drag.emoji}</span>
        </div>
      )}

      {/* ================= BOARD CLEARED MODAL ================= */}
      {modal && (
        <div className={`rg-overlay${modalVis ? " vis" : ""}`}>
          <div className="rg-modal">
            <div className="rg-glow" />
            <div className="rg-logo-sm">
              <img src={rainbucksLogo} alt="Rainbucks" />
            </div>
            <RatingPill relative />
            <div style={{ position: "relative", fontSize: 36 }}>🎉</div>
            <h2>Board Cleared!</h2>
            <p className="rg-earned-lbl">You've earned</p>
            <p className="rg-earned">${earned.toFixed(2)}</p>
            <a className="rg-claim" href={offerUrl} onClick={closeAndClaim}>
              Claim Your Reward
            </a>
            <StatsRow />
          </div>
        </div>
      )}
    </>
  );
}
