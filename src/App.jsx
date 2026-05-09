import React from 'react';
// pv2-shared.jsx — constants, hooks, and shared UI components

// ── SECTION CONFIG ───────────────────────────────────────────────────
const SECTIONS_DATA = [
  { id: 'home',        label: 'Home',         accent: 'oklch(68% 0.24 300)' },
  { id: 'algorithmia', label: 'Algorithmia',  accent: 'oklch(72% 0.22 195)' },
  { id: 'replay',      label: 'Replay',       accent: 'oklch(68% 0.25 18)'  },
  { id: 'scriptures',  label: 'Scriptures',   accent: 'oklch(75% 0.17 85)'  },
  { id: 'eightball',   label: 'Magic 8-Ball', accent: 'oklch(70% 0.18 280)' },
  { id: 'about',       label: 'About',        accent: 'oklch(70% 0.20 150)' },
  { id: 'contact',     label: 'Contact',      accent: 'oklch(65% 0.18 240)' },
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
  retro:   "'Press Start 2P', monospace",
};

const PROJECTS = [
  {
    id: 'algorithmia', kind: 'Game',
    title: 'Algorithmia', subtitle: 'The Path of Logic',
    desc: 'A puzzle-adventure game that teaches twelve algorithm concepts through play. 47 unit tests, an event bus, and a branching dialogue system.',
    tags: ['TypeScript', 'Phaser 3', 'Vite', 'Vitest'],
    accent: 'oklch(72% 0.22 195)',
    live: null,
  },
  {
    id: 'replay', kind: 'Mobile App',
    title: 'Replay', subtitle: 'Social music, four times a day',
    desc: 'Cross-platform music sharing app limited to four daily windows. Real-time over Socket.IO, smart caching cuts Spotify calls ~40%.',
    tags: ['React Native', 'Node', 'PostgreSQL', 'Redis', 'Socket.IO'],
    accent: 'oklch(68% 0.25 18)',
    live: null,
  },
  {
    id: 'scriptures', kind: 'AI / RAG',
    title: 'Hindu Scriptures RAG', subtitle: 'Search 200k verses',
    desc: 'A retrieval engine over 200k+ verses from 15+ Hindu texts. Hybrid search (Cohere dense + BM25), agentic ReAct loop on top. Live demo.',
    tags: ['Python', 'Qdrant', 'Cohere', 'Flask', 'Anthropic'],
    accent: 'oklch(75% 0.17 85)',
    live: 'https://hindu-rag.up.railway.app/',
  },
  {
    id: 'eightball', kind: 'AI / Web',
    title: 'AI Magic 8-Ball', subtitle: 'Ask it anything',
    desc: 'A take on the classic toy: ask it anything and an LLM answers in true 8-ball style. Built and deployed on Vercel.',
    tags: ['Next.js', 'TypeScript', 'LLM', 'Vercel'],
    accent: 'oklch(70% 0.18 280)',
    live: 'https://ai-8ball.vercel.app/',
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
        height: '100%',
        display: 'flex', flexDirection: 'column',
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
        <span style={{ fontFamily: FONTS.mono, fontSize: '0.58rem', color: project.accent, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{project.kind}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {project.live && (
            <span style={{ fontFamily: FONTS.mono, fontSize: '0.55rem', color: project.accent, letterSpacing: '0.1em', textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: project.accent, boxShadow: `0 0 6px ${project.accent}` }} />
              live
            </span>
          )}
          <span style={{ fontFamily: FONTS.mono, fontSize: '0.7rem', color: BASE.fgFaint, transition: 'color 200ms ease' }}>→</span>
        </span>
      </div>
      <h3 style={{ fontFamily: FONTS.display, fontSize: '1.65rem', color: BASE.fg, lineHeight: 1.1, margin: '0 0 0.4rem' }}>{project.title}</h3>
      <p style={{ fontFamily: FONTS.display, fontStyle: 'italic', fontSize: '0.95rem', color: BASE.fgSoft, marginBottom: '0.7rem', minHeight: '1.4em' }}>{project.subtitle || '\u00A0'}</p>
      <p style={{ fontFamily: FONTS.body, fontSize: '0.875rem', color: BASE.fgSoft, lineHeight: 1.65, marginBottom: '1.5rem' }}>{project.desc}</p>
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: 'auto' }}>
        {project.tags.map(t => (
          <span key={t} style={{ fontFamily: FONTS.mono, fontSize: '0.56rem', letterSpacing: '0.06em', textTransform: 'lowercase', color: BASE.fgFaint, border: `1px solid ${BASE.fgFaint}`, padding: '0.2rem 0.5rem' }}>{t}</span>
        ))}
      </div>
      <div style={{ marginTop: '1.5rem', fontFamily: FONTS.mono, fontSize: '0.62rem', color: project.accent, letterSpacing: '0.08em' }}>
        view project →
      </div>
    </div>
  );
}

// ── LIVE SITE PREVIEW ────────────────────────────────────────────────
// A browser-chrome frame that lazy-loads the real deployed site in an
// iframe once it scrolls into view. Click-to-load is preserved as a
// fallback so X-Frame-Options sites still get a decent preview.
function LiveSitePreview({ url, accent, label, height = 520, aspect = null }) {
  const ref = React.useRef(null);
  const [inView, setInView]   = React.useState(false);
  const [loaded, setLoaded]   = React.useState(false);
  const [loadStarted, setLoadStarted] = React.useState(false);

  React.useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.25, rootMargin: '0px 0px -10% 0px' }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  // Stagger actual iframe load so it doesn't compete with reveal animations.
  React.useEffect(() => {
    if (!inView || loadStarted) return;
    const t = setTimeout(() => setLoadStarted(true), 250);
    return () => clearTimeout(t);
  }, [inView, loadStarted]);

  const host = (() => { try { return new URL(url).host; } catch { return url; } })();

  return (
    <div ref={ref} style={{
      position: 'relative',
      borderRadius: 10,
      overflow: 'hidden',
      background: BASE.bgSurf,
      border: `1px solid ${BASE.fgFaint}`,
      boxShadow: `0 30px 80px -20px rgba(0,0,0,0.55), 0 0 0 1px ${accent}22, 0 0 60px -10px ${accent}33`,
    }}>
      {/* Browser chrome */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '0.65rem 0.9rem',
        background: 'oklch(15% 0.012 270)',
        borderBottom: `1px solid ${BASE.fgFaint}`,
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f57' }} />
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#febc2e' }} />
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#28c840' }} />
        </div>
        <div style={{
          flex: 1,
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.3rem 0.7rem',
          background: BASE.bg,
          borderRadius: 6,
          fontFamily: FONTS.mono, fontSize: '0.65rem',
          color: BASE.fgSoft,
          minWidth: 0,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: loaded ? accent : BASE.fgFaint, boxShadow: loaded ? `0 0 6px ${accent}` : 'none', flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>https://{host}</span>
        </div>
        <a href={url} target="_blank" rel="noreferrer" data-hover style={{
          fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.08em',
          textTransform: 'lowercase', color: accent, textDecoration: 'none',
          padding: '0.25rem 0.6rem', border: `1px solid ${accent}55`,
          borderRadius: 4, transition: 'background 200ms ease',
          flexShrink: 0,
        }}
        onMouseEnter={e => e.currentTarget.style.background = `${accent}22`}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >open ↗</a>
      </div>

      {/* Iframe stage */}
      <div style={{
        position: 'relative',
        width: '100%',
        ...(aspect ? { aspectRatio: aspect } : { height }),
        background: '#fff',
      }}>
        {loadStarted && (
          <iframe
            src={url}
            title={label || host}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            style={{ width: '100%', height: '100%', border: 0, display: 'block', opacity: loaded ? 1 : 0, transition: 'opacity 500ms ease' }}
          />
        )}

        {/* Loader / placeholder overlay */}
        {!loaded && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: '1rem',
            background: BASE.bg,
            color: BASE.fgSoft,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              border: `2px solid ${BASE.fgFaint}`,
              borderTopColor: accent,
              animation: 'lsp-spin 0.9s linear infinite',
            }} />
            <p style={{ fontFamily: FONTS.mono, fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'lowercase' }}>
              {loadStarted ? 'loading live site…' : 'preparing preview…'}
            </p>
            <p style={{ fontFamily: FONTS.body, fontSize: '0.78rem', color: BASE.fgFaint, maxWidth: 280, textAlign: 'center', lineHeight: 1.5 }}>
              If the embed is blocked, use the <span style={{ color: accent }}>open ↗</span> button to view the site directly.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes lsp-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ── MAGNETIC HOVER (subtle pull toward cursor) ───────────────────────
function Magnetic({ children, strength = 0.35, className }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) * strength;
      const dy = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    const onLeave = () => { el.style.transform = ''; };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, [strength]);
  return <span ref={ref} className={className} style={{ display: 'inline-block', transition: 'transform 320ms cubic-bezier(0.19,1,0.22,1)' }}>{children}</span>;
}

// ── SCROLL PROGRESS BAR (top of viewport) ────────────────────────────
function ScrollProgress({ accent }) {
  const [p, setP] = React.useState(0);
  React.useEffect(() => {
    const fn = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? window.scrollY / max : 0);
    };
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    window.addEventListener('resize', fn);
    return () => { window.removeEventListener('scroll', fn); window.removeEventListener('resize', fn); };
  }, []);
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 101, pointerEvents: 'none' }}>
      <div style={{
        height: '100%', width: `${p * 100}%`,
        background: `linear-gradient(90deg, transparent, ${accent}, ${accent})`,
        boxShadow: `0 0 12px ${accent}`,
        transition: 'background 400ms ease',
      }} />
    </div>
  );
}

// ── SPLIT TEXT REVEAL (letter-by-letter on view) ─────────────────────
function SplitText({ text, delay = 0, stagger = 22, style: sx = {}, as: Tag = 'span' }) {
  const ref = React.useRef(null);
  const [vis, setVis] = React.useState(false);
  React.useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <Tag ref={ref} style={{ display: 'inline-block', ...sx }}>
      {text.split('').map((ch, i) => (
        <span key={i} style={{
          display: 'inline-block',
          opacity: vis ? 1 : 0,
          transform: vis ? 'translateY(0) rotate(0deg)' : 'translateY(0.6em) rotate(6deg)',
          transition: `opacity 600ms cubic-bezier(0.19,1,0.22,1) ${delay + i * stagger}ms,
                       transform 700ms cubic-bezier(0.19,1,0.22,1) ${delay + i * stagger}ms`,
          whiteSpace: ch === ' ' ? 'pre' : 'normal',
        }}>{ch}</span>
      ))}
    </Tag>
  );
}

// ── MARQUEE TICKER (horizontal looping belt) ─────────────────────────
function Marquee({ items, accent, speed = 28 }) {
  const content = (
    <span style={{ display: 'inline-flex', gap: '3rem', alignItems: 'center', paddingRight: '3rem' }}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          <span style={{
            fontFamily: FONTS.display, fontStyle: 'italic',
            fontSize: 'clamp(2rem, 1.5rem + 3vw, 4.5rem)',
            color: BASE.fg, letterSpacing: '-0.02em', whiteSpace: 'nowrap',
          }}>{it}</span>
          <span style={{
            width: 10, height: 10, borderRadius: '50%',
            background: accent, boxShadow: `0 0 14px ${accent}`,
            flexShrink: 0,
          }} />
        </React.Fragment>
      ))}
    </span>
  );
  return (
    <div style={{
      position: 'relative',
      padding: '2rem 0',
      background: BASE.bg,
      overflow: 'hidden',
      borderTop: `1px solid ${BASE.fgFaint}`,
      borderBottom: `1px solid ${BASE.fgFaint}`,
    }}>
      <style>{`
        @keyframes mq-roll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .mq-track { animation: mq-roll ${speed}s linear infinite !important; }
        @media (prefers-reduced-motion: reduce) {
          .mq-track { animation: mq-roll ${speed}s linear infinite !important; }
        }
      `}</style>
      <div className="mq-track" style={{ display: 'inline-flex', whiteSpace: 'nowrap' }}>
        {content}{content}
      </div>
    </div>
  );
}

// ── ANIMATED DIVIDER (drawing line + traveling dot) ──────────────────
function AnimatedDivider({ accent }) {
  const ref = React.useRef(null);
  const [vis, setVis] = React.useState(false);
  React.useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ position: 'relative', height: 1, width: '100%', background: BASE.fgFaint, overflow: 'visible' }}>
      <style>{`@keyframes ad-dot { 0%,100% { left: 0%; } 50% { left: calc(100% - 8px); } }`}</style>
      <div style={{
        position: 'absolute', left: 0, top: 0, height: '100%',
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        width: vis ? '100%' : '0%',
        transition: 'width 1400ms cubic-bezier(0.19,1,0.22,1)',
      }} />
      {vis && <div style={{
        position: 'absolute', top: -3, width: 8, height: 8, borderRadius: '50%',
        background: accent, boxShadow: `0 0 12px ${accent}`,
        animation: 'ad-dot 6s ease-in-out infinite',
      }} />}
    </div>
  );
}

// ── GRAIN / NOISE OVERLAY ────────────────────────────────────────────
function Grain() {
  return (
    <div aria-hidden="true" style={{
      position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50,
      mixBlendMode: 'overlay', opacity: 0.06,
      backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"160\\" height=\\"160\\"><filter id=\\"n\\"><feTurbulence type=\\"fractalNoise\\" baseFrequency=\\"0.85\\" numOctaves=\\"2\\" stitchTiles=\\"stitch\\"/></filter><rect width=\\"100%25\\" height=\\"100%25\\" filter=\\"url(%23n)\\"/></svg>")',
    }} />
  );
}

Object.assign(window, {
  SECTIONS_DATA, BASE, FONTS, PROJECTS,
  useScramble, useCursorPos, Cursor,
  Reveal, useParallax, GlitchText, useCounter, ProjectCard,
  LiveSitePreview,
  Magnetic, ScrollProgress, SplitText, Marquee, AnimatedDivider, Grain,
});

// pv2-sections.jsx — all six sections

const G = 'clamp(1.5rem, 4vw, 5rem)';

// ── ANIMATED WAVEFORM (Replay) ───────────────────────────────────────
function AnimatedWaveform({ color }) {
  const [phase, setPhase] = React.useState(0);
  React.useEffect(() => {
    let raf;
    const tick = () => { setPhase(p => p + 0.028); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const pts = Array.from({ length: 97 }, (_, i) => {
    const x = (i / 96) * 960;
    const y = 30 + Math.sin(i * 0.42 + phase) * 14 + Math.sin(i * 1.1 + phase * 1.6) * 6 + Math.sin(i * 2.4 + phase * 0.8) * 3;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg viewBox="0 0 960 60" style={{ width: '100%', height: 36, display: 'block' }} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" opacity="0.35" />
    </svg>
  );
}

// ── FLOATING PARTICLES (Scriptures) ─────────────────────────────────
function FloatingParticles({ color }) {
  const particles = React.useMemo(() => Array.from({ length: 22 }, (_, i) => ({
    id: i,
    left: `${5 + Math.random() * 90}%`,
    top:  `${10 + Math.random() * 80}%`,
    size: 2 + Math.random() * 3,
    duration: 4 + Math.random() * 5,
    delay: Math.random() * 6,
  })), []);
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute', left: p.left, top: p.top,
          width: p.size, height: p.size, borderRadius: '50%',
          background: color, opacity: 0,
          animation: `ptcl ${p.duration}s ease-in-out ${p.delay}s infinite`,
        }} />
      ))}
    </div>
  );
}

// ── SKILL BAR ────────────────────────────────────────────────────────
function SkillBar({ label, pct, accent, active, delay = 0 }) {
  return (
    <div style={{ marginBottom: '0.9rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
        <span style={{ fontFamily: FONTS.mono, fontSize: '0.62rem', color: BASE.fgSoft, letterSpacing: '0.06em', textTransform: 'lowercase' }}>{label}</span>
        <span style={{ fontFamily: FONTS.mono, fontSize: '0.62rem', color: BASE.fgFaint }}>{pct}%</span>
      </div>
      <div style={{ height: 2, background: BASE.fgFaint, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, height: '100%',
          background: accent, width: active ? `${pct}%` : '0%',
          transition: active ? `width 1100ms cubic-bezier(0.19,1,0.22,1) ${delay}ms` : 'none',
          boxShadow: active ? `0 0 8px ${accent}88` : 'none',
        }} />
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// HERO SECTION
// ════════════════════════════════════════════════════════════════════
function HeroSection({ onScrollTo }) {
  const [ready, setReady] = React.useState(false);
  const name = useScramble('Sanjeev Kathiravan', ready);
  const py   = useParallax(0.22);

  React.useEffect(() => { const t = setTimeout(() => setReady(true), 200); return () => clearTimeout(t); }, []);

  return (
    <section id="home" style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `6rem ${G} 4rem`, overflow: 'hidden' }}>
      {/* Animated blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', left: '20%', top: '30%', width: 500, height: 500, borderRadius: '50%', background: 'oklch(68% 0.24 300)', filter: 'blur(100px)', opacity: 0.12, animation: 'blob-a 14s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', left: '70%', top: '20%', width: 400, height: 400, borderRadius: '50%', background: 'oklch(68% 0.25 18)',  filter: 'blur(90px)',  opacity: 0.10, animation: 'blob-b 17s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', left: '50%', top: '70%', width: 450, height: 450, borderRadius: '50%', background: 'oklch(72% 0.22 195)', filter: 'blur(110px)', opacity: 0.08, animation: 'blob-c 11s ease-in-out infinite' }} />
      </div>

      {/* Parallax content */}
      <div style={{ position: 'relative', zIndex: 1, transform: `translateY(${-py}px)`, maxWidth: 1100 }}>
        <div style={{ opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(10px)', transition: 'opacity 600ms ease 100ms, transform 600ms ease 100ms' }}>
          <p style={{ fontFamily: FONTS.mono, fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: BASE.fgSoft, marginBottom: '1.75rem' }}>
            software engineer · ai · full-stack
          </p>
        </div>

        {/* Scramble name */}
        <h1 style={{
          fontFamily: FONTS.display, fontWeight: 700,
          fontSize: 'clamp(3.5rem, 2rem + 7vw, 9rem)',
          lineHeight: 0.92, letterSpacing: '-0.03em',
          color: BASE.fg, margin: 0, marginBottom: '1.75rem',
          fontVariantNumeric: 'normal',
        }}>
          {name}
        </h1>

        <div style={{ opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(16px)', transition: 'opacity 700ms ease 900ms, transform 700ms ease 900ms', maxWidth: '52ch', marginBottom: '4rem' }}>
          <p style={{ fontFamily: FONTS.body, fontSize: 'clamp(1rem, 0.85rem + 0.8vw, 1.3rem)', color: BASE.fgSoft, lineHeight: 1.6, fontStyle: 'italic' }}>
            Recent Rutgers CS &amp; Data Science graduate. I build games, mobile apps, and AI tools — four of them are below.
          </p>
        </div>

        {/* Project cards with stagger */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1px', background: BASE.fgFaint }}>
          {PROJECTS.map((p, i) => (
            <div key={p.id} style={{ display: 'flex', opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(24px)', transition: `opacity 700ms ease ${1200 + i * 140}ms, transform 700ms ease ${1200 + i * 140}ms` }}>
              <ProjectCard project={p} onScrollTo={onScrollTo} />
            </div>
          ))}
        </div>

        {/* View all projects button */}
        <div style={{
          opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(16px)',
          transition: `opacity 700ms ease ${1800}ms, transform 700ms ease ${1800}ms`,
          marginTop: '2.5rem', display: 'flex', justifyContent: 'center',
        }}>
          <button onClick={() => onScrollTo('more-work')} data-hover
            style={{
              background: 'transparent', border: `1px solid ${BASE.fgFaint}`,
              color: BASE.fg, fontFamily: FONTS.mono, fontSize: '0.7rem',
              letterSpacing: '0.18em', textTransform: 'uppercase',
              padding: '0.95rem 1.75rem', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '0.85rem',
              transition: 'border-color 250ms ease, color 250ms ease, background 250ms ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'oklch(68% 0.24 300)';
              e.currentTarget.style.color = 'oklch(80% 0.18 300)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = BASE.fgFaint;
              e.currentTarget.style.color = BASE.fg;
            }}
          >
            view all projects
            <span style={{ fontSize: '0.85rem', letterSpacing: 0 }}>↓</span>
          </button>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
        fontFamily: FONTS.mono, fontSize: '0.58rem', color: BASE.fgFaint, letterSpacing: '0.12em',
        textTransform: 'lowercase', opacity: ready ? 1 : 0, transition: 'opacity 800ms ease 2200ms',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
      }}>
        scroll
        <div style={{ width: 1, height: 28, background: `linear-gradient(${BASE.fgFaint}, transparent)` }} />
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════
// ALGORITHMIA SECTION
// ════════════════════════════════════════════════════════════════════
function AlgorithmiaSection() {
  const accent = SECTIONS_DATA[1].accent;
  const statsRef = React.useRef(null);
  const [statsVis, setStatsVis] = React.useState(false);
  React.useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStatsVis(true); obs.disconnect(); } }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);
  const c1 = useCounter(12, statsVis);
  const c2 = useCounter(47, statsVis, 1600);
  const c3 = useCounter(20, statsVis, 800);

  return (
    <section id="algorithmia" style={{ position: 'relative', minHeight: '100vh', padding: `clamp(4rem,8vw,8rem) ${G}`, overflow: 'hidden',
      backgroundColor: BASE.bg,
      backgroundImage: 'radial-gradient(circle, rgba(60,100,210,0.28) 1px, transparent 1px)',
      backgroundSize: '28px 28px',
    }}>
      {/* Scanline */}
      <div style={{ position: 'absolute', left: 0, right: 0, height: '1px', background: `linear-gradient(90deg, transparent, ${accent}44, transparent)`, animation: 'scanline 8s linear infinite', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1000, position: 'relative', zIndex: 1 }}>
        <Reveal>
          <p style={{ fontFamily: FONTS.retro, fontSize: '0.55rem', color: accent, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            {'>'} 01 · GAME · TS · PHASER 3
          </p>
          <h2 style={{ fontFamily: FONTS.retro, fontWeight: 400, fontSize: 'clamp(1.75rem,1.2rem + 3vw,3.75rem)', lineHeight: 1.05, color: '#e0f8d0', textShadow: '0 0 0 #081820, 3px 3px 0 rgba(8,24,32,0.9)', margin: '0 0 1rem', letterSpacing: '0.02em' }}>
            <GlitchText accent={accent}>ALGORITHMIA</GlitchText>
          </h2>
          <p style={{ fontFamily: FONTS.retro, fontSize: 'clamp(0.7rem,0.55rem + 0.5vw,1rem)', color: '#88c070', marginBottom: '3rem', letterSpacing: '0.02em' }}>
            THE PATH OF LOGIC
          </p>
        </Reveal>

        {/* Stat counters */}
        <div ref={statsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: BASE.fgFaint, marginBottom: '4rem' }}>
          {[
            { val: c1, label: 'algorithm concepts', suffix: '' },
            { val: c3, label: 'puzzles', suffix: '≈' },
            { val: c2, label: 'tests passing', suffix: '' },
          ].map(({ val, label, suffix }) => (
            <div key={label} style={{ background: BASE.bgSurf, padding: '2rem 1.5rem' }}>
              <div style={{ fontFamily: FONTS.retro, fontSize: 'clamp(1.5rem,1.2rem + 1.2vw,2.5rem)', color: accent, lineHeight: 1.1, letterSpacing: '0.02em' }}>
                {suffix}{val}
              </div>
              <div style={{ fontFamily: FONTS.retro, fontSize: '0.5rem', color: BASE.fgFaint, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '0.85rem', lineHeight: 1.6 }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,15rem)', gap: 'clamp(2rem,3vw,4rem)', alignItems: 'start' }}>
          <div>
            {[
              ['the idea', 'A puzzle-adventure game where the mechanics are the algorithms. Sorting puzzles are lanes you have to arrange objects through; you can\u2019t progress until you actually understand what the algorithm is doing. Twelve concepts covered, from sorting to memoization.'],
              ['what I built', 'Ten modular systems in TypeScript, all talking through a typed pub/sub event bus. Save state lives in localStorage with a versioning and migration layer. The audio engine crossfades tracks and pools samples. A branching dialogue system drives the story.'],
              ['what I learned', 'Teaching something interactively is harder, and more honest, than writing about it. I rewrote the sliding-window tutorial three times before I realized my mental model was off \u2014 the simulation kept disagreeing with my words, and the simulation was right.'],
            ].map(([head, body], i) => (
              <Reveal key={head} delay={i * 120}>
                <div style={{ marginBottom: '2.5rem' }}>
                  <p style={{ fontFamily: FONTS.mono, fontSize: '0.66rem', color: accent, letterSpacing: '0.1em', marginBottom: '0.65rem' }}><span style={{ color: BASE.fgFaint }}>// </span>{head}</p>
                  <p style={{ fontFamily: FONTS.body, fontSize: '1rem', color: BASE.fgSoft, lineHeight: 1.7, maxWidth: '58ch' }}>{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal dir="right">
            <div style={{ background: BASE.bgSurf, border: `1px solid ${BASE.fgFaint}`, padding: '1.25rem', fontFamily: FONTS.mono, fontSize: '0.62rem' }}>
              <div style={{ fontFamily: FONTS.retro, fontSize: '0.55rem', color: accent, marginBottom: '0.9rem', paddingBottom: '0.85rem', borderBottom: `1px solid ${BASE.fgFaint}`, textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.6 }}>{'>'} PROJECT DETAILS</div>
              <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {[['stack','TypeScript · Phaser 3 · Vite · Vitest'],['status','in active development'],['systems','pub/sub bus · save migrations · pooled audio'],['repo','github.com/snjvkthrvn/algorithmia']].map(([k,v]) => (
                  <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <dt style={{ fontFamily: FONTS.retro, fontSize: '0.5rem', color: BASE.fgFaint, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.4 }}>{k}</dt>
                    <dd style={{ margin: 0, color: BASE.fg, lineHeight: 1.5, wordBreak: 'break-word' }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════
// REPLAY SECTION
// ════════════════════════════════════════════════════════════════════
function ReplaySection() {
  const accent = SECTIONS_DATA[2].accent;
  const segments = [
    { time: '06–10', name: 'morning',   desc: 'Commute. First light.' },
    { time: '11–14', name: 'midday',    desc: 'Background, a break.' },
    { time: '15–19', name: 'afternoon', desc: 'Wind-down, drive home.' },
    { time: '20–00', name: 'night',     desc: 'The closing hour.' },
  ];
  return (
    <section id="replay" style={{ minHeight: '100vh', padding: `clamp(4rem,8vw,8rem) ${G}`, background: 'oklch(13% 0.035 295)' }}>
      <div style={{ maxWidth: 1000 }}>
        <Reveal>
          <p style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: BASE.fgSoft, marginBottom: '1.25rem' }}>
            02 · mobile app · react native · node · postgres · redis · socket.io
          </p>
          <h2 style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: 'clamp(4rem,3rem + 6vw,11rem)', lineHeight: 0.9, letterSpacing: '-0.035em', color: BASE.fg, margin: 0 }}>
            Replay
          </h2>
          <AnimatedWaveform color={accent} />
          <p style={{ fontFamily: FONTS.body, fontStyle: 'italic', fontSize: '1.15rem', color: BASE.fgSoft, marginTop: '0.25rem', marginBottom: '3rem', maxWidth: '44ch' }}>
            Social music sharing, but only four times a day.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'oklch(25% 0.04 295)', marginBottom: '4rem' }}>
            {segments.map((s, i) => (
              <div key={s.name} style={{ background: i === 3 ? 'oklch(20% 0.04 295)' : 'oklch(17% 0.038 295)', padding: '1.25rem 1rem', borderTop: i === 3 ? `2px solid ${accent}` : '2px solid transparent' }}>
                <div style={{ fontFamily: FONTS.mono, fontSize: '0.58rem', color: accent, letterSpacing: '0.1em', marginBottom: '0.4rem' }}>{s.time}</div>
                <div style={{ fontFamily: FONTS.display, fontSize: '1.1rem', color: BASE.fg, marginBottom: '0.35rem' }}>{s.name}</div>
                <div style={{ fontFamily: FONTS.body, fontSize: '0.78rem', color: BASE.fgSoft, lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,15rem)', gap: 'clamp(2rem,3vw,4rem)', alignItems: 'start' }}>
          <div>
            {[
              ['the constraint', 'Sharing is limited to four time windows a day. A post is current inside its window, archived once it closes. Capping users at one post per window per day turned out to be the whole point \u2014 when you can\u2019t spam, you actually pick something good.'],
              ['the build', 'React Native + Expo, shipping iOS, Android, and web from one codebase. Express + Prisma + Postgres on the back end, Redis caching Spotify responses and running a job queue. Realtime over Socket.IO with Firebase Cloud Messaging as a push fallback. Targeted cache invalidation cut Spotify API calls by ~40%.'],
            ].map(([head, body], i) => (
              <Reveal key={head} delay={i * 120}>
                <div style={{ marginBottom: '2.5rem' }}>
                  <h3 style={{ fontFamily: FONTS.display, fontSize: '1.6rem', color: BASE.fg, margin: '0 0 0.65rem', fontWeight: 500 }}>{head}</h3>
                  <p style={{ fontFamily: FONTS.body, fontSize: '1rem', color: BASE.fgSoft, lineHeight: 1.7, maxWidth: '58ch' }}>{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal dir="right">
            <div style={{ borderLeft: `2px solid ${accent}`, paddingLeft: '1.25rem' }}>
              <dl style={{ display: 'grid', rowGap: '1rem' }}>
                {[['client','React Native, Expo'],['server','Node, Express, Prisma, PostgreSQL'],['realtime','Redis, Socket.IO, Firebase FCM'],['auth','Spotify OAuth 2.0 · JWT'],['cache','≈40% fewer Spotify API calls'],['repo','github.com/snjvkthrvn/replay']].map(([k,v]) => (
                  <div key={k}>
                    <dt style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'lowercase', color: BASE.fgFaint, marginBottom: '0.15rem' }}>{k}</dt>
                    <dd style={{ margin: 0, fontFamily: FONTS.body, fontSize: '0.875rem', color: BASE.fgSoft, lineHeight: 1.5 }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════
// SCRIPTURES SECTION
// ════════════════════════════════════════════════════════════════════
function ScripturesSection() {
  const accent = SECTIONS_DATA[3].accent;
  return (
    <section id="scriptures" style={{ position: 'relative', minHeight: '100vh', padding: `clamp(4rem,8vw,8rem) ${G}`, background: 'oklch(11% 0.025 68)', overflow: 'hidden' }}>
      <FloatingParticles color={accent} />
      <div style={{ maxWidth: 1100, position: 'relative', zIndex: 1 }}>
        <Reveal>
          <p style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: BASE.fgSoft, marginBottom: '2rem' }}>
            03 · ai / rag · python · qdrant · cohere · flask · anthropic
          </p>
          <h2 style={{ fontFamily: FONTS.display, fontWeight: 400, fontSize: 'clamp(2rem,1.5rem + 3vw,5rem)', lineHeight: 1.02, color: BASE.fg, maxWidth: '14ch', margin: '0 0 0.5rem' }}>
            Hindu Scriptures, searchable.
          </h2>
          <p style={{ fontFamily: FONTS.body, fontStyle: 'italic', fontSize: '1.1rem', color: BASE.fgSoft, maxWidth: '46ch', marginBottom: '2.5rem' }}>
            200,000 verses. Hybrid search. An agentic loop on top.
          </p>
        </Reveal>

        {/* Live embed */}
        <Reveal delay={80}>
          <div style={{ marginBottom: '3.5rem' }}>
            <p style={{ fontFamily: FONTS.mono, fontSize: '0.58rem', color: accent, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent, boxShadow: `0 0 6px ${accent}`, animation: 'eb-pulse 1.6s ease-in-out infinite' }} />
              live · interact below
            </p>
            <LiveSitePreview url="https://hindu-rag.up.railway.app/" accent={accent} label="Hindu Scriptures RAG" height={560} />
          </div>
        </Reveal>

        {/* Corpus stats */}
        <Reveal delay={80}>
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', marginBottom: '3.5rem', paddingBottom: '2.5rem', borderBottom: `1px solid oklch(25% 0.02 68)` }}>
            {[['200k+', 'verses indexed'],['15+', 'source texts'],['10+', 'life-domain tags'],['3', 'retrieval modes']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: FONTS.display, fontSize: '2.5rem', color: accent, lineHeight: 1 }}>{n}</div>
                <div style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', color: BASE.fgFaint, letterSpacing: '0.08em', textTransform: 'lowercase', marginTop: '0.35rem' }}>{l}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,15rem)', gap: 'clamp(2rem,3vw,4rem)', alignItems: 'start' }}>
          <div>
            {[
              ['the problem', 'Scripture has no search bar. A RAG pipeline can give it one \u2014 but only if it\u2019s honest about the texts and modest about what retrieval can do for someone looking for consolation rather than a citation.'],
              ['retrieval', 'Hybrid search over Qdrant: Cohere multilingual dense embeddings for semantic similarity, BM25 sparse retrieval for proper-noun and keyword hits, fused with Reciprocal Rank Fusion. Pure dense retrieval missed sage names; BM25 missed conceptual paraphrases. The fusion catches both.'],
              ['what I learned', 'The retrieval isn\u2019t the hard part. The data is. Producing a single consistent canonical reference for any given verse took more design work than anything on the model side.'],
            ].map(([head, body], i) => (
              <Reveal key={head} delay={i * 120}>
                <div style={{ marginBottom: '2.5rem' }}>
                  <h3 style={{ fontFamily: FONTS.display, fontSize: '1.45rem', color: BASE.fg, margin: '0 0 0.65rem', fontWeight: 400, fontStyle: 'italic' }}>{head}</h3>
                  <p style={{ fontFamily: FONTS.body, fontSize: '1rem', color: BASE.fgSoft, lineHeight: 1.72, maxWidth: '58ch' }}>{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal dir="right">
            <div style={{ background: 'oklch(16% 0.03 68)', padding: '1.25rem' }}>
              <dl style={{ display: 'grid', rowGap: '0.9rem' }}>
                {[['live demo','hindu-rag.up.railway.app'],['tier 1','Bhagavad Gītā · 11 Upanishads'],['tier 2','Yoga Sutras · Mahābhārata · Rāmāyaṇa'],['retrieval','Cohere dense + BM25 · RRF'],['agent','ReAct · Anthropic tool-use'],['serve','Flask + SSE · Docker Qdrant'],['repo','github.com/snjvkthrvn/hindu-scriptures-rag']].map(([k,v]) => (
                  <div key={k}>
                    <dt style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'lowercase', color: BASE.fgFaint, marginBottom: '0.15rem' }}>{k}</dt>
                    <dd style={{ margin: 0, fontFamily: FONTS.body, fontSize: '0.8rem', color: BASE.fgSoft, lineHeight: 1.5 }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════
// MAGIC 8-BALL SECTION
// ════════════════════════════════════════════════════════════════════
function MagicEightBallSection() {
  const accent = SECTIONS_DATA[4].accent;
  return (
    <section id="eightball" style={{
      position: 'relative', minHeight: '100vh', padding: `clamp(4rem,8vw,8rem) ${G}`,
      background: 'oklch(11% 0.025 280)', overflow: 'hidden',
    }}>
      <style>{`
        @keyframes eb-pulse {
          0%, 100% { opacity: 0.7; }
          50%      { opacity: 1; }
        }
      `}</style>

      <div style={{ maxWidth: 1100, position: 'relative', zIndex: 1 }}>
        <Reveal>
          <p style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', color: accent, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            04 · ai / web · next.js · typescript · llm · vercel
          </p>
          <h2 style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: 'clamp(2.5rem,2rem + 4vw,6rem)', lineHeight: 0.95, color: BASE.fg, margin: '0 0 0.5rem' }}>
            AI Magic 8-Ball
          </h2>
          <p style={{ fontFamily: FONTS.display, fontStyle: 'italic', fontSize: 'clamp(1rem,0.8rem + 1vw,1.5rem)', color: BASE.fgSoft, marginBottom: '2.5rem' }}>
            Ask it anything.
          </p>
        </Reveal>

        {/* Live embed */}
        <Reveal delay={80}>
          <div style={{ marginBottom: '4rem' }}>
            <p style={{ fontFamily: FONTS.mono, fontSize: '0.58rem', color: accent, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent, boxShadow: `0 0 6px ${accent}`, animation: 'eb-pulse 1.6s ease-in-out infinite' }} />
              live · ask it a question
            </p>
            <LiveSitePreview url="https://ai-8ball.vercel.app/" accent={accent} label="AI Magic 8-Ball" height={620} />
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,15rem)', gap: 'clamp(2rem,3vw,4rem)', alignItems: 'start' }}>
          <div>
            {[
              ['the idea', 'A modern remake of the classic toy. Type a yes/no question, the model answers in true magic 8-ball voice — terse, slightly cryptic, occasionally suspicious of you.'],
              ['the build', 'Next.js + TypeScript on Vercel. The interesting bit is prompt design: the model is instructed to stay in character, never break the fourth wall, and pick from a constrained answer space without sounding canned.'],
            ].map(([head, body], i) => (
              <Reveal key={head} delay={i * 120}>
                <div style={{ marginBottom: '2.5rem' }}>
                  <p style={{ fontFamily: FONTS.mono, fontSize: '0.66rem', color: accent, letterSpacing: '0.1em', marginBottom: '0.65rem' }}><span style={{ color: BASE.fgFaint }}>// </span>{head}</p>
                  <p style={{ fontFamily: FONTS.body, fontSize: '1rem', color: BASE.fgSoft, lineHeight: 1.7, maxWidth: '58ch' }}>{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal dir="right">
            <div style={{ background: 'oklch(15% 0.025 280)', padding: '1.25rem', border: `1px solid ${BASE.fgFaint}` }}>
              <dl style={{ display: 'grid', rowGap: '0.9rem' }}>
                {[['live','ai-8ball.vercel.app'],['stack','Next.js · TypeScript'],['model','LLM via API'],['deploy','Vercel'],['focus','prompt design · UX']].map(([k,v]) => (
                  <div key={k}>
                    <dt style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'lowercase', color: BASE.fgFaint, marginBottom: '0.15rem' }}>{k}</dt>
                    <dd style={{ margin: 0, fontFamily: FONTS.body, fontSize: '0.8rem', color: BASE.fgSoft, lineHeight: 1.5 }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════
// ABOUT SECTION (formerly Vita)
// ════════════════════════════════════════════════════════════════════
function AboutSection() {
  const accent = SECTIONS_DATA[5].accent;

  const experience = [
    {
      date: 'Jun – Sep 2024',
      org: 'Cholamandalam Investment & Finance',
      role: 'Machine Learning Intern',
      bullets: [
        'Built multivariate LSTM models (TensorFlow / PyTorch) for monthly HCV loan delinquency forecasting — 3-layer architecture with dropout and Adam, beating internal predictions by 0.5 pp.',
        'Engineered a time-series pipeline integrating 71 months of macroeconomic indicators (70+ variables) across 10+ cities, with fuzzy-matching, seasonal decomposition, and feature aggregation.',
        'Resolved multicollinearity using VIF, Ridge / Lasso, and RFE + Random Forest importance ranking.',
        'Tuned hyperparameters via GridSearchCV; presented two production models to the CRO with 12-month forecasts.',
      ],
    },
  ];

  const education = {
    date: '2021 – Dec 2025',
    org: 'Rutgers University, New Brunswick',
    role: 'B.A. Computer Science & Data Science',
    coursework: [
      'Machine Learning Principles',
      'Design & Analysis of Algorithms',
      'Artificial Intelligence',
      'Applied Statistical Learning',
      'Data Structures',
      'Computer Architecture',
      'Discrete Structures I & II',
      'Intro to Data Science',
    ],
  };

  const skillGroups = [
    { label: 'Languages',       items: ['Python', 'TypeScript', 'JavaScript', 'Java', 'SQL', 'C', 'R'] },
    { label: 'Frontend',        items: ['React', 'React Native', 'Next.js', 'Tailwind', 'Phaser 3'] },
    { label: 'Backend',         items: ['Node', 'Express', 'Django', 'Flask', 'Socket.IO', 'REST'] },
    { label: 'Data & infra',    items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Qdrant', 'Docker', 'AWS', 'Firebase'] },
    { label: 'ML & AI',         items: ['PyTorch', 'TensorFlow', 'Scikit-Learn', 'Pandas', 'Anthropic', 'OpenAI', 'LSTMs', 'RAG'] },
  ];

  const certs = [
    'Stanford / Coursera — Advanced Learning Algorithms; Supervised Machine Learning',
    'Meta Backend Developer Professional Certificate',
  ];

  return (
    <section id="about" style={{ minHeight: '100vh', padding: `clamp(4rem,8vw,8rem) ${G}`, background: BASE.bgMid }}>
      <div style={{ maxWidth: 1100 }}>
        <Reveal>
          <p style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: BASE.fgSoft, marginBottom: '1.25rem' }}>about</p>
          <h2 style={{ fontFamily: FONTS.display, fontWeight: 400, fontSize: 'clamp(3rem,2rem + 4vw,7rem)', lineHeight: 0.94, letterSpacing: '-0.025em', color: BASE.fg, margin: '0 0 1rem' }}>About me</h2>
          <p style={{ fontFamily: FONTS.body, fontSize: '1.05rem', color: BASE.fgSoft, lineHeight: 1.7, marginBottom: '4rem', maxWidth: '60ch' }}>
            I&rsquo;m a software engineer based in Edison, NJ. I just finished my B.A. in Computer Science &amp; Data Science at Rutgers (Dec 2025). I&rsquo;ve worked on machine learning in production, shipped a cross-platform mobile app, and built a few things that started as &ldquo;wouldn&rsquo;t it be cool if&rdquo; and turned into real projects.
          </p>
        </Reveal>

        {/* Experience + Education side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'clamp(2rem, 4vw, 4rem)', marginBottom: '5rem' }}>
          {/* Experience */}
          <Reveal>
            <div>
              <p style={{ fontFamily: FONTS.mono, fontSize: '0.62rem', color: accent, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: `1px solid ${accent}44` }}>
                Experience
              </p>
              {experience.map(e => (
                <div key={e.org} style={{ marginBottom: '2rem' }}>
                  <p style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.06em', textTransform: 'lowercase', color: BASE.fgFaint, marginBottom: '0.5rem' }}>{e.date}</p>
                  <h3 style={{ fontFamily: FONTS.display, fontSize: '1.35rem', color: BASE.fg, fontWeight: 500, margin: '0 0 0.25rem' }}>{e.org}</h3>
                  <p style={{ fontFamily: FONTS.body, fontStyle: 'italic', color: BASE.fgSoft, marginBottom: '1rem', fontSize: '0.95rem' }}>{e.role}</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {e.bullets.map((b, i) => (
                      <li key={i} style={{
                        fontFamily: FONTS.body, fontSize: '0.9rem', color: BASE.fgSoft, lineHeight: 1.6,
                        paddingLeft: '1rem', position: 'relative',
                      }}>
                        <span style={{ position: 'absolute', left: 0, top: '0.55rem', width: 4, height: 4, borderRadius: '50%', background: accent }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Education */}
          <Reveal delay={100}>
            <div>
              <p style={{ fontFamily: FONTS.mono, fontSize: '0.62rem', color: accent, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: `1px solid ${accent}44` }}>
                Education
              </p>
              <p style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.06em', textTransform: 'lowercase', color: BASE.fgFaint, marginBottom: '0.5rem' }}>{education.date}</p>
              <h3 style={{ fontFamily: FONTS.display, fontSize: '1.35rem', color: BASE.fg, fontWeight: 500, margin: '0 0 0.25rem' }}>{education.org}</h3>
              <p style={{ fontFamily: FONTS.body, fontStyle: 'italic', color: BASE.fgSoft, marginBottom: '1.25rem', fontSize: '0.95rem' }}>{education.role}</p>

              <p style={{ fontFamily: FONTS.mono, fontSize: '0.58rem', color: BASE.fgFaint, letterSpacing: '0.08em', textTransform: 'lowercase', marginBottom: '0.6rem' }}>relevant coursework</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '2rem' }}>
                {education.coursework.map(c => (
                  <span key={c} style={{
                    fontFamily: FONTS.body, fontSize: '0.78rem', color: BASE.fgSoft,
                    border: `1px solid ${BASE.fgFaint}`, padding: '0.25rem 0.6rem',
                  }}>{c}</span>
                ))}
              </div>

              <p style={{ fontFamily: FONTS.mono, fontSize: '0.58rem', color: BASE.fgFaint, letterSpacing: '0.08em', textTransform: 'lowercase', marginBottom: '0.6rem' }}>certifications</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {certs.map(c => (
                  <li key={c} style={{ fontFamily: FONTS.body, fontSize: '0.85rem', color: BASE.fgSoft, lineHeight: 1.5 }}>{c}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Skills - grouped, no percentages */}
        <Reveal>
          <p style={{ fontFamily: FONTS.mono, fontSize: '0.62rem', color: accent, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '2rem', paddingBottom: '0.5rem', borderBottom: `1px solid ${accent}44` }}>
            Skills
          </p>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
          {skillGroups.map((g, i) => (
            <Reveal key={g.label} delay={i * 70}>
              <div>
                <p style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', color: BASE.fgFaint, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.85rem' }}>{g.label}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {g.items.map(item => (
                    <span key={item} style={{
                      fontFamily: FONTS.body, fontSize: '0.85rem', color: BASE.fg,
                      background: BASE.bgSurf, padding: '0.3rem 0.7rem',
                      border: `1px solid ${BASE.fgFaint}`,
                    }}>{item}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════
// CONTACT SECTION
// ════════════════════════════════════════════════════════════════════
function ContactSection() {
  const accent = SECTIONS_DATA[6].accent;
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard?.writeText('sanjeevkathiravanpro@gmail.com').catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section id="contact" style={{ minHeight: '80vh', padding: `clamp(5rem,10vw,12rem) ${G}`, background: BASE.bg, display: 'flex', alignItems: 'center' }}>
      <div style={{ maxWidth: 700 }}>
        <Reveal>
          <p style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: BASE.fgSoft, marginBottom: '1rem' }}>contact</p>
          <h2 style={{ fontFamily: FONTS.display, fontWeight: 400, fontSize: 'clamp(2rem,1.5rem + 3vw,4rem)', lineHeight: 1, letterSpacing: '-0.02em', color: BASE.fg, margin: '0 0 2rem' }}>Let&rsquo;s talk.</h2>
        </Reveal>
        <Reveal delay={80}>
          <Magnetic strength={0.18}>
          <button onClick={copy} data-hover style={{
            background: 'none', border: 0, cursor: 'none', textAlign: 'left', padding: 0, display: 'block',
            fontFamily: FONTS.display, fontWeight: 400,
            fontSize: 'clamp(1.25rem,1rem + 2.5vw,2.75rem)',
            lineHeight: 1.1, letterSpacing: '-0.02em',
            color: copied ? accent : BASE.fg,
            transition: 'color 200ms ease',
            marginBottom: '0.5rem',
          }}>
            sanjeevkathiravanpro@gmail.com
          </button>
          </Magnetic>
          {copied && <p style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', color: accent, letterSpacing: '0.08em' }}>copied. ✓</p>}
        </Reveal>
        <Reveal delay={160}>
          <div style={{ display: 'flex', gap: '2.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            {[['linkedin','https://linkedin.com/in/sanjeev-kathiravan'],['github','https://github.com/snjvkthrvn'],['resume','uploads/sk_resume_.pdf'],['source','https://github.com/snjvkthrvn/port-website']].map(([label, href]) => (
              <a key={label} href={href} rel="noreferrer" target="_blank" data-hover style={{
                fontFamily: FONTS.mono, fontSize: '0.68rem', letterSpacing: '0.08em',
                textTransform: 'lowercase', color: BASE.fgSoft, textDecoration: 'none',
                borderBottom: `1px solid ${BASE.fgFaint}`, paddingBottom: '0.1rem',
                transition: 'color 180ms ease, border-color 180ms ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = accent; e.currentTarget.style.borderBottomColor = accent; }}
              onMouseLeave={e => { e.currentTarget.style.color = BASE.fgSoft; e.currentTarget.style.borderBottomColor = BASE.fgFaint; }}
              >{label}</a>
            ))}
          </div>
        </Reveal>
        <Reveal delay={240}>
          <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: `1px solid ${BASE.fgFaint}` }}>
            <p style={{ fontFamily: FONTS.body, color: BASE.fgSoft, fontSize: '0.9rem', lineHeight: 1.65, maxWidth: '52ch' }}>
              Edison, NJ · open to relocation · US Citizen
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════════════════
// MORE WORK SECTION (smaller projects / coursework)
// ════════════════════════════════════════════════════════════════════
function MoreWorkSection() {
  const accent = SECTIONS_DATA[0].accent;
  const items = [
    { kind: 'ML · forecasting',  title: 'HCV Loan Delinquency Forecasting',
      desc: 'LSTM ensemble in TensorFlow/PyTorch over 71 months of macroeconomic indicators. 0.5pp improvement over the in-house team. Built during my Cholamandalam internship.',
      tags: ['PyTorch', 'TensorFlow', 'Time Series'] },
    { kind: 'AI · coursework',   title: 'Reinforcement Learning Maze Solver',
      desc: 'Q-learning and SARSA agents navigating procedurally generated grid worlds, with a comparison harness for convergence speed and policy stability.',
      tags: ['Python', 'NumPy', 'RL'] },
    { kind: 'Algorithms',        title: 'Visual Pathfinding Sandbox',
      desc: 'Side-by-side A*, Dijkstra, BFS, and DFS over a draggable grid of walls and weights. Built to internalize heuristic admissibility for an algorithms course.',
      tags: ['TypeScript', 'Canvas'] },
    { kind: 'Data Science',      title: 'NYC Subway Delay Analyzer',
      desc: 'Pandas + scikit-learn pipeline correlating MTA performance metrics with weather and event data. Output: a small dashboard ranking the most chronically late lines.',
      tags: ['Python', 'Pandas', 'Sklearn'] },
    { kind: 'Systems',           title: 'Mini Shell in C',
      desc: 'POSIX shell clone with pipes, redirection, job control, and a built-in command set. Written for Computer Architecture; a love letter to fork() and execvp().',
      tags: ['C', 'POSIX', 'Unix'] },
    { kind: 'Web',               title: 'Personal Site, v1 → v3',
      desc: 'This page is the third iteration of my portfolio. Each version is a separate aesthetic exercise — typography-driven, codex/folio-driven, and now narrative-driven.',
      tags: ['React', 'Design'] },
  ];
  return (
    <section id="more-work" style={{ position: 'relative', padding: `clamp(4rem,8vw,7rem) ${G}`, background: BASE.bg, borderTop: `1px solid ${BASE.fgFaint}` }}>
      <div style={{ maxWidth: 1100 }}>
        <Reveal>
          <p style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: accent, marginBottom: '1rem' }}>
            ✦ more work
          </p>
          <h2 style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: 'clamp(2.25rem,1.5rem + 3vw,4rem)', lineHeight: 1, letterSpacing: '-0.02em', color: BASE.fg, margin: '0 0 1rem' }}>
            Other things I&rsquo;ve built
          </h2>
          <p style={{ fontFamily: FONTS.body, fontStyle: 'italic', fontSize: '1.1rem', color: BASE.fgSoft, marginBottom: '3.5rem', maxWidth: '50ch' }}>
            Smaller experiments, coursework, and side-quests. Less polished than the four above, but each one taught me something specific.
          </p>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '1px', background: BASE.fgFaint, border: `1px solid ${BASE.fgFaint}` }}>
          {items.map((p, i) => (
            <Reveal key={p.title} delay={i * 60}>
              <div style={{ background: BASE.bgSurf, padding: '1.75rem 1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontFamily: FONTS.mono, fontSize: '0.56rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: accent, marginBottom: '0.85rem' }}>{p.kind}</div>
                <h3 style={{ fontFamily: FONTS.display, fontWeight: 600, fontSize: '1.25rem', color: BASE.fg, lineHeight: 1.2, margin: '0 0 0.65rem' }}>{p.title}</h3>
                <p style={{ fontFamily: FONTS.body, fontSize: '0.88rem', color: BASE.fgSoft, lineHeight: 1.6, marginBottom: '1.25rem' }}>{p.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: 'auto' }}>
                  {p.tags.map(t => (
                    <span key={t} style={{ fontFamily: FONTS.mono, fontSize: '0.54rem', letterSpacing: '0.06em', textTransform: 'lowercase', color: BASE.fgFaint, border: `1px solid ${BASE.fgFaint}`, padding: '0.18rem 0.45rem' }}>{t}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, {
  AnimatedWaveform, FloatingParticles, SkillBar,
  HeroSection, AlgorithmiaSection, ReplaySection,
  ScripturesSection, MagicEightBallSection, AboutSection, ContactSection,
  MoreWorkSection,
});

// pv2-app.jsx — nav, active section tracking, root app

const TWEAK_DEF = /*EDITMODE-BEGIN*/{"showCursor": true}/*EDITMODE-END*/;

// ── ACTIVE SECTION TRACKER ───────────────────────────────────────────
function useActiveSection() {
  const [active, setActive] = React.useState('home');
  React.useEffect(() => {
    const ids = SECTIONS_DATA.map(s => s.id);
    const els = ids.map(id => document.getElementById(id)).filter(Boolean);
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && e.intersectionRatio >= 0.35) setActive(e.target.id);
      });
    }, { threshold: 0.35 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return active;
}

// ── SCROLL TO SECTION ────────────────────────────────────────────────
function useScrollTo() {
  return React.useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 68;
    window.scrollTo({ top, behavior: 'smooth' });
  }, []);
}

// ── NAV ──────────────────────────────────────────────────────────────
function Nav({ active, accent, scrollTo }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navItems = SECTIONS_DATA.filter(s => s.id !== 'home');

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 clamp(1.5rem, 4vw, 5rem)',
      height: 68,
      background: scrolled ? `${BASE.bg}ee` : 'transparent',
      backdropFilter: scrolled ? 'blur(14px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
      borderBottom: scrolled ? `1px solid ${BASE.fgFaint}` : '1px solid transparent',
      transition: 'background 400ms ease, border-color 300ms ease',
    }}>
      {/* Logo */}
      <button onClick={() => scrollTo('home')} data-hover style={{
        background: 'none', border: 0, cursor: 'none', padding: 0,
        fontFamily: FONTS.display, fontSize: '1.05rem', color: BASE.fg,
        letterSpacing: '-0.01em', transition: 'color 300ms ease',
      }}
      onMouseEnter={e => e.currentTarget.style.color = accent}
      onMouseLeave={e => e.currentTarget.style.color = BASE.fg}
      >
        SK
      </button>

      {/* Desktop nav items */}
      <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
        {navItems.map(s => (
          <button key={s.id} onClick={() => { scrollTo(s.id); setMenuOpen(false); }} data-hover style={{
            background: 'none', border: 0, cursor: 'none',
            fontFamily: FONTS.mono, fontSize: '0.62rem',
            letterSpacing: '0.08em', textTransform: 'lowercase',
            color: active === s.id ? accent : BASE.fgFaint,
            padding: '0.4rem 0.8rem',
            transition: 'color 250ms ease',
            position: 'relative',
          }}
          onMouseEnter={e => { if (active !== s.id) e.currentTarget.style.color = BASE.fgSoft; }}
          onMouseLeave={e => { e.currentTarget.style.color = active === s.id ? accent : BASE.fgFaint; }}
          >
            {s.label}
            {active === s.id && (
              <span style={{
                position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)',
                width: 4, height: 4, borderRadius: '50%', background: accent,
                boxShadow: `0 0 6px ${accent}`,
              }} />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}

// ── TWEAKS PANEL ─────────────────────────────────────────────────────
function TweaksPanel({ show, showCursor, setShowCursor, onClose }) {
  if (!show) return null;
  return (
    <div style={{
      position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9997,
      background: 'oklch(15% 0.012 270)',
      border: '1px solid oklch(28% 0.01 270)',
      padding: '1.25rem 1.5rem', minWidth: 240,
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      fontFamily: FONTS.mono, fontSize: '0.68rem', letterSpacing: '0.05em',
      color: BASE.fg,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid oklch(25% 0.01 270)' }}>
        <span style={{ color: BASE.fgSoft, letterSpacing: '0.1em', textTransform: 'lowercase' }}>tweaks</span>
        <button onClick={onClose} data-hover style={{ background: 'none', border: 0, cursor: 'none', color: BASE.fgFaint, fontFamily: 'inherit', fontSize: '0.75rem', padding: '0 0.25rem' }}>✕</button>
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'none', marginBottom: '0.75rem' }} data-hover>
        <input type="checkbox" checked={showCursor} onChange={e => setShowCursor(e.target.checked)} style={{ accentColor: 'oklch(68% 0.24 300)', width: 13, height: 13 }} />
        <span>custom cursor</span>
      </label>
      <p style={{ color: BASE.fgFaint, lineHeight: 1.5, textTransform: 'none', letterSpacing: '0.02em', fontSize: '0.62rem' }}>
        Scroll through each section — accent color shifts automatically.
      </p>
    </div>
  );
}

// ── APP ROOT ─────────────────────────────────────────────────────────
function App() {
  const active       = useActiveSection();
  const scrollTo     = useScrollTo();
  const [showTweaks, setShowTweaks] = React.useState(false);
  const [showCursor, setShowCursor] = React.useState(TWEAK_DEF.showCursor);

  const accent = (SECTIONS_DATA.find(s => s.id === active) || SECTIONS_DATA[0]).accent;

  // Tweaks protocol
  React.useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode')   setShowTweaks(true);
      if (e.data?.type === '__deactivate_edit_mode') setShowTweaks(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  React.useEffect(() => {
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { showCursor } }, '*');
  }, [showCursor]);

  const handleTweakClose = () => {
    setShowTweaks(false);
    window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
  };

  // Keyboard shortcut: Escape closes tweaks
  React.useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') setShowTweaks(false); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  return (
    <>
      {showCursor && <Cursor accent={accent} />}
      <ScrollProgress accent={accent} />
      <Grain />

      <Nav active={active} accent={accent} scrollTo={scrollTo} />

      <HeroSection      onScrollTo={scrollTo} />
      <Marquee items={['available for hire', 'based in edison, nj', 'open to relocate', 'building with ai', 'rutgers cs · ds 2025']} accent={accent} />
      <AlgorithmiaSection />
      <ReplaySection />
      <ScripturesSection />
      <MagicEightBallSection />
      <AboutSection />
      <MoreWorkSection />
      <ContactSection />

      <TweaksPanel
        show={showTweaks}
        showCursor={showCursor}
        setShowCursor={setShowCursor}
        onClose={handleTweakClose}
      />
    </>
  );
}

export default App;
