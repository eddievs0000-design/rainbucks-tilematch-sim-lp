import { useCallback, useEffect, useRef, useState } from "react";

import rainbucksLogo from "@/assets/rainbucks-logo";

/* ============================================================
   CONFIG
   ============================================================ */
export const ROWS = 7;
export const COLS = 6;
export const GOAL = 50;
export const BOMB_AFTER = 5;
export const FINAL_BALANCE = 43.52;

type TileType = "star" | "diamond" | "heart" | "coin" | "bomb";
type Cell = { type: TileType; bomb: boolean } | null;

const TYPES: TileType[] = ["star", "diamond", "heart", "coin"];

function TileIcon({ type }: { type: TileType }) {
  switch (type) {
    case "star":
      return (
        <svg viewBox="0 0 24 24" fill="#fff">
          <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" />
        </svg>
      );
    case "diamond":
      return (
        <svg viewBox="0 0 24 24" fill="#fff">
          <path d="M12 2L2 9l10 13L22 9z" />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 24 24" fill="#fff">
          <path d="M12 21s-7.5-4.9-10-9.5C.5 8 2.5 4.5 6 4.5c2 0 3.5 1 4.5 2.5 1-1.5 2.5-2.5 4.5-2.5 3.5 0 5.5 3.5 4 7-2.5 4.6-10 9.5-10 9.5z" />
        </svg>
      );
    case "coin":
      return (
        <svg viewBox="0 0 24 24" fill="#fff">
          <circle cx="12" cy="12" r="9" fill="none" stroke="#fff" strokeWidth="2.4" />
          <text x="12" y="16.4" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily="sans-serif">
            $
          </text>
        </svg>
      );
    case "bomb":
      return (
        <svg viewBox="0 0 24 24" fill="#fff">
          <circle cx="11" cy="14" r="7" />
          <rect x="13" y="4" width="4" height="4" rx="1" transform="rotate(30 15 6)" />
          <path d="M17 5c1-2 3-2 4-1" stroke="#F2B93B" strokeWidth="2" fill="none" />
        </svg>
      );
  }
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
function sfxBoom() {
  const c = actx();
  if (!c) return;
  const t = c.currentTime;
  const n = Math.floor(c.sampleRate * 0.4);
  const buf = c.createBuffer(1, n, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const src = c.createBufferSource();
  src.buffer = buf;
  const f = c.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.setValueAtTime(1200, t);
  f.frequency.exponentialRampToValueAtTime(120, t + 0.4);
  const g = c.createGain();
  g.gain.setValueAtTime(0.35, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
  src.connect(f);
  f.connect(g);
  g.connect(c.destination);
  src.start(t);
  src.stop(t + 0.4);
  const o2 = c.createOscillator();
  const g2 = c.createGain();
  o2.type = "sine";
  o2.frequency.setValueAtTime(150, t);
  o2.frequency.exponentialRampToValueAtTime(30, t + 0.3);
  g2.gain.setValueAtTime(0.3, t);
  g2.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
  o2.connect(g2);
  g2.connect(c.destination);
  o2.start(t);
  o2.stop(t + 0.3);
}

function payout(n: number) {
  const m = n >= 6 ? 3 : n >= 4 ? 2 : 1;
  return +(n * 0.35 * m).toFixed(2);
}

function makeBoard(): Cell[][] {
  const b: Cell[][] = [];
  for (let r = 0; r < ROWS; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < COLS; c++) row.push({ type: TYPES[Math.floor(Math.random() * TYPES.length)], bomb: false });
    b.push(row);
  }
  return b;
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

export function BlockGame({ offerUrl }: { offerUrl: string }) {
  const boardRef = useRef<Cell[][]>(makeBoard());
  const [version, setVersion] = useState(0);
  const fallRef = useRef<Set<string>>(new Set());
  const lockedRef = useRef(false);
  const finishedRef = useRef(false);
  const bombRef = useRef(false);
  const clearsRef = useRef(0);
  const balanceRef = useRef(0);

  const [balance, setBalance] = useState(0);
  const [balBump, setBalBump] = useState(false);
  const [gameBump, setGameBump] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalVis, setModalVis] = useState(false);
  const [earned, setEarned] = useState(0);
  const [started, setStarted] = useState(false);
  const [overlayGone, setOverlayGone] = useState(false);

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

  const applyBalance = useCallback((v: number) => {
    balanceRef.current = v;
    setBalance(v);
  }, []);

  const cellCenter = (r: number, c: number) => {
    const grid = gridRef.current;
    if (!grid) return { x: 0, y: 0 };
    const rect = grid.getBoundingClientRect();
    const w = rect.width / COLS;
    const h = rect.height / ROWS;
    return { x: rect.left + c * w + w / 2, y: rect.top + r * h + h / 2 };
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

  const group = (r: number, c: number) => {
    const board = boardRef.current;
    const start = board[r][c];
    if (!start) return [] as [number, number][];
    const t = start.type;
    const seen: Record<string, 1> = {};
    const stack: [number, number][] = [[r, c]];
    const out: [number, number][] = [];
    while (stack.length) {
      const [rr, cc] = stack.pop()!;
      const key = `${rr}-${cc}`;
      if (seen[key] || rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) continue;
      const cell = board[rr][cc];
      if (!cell || cell.bomb || cell.type !== t) continue;
      seen[key] = 1;
      out.push([rr, cc]);
      stack.push([rr - 1, cc], [rr + 1, cc], [rr, cc - 1], [rr, cc + 1]);
    }
    return out;
  };

  const collapse = () => {
    const board = boardRef.current;
    const newB: Cell[][] = [];
    const fallSet = new Set<string>();
    for (let r = 0; r < ROWS; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < COLS; c++) row.push(null);
      newB.push(row);
    }
    for (let c = 0; c < COLS; c++) {
      const col: Cell[] = [];
      for (let r = 0; r < ROWS; r++) if (board[r][c]) col.push(board[r][c]);
      const off = ROWS - col.length;
      for (let r = 0; r < ROWS; r++) {
        newB[r][c] = r < off ? null : col[r - off];
        if (r >= off && off > 0) fallSet.add(`${r}-${c}`);
      }
    }
    boardRef.current = newB;
    return fallSet;
  };

  const boardEmpty = () => {
    const board = boardRef.current;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (board[r][c]) return false;
    return true;
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

  const explode = () => {
    sfxBoom();
    lockedRef.current = true;
    const board = boardRef.current;
    const remaining: { x: number; y: number }[] = [];
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        const cell = board[r][c];
        if (cell && !cell.bomb) remaining.push(cellCenter(r, c));
      }
    const cells = gridRef.current?.children;
    if (cells) for (let i = 0; i < cells.length; i++) cells[i].classList.add("clearing");
    later(() => {
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) boardRef.current[r][c] = null;
      if (remaining.length) flyCoins(remaining.slice(0, 12), 0);
      fallRef.current = new Set();
      rerender();
      finishBoard();
    }, 150);
  };

  const dropBomb = () => {
    bombRef.current = true;
    const c = Math.floor(Math.random() * COLS);
    boardRef.current[0][c] = { type: "bomb", bomb: true };
    const ticks = window.setInterval(sfxTick, 250);
    timers.current.push(ticks);
    later(() => {
      window.clearInterval(ticks);
      explode();
    }, 1000);
  };

  const startGame = () => {
    if (started) return;
    setStarted(true);
    sfxTick();
    later(() => setOverlayGone(true), 260);
  };

  const tap = (r: number, c: number) => {
    const board = boardRef.current;
    if (lockedRef.current || finishedRef.current || !board[r][c] || board[r][c]!.bomb) return;
    const g = group(r, c);
    if (g.length < 2) return;
    lockedRef.current = true;
    actx();
    const idx = g.map(([rr, cc]) => rr * COLS + cc);
    const cells = gridRef.current?.children;
    if (cells) idx.forEach((i) => cells[i]?.classList.add("selected"));
    const pts = g.map(([rr, cc]) => cellCenter(rr, cc));
    const amt = payout(g.length);
    later(() => {
      sfxWhoosh();
      if (cells) idx.forEach((i) => cells[i]?.classList.add("clearing"));
      later(() => {
        g.forEach(([rr, cc]) => {
          boardRef.current[rr][cc] = null;
        });
        clearsRef.current++;
        const fallSet = collapse();
        flyCoins(pts, amt);
        if (clearsRef.current >= BOMB_AFTER && !bombRef.current) dropBomb();
        fallRef.current = fallSet;
        rerender();
        lockedRef.current = false;
        if (boardEmpty() && !bombRef.current) finishBoard();
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
            <p>Tap anywhere to play</p>
          </div>
        )}
        <div className="rg-grid" ref={gridRef}>
          {board.flatMap((row, r) =>
            row.map((cell, c) => {
              const key = `${version}-${r}-${c}`;
              if (!cell) return <div key={key} className="rg-cell empty" />;
              const falling = fallRef.current.has(`${r}-${c}`);
              return (
                <div
                  key={key}
                  className={`rg-cell ${cell.bomb ? "t-bomb bomb" : `t-${cell.type}`}${falling ? " falling" : ""}`}
                  onPointerDown={() => tap(r, c)}
                >
                  <TileIcon type={cell.bomb ? "bomb" : cell.type} />
                </div>
              );
            }),
          )}
        </div>
        <p className="rg-hint">Tap groups of 2 or more matching blocks</p>
      </div>

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
