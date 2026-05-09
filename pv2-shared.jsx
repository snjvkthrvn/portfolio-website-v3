// pv2-shared.jsx — constants, hooks, and shared UI components

// ── SECTION CONFIG ───────────────────────────────────────────────────
const SECTIONS_DATA = [
  { id: 'home',        label: 'Home',        accent: 'oklch(68% 0.24 300)' },
  { id: 'algorithmia', label: 'Algorithmia', accent: 'oklch(72% 0.22 195)' },
  { id: 'replay',      label: 'Replay',      accent: 'oklch(68% 0.25 18)'  },
  { id: 'scriptures',  label: 'Scriptures',  accent: 'oklch(75% 0.17 85)'  },
  { id: 'vita',        label: 'Vita',        accent: 'oklch(70% 0.20 150)' },
  { id: 'contact',     label: 'Contact',     accent: 'oklch(65% 0.18 240)' },
];

const BASE = {
  bg:      '#09090f',
  bgMid:   '#111118',
  bgSurf:  '#16161f',
  fg:      '#e6e6f0',
  fgSoft:  '#858598',
  fgFaint: '#2e2e3e',
};

const FONTS = {
  display: "'Playfair Display', ui-serif, Georgia, serif",
  body:    "'Source Serif 4', ui-serif, Georgia, serif",
  mono:    "'JetBrains Mono', ui-monospace, monospace",
};

const PROJECTS = [
  {
    id: 'algorithmia', folio: 'f. 2r',
    title: 'Algorithmia', subtitle: 'The Path of Logic',
    desc: 'A puzzle-adventure game teaching twelve algorithm concepts through play. 47 tests, one event bus, a branching dialogue system.',
    tags: ['TypeScript', 'Phaser 3', 'Vite', 'Vitest'],
    accent: 'oklch(72% 0.22 195)',
  },
  {
    id: 'replay', folio: 'f. 2v',
    title: 'Replay', subtitle: null,
    desc: 'Social music sharing bounded to four daily windows. Real-time via Socket.IO. One post per window keeps it honest.',
    tags: ['React Native', 'Node', 'PostgreSQL', 'Redis', 'Socket.IO'],
    accent: 'oklch(68% 0.25 18)',
  },
  {
    id: 'scriptures', folio: 'f. 3r',
    title: 'Hindu Scriptures RAG', subtitle: null,
    desc: 'Hybrid retrieval over ≈200k verses from 15+ texts. Cohere dense + BM25 sparse, fused. A ReAct loop on top.',
    tags: ['Python', 'Qdrant', 'Cohere', 'Flask', 'Anthropic'],
    accent: 'oklch(75% 0.17 85)',
  },
];

// ── SCRAMBLE TEXT HOOK ───────────────────────────────────────────────
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
function useScramble(text, active) {
  const [out, setOut] = React.useState('');
  React.useEffect(() => {
    if (!active) { setOut(text); return; }
    let frame = 0;
    const total = text.length * 3 + 28;
    let raf;
    const tick = () => {
      frame++;
      const revealed = Math.floor((frame / total) * text.length);
      const result = text.split('').map((ch, i) => {
        if (i < revealed || ch === ' ') return ch;
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }).join('');
      setOut(result);
      if (frame < total) raf = requestAnimationFrame(tick);
      else setOut(text);
    };
    const t = setTimeout(() => { raf = requestAnimationFrame(tick); }, 350);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); };
  }, [text, active]);
  return out || text.replace(/\S/g, '▓');
}

// ── CURSOR ───────────────────────────────────────────────────────────
function useCursorPos() {
  const mouse  = React.useRef({ x: -300, y: -300 });
  const lagRef = React.useRef({ x: -300, y: -300 });
  const [dot,  setDot]  = React.useState({ x: -300, y: -300 });
  const [ring, setRing] = React.useState({ x: -300, y: -300 });
  const [big,  setBig]  = React.useState(false);

  React.useEffect(() => {
    const onMove = e => { mouse.current = { x: e.clientX, y: e.clientY }; };
    const onOver = e => { if (e.target.closest('a,button,[data-hover]')) setBig(true);  };
    const onOut  = e => { if (e.target.closest('a,button,[data-hover]')) setBig(false); };
    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout',  onOut);
    let raf;
    const loop = () => {
      setDot({ ...mouse.current });
      lagRef.current.x += (mouse.current.x - lagRef.current.x) * 0.11;
      lagRef.current.y += (mouse.current.y - lagRef.current.y) * 0.11;
      setRing({ x: lagRef.current.x, y: lagRef.current.y });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout',  onOut);
      cancelAnimationFrame(raf);
    };
  }, []);
  return { dot, ring, big };
}

function Cursor({ accent }) {
  const { dot, ring, big } = useCursorPos();
  const sz = big ? 48 : 30;
  return (
    <>
      <div style={{
        position: 'fixed', pointerEvents: 'none', zIndex: 9999,
        width: 6, height: 6, borderRadius: '50%',
        background: accent, left: dot.x - 3, top: dot.y - 3,
        transition: 'background 400ms ease',
      }} />
      <div style={{
        position: 'fixed', pointerEvents: 'none', zIndex: 9998,
        width: sz, height: sz, borderRadius: '50%',
        border: `1.5px solid ${accent}`,
        left: ring.x - sz / 2, top: ring.y - sz / 2,
        opacity: 0.55,
        transition: 'width 200ms ease, height 200ms ease, border-color 400ms ease',
      }} />
    </>
  );
}

// ── SCROLL REVEAL ────────────────────────────────────────────────────
function Reveal({ children, delay = 0, dir = 'up' }) {
  const ref = React.useRef(null);
  const [vis, setVis] = React.useState(false);
  React.useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const T = {
    up:    vis ? 'translateY(0)' : 'translateY(38px)',
    left:  vis ? 'translateX(0)' : 'translateX(-38px)',
    right: vis ? 'translateX(0)' : 'translateX(38px)',
    scale: vis ? 'scale(1)'      : 'scale(0.92)',
  };
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: T[dir] || T.up,
      transition: `opacity 700ms cubic-bezier(0.19,1,0.22,1) ${delay}ms,
                   transform 700ms cubic-bezier(0.19,1,0.22,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ── PARALLAX HOOK ────────────────────────────────────────────────────
function useParallax(speed = 0.25) {
  const [y, setY] = React.useState(0);
  React.useEffect(() => {
    const fn = () => setY(window.scrollY * speed);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, [speed]);
  return y;
}

// ── GLITCH TEXT ──────────────────────────────────────────────────────
function GlitchText({ children, accent, style: sx = {} }) {
  const [g, setG] = React.useState(false);
  React.useEffect(() => {
    const id = setInterval(() => {
      setG(true);
      setTimeout(() => setG(false), 150);
    }, 3800 + Math.random() * 3500);
    return () => clearInterval(id);
  }, []);
  return (
    <span style={{ position: 'relative', display: 'inline-block', ...sx }}>
      <span style={{ opacity: g ? 0.82 : 1 }}>{children}</span>
      {g && <>
        <span style={{ position: 'absolute', inset: 0, color: 'oklch(72% 0.3 195)', clipPath: 'inset(22% 0 52% 0)', left: '-3px', pointerEvents: 'none' }}>{children}</span>
        <span style={{ position: 'absolute', inset: 0, color: accent,               clipPath: 'inset(62% 0 12% 0)', left: '3px',  pointerEvents: 'none' }}>{children}</span>
      </>}
    </span>
  );
}

// ── COUNTER HOOK (animates number on reveal) ─────────────────────────
function useCounter(target, active, duration = 1400) {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (!active) return;
    let start = null;
    let raf;
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.round(p * p * target)); // easeInQuad
      if (p < 1) raf = requestAnimationFrame(tick);
      else setVal(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return val;
}

// ── 3D TILT PROJECT CARD ─────────────────────────────────────────────
function ProjectCard({ project, onScrollTo }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 12;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * -12;
      el.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${y}deg) translateY(-8px)`;
    };
    const onLeave = () => { el.style.transform = ''; };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, []);

  return (
    <div ref={ref} onClick={() => onScrollTo(project.id)} data-hover
      style={{
        background: BASE.bgSurf, border: `1px solid ${BASE.fgFaint}`,
        padding: '2rem 1.75rem', cursor: 'pointer',
        transition: 'transform 500ms cubic-bezier(0.19,1,0.22,1), border-color 300ms ease, box-shadow 400ms ease',
        transformStyle: 'preserve-3d',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = project.accent;
        e.currentTarget.style.boxShadow = `0 28px 60px ${project.accent}1a`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = BASE.fgFaint;
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <span style={{ fontFamily: FONTS.mono, fontSize: '0.58rem', color: project.accent, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{project.folio}</span>
        <span style={{ fontFamily: FONTS.mono, fontSize: '0.7rem', color: BASE.fgFaint, transition: 'color 200ms ease' }}>→</span>
      </div>
      <h3 style={{ fontFamily: FONTS.display, fontSize: '1.65rem', color: BASE.fg, lineHeight: 1.1, margin: '0 0 0.4rem' }}>{project.title}</h3>
      {project.subtitle && <p style={{ fontFamily: FONTS.display, fontStyle: 'italic', fontSize: '0.95rem', color: BASE.fgSoft, marginBottom: '0.7rem' }}>{project.subtitle}</p>}
      <p style={{ fontFamily: FONTS.body, fontSize: '0.875rem', color: BASE.fgSoft, lineHeight: 1.65, marginBottom: '1.5rem' }}>{project.desc}</p>
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        {project.tags.map(t => (
          <span key={t} style={{ fontFamily: FONTS.mono, fontSize: '0.56rem', letterSpacing: '0.06em', textTransform: 'lowercase', color: BASE.fgFaint, border: `1px solid ${BASE.fgFaint}`, padding: '0.2rem 0.5rem' }}>{t}</span>
        ))}
      </div>
      <div style={{ marginTop: '1.5rem', fontFamily: FONTS.mono, fontSize: '0.62rem', color: project.accent, letterSpacing: '0.08em' }}>
        read the folio →
      </div>
    </div>
  );
}

Object.assign(window, {
  SECTIONS_DATA, BASE, FONTS, PROJECTS,
  useScramble, useCursorPos, Cursor,
  Reveal, useParallax, GlitchText, useCounter, ProjectCard,
});
