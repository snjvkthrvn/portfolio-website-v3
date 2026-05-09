// =============================================================
// THEMES — one visual world per section of the codex
// =============================================================
const THEMES = {
  frontispiece: {
    id: 'frontispiece', folio: 'f. 1r',
    bg:       'oklch(96.5% 0.015 80)',
    bgDeep:   'oklch(93% 0.02 80)',
    fg:       'oklch(22% 0.035 40)',
    fgSoft:   'oklch(45% 0.03 40)',
    fgFaint:  'oklch(65% 0.025 40)',
    accent:   'oklch(55% 0.17 30)',
    accentBg: 'oklch(92% 0.04 30)',
    surface:  'oklch(93% 0.02 80)',
    dark: false,
  },
  algorithmia: {
    id: 'algorithmia', folio: 'f. 2r',
    bg:       'oklch(11% 0.025 255)',
    bgDeep:   'oklch(16% 0.03 255)',
    fg:       'oklch(88% 0.01 255)',
    fgSoft:   'oklch(62% 0.015 255)',
    fgFaint:  'oklch(36% 0.02 255)',
    accent:   'oklch(72% 0.22 195)',
    accentBg: 'oklch(20% 0.08 195)',
    surface:  'oklch(16% 0.025 255)',
    dark: true,
  },
  replay: {
    id: 'replay', folio: 'f. 2v',
    bg:       'oklch(15% 0.035 295)',
    bgDeep:   'oklch(21% 0.045 295)',
    fg:       'oklch(93% 0.008 295)',
    fgSoft:   'oklch(65% 0.015 295)',
    fgFaint:  'oklch(36% 0.02 295)',
    accent:   'oklch(68% 0.25 18)',
    accentBg: 'oklch(24% 0.08 18)',
    surface:  'oklch(21% 0.04 295)',
    dark: true,
  },
  scriptures: {
    id: 'scriptures', folio: 'f. 3r',
    bg:       'oklch(92% 0.055 78)',
    bgDeep:   'oklch(86% 0.075 72)',
    fg:       'oklch(19% 0.065 48)',
    fgSoft:   'oklch(40% 0.055 52)',
    fgFaint:  'oklch(60% 0.04 65)',
    accent:   'oklch(53% 0.24 48)',
    accentBg: 'oklch(88% 0.06 72)',
    surface:  'oklch(86% 0.07 72)',
    dark: false,
  },
  vita: {
    id: 'vita', folio: 'f. 4r',
    bg:       'oklch(98.5% 0.003 95)',
    bgDeep:   'oklch(94% 0.006 95)',
    fg:       'oklch(14% 0.005 95)',
    fgSoft:   'oklch(42% 0.005 95)',
    fgFaint:  'oklch(68% 0.004 95)',
    accent:   'oklch(50% 0.18 30)',
    accentBg: 'oklch(94% 0.02 30)',
    surface:  'oklch(94% 0.006 95)',
    dark: false,
  },
  colophon: {
    id: 'colophon', folio: 'f. 4v',
    bg:       'oklch(13% 0.014 68)',
    bgDeep:   'oklch(19% 0.018 65)',
    fg:       'oklch(80% 0.014 70)',
    fgSoft:   'oklch(55% 0.012 70)',
    fgFaint:  'oklch(36% 0.01 70)',
    accent:   'oklch(62% 0.16 28)',
    accentBg: 'oklch(24% 0.06 28)',
    surface:  'oklch(19% 0.016 68)',
    dark: true,
  },
};

const FONTS = {
  display: "'Playfair Display', ui-serif, Georgia, serif",
  body:    "'Source Serif 4', ui-serif, Georgia, serif",
  mono:    "'JetBrains Mono', ui-monospace, 'SF Mono', monospace",
};

const NAV = [
  { id: 'frontispiece', title: 'Frontispiece',                      folio: 'f. 1r', note: 'The title page.' },
  { id: 'algorithmia',  title: 'Algorithmia: The Path of Logic',    folio: 'f. 2r', note: 'A puzzle-adventure teaching twelve algorithm concepts.' },
  { id: 'replay',       title: 'Replay',                            folio: 'f. 2v', note: 'Social music sharing across four daily segments.' },
  { id: 'scriptures',   title: 'A Retrieval Engine on Hindu Scriptures', folio: 'f. 3r', note: 'Two hundred thousand verses, hybrid search, a ReAct loop.' },
  { id: 'vita',         title: 'Vita',                              folio: 'f. 4r', note: 'Education, experience, instruments of the craft.' },
  { id: 'colophon',     title: 'Colophon',                         folio: 'f. 4v', note: 'Contact, credits, how this was pressed.' },
];

const G = 'clamp(1.25rem, 3vw, 3rem)';

// =============================================================
// RUNNING HEADER
// =============================================================
function RunningHeader({ theme, onNavigate, drawerOpen, setDrawerOpen }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 64);
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 20,
      display: 'grid', gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'baseline',
      padding: `0.9rem ${G}`,
      background: `color-mix(in oklch, ${theme.bg} ${theme.dark ? '93%' : '88%'}, transparent)`,
      backdropFilter: 'blur(14px) saturate(1.1)',
      WebkitBackdropFilter: 'blur(14px) saturate(1.1)',
      borderBottom: `1px solid ${scrolled ? theme.fgFaint : 'transparent'}`,
      transition: 'border-color 300ms ease, background 600ms ease',
      fontFamily: FONTS.mono, fontSize: '0.68rem',
      letterSpacing: '0.08em', textTransform: 'lowercase',
      color: theme.fgSoft,
    }}>
      <button onClick={() => onNavigate('frontispiece')} style={{
        background: 'none', border: 0, cursor: 'pointer', padding: 0,
        fontFamily: FONTS.display, fontSize: '0.975rem',
        letterSpacing: 'normal', textTransform: 'none',
        color: theme.fg, justifySelf: 'start',
        transition: 'color 500ms ease',
      }}>
        SK <span style={{ color: theme.fgFaint, margin: '0 0.15em' }}>·</span> codex
      </button>

      <button onClick={() => setDrawerOpen(v => !v)} style={{
        background: 'none', border: 0, cursor: 'pointer',
        fontFamily: FONTS.mono, fontSize: '0.68rem',
        letterSpacing: '0.08em', textTransform: 'lowercase',
        color: drawerOpen ? theme.accent : theme.fgSoft,
        padding: '0.3rem 0.8rem',
        transition: 'color 200ms ease',
      }}>
        index {drawerOpen ? '↑' : '↓'}
      </button>

      <span style={{ justifySelf: 'end', color: theme.fgFaint, transition: 'color 500ms ease' }}>
        {theme.folio}
      </span>
    </header>
  );
}

// =============================================================
// INDEX DRAWER
// =============================================================
function IndexDrawer({ open, theme, onNavigate, currentPage }) {
  return (
    <div style={{
      position: 'fixed', inset: '3rem 0 auto 0', zIndex: 15,
      background: theme.bg,
      borderBottom: `1px solid ${theme.fgFaint}`,
      maxHeight: open ? '75vh' : 0,
      overflow: 'hidden',
      transition: 'max-height 380ms cubic-bezier(0.19,1,0.22,1), background 600ms ease',
    }}>
      <div style={{
        padding: `clamp(1.5rem,3vw,2.5rem) ${G}`,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '0 1.5rem',
        maxWidth: 1100, margin: '0 auto',
      }}>
        {NAV.map(item => (
          <button key={item.id} onClick={() => onNavigate(item.id)} style={{
            background: 'none', border: 0, cursor: 'pointer', textAlign: 'left',
            padding: '0.75rem 0',
            borderTop: `1px solid ${theme.fgFaint}`,
            display: 'grid', gridTemplateColumns: '3.5rem 1fr',
            columnGap: '0.75rem', alignItems: 'start',
            color: currentPage === item.id ? theme.accent : theme.fg,
            transition: 'color 160ms ease',
          }}
          onMouseEnter={e => { if (currentPage !== item.id) e.currentTarget.style.color = theme.accent; }}
          onMouseLeave={e => { if (currentPage !== item.id) e.currentTarget.style.color = theme.fg; }}
          >
            <span style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.08em', color: theme.fgFaint, paddingTop: '0.3rem', display: 'block' }}>
              {item.folio}
            </span>
            <div>
              <div style={{ fontFamily: FONTS.display, fontSize: '1.1rem', lineHeight: 1.2 }}>{item.title}</div>
              <div style={{ fontFamily: FONTS.body, fontStyle: 'italic', fontSize: '0.78rem', color: theme.fgSoft, marginTop: '0.15rem', lineHeight: 1.4 }}>{item.note}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// =============================================================
// PAGE FOOTER
// =============================================================
function PageFooter({ theme }) {
  return (
    <footer style={{
      padding: `clamp(2rem,3vw,3rem) ${G} clamp(3rem,4vw,4rem)`,
      borderTop: `1px solid ${theme.fgFaint}`,
      background: theme.bg,
      transition: 'background 600ms ease, border-color 400ms ease',
    }}>
      <p style={{
        fontFamily: FONTS.body, fontStyle: 'italic', fontSize: '0.875rem',
        color: theme.fgSoft, lineHeight: 1.65, maxWidth: '68ch', marginBottom: '1rem',
      }}>
        This codex was typeset in Playfair Display, Source Serif 4, and JetBrains Mono,
        composed in Astro, pressed 2026-04-23, in Edison, New Jersey.
      </p>
      <div style={{
        display: 'flex', gap: '1.5rem', flexWrap: 'wrap',
        fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.08em',
        textTransform: 'lowercase', color: theme.fgFaint,
      }}>
        {[['rev. unreleased', null], ['source', 'https://github.com/snjvkthrvn/port-website'], ['email', 'mailto:sanjeevkathiravanpro@gmail.com'], ['linkedin', 'https://linkedin.com/in/sanjeev-kathiravan'], ['github', 'https://github.com/snjvkthrvn']].map(([label, href]) =>
          href ? (
            <a key={label} href={href} style={{ color: 'inherit', textDecoration: 'none' }}>{label}</a>
          ) : (
            <span key={label}>{label}</span>
          )
        )}
      </div>
    </footer>
  );
}

// =============================================================
// SHARED: PAGINATION ROW
// =============================================================
function PaginationRow({ theme, prev, next, onNavigate }) {
  const btnBase = {
    background: 'none', border: 0, cursor: 'pointer',
    fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.08em',
    textTransform: 'lowercase', color: theme.fgSoft,
    display: 'flex', flexDirection: 'column', gap: '0.25rem',
    transition: 'color 180ms ease',
  };
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      marginTop: '4rem', paddingTop: '2rem', borderTop: `1px solid ${theme.fgFaint}`,
      maxWidth: 1000,
    }}>
      {prev ? (
        <button onClick={() => onNavigate(prev.id)} style={{ ...btnBase, alignItems: 'flex-start' }}>
          <span>← prev</span>
          <span style={{ color: theme.fgFaint }}>{prev.folio}</span>
          <span style={{ fontFamily: FONTS.display, fontSize: '1rem', color: theme.fg }}>{prev.title}</span>
        </button>
      ) : <div />}
      {next ? (
        <button onClick={() => onNavigate(next.id)} style={{ ...btnBase, alignItems: 'flex-end' }}>
          <span>next →</span>
          <span style={{ color: theme.fgFaint }}>{next.folio}</span>
          <span style={{ fontFamily: FONTS.display, fontSize: '1rem', color: theme.fg }}>{next.title}</span>
        </button>
      ) : <div />}
    </div>
  );
}

Object.assign(window, { THEMES, FONTS, NAV, G, RunningHeader, IndexDrawer, PageFooter, PaginationRow });
