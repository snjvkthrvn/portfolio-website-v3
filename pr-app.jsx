// pr-app.jsx — root app, page routing, transitions, tweaks

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{"immersive": true}/*EDITMODE-END*/;

// =============================================================
// TWEAKS PANEL
// =============================================================
function TweaksPanel({ show, immersive, setImmersive, onClose }) {
  if (!show) return null;

  const panelStyle = {
    position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 100,
    background: 'oklch(18% 0.012 70)',
    color: 'oklch(80% 0.01 70)',
    border: '1px solid oklch(30% 0.01 70)',
    padding: '1.25rem 1.5rem',
    minWidth: 260,
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.68rem',
    letterSpacing: '0.05em',
  };

  const labelStyle = {
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    cursor: 'pointer', marginBottom: '0.5rem',
    lineHeight: 1.4,
  };

  const descStyle = {
    color: 'oklch(48% 0.01 70)',
    marginTop: '0.75rem', lineHeight: 1.55,
    textTransform: 'none', letterSpacing: '0.02em',
  };

  return (
    <div style={panelStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid oklch(28% 0.01 70)' }}>
        <span style={{ color: 'oklch(55% 0.01 70)', letterSpacing: '0.1em', textTransform: 'lowercase' }}>tweaks</span>
        <button onClick={onClose} style={{ background: 'none', border: 0, cursor: 'pointer', color: 'oklch(45% 0.01 70)', fontFamily: 'inherit', fontSize: '0.75rem', padding: '0 0.25rem' }}>✕</button>
      </div>

      <label style={labelStyle}>
        <input
          type="checkbox"
          checked={immersive}
          onChange={e => setImmersive(e.target.checked)}
          style={{ accentColor: 'oklch(65% 0.2 30)', width: 14, height: 14, flexShrink: 0 }}
        />
        <span>immersive mode</span>
      </label>

      <p style={descStyle}>
        {immersive
          ? 'Each section has its own visual world — dark, warm, cool, stark.'
          : 'All pages share the frontispiece palette. Consistent, quieter.'}
      </p>
    </div>
  );
}

// =============================================================
// APP
// =============================================================
function App() {
  const [page, setPage]             = React.useState('frontispiece');
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [fading, setFading]         = React.useState(false);
  const [immersive, setImmersive]   = React.useState(TWEAK_DEFAULTS.immersive);
  const [showTweaks, setShowTweaks] = React.useState(false);

  // Resolve theme: immersive = per-page palette, else always frontispiece
  const rawTheme = THEMES[page];
  const theme    = immersive ? rawTheme : { ...THEMES.frontispiece, folio: rawTheme.folio };

  // Navigation with fade transition
  const navigate = React.useCallback((newPage) => {
    if (newPage === page) { setDrawerOpen(false); return; }
    setFading(true);
    setTimeout(() => {
      setPage(newPage);
      setDrawerOpen(false);
      window.scrollTo(0, 0);
      setFading(false);
    }, 230);
  }, [page]);

  // Keyboard shortcuts: gi=index gi = drawer, gh=home, gv=vita, gc=colophon
  React.useEffect(() => {
    let last = '';
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const ch = e.key;
      const combo = last + ch;
      if (combo === 'gh') navigate('frontispiece');
      if (combo === 'gv') navigate('vita');
      if (combo === 'gc') navigate('colophon');
      if (combo === 'gi') setDrawerOpen(v => !v);
      if (e.key === 'Escape') setDrawerOpen(false);
      last = ch;
      setTimeout(() => { last = ''; }, 800);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);

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

  // Sync tweak value to host
  React.useEffect(() => {
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { immersive } }, '*');
  }, [immersive]);

  const handleTweakClose = () => {
    setShowTweaks(false);
    window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
  };

  const pages = {
    frontispiece: <FrontispiecePage theme={theme} onNavigate={navigate} />,
    algorithmia:  <AlgorithmiaPage  theme={theme} onNavigate={navigate} />,
    replay:       <ReplayPage       theme={theme} onNavigate={navigate} />,
    scriptures:   <ScripturesPage   theme={theme} onNavigate={navigate} />,
    vita:         <VitaPage         theme={theme} onNavigate={navigate} />,
    colophon:     <ColophonPage     theme={theme} />,
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.bg,
      color: theme.fg,
      fontFamily: FONTS.body,
      transition: 'background 600ms cubic-bezier(0.19,1,0.22,1), color 400ms ease',
    }}>
      <RunningHeader
        theme={theme}
        onNavigate={navigate}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />

      <IndexDrawer
        open={drawerOpen}
        theme={theme}
        onNavigate={navigate}
        currentPage={page}
      />

      {/* Page with fade transition */}
      <div style={{
        opacity: fading ? 0 : 1,
        transform: fading ? 'translateY(6px)' : 'translateY(0)',
        transition: 'opacity 250ms ease, transform 250ms ease',
      }}>
        {pages[page]}
        {page !== 'colophon' && <PageFooter theme={theme} />}
      </div>

      <TweaksPanel
        show={showTweaks}
        immersive={immersive}
        setImmersive={setImmersive}
        onClose={handleTweakClose}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
