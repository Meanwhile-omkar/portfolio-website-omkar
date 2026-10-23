'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GraduationCap, Database } from 'lucide-react';

// ─── Chess Engine ──────────────────────────────────────────────────────────────

type PieceType = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P';
type Color = 'w' | 'b';
interface Piece { type: PieceType; color: Color; }
type Board = (Piece | null)[];

const UNICODE: Record<Color, Record<PieceType, string>> = {
  w: { K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙' },
  b: { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟' },
};

const COL_LABELS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const BACK_RANK: PieceType[] = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];

function initialBoard(): Board {
  const b: Board = Array(64).fill(null);
  BACK_RANK.forEach((t, c) => { b[c] = { type: t, color: 'b' }; });
  for (let c = 0; c < 8; c++) b[8 + c] = { type: 'P', color: 'b' };
  for (let c = 0; c < 8; c++) b[48 + c] = { type: 'P', color: 'w' };
  BACK_RANK.forEach((t, c) => { b[56 + c] = { type: t, color: 'w' }; });
  return b;
}

function validMoves(board: Board, from: number, color: Color): number[] {
  const piece = board[from];
  if (!piece || piece.color !== color) return [];
  const moves: number[] = [];
  const r = Math.floor(from / 8), c = from % 8;
  const ok = (rr: number, cc: number) => rr >= 0 && rr < 8 && cc >= 0 && cc < 8;
  const empty = (rr: number, cc: number) => ok(rr, cc) && !board[rr * 8 + cc];
  const enemy = (rr: number, cc: number) => ok(rr, cc) && !!board[rr * 8 + cc] && board[rr * 8 + cc]!.color !== color;
  // canGo: empty or enemy (not own piece)
  const canGo = (rr: number, cc: number) => ok(rr, cc) && board[rr * 8 + cc]?.color !== color;

  const slide = (dr: number, dc: number) => {
    let rr = r + dr, cc = c + dc;
    while (ok(rr, cc)) {
      if (!board[rr * 8 + cc]) { moves.push(rr * 8 + cc); }
      else { if (enemy(rr, cc)) moves.push(rr * 8 + cc); break; }
      rr += dr; cc += dc;
    }
  };

  switch (piece.type) {
    case 'P': {
      const d = color === 'w' ? -1 : 1, start = color === 'w' ? 6 : 1;
      if (empty(r + d, c)) {
        moves.push((r + d) * 8 + c);
        if (r === start && empty(r + 2 * d, c)) moves.push((r + 2 * d) * 8 + c);
      }
      if (enemy(r + d, c - 1)) moves.push((r + d) * 8 + (c - 1));
      if (enemy(r + d, c + 1)) moves.push((r + d) * 8 + (c + 1));
      break;
    }
    case 'N':
      [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]]
        .forEach(([dr, dc]) => { if (canGo(r + dr, c + dc)) moves.push((r + dr) * 8 + (c + dc)); });
      break;
    case 'B': [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([dr, dc]) => slide(dr, dc)); break;
    case 'R': [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dr, dc]) => slide(dr, dc)); break;
    case 'Q': [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]].forEach(([dr, dc]) => slide(dr, dc)); break;
    case 'K':
      [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]
        .forEach(([dr, dc]) => { if (canGo(r + dr, c + dc)) moves.push((r + dr) * 8 + (c + dc)); });
      break;
  }
  return moves;
}

function allMoves(board: Board, color: Color): { from: number; to: number }[] {
  const moves: { from: number; to: number }[] = [];
  board.forEach((p, i) => {
    if (p?.color === color) validMoves(board, i, color).forEach(to => moves.push({ from: i, to }));
  });
  return moves;
}

function applyMove(board: Board, from: number, to: number): Board {
  const b = [...board];
  const piece = b[from]!;
  const toRow = Math.floor(to / 8);
  b[to] = (piece.type === 'P' && (toRow === 0 || toRow === 7))
    ? { type: 'Q', color: piece.color }
    : piece;
  b[from] = null;
  return b;
}

// ─── Chess Simulation Component ────────────────────────────────────────────────

function ChessSimulation() {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [turn, setTurn] = useState<Color>('w');
  const [lastMove, setLastMove] = useState<{ from: number; to: number } | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [moveLog, setMoveLog] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const moves = allMoves(board, turn);
      if (!moves.length || moveCount > 90) {
        setBoard(initialBoard()); setTurn('w'); setMoveCount(0);
        setMoveLog([]); setLastMove(null);
        return;
      }
      // Slightly prefer captures to make it look more like real chess
      const captures = moves.filter(m => board[m.to] !== null);
      const chosen = captures.length > 0 && Math.random() < 0.55
        ? captures[Math.floor(Math.random() * captures.length)]
        : moves[Math.floor(Math.random() * moves.length)];

      const piece = board[chosen.from]!;
      const captured = board[chosen.to];
      const toLabel = `${COL_LABELS[chosen.to % 8]}${8 - Math.floor(chosen.to / 8)}`;
      const notation = `${piece.type === 'P' ? '' : piece.type}${captured ? 'x' : ''}${toLabel}`;

      setMoveLog(lg => [...lg.slice(-5), notation]);
      setLastMove(chosen);
      setBoard(applyMove(board, chosen.from, chosen.to));
      setTurn(t => (t === 'w' ? 'b' : 'w'));
      setMoveCount(c => c + 1);
    }, 1400);
    return () => clearTimeout(timer);
  }, [board, turn, moveCount]);

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {/* Column labels */}
      <div className="flex pl-6">
        {COL_LABELS.map(l => (
          <div key={l} className="w-10 text-center font-mono text-[8px] text-white/20">{l}</div>
        ))}
      </div>

      <div className="flex">
        {/* Row labels */}
        <div className="flex flex-col pr-2">
          {[8, 7, 6, 5, 4, 3, 2, 1].map(n => (
            <div key={n} className="h-10 flex items-center justify-end font-mono text-[8px] text-white/20 w-4">{n}</div>
          ))}
        </div>

        {/* Board */}
        <div
          className="grid border border-white/[0.07] rounded overflow-hidden shadow-[0_0_50px_-8px_rgba(201,168,76,0.2)]"
          style={{ gridTemplateColumns: 'repeat(8, 40px)', gridTemplateRows: 'repeat(8, 40px)' }}
        >
          {board.map((piece, idx) => {
            const row = Math.floor(idx / 8);
            const col = idx % 8;
            const isLight = (row + col) % 2 === 0;
            const isFrom = lastMove?.from === idx;
            const isTo = lastMove?.to === idx;

            return (
              <div
                key={idx}
                className="relative flex items-center justify-center"
                style={{
                  backgroundColor: isFrom
                    ? 'rgba(201,168,76,0.28)'
                    : isTo
                    ? 'rgba(201,168,76,0.18)'
                    : isLight
                    ? '#1d1912'
                    : '#0e0c08',
                }}
              >
                {piece && (
                  <motion.span
                    key={`${idx}-${moveCount}`}
                    initial={isTo ? { scale: 0.5, opacity: 0 } : false}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.25, ease: 'backOut' }}
                    className="text-[21px] leading-none relative z-10 pointer-events-none"
                    style={{
                      color: piece.color === 'w' ? '#f0e6c8' : '#100d06',
                      WebkitTextStroke: piece.color === 'w'
                        ? '0.4px rgba(0,0,0,0.8)'
                        : '0.6px rgba(201,168,76,0.4)',
                      filter: piece.color === 'w'
                        ? 'drop-shadow(0 1px 3px rgba(0,0,0,0.9))'
                        : 'drop-shadow(0 0 4px rgba(201,168,76,0.15))',
                    }}
                  >
                    {UNICODE[piece.color][piece.type]}
                  </motion.span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Status bar */}
      <div className="w-[346px] flex items-center gap-3 px-0.5">
        <motion.div
          key={turn}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`w-2 h-2 rounded-full flex-shrink-0 ${turn === 'w' ? 'bg-[#f0e6c8] shadow-[0_0_8px_rgba(240,230,200,0.6)]' : 'bg-gold/60 shadow-[0_0_8px_rgba(201,168,76,0.5)]'}`}
        />
        <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/25">
          {turn === 'w' ? 'White' : 'Black'} to move
        </span>
        <span className="ml-auto font-mono text-[9px] text-white/15">
          {moveCount} moves
        </span>
      </div>

      {/* Move log */}
      {moveLog.length > 0 && (
        <div className="w-[346px] flex flex-wrap gap-1.5 px-0.5">
          {moveLog.map((m, i) => (
            <span
              key={i}
              className={`font-mono text-[9px] px-2 py-0.5 rounded border transition-colors duration-300 ${
                i === moveLog.length - 1
                  ? 'border-gold/40 text-gold/70 bg-gold/5'
                  : 'border-white/[0.06] text-white/20'
              }`}
            >
              {m}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────────

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePosition({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
  };

  const { scrollY } = useScroll();
  const chessY = useTransform(scrollY, [0, 600], [0, -55]);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505] selection:bg-gold/30 selection:text-gold"
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 z-0 opacity-[0.11]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 72%)',
        }}
      />

      {/* Mouse spotlight */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `radial-gradient(700px circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(201,168,76,0.07), transparent 40%)`,
        }}
      />

      {/* Main content */}
      <div className="relative z-10 max-w-[1200px] w-full px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-6 pt-8">

        {/* ── LEFT: Text ── */}
        <div className="flex-1 flex flex-col justify-center max-w-xl">

          {/* Tag line */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 text-[10px] tracking-[0.25em] uppercase text-gold mb-8 font-mono"
          >
            <span className="w-10 h-[1px] bg-gradient-to-r from-gold to-transparent" />
            Pre-Final Year · DJ Sanghvi
          </motion.div>

          {/* Name */}
          <div className="relative">
            <motion.h1
              initial={{ opacity: 0, filter: 'blur(10px)', y: 24 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
              className="font-display text-[clamp(64px,9vw,118px)] font-bold leading-[0.9] tracking-[-0.03em] text-cream"
            >
              Omkar
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, filter: 'blur(10px)', x: -16 }}
              animate={{ opacity: 1, filter: 'blur(0px)', x: 0 }}
              transition={{ duration: 0.8, delay: 0.55, ease: 'easeOut' }}
              className="font-display text-[clamp(64px,9vw,118px)] leading-[0.9] text-gold italic"
            >
              Haryan<span className="text-white not-italic">.</span>
            </motion.h1>
            {/* Decorative left accent */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: '100%' }}
              transition={{ duration: 1, delay: 0.7 }}
              className="absolute -left-5 top-2 bottom-2 w-[1px] bg-white/10 hidden md:block"
            />
          </div>

          {/* Pitch */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-8 text-[15px] md:text-[17px] text-cream-dim max-w-[420px] leading-[1.75] font-light"
          >
            An engineer who thinks in{' '}
            <span className="text-white border-b border-white/20 pb-0.5">systems</span> and moves like a{' '}
            <span className="text-gold border-b border-gold/20 pb-0.5">knight</span>.
            Bridging raw data engineering and high-level strategy.
          </motion.p>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="mt-10 flex flex-wrap gap-4 items-center"
          >
            <HeroBadge icon={<Database size={13} />} text="Data Science" />
            <HeroBadge icon={<span className="text-[15px] leading-none">♞</span>} text="Strategy" gold />

            {/* Education pill */}
            <div className="w-full md:w-auto md:ml-2 md:pl-5 md:border-l border-white/10 flex items-center gap-3 group cursor-default">
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 group-hover:border-gold/30 transition-colors duration-300">
                <GraduationCap className="text-cream group-hover:text-gold transition-colors duration-300" size={17} />
              </div>
              <div>
                <div className="text-[13px] font-bold text-cream">DJ Sanghvi COE</div>
                <div className="text-[11px] text-cream-dim font-mono mt-0.5">CGPA: 8.82 · 2023–27</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT: Live Chess ── */}
        <motion.div
          style={{ y: chessY }}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.65, ease: 'easeOut' }}
          className="hidden lg:flex flex-col items-center gap-4 flex-shrink-0"
        >
          <p className="font-mono text-[8px] tracking-[0.25em] uppercase text-gold/35">
            Autonomous · Random Engine
          </p>
          <ChessSimulation />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="font-mono text-[9px] text-gold/35 uppercase tracking-[0.2em]">Scroll</span>
        <div className="w-[1px] h-12 bg-white/10 relative overflow-hidden">
          <motion.div
            animate={{ top: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-gold to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}

// ─── Badge helper ──────────────────────────────────────────────────────────────

function HeroBadge({ icon, text, gold = false }: { icon: React.ReactNode; text: string; gold?: boolean }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      className={`
        px-5 py-3 rounded-lg backdrop-blur-md border flex items-center gap-2.5 cursor-default transition-all duration-300
        ${gold
          ? 'bg-gold/5 border-gold/20 hover:bg-gold/10 hover:shadow-[0_0_20px_-5px_rgba(201,168,76,0.3)]'
          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
        }
      `}
    >
      <span className={gold ? 'text-gold' : 'text-blue-400'}>{icon}</span>
      <span className={`text-[12px] tracking-wider uppercase font-medium ${gold ? 'text-gold' : 'text-cream'}`}>
        {text}
      </span>
    </motion.div>
  );
}
