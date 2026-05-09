// pr-pages.jsx — all six page components

// =============================================================
// FRONTISPIECE
// =============================================================
function InkInTitle({ text, theme }) {
  const [phase, setPhase] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setPhase(true), 120);
    return () => clearTimeout(t);
  }, []);
  return (
    <h1 style={{
      fontFamily: FONTS.display, fontWeight: 400,
      fontSize: 'clamp(3.5rem, 2rem + 6vw, 7rem)',
      lineHeight: 0.94, letterSpacing: '-0.025em',
      color: theme.fg, margin: 0,
    }}>
      {text.split(' ').map((word, i) => (
        <span key={i} style={{
          display: 'inline-block', marginRight: '0.25em',
          opacity: phase ? 1 : 0,
          filter: phase ? 'none' : 'blur(10px)',
          transform: phase ? 'none' : 'translateY(8px)',
          transition: `opacity 800ms cubic-bezier(0.19,1,0.22,1) ${i * 130}ms,
                       filter 800ms cubic-bezier(0.19,1,0.22,1) ${i * 130}ms,
                       transform 800ms cubic-bezier(0.19,1,0.22,1) ${i * 130}ms`,
        }}>{word}</span>
      ))}
    </h1>
  );
}

function FrontispiecePage({ theme, onNavigate }) {
  return (
    <main style={{ background: theme.bg, padding: `clamp(4rem,10vw,10rem) ${G} clamp(4rem,6vw,6rem)`, transition: 'background 600ms ease' }}>
      <article style={{ display: 'grid', gap: 'clamp(2.5rem,5vw,5rem)', maxWidth: 820 }}>

        <div>
          <InkInTitle text="Sanjeev Kathiravan" theme={theme} />
          <p style={{ fontFamily: FONTS.display, fontStyle: 'italic', fontSize: 'clamp(1.1rem,0.8rem + 1.2vw,1.75rem)', color: theme.fgSoft, marginTop: '0.75rem' }}>
            A codex of work, volume I.
          </p>
        </div>

        <figure style={{ margin: 0, maxWidth: '46ch' }}>
          <p style={{ fontFamily: FONTS.display, fontSize: '1.3rem', color: theme.fg, lineHeight: 1.5, marginBottom: '0.4rem' }}>
            कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।
          </p>
          <figcaption>
            <p style={{ fontFamily: FONTS.body, fontStyle: 'italic', fontSize: '0.9375rem', color: theme.fgSoft, lineHeight: 1.55 }}>
              You have a right to the work itself, never to its fruits.
            </p>
            <span style={{ display: 'block', marginTop: '0.5rem', fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'lowercase', color: theme.fgFaint }}>
              Bhagavad Gītā · 2.47
            </span>
          </figcaption>
        </figure>

        <p style={{ fontFamily: FONTS.body, maxWidth: '60ch', color: theme.fg, lineHeight: 1.65, fontSize: '1.0625rem' }}>
          Recent graduate of Rutgers University in Computer Science and Data Science,
          pressing this codex in the spring of twenty twenty-six. What follows is a short
          catalogue of things I have built: a forecasting model for a credit portfolio,
          a puzzle-adventure that teaches algorithms, a social application for music listeners,
          and a retrieval engine over Hindu scriptures.
        </p>

        <section>
          <p style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'lowercase', color: theme.fgFaint, marginBottom: '0.75rem' }}>
            contents of the codex
          </p>
          <ol style={{ listStyle: 'none', padding: 0, borderTop: `1px solid ${theme.fgFaint}` }}>
            {NAV.slice(1).map(item => (
              <li key={item.id}>
                <button onClick={() => onNavigate(item.id)} style={{
                  display: 'grid', gridTemplateColumns: '4rem 1fr auto',
                  alignItems: 'baseline', columnGap: '1.5rem',
                  width: '100%', padding: '1rem 0',
                  background: 'none', border: 0, cursor: 'pointer', textAlign: 'left',
                  borderBottom: `1px solid ${theme.fgFaint}`, color: theme.fg,
                  transition: 'color 200ms ease',
                }}
                onMouseEnter={e => e.currentTarget.style.color = theme.accent}
                onMouseLeave={e => e.currentTarget.style.color = theme.fg}
                >
                  <span style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.08em', color: theme.fgFaint, textTransform: 'lowercase' }}>{item.folio}</span>
                  <span style={{ fontFamily: FONTS.display, fontSize: '1.2rem' }}>{item.title}</span>
                  <span style={{ fontFamily: FONTS.body, fontSize: '0.78rem', color: theme.fgSoft, fontStyle: 'italic' }}>{item.note}</span>
                </button>
              </li>
            ))}
          </ol>
        </section>

      </article>
    </main>
  );
}

// =============================================================
// ALGORITHMIA — dark, technical, terminal-flavored
// =============================================================
function AlgorithmiaPage({ theme, onNavigate }) {
  const rule = { border: 0, borderTop: `1px solid ${theme.fgFaint}`, margin: '2rem 0' };

  function SectionHead({ children }) {
    return (
      <p style={{ fontFamily: FONTS.mono, fontSize: '0.7rem', letterSpacing: '0.1em', color: theme.accent, marginBottom: '0.75rem' }}>
        <span style={{ color: theme.fgFaint }}>// </span>{children}
      </p>
    );
  }

  return (
    <main style={{
      minHeight: '100vh',
      backgroundColor: theme.bg,
      backgroundImage: 'radial-gradient(circle, rgba(60,100,210,0.32) 1px, transparent 1px)',
      backgroundSize: '28px 28px',
      padding: `clamp(3rem,5vw,5rem) ${G}`,
      transition: 'background-color 600ms ease',
    }}>
      <header style={{ marginBottom: 'clamp(2.5rem,5vw,5rem)', maxWidth: 900 }}>
        <p style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.08em', color: theme.accent, textTransform: 'lowercase', marginBottom: '1.25rem' }}>
          {'>'} f.2r · 2025–2026 · typescript · phaser 3 · vite · vitest
        </p>
        <h1 style={{ fontFamily: FONTS.mono, fontWeight: 500, fontSize: 'clamp(1.75rem,1.2rem + 3vw,3.5rem)', lineHeight: 1.05, color: theme.fg, margin: 0 }}>
          <span style={{ color: theme.accent }}>_</span>Algorithmia<br />
          <span style={{ color: theme.fgSoft, fontSize: '0.62em', fontWeight: 400 }}>: The Path of Logic</span>
        </h1>
        <p style={{ fontFamily: FONTS.body, fontStyle: 'italic', fontSize: '1.05rem', color: theme.fgSoft, marginTop: '0.75rem', maxWidth: '44ch' }}>
          A puzzle-adventure that teaches twelve algorithm concepts through play.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,17rem)', gap: 'clamp(2rem,3vw,4rem)', alignItems: 'start', maxWidth: 1000 }}>
        <div style={{ fontFamily: FONTS.body, color: theme.fg, lineHeight: 1.65, fontSize: '1.0625rem' }}>
          <p style={{ marginBottom: '1em' }}>
            <span style={{ float: 'left', fontFamily: FONTS.mono, fontWeight: 500, fontSize: '3.8em', lineHeight: 0.8, paddingRight: '0.08em', paddingTop: '0.05em', color: theme.accent }}>B</span>
            ullet points in an algorithms textbook leave a texture in your head and not much more.
            Spatial movement through a problem — the kind you only get by doing — makes the shape of an algorithm permanent.
            I wanted to build the second kind of learning.
          </p>

          <hr style={rule} />
          <SectionHead>approach</SectionHead>
          <p style={{ marginBottom: '1em' }}>
            Design a world where the mechanics <em>are</em> the algorithms. A sorting puzzle is a lane you must arrange
            objects through; you cannot progress until your intuition aligns with what the algorithm is actually doing.
            Twelve concepts: sorting, hashing, two pointers, sliding window, recursion, BFS and DFS,
            greedy choice, binary search, dynamic programming, memoization.
          </p>

          <hr style={rule} />
          <SectionHead>what I built</SectionHead>
          <p style={{ marginBottom: '1em' }}>
            Ten modular systems in TypeScript, coordinated through a typed publish-subscribe event bus so gameplay,
            dialogue, audio, and the education layer communicate without knowing about each other. State persists in
            localStorage behind a versioning and migration layer. The audio engine crossfades between tracks and
            object-pools samples. A branching dialogue system handles narrative turns that depend on what the player
            has already solved.
          </p>
          <p style={{ marginBottom: '1em' }}>
            After each puzzle: a five-stage post-puzzle education framework. Forty-seven unit tests in Vitest
            cover the event bus, the save-migration layer, education scoring, and puzzle invariants I did not want to regress on.
          </p>

          <hr style={rule} />
          <SectionHead>what it taught me</SectionHead>
          <p>
            Explaining something interactively is more honest than explaining it in prose. I wrote the sliding-window
            tutorial three times before I realized my mental model for it had been slightly wrong — the interactive
            version would not behave the way I was describing, and I had to trust the simulation over my own words.
          </p>
        </div>

        <aside style={{
          position: 'sticky', top: 'calc(3rem + 1.5rem)',
          background: theme.surface, border: `1px solid ${theme.fgFaint}`,
          padding: '1.25rem',
        }}>
          <div style={{ fontFamily: FONTS.mono, fontSize: '0.63rem', color: theme.accent, marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: `1px solid ${theme.fgFaint}` }}>
            {'>'} manifest.json
          </div>
          <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: '1rem', rowGap: '0.55rem', fontFamily: FONTS.mono, fontSize: '0.63rem' }}>
            {[
              ['stack',   'TypeScript · Phaser 3 · Vite · Vitest'],
              ['status',  'active dev, Apr 2026'],
              ['tests',   '47 passing'],
              ['puzzles', '≈20 · 12 concepts'],
              ['arch',    'pub/sub bus · localStorage migration · object-pool audio'],
              ['repo',    'github.com/snjvkthrvn/algorithmia'],
            ].map(([k, v]) => (
              <React.Fragment key={k}>
                <dt style={{ color: theme.fgFaint, letterSpacing: '0.08em' }}>{k}</dt>
                <dd style={{ margin: 0, color: theme.fg }}>{v}</dd>
              </React.Fragment>
            ))}
          </dl>
          <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: `1px solid ${theme.fgFaint}`, fontFamily: FONTS.mono, fontSize: '0.6rem', color: theme.fgSoft }}>
            <span style={{ color: theme.accent }}>→ </span>active rewrite adds React 19 shell + OpenAI hint system
          </div>
        </aside>
      </div>

      <PaginationRow theme={theme} prev={null} next={{ id: 'replay', folio: 'f. 2v', title: 'Replay' }} onNavigate={onNavigate} />
    </main>
  );
}

// =============================================================
// REPLAY — deep purple, bold, music-forward
// =============================================================
function Waveform({ color }) {
  const pts = Array.from({ length: 97 }, (_, i) => {
    const x = (i / 96) * 960;
    const y = 30 + Math.sin(i * 0.42) * 13 + Math.sin(i * 1.1) * 6 + Math.sin(i * 2.3) * 3;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg viewBox="0 0 960 60" style={{ width: '100%', maxWidth: 720, height: 38, display: 'block' }} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" opacity="0.25" />
    </svg>
  );
}

function ReplayPage({ theme, onNavigate }) {
  const segments = [
    { time: '06–10', name: 'morning',   desc: 'Commute, first light, the cup before you leave.' },
    { time: '11–14', name: 'midday',    desc: 'A break, something in the background.' },
    { time: '15–19', name: 'afternoon', desc: 'Wind-down, the drive home, decompression.' },
    { time: '20–00', name: 'night',     desc: 'The closing hour. What you choose to end on.' },
  ];

  return (
    <main style={{ background: theme.bg, minHeight: '100vh', padding: `clamp(3rem,5vw,5rem) ${G}`, transition: 'background 600ms ease' }}>

      <header style={{ marginBottom: 'clamp(3rem,6vw,6rem)' }}>
        <p style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.08em', color: theme.fgFaint, textTransform: 'lowercase', marginBottom: '1.5rem' }}>
          f. 2v · 2025–2026 · react native · expo · node · postgres · redis · socket.io
        </p>
        <h1 style={{
          fontFamily: FONTS.display, fontWeight: 700,
          fontSize: 'clamp(4.5rem,3rem + 6vw,10rem)',
          lineHeight: 0.91, letterSpacing: '-0.03em',
          color: theme.fg, margin: 0,
        }}>Replay</h1>
        <Waveform color={theme.accent} />
        <p style={{ fontFamily: FONTS.body, fontStyle: 'italic', fontSize: '1.15rem', color: theme.fgSoft, marginTop: '0.25rem', maxWidth: '44ch' }}>
          Social music sharing, tuned to the rhythm of a day.
        </p>
      </header>

      <section style={{ maxWidth: 900, marginBottom: '4rem' }}>
        <p style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'lowercase', color: theme.fgFaint, marginBottom: '1rem' }}>
          the four windows
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: theme.fgFaint }}>
          {segments.map((s, i) => (
            <div key={s.name} style={{
              background: i === 3 ? theme.bgDeep : theme.surface,
              padding: '1.25rem 1rem',
              borderTop: i === 3 ? `2px solid ${theme.accent}` : '2px solid transparent',
            }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: '0.58rem', color: theme.accent, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{s.time}</div>
              <div style={{ fontFamily: FONTS.display, fontSize: '1.1rem', color: theme.fg, marginBottom: '0.4rem' }}>{s.name}</div>
              <div style={{ fontFamily: FONTS.body, fontSize: '0.78rem', color: theme.fgSoft, lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,16rem)', gap: 'clamp(2rem,3vw,4rem)', alignItems: 'start', maxWidth: 1000 }}>
        <div style={{ fontFamily: FONTS.body, color: theme.fg, lineHeight: 1.65, fontSize: '1.0625rem' }}>
          <p style={{ marginBottom: '1.5em' }}>
            Most music sharing is one-to-many or asynchronous. Neither captures the small window where the good thing is still new. Replay is a social app built around that window: sharing is bounded to four daily segments, and a replay is considered current inside its segment, archival outside of it.
          </p>

          <h2 style={{ fontFamily: FONTS.display, fontSize: '1.6rem', fontWeight: 500, color: theme.fg, margin: '2.5rem 0 0.75rem' }}>Architecture</h2>
          <p style={{ marginBottom: '1.5em' }}>
            React Native + Expo to iOS, Android, and web from one codebase. Express with Prisma over Postgres,
            fronted by Redis for caching Spotify API responses and backing a job queue for capture events. Real-time
            updates go through Socket.IO with Firebase Cloud Messaging as push fallback for backgrounded clients.
            A background job polls the Spotify Web API at randomized intervals per user — no thundering herd — then
            persists captures into Postgres. Targeted cache invalidation on known state changes reduced outbound
            Spotify calls by around forty percent versus a naive per-request architecture.
          </p>

          <h2 style={{ fontFamily: FONTS.display, fontSize: '1.6rem', fontWeight: 500, color: theme.fg, margin: '2.5rem 0 0.75rem' }}>What it taught me</h2>
          <p>
            The constraint — one post per window per day — turned out to be generative. When users cannot spam,
            they choose carefully. The feed becomes a curated object rather than a stream. I did not predict this
            when I designed the system; it emerged from the constraint itself, which is the best kind of design outcome.
          </p>
        </div>

        <aside style={{ position: 'sticky', top: 'calc(3rem + 1.5rem)', borderLeft: `2px solid ${theme.accent}`, paddingLeft: '1.25rem' }}>
          <dl style={{ display: 'grid', rowGap: '1rem' }}>
            {[
              ['client',   'React Native, Expo — iOS · Android · web'],
              ['server',   'Node.js, Express, Prisma, PostgreSQL'],
              ['realtime', 'Redis, Socket.IO, Firebase Cloud Messaging'],
              ['auth',     'Spotify OAuth 2.0 · JWT · per-route rate limits'],
              ['cache',    '≈40% reduction in Spotify API calls'],
              ['status',   'active dev, Apr 2026'],
              ['repo',     'github.com/snjvkthrvn/replay'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'lowercase', color: theme.fgFaint, marginBottom: '0.15rem' }}>{k}</dt>
                <dd style={{ margin: 0, fontFamily: FONTS.body, fontSize: '0.875rem', color: theme.fgSoft, lineHeight: 1.5 }}>{v}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      <PaginationRow theme={theme}
        prev={{ id: 'algorithmia', folio: 'f. 2r', title: 'Algorithmia' }}
        next={{ id: 'scriptures',  folio: 'f. 3r', title: 'Hindu Scriptures RAG' }}
        onNavigate={onNavigate}
      />
    </main>
  );
}

// =============================================================
// HINDU SCRIPTURES RAG — saffron ochre, dense, reverent
// =============================================================
function ScripturesPage({ theme, onNavigate }) {
  function Rule() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '2.25rem 0' }}>
        <div style={{ flex: 1, height: 1, background: theme.fgFaint }} />
        <span style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', color: theme.fgFaint }}>◆</span>
        <div style={{ flex: 1, height: 1, background: theme.fgFaint }} />
      </div>
    );
  }

  return (
    <main style={{ background: theme.bg, minHeight: '100vh', padding: `clamp(3rem,5vw,5rem) ${G}`, transition: 'background 600ms ease' }}>

      <header style={{ marginBottom: 'clamp(2.5rem,4vw,4rem)', maxWidth: 900 }}>
        <p style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.08em', color: theme.fgFaint, textTransform: 'lowercase', marginBottom: '2rem' }}>
          f. 3r · 2025–2026 · python · flask · qdrant · cohere · anthropic
        </p>

        <blockquote style={{ margin: '0 0 2.5rem', paddingLeft: '1.5rem', borderLeft: `3px solid ${theme.accent}`, maxWidth: '44ch' }}>
          <p style={{ fontFamily: FONTS.display, fontSize: '1.3rem', color: theme.fg, lineHeight: 1.55, marginBottom: '0.4rem' }}>
            विद्याविनयसम्पन्ने ब्राह्मणे गवि हस्तिनि।
          </p>
          <p style={{ fontFamily: FONTS.body, fontStyle: 'italic', fontSize: '0.875rem', color: theme.fgSoft, lineHeight: 1.55 }}>
            "The wise see the same reality in a learned brahmin, a cow, an elephant." — Bhagavad Gītā 5.18
          </p>
        </blockquote>

        <h1 style={{ fontFamily: FONTS.display, fontWeight: 400, fontSize: 'clamp(2rem,1.5rem + 2.5vw,3.5rem)', lineHeight: 1.05, letterSpacing: '-0.015em', color: theme.fg, maxWidth: '18ch', margin: 0 }}>
          A Retrieval Engine on Hindu Scriptures
        </h1>
        <p style={{ fontFamily: FONTS.body, fontStyle: 'italic', fontSize: '1.05rem', color: theme.fgSoft, marginTop: '0.5rem', maxWidth: '42ch' }}>
          Two hundred thousand verses from fifteen texts, with a ReAct loop over top.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,16rem)', gap: 'clamp(2rem,3vw,4rem)', alignItems: 'start', maxWidth: 1000 }}>
        <div style={{ fontFamily: FONTS.body, color: theme.fg, lineHeight: 1.7, fontSize: '1.0625rem' }}>
          <p style={{ marginBottom: '1em' }}>
            <span style={{ float: 'left', fontFamily: FONTS.display, fontWeight: 700, fontSize: '4.2em', lineHeight: 0.8, paddingRight: '0.1em', paddingTop: '0.05em', color: theme.accent }}>S</span>
            cripture has no search bar. A RAG pipeline can give it one — but only if the pipeline is honest about the texts it is indexing, and modest about what retrieval can do for a reader who came looking for consolation rather than a citation.
          </p>

          <Rule />
          <h2 style={{ fontFamily: FONTS.display, fontSize: '1.5rem', color: theme.fg, margin: '0 0 0.75rem' }}>The corpus</h2>
          <p style={{ marginBottom: '1em' }}>
            Roughly two hundred thousand verses from fifteen-plus texts: the Bhagavad Gītā, the eleven principal
            Upanishads, the Yoga Sutras, Viveka Chudāmani, and chapter-level portions of the Mahābhārata and
            Rāmāyaṇa. Each source ships in a different format with different transliteration conventions and
            chapter-and-verse schemes. The pipeline's hardest job is the first layer: parse these incompatible
            inputs into a unified schema — tradition, text, book, chapter, verse, original script, transliteration,
            translation, commentary.
          </p>

          <Rule />
          <h2 style={{ fontFamily: FONTS.display, fontSize: '1.5rem', color: theme.fg, margin: '0 0 0.75rem' }}>Retrieval</h2>
          <p style={{ marginBottom: '1em' }}>
            Hybrid search over a Qdrant vector store: Cohere multilingual dense embeddings for semantic similarity,
            BM25 sparse retrieval for proper-noun and keyword hits, fused with Reciprocal Rank Fusion. Pure dense
            retrieval missed sage names and place names; BM25 on its own missed conceptual paraphrases. The fusion
            holds both. Over the retriever: a ReAct-style agent loop — the model can retrieve more verses, re-query
            with different semantic tags, or compose a response with inline citations.
          </p>

          <Rule />
          <h2 style={{ fontFamily: FONTS.display, fontSize: '1.5rem', color: theme.fg, margin: '0 0 0.75rem' }}>What it taught me</h2>
          <p>
            The retrieval is not the hard part. The data is the hard part. Producing a single consistent canonical
            reference for any given verse required more design work than anything on the model side. I have come to
            believe this is true for most RAG systems worth building: the retrieval is a library card catalog —
            it only works if someone has first done the work of cataloging.
          </p>
        </div>

        <aside style={{ position: 'sticky', top: 'calc(3rem + 1.5rem)', background: theme.surface, padding: '1.25rem' }}>
          <dl style={{ display: 'grid', rowGap: '0.9rem' }}>
            {[
              ['corpus',    '≈200k verses · 15+ texts'],
              ['tier 1',    'Bhagavad Gītā · 11 Upanishads'],
              ['tier 2',    'Yoga Sutras · Viveka Chudāmani · Mahābhārata · Rāmāyaṇa'],
              ['retrieval', 'Cohere dense + BM25 sparse · RRF fusion'],
              ['metadata',  'tradition · theme · life domain'],
              ['agent',     'ReAct loop · Anthropic tool-use · swappable backend'],
              ['stack',     'Python · Qdrant · Flask · Docker · Anthropic'],
              ['repo',      'github.com/snjvkthrvn/hindu-scriptures-rag'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'lowercase', color: theme.fgFaint, marginBottom: '0.15rem' }}>{k}</dt>
                <dd style={{ margin: 0, fontFamily: FONTS.body, fontSize: '0.8rem', color: theme.fgSoft, lineHeight: 1.5 }}>{v}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      <PaginationRow theme={theme}
        prev={{ id: 'replay',   folio: 'f. 2v', title: 'Replay' }}
        next={{ id: 'vita',     folio: 'f. 4r', title: 'Vita' }}
        onNavigate={onNavigate}
      />
    </main>
  );
}

// =============================================================
// VITA — near-white, Swiss grid, professional
// =============================================================
function VitaPage({ theme, onNavigate }) {
  const entries = [
    {
      date: '2021 – 2025', note: 'dec 2025',
      title: 'Rutgers University',
      role: 'B.A. Computer Science and Data Science',
      body: 'Coursework spanning machine learning principles, design and analysis of algorithms, data structures, computer architecture, discrete structures I and II, applied statistical learning, and artificial intelligence.',
    },
    {
      date: 'Jun – Sep 2024',
      title: 'Cholamandalam Investment and Finance Company',
      role: 'Machine Learning Intern',
      body: 'Built a multivariate LSTM neural network for monthly HCV loan delinquency forecasting, improving on internal analytics predictions by half a percentage point through a three-layer architecture with dropout regularization and Adam optimization. Presented to the chief risk officer alongside a reproducible state-wise prediction framework. Engineered a time-series pipeline integrating 71 months of macroeconomic indicators with internal credit metrics across 70+ variables and 10+ cities.',
    },
    {
      date: '2025 – present',
      title: 'Independent Work',
      role: 'Three projects, each with its own folio.',
      projects: [
        { id: 'algorithmia', title: 'Algorithmia: The Path of Logic', stack: 'TypeScript · Phaser 3 · Vite' },
        { id: 'replay',      title: 'Replay',                         stack: 'React Native · Expo · Node · Postgres · Redis' },
        { id: 'scriptures',  title: 'A Retrieval Engine on Hindu Scriptures', stack: 'Python · Qdrant · Cohere · Anthropic' },
      ],
    },
    {
      date: 'instruments',
      title: 'Technical Skills',
      skills: [
        ['languages', 'Python, Java, TypeScript, JavaScript, SQL, C, R'],
        ['web & app',  'React, React Native, Next.js, Node, Express, Django, Flask, Phaser 3, Tailwind'],
        ['data',       'PostgreSQL, MySQL, MongoDB, Redis, Qdrant, AWS (EC2, S3), Firebase, Docker'],
        ['ml & ai',    'PyTorch, TensorFlow, Scikit-learn, OpenAI API, Anthropic API, LSTM, pandas'],
      ],
    },
    {
      date: 'credentials',
      title: 'Certifications',
      certs: [
        'Stanford University (Coursera) — Advanced Learning Algorithms; Supervised Machine Learning.',
        'Meta Backend Developer — Professional Certificate. Python, Django, APIs, MySQL, Git, Cloud Hosting.',
      ],
    },
  ];

  return (
    <main style={{ background: theme.bg, minHeight: '100vh', padding: `clamp(3rem,5vw,5rem) ${G}`, transition: 'background 600ms ease' }}>
      <article style={{ maxWidth: 900 }}>
        <header style={{ marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: `1px solid ${theme.fgFaint}` }}>
          <p style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.08em', color: theme.fgFaint, textTransform: 'lowercase', marginBottom: '1rem' }}>
            f. 4r · sanjeev kathiravan · edison, nj
          </p>
          <h1 style={{ fontFamily: FONTS.display, fontWeight: 400, fontSize: 'clamp(2.5rem,2rem + 2.5vw,4.5rem)', lineHeight: 1.02, letterSpacing: '-0.02em', color: theme.fg, margin: '0 0 0.5rem' }}>
            Vita
          </h1>
          <p style={{ fontFamily: FONTS.body, fontStyle: 'italic', fontSize: '1.05rem', color: theme.fgSoft, marginBottom: '1.5rem' }}>
            Curriculum vitae, in the old sense.
          </p>
          <p style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'lowercase', color: theme.fgSoft }}>
            sanjeevkathiravanpro@gmail.com · 551-358-9937 · linkedin · github · resume (pdf)
          </p>
        </header>

        {entries.map((entry, i) => (
          <section key={i} style={{ display: 'grid', gridTemplateColumns: '9rem 1fr', gap: '2.5rem', padding: '2.5rem 0', borderBottom: `1px solid ${theme.fgFaint}` }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'lowercase', color: theme.fgFaint, paddingTop: '0.55rem', lineHeight: 1.6 }}>
              <div>{entry.date}</div>
              {entry.note && <div style={{ fontStyle: 'italic', color: theme.fgSoft }}>{entry.note}</div>}
            </div>
            <div>
              <h2 style={{ fontFamily: FONTS.display, fontSize: '1.5rem', color: theme.fg, margin: '0 0 0.2rem' }}>{entry.title}</h2>
              {entry.role && <p style={{ fontFamily: FONTS.body, fontStyle: 'italic', color: theme.fgSoft, marginBottom: entry.body ? '0.75rem' : '0.5rem' }}>{entry.role}</p>}
              {entry.body && <p style={{ fontFamily: FONTS.body, lineHeight: 1.65, color: theme.fg, maxWidth: '58ch', margin: 0 }}>{entry.body}</p>}
              {entry.projects && (
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.5rem' }}>
                  {entry.projects.map(p => (
                    <li key={p.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'baseline', gap: '1rem', padding: '0.6rem 0', borderBottom: `1px solid ${theme.fgFaint}` }}>
                      <button onClick={() => onNavigate(p.id)} style={{ background: 'none', border: 0, cursor: 'pointer', textAlign: 'left', fontFamily: FONTS.display, fontSize: '1.1rem', color: theme.fg, transition: 'color 180ms ease' }}
                        onMouseEnter={e => e.currentTarget.style.color = theme.accent}
                        onMouseLeave={e => e.currentTarget.style.color = theme.fg}
                      >{p.title}</button>
                      <span style={{ fontFamily: FONTS.mono, fontSize: '0.56rem', color: theme.fgFaint, letterSpacing: '0.06em', textTransform: 'lowercase', whiteSpace: 'nowrap' }}>{p.stack}</span>
                    </li>
                  ))}
                </ul>
              )}
              {entry.skills && (
                <dl style={{ display: 'grid', gridTemplateColumns: '7rem 1fr', columnGap: '1.5rem', rowGap: '0.5rem', maxWidth: '58ch', marginTop: '0.5rem' }}>
                  {entry.skills.map(([k, v]) => (
                    <React.Fragment key={k}>
                      <dt style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'lowercase', color: theme.fgFaint }}>{k}</dt>
                      <dd style={{ margin: 0, fontFamily: FONTS.body, color: theme.fg }}>{v}</dd>
                    </React.Fragment>
                  ))}
                </dl>
              )}
              {entry.certs && (
                <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '0.75rem', marginTop: '0.5rem' }}>
                  {entry.certs.map((c, ci) => <li key={ci} style={{ fontFamily: FONTS.body, color: theme.fg, maxWidth: '58ch', lineHeight: 1.65 }}>{c}</li>)}
                </ul>
              )}
            </div>
          </section>
        ))}
      </article>
    </main>
  );
}

// =============================================================
// COLOPHON — near-black warm, quiet close
// =============================================================
function ColophonPage({ theme }) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard?.writeText('sanjeevkathiravanpro@gmail.com').catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <main style={{
      background: theme.bg, minHeight: '100vh',
      padding: `clamp(5rem,12vw,14rem) ${G}`,
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      transition: 'background 600ms ease',
    }}>
      <article style={{ maxWidth: 680 }}>
        <p style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'lowercase', color: theme.fgFaint, marginBottom: '4rem' }}>
          f. 4v
        </p>

        <button onClick={copy} style={{
          background: 'none', border: 0, cursor: 'pointer', textAlign: 'left', padding: 0, display: 'block',
          fontFamily: FONTS.display,
          fontSize: 'clamp(1.25rem,1rem + 2.2vw,2.5rem)',
          lineHeight: 1.1, letterSpacing: '-0.02em',
          color: copied ? theme.accent : theme.fg,
          transition: 'color 200ms ease',
          marginBottom: copied ? '0.4rem' : '0',
        }}>
          sanjeevkathiravanpro@gmail.com
        </button>
        {copied && (
          <p style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', color: theme.accent, letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
            copied. ✓
          </p>
        )}

        <div style={{ display: 'flex', gap: '2rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
          {[
            ['linkedin', 'https://linkedin.com/in/sanjeev-kathiravan'],
            ['github',   'https://github.com/snjvkthrvn'],
            ['resume',   '/sk_resume_.pdf'],
            ['source',   'https://github.com/snjvkthrvn/port-website'],
          ].map(([label, href]) => (
            <a key={label} href={href} rel="noreferrer" target="_blank" style={{
              fontFamily: FONTS.mono, fontSize: '0.68rem', letterSpacing: '0.08em',
              textTransform: 'lowercase', color: theme.fgSoft, textDecoration: 'none',
              borderBottom: `1px solid ${theme.fgFaint}`, paddingBottom: '0.1rem',
              transition: 'color 180ms ease, border-color 180ms ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = theme.accent; e.currentTarget.style.borderBottomColor = theme.accent; }}
            onMouseLeave={e => { e.currentTarget.style.color = theme.fgSoft; e.currentTarget.style.borderBottomColor = theme.fgFaint; }}
            >{label}</a>
          ))}
        </div>

        <hr style={{ border: 0, borderTop: `1px solid ${theme.fgFaint}`, margin: '3.5rem 0' }} />

        <p style={{ fontFamily: FONTS.body, fontStyle: 'italic', color: theme.fgSoft, lineHeight: 1.7, maxWidth: '54ch', marginBottom: '1rem' }}>
          This codex was typeset in Playfair Display, Source Serif 4, and JetBrains Mono,
          composed in Astro, pressed 2026-04-23, in Edison, New Jersey.
        </p>
        <p style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'lowercase', color: theme.fgFaint }}>
          rev. unreleased
        </p>
      </article>
    </main>
  );
}

Object.assign(window, {
  InkInTitle, FrontispiecePage,
  Waveform, AlgorithmiaPage, ReplayPage,
  ScripturesPage, VitaPage, ColophonPage,
});
