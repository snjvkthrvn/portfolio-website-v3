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
