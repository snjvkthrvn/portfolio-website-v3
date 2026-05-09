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
            sk · 2026 · engineer + builder
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
            Recent Rutgers CS graduate. I build games, apps, and AI pipelines — three of them live in this codex.
          </p>
        </div>

        {/* Project cards with stagger */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1px', background: BASE.fgFaint }}>
          {PROJECTS.map((p, i) => (
            <div key={p.id} style={{ opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(24px)', transition: `opacity 700ms ease ${1200 + i * 140}ms, transform 700ms ease ${1200 + i * 140}ms` }}>
              <ProjectCard project={p} onScrollTo={onScrollTo} />
            </div>
          ))}
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
          <p style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', color: accent, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            {'>'} f.2r · typescript · phaser 3 · vite
          </p>
          <h2 style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: 'clamp(2.5rem,2rem + 4vw,6rem)', lineHeight: 0.95, color: BASE.fg, margin: '0 0 0.5rem' }}>
            <GlitchText accent={accent}>Algorithmia</GlitchText>
          </h2>
          <p style={{ fontFamily: FONTS.display, fontStyle: 'italic', fontSize: 'clamp(1rem,0.8rem + 1vw,1.5rem)', color: BASE.fgSoft, marginBottom: '3rem' }}>
            The Path of Logic
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
              <div style={{ fontFamily: FONTS.display, fontSize: 'clamp(2.5rem,2rem + 2vw,4rem)', color: accent, lineHeight: 1 }}>
                {suffix}{val}
              </div>
              <div style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', color: BASE.fgFaint, letterSpacing: '0.08em', textTransform: 'lowercase', marginTop: '0.5rem' }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,15rem)', gap: 'clamp(2rem,3vw,4rem)', alignItems: 'start' }}>
          <div>
            {[
              ['approach', 'Design a world where the mechanics are the algorithms. A sorting puzzle is a lane you must arrange objects through; you cannot progress until your intuition aligns with what the algorithm is actually doing. Twelve concepts covered — sorting through memoization.'],
              ['what I built', 'Ten modular systems in TypeScript, coordinated through a typed publish-subscribe event bus. State persists in localStorage behind a versioning and migration layer. The audio engine crossfades between tracks and object-pools samples. A branching dialogue system handles narrative turns.'],
              ['what it taught me', 'Explaining something interactively is more honest than explaining it in prose. I wrote the sliding-window tutorial three times before I realized my mental model for it had been slightly wrong — the interactive version would not behave the way I was describing, and I had to trust the simulation over my own words.'],
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
              <div style={{ color: accent, marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: `1px solid ${BASE.fgFaint}` }}>{'>'} manifest.json</div>
              <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: '1rem', rowGap: '0.55rem' }}>
                {[['stack','TypeScript · Phaser 3 · Vite · Vitest'],['status','active dev, Apr 2026'],['arch','pub/sub · localStorage migration · object-pool audio'],['repo','github.com/snjvkthrvn/algorithmia']].map(([k,v]) => (
                  <React.Fragment key={k}>
                    <dt style={{ color: BASE.fgFaint }}>{k}</dt>
                    <dd style={{ margin: 0, color: BASE.fg }}>{v}</dd>
                  </React.Fragment>
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
            f. 2v · react native · node · postgres · redis · socket.io
          </p>
          <h2 style={{ fontFamily: FONTS.display, fontWeight: 700, fontSize: 'clamp(4rem,3rem + 6vw,11rem)', lineHeight: 0.9, letterSpacing: '-0.035em', color: BASE.fg, margin: 0 }}>
            Replay
          </h2>
          <AnimatedWaveform color={accent} />
          <p style={{ fontFamily: FONTS.body, fontStyle: 'italic', fontSize: '1.15rem', color: BASE.fgSoft, marginTop: '0.25rem', marginBottom: '3rem', maxWidth: '44ch' }}>
            Social music sharing, tuned to the rhythm of a day.
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
              ['the constraint', 'Sharing bounded to four daily segments. A replay is current inside its segment, archival outside of it. The constraint — one post per window per day — turned out to be generative. When users cannot spam, they choose carefully.'],
              ['the architecture', 'React Native + Expo to iOS, Android, and web from one codebase. Express with Prisma over Postgres, fronted by Redis for caching Spotify API responses and a job queue for capture events. Real-time via Socket.IO; Firebase Cloud Messaging as push fallback. Targeted cache invalidation reduced outbound Spotify calls by ≈40%.'],
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
      <div style={{ maxWidth: 1000, position: 'relative', zIndex: 1 }}>
        <Reveal>
          <p style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: BASE.fgSoft, marginBottom: '2rem' }}>
            f. 3r · python · qdrant · cohere · flask · anthropic
          </p>
          <blockquote style={{ margin: '0 0 2.5rem', paddingLeft: '1.5rem', borderLeft: `3px solid ${accent}`, maxWidth: '44ch' }}>
            <p style={{ fontFamily: FONTS.display, fontSize: '1.25rem', color: BASE.fg, lineHeight: 1.55, marginBottom: '0.4rem' }}>
              विद्याविनयसम्पन्ने ब्राह्मणे गवि हस्तिनि।
            </p>
            <p style={{ fontFamily: FONTS.body, fontStyle: 'italic', fontSize: '0.875rem', color: BASE.fgSoft, lineHeight: 1.55 }}>
              "The wise see the same reality in a brahmin, a cow, an elephant." — Gītā 5.18
            </p>
          </blockquote>
          <h2 style={{ fontFamily: FONTS.display, fontWeight: 400, fontSize: 'clamp(2rem,1.5rem + 3vw,5rem)', lineHeight: 1.02, color: BASE.fg, maxWidth: '14ch', margin: '0 0 0.5rem' }}>
            A Retrieval Engine on Hindu Scriptures
          </h2>
          <p style={{ fontFamily: FONTS.body, fontStyle: 'italic', fontSize: '1.1rem', color: BASE.fgSoft, maxWidth: '42ch', marginBottom: '3.5rem' }}>
            Two hundred thousand verses. Hybrid search. A ReAct loop on top.
          </p>
        </Reveal>

        {/* Corpus stats */}
        <Reveal delay={80}>
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', marginBottom: '3.5rem', paddingBottom: '2.5rem', borderBottom: `1px solid oklch(25% 0.02 68)` }}>
            {[['≈200k', 'verses indexed'],['15+', 'source texts'],['10+', 'life-domain tags'],['3', 'retrieval modes']].map(([n, l]) => (
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
              ['the problem', 'Scripture has no search bar. A RAG pipeline can give it one — but only if the pipeline is honest about the texts it is indexing, and modest about what retrieval can do for a reader who came looking for consolation rather than a citation.'],
              ['retrieval', 'Hybrid search over Qdrant: Cohere multilingual dense embeddings for semantic similarity, BM25 sparse retrieval for proper-noun and keyword hits, fused with Reciprocal Rank Fusion. Pure dense retrieval missed sage names; BM25 missed conceptual paraphrases. The fusion holds both.'],
              ['what it taught me', 'The retrieval is not the hard part. The data is the hard part. Producing a single consistent canonical reference for any given verse required more design work than anything on the model side.'],
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
                {[['tier 1','Bhagavad Gītā · 11 Upanishads'],['tier 2','Yoga Sutras · Viveka Chudāmani · Mahābhārata'],['retrieval','Cohere dense + BM25 · RRF'],['agent','ReAct · Anthropic tool-use'],['serve','Flask + SSE · Docker Qdrant'],['repo','github.com/snjvkthrvn/hindu-scriptures-rag']].map(([k,v]) => (
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
// VITA SECTION
// ════════════════════════════════════════════════════════════════════
function VitaSection() {
  const accent = SECTIONS_DATA[4].accent;
  const skillsRef = React.useRef(null);
  const [skillsVis, setSkillsVis] = React.useState(false);
  React.useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSkillsVis(true); obs.disconnect(); } }, { threshold: 0.2 });
    if (skillsRef.current) obs.observe(skillsRef.current);
    return () => obs.disconnect();
  }, []);

  const entries = [
    { date: '2021–2025', org: 'Rutgers University', role: 'B.A. Computer Science & Data Science', detail: 'Machine learning, algorithms, data structures, computer architecture, applied statistical learning, AI.' },
    { date: 'Jun–Sep 2024', org: 'Cholamandalam Investment and Finance Company', role: 'Machine Learning Intern', detail: 'Built a multivariate LSTM for monthly HCV loan delinquency forecasting, improving predictions by 0.5 pp. Presented to the chief risk officer. Engineered a pipeline over 71 months of macroeconomic indicators.' },
  ];

  const skills = [
    { label: 'Python / ML',         pct: 90 },
    { label: 'TypeScript / React',  pct: 85 },
    { label: 'Systems & databases', pct: 78 },
    { label: 'React Native / Expo', pct: 75 },
    { label: 'AI / RAG pipelines',  pct: 82 },
  ];

  return (
    <section id="vita" style={{ minHeight: '100vh', padding: `clamp(4rem,8vw,8rem) ${G}`, background: BASE.bgMid }}>
      <div style={{ maxWidth: 1000 }}>
        <Reveal>
          <p style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: BASE.fgSoft, marginBottom: '1.25rem' }}>f. 4r</p>
          <h2 style={{ fontFamily: FONTS.display, fontWeight: 400, fontSize: 'clamp(3rem,2rem + 4vw,7rem)', lineHeight: 0.94, letterSpacing: '-0.025em', color: BASE.fg, margin: '0 0 0.5rem' }}>Vita</h2>
          <p style={{ fontFamily: FONTS.body, fontStyle: 'italic', fontSize: '1.05rem', color: BASE.fgSoft, marginBottom: '3.5rem', maxWidth: '44ch' }}>
            Curriculum vitae, in the old sense.
          </p>
        </Reveal>

        {/* Timeline entries */}
        <div style={{ marginBottom: '4rem' }}>
          {entries.map((e, i) => (
            <Reveal key={e.org} delay={i * 100}>
              <div style={{ display: 'grid', gridTemplateColumns: '8.5rem 1fr', gap: '2.5rem', padding: '2rem 0', borderBottom: `1px solid ${BASE.fgFaint}`, position: 'relative' }}>
                <div style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.06em', textTransform: 'lowercase', color: BASE.fgFaint, paddingTop: '0.5rem' }}>{e.date}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: accent, boxShadow: `0 0 10px ${accent}`, flexShrink: 0 }} />
                    <h3 style={{ fontFamily: FONTS.display, fontSize: '1.4rem', color: BASE.fg, fontWeight: 500 }}>{e.org}</h3>
                  </div>
                  <p style={{ fontFamily: FONTS.body, fontStyle: 'italic', color: BASE.fgSoft, marginBottom: '0.75rem', paddingLeft: '1.5rem' }}>{e.role}</p>
                  <p style={{ fontFamily: FONTS.body, fontSize: '0.9375rem', color: BASE.fgSoft, lineHeight: 1.65, maxWidth: '55ch', paddingLeft: '1.5rem' }}>{e.detail}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Skill bars */}
        <div ref={skillsRef} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '1rem 4rem' }}>
          {skills.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <SkillBar label={s.label} pct={s.pct} accent={accent} active={skillsVis} delay={i * 100} />
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
  const accent = SECTIONS_DATA[5].accent;
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
          <p style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: BASE.fgSoft, marginBottom: '3rem' }}>f. 4v · colophon</p>
        </Reveal>
        <Reveal delay={80}>
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
          {copied && <p style={{ fontFamily: FONTS.mono, fontSize: '0.6rem', color: accent, letterSpacing: '0.08em' }}>copied. ✓</p>}
        </Reveal>
        <Reveal delay={160}>
          <div style={{ display: 'flex', gap: '2.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            {[['linkedin','https://linkedin.com/in/sanjeev-kathiravan'],['github','https://github.com/snjvkthrvn'],['resume','/sk_resume_.pdf'],['source','https://github.com/snjvkthrvn/port-website']].map(([label, href]) => (
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
            <p style={{ fontFamily: FONTS.body, fontStyle: 'italic', color: BASE.fgSoft, fontSize: '0.9rem', lineHeight: 1.65, maxWidth: '52ch', marginBottom: '0.75rem' }}>
              Typeset in Playfair Display, Source Serif 4, and JetBrains Mono. Composed in Astro. Pressed 2026-04-23, Edison, New Jersey.
            </p>
            <p style={{ fontFamily: FONTS.mono, fontSize: '0.58rem', color: BASE.fgFaint, letterSpacing: '0.08em', textTransform: 'lowercase' }}>rev. unreleased</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

Object.assign(window, {
  AnimatedWaveform, FloatingParticles, SkillBar,
  HeroSection, AlgorithmiaSection, ReplaySection,
  ScripturesSection, VitaSection, ContactSection,
});
