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

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
