import { QuartzComponent, QuartzComponentConstructor } from "./types"

type Project = {
  name: string
  description: string
  tags: string
  href: string
}

type CurrentItem = {
  label: string
  value: string
}

// ── Edit these when your situation changes ──────────────────────────
const TAGLINES: string[] = ["systems thinker.", "full-stack dev.", "builds things that work."]

const PROJECTS: Project[] = [
  {
    name: "SelfForge",
    description:
      "AI self-improvement platform with custom auth and a RAG pipeline over user notes.",
    tags: "FastAPI, PostgreSQL, LangChain, FAISS, React, AWS",
    href: "/projects",
  },
  {
    name: "Lumina Invest",
    description: "Portfolio tracker with custom CSV imports for Moomoo and Revolut exports.",
    tags: "React, Express, Yahoo Finance API, papaparse",
    href: "/projects",
  },
  {
    name: "Knowledge Graph Portfolio",
    description: "This site: Quartz notes, Cloudflare Workers, and a graph layer for navigation.",
    tags: "Quartz v4, Three.js, Cloudflare Workers",
    href: "/graph",
  },
]

const CURRENTLY: CurrentItem[] = [
  { label: "building", value: "resq, a Win32 tray resolution manager" },
  { label: "reading", value: "—" },
  { label: "listening", value: "—" },
]
// ────────────────────────────────────────────────────────────────────

// Typewriter timing:
// - TYPE_SPEED_MS controls how fast each phrase appears.
// - PAUSE_MS controls how long the complete phrase stays visible.
// - DELETE_SPEED_MS controls how fast the phrase is erased.
// - NEXT_PAUSE_MS controls the beat before the next phrase starts.
// Lower the numbers to speed it up; raise them to make it calmer.
const TYPE_SPEED_MS = 76 // ms per character while typing
const PAUSE_MS = 1150 // ms to pause at end of phrase
const DELETE_SPEED_MS = 34 // ms per character while deleting
const NEXT_PAUSE_MS = 220 // ms before starting next phrase

const typewriterScript = `
(() => {
  const target = document.getElementById("typewriter")
  if (!target) return

  const phrases = ${JSON.stringify(TAGLINES)}
  const TYPE_SPEED_MS = ${TYPE_SPEED_MS}
  const PAUSE_MS = ${PAUSE_MS}
  const DELETE_SPEED_MS = ${DELETE_SPEED_MS}
  const NEXT_PAUSE_MS = ${NEXT_PAUSE_MS}

  let phraseIndex = 0
  let charIndex = 0
  let deleting = false

  const tick = () => {
    const phrase = phrases[phraseIndex]
    target.textContent = phrase.slice(0, charIndex)

    if (!deleting && charIndex < phrase.length) {
      charIndex += 1
      window.setTimeout(tick, TYPE_SPEED_MS)
      return
    }

    if (!deleting) {
      deleting = true
      window.setTimeout(tick, PAUSE_MS)
      return
    }

    if (charIndex > 0) {
      charIndex -= 1
      window.setTimeout(tick, DELETE_SPEED_MS)
      return
    }

    deleting = false
    phraseIndex = (phraseIndex + 1) % phrases.length
    window.setTimeout(tick, NEXT_PAUSE_MS)
  }

  tick()
})()
`

const Landing: QuartzComponent = () => {
  return (
    <div class="landing">
      {/* ── Hero ── */}
      <section class="landing-hero" aria-labelledby="landing-name">
        <p class="landing-kicker">~/portfolio</p>
        <h1 id="landing-name" class="landing-name">
          sasank kodamarthy
        </h1>
        <p class="landing-tagline">
          <span id="typewriter"></span>
          <span class="cursor">|</span>
        </p>
        <div class="landing-cta">
          <a href="/projects">work ↗</a>
          <a href="/notes">notes ↗</a>
        </div>
      </section>

      {/* ── About ── */}
      <section class="landing-section landing-about" aria-labelledby="about-heading">
        <h2 id="about-heading">about</h2>
        <p>
          Final year CS at AVN, Hyderabad. I build full-stack systems, lately FastAPI backends,
          React frontends, and tools that scratch my own itches. I care about how things are
          structured more than how they look. I use Hyprland, write configs obsessively, and have
          opinions about window managers.
        </p>
      </section>

      {/* ── Selected projects ── */}
      <section class="landing-section" aria-labelledby="selected-projects-heading">
        <div class="landing-section-head">
          <h2 id="selected-projects-heading">selected projects</h2>
          <a href="/projects">all work ↗</a>
        </div>
        <div class="project-grid">
          {PROJECTS.map((project) => (
            <article class="project-card">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <p class="project-tags">{project.tags}</p>
              <a href={project.href}>view ↗</a>
            </article>
          ))}
        </div>
      </section>

      {/* ── Currently ── */}
      <section class="landing-section currently" aria-labelledby="currently-heading">
        <h2 id="currently-heading">currently</h2>
        <dl>
          {CURRENTLY.map((item) => (
            <div>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <script dangerouslySetInnerHTML={{ __html: typewriterScript }} />
    </div>
  )
}

Landing.css = `
/* ── Layout ── */
.landing {
  width: min(100%, 980px);
  margin: 0 auto;
  padding: 5.5rem 0 3rem;
  animation: pageFade 300ms ease both;
}

.landing-section {
  padding: 2.4rem 0;
  border-top: 1px solid var(--border);
}

.landing-section h2 {
  margin: 0 0 1rem;
  font-size: 0.82rem;
  font-weight: 400;
  text-transform: lowercase;
}

.landing-kicker,
.landing-section h2,
.currently dt,
.project-tags {
  font-family: var(--font-mono);
  color: var(--muted);
}

/* ── Hero ── */
.landing-hero {
  padding: 5rem 0 4.5rem;
}

.landing-kicker {
  margin: 0 0 0.9rem;
  font-size: 0.72rem;
}

.landing-name {
  margin: 0;
  font-family: var(--font-mono);
  font-size: clamp(1.55rem, 5vw, 2rem);
  line-height: 1.2;
  font-weight: 400;
}

.landing-tagline {
  min-height: 1.7rem;
  margin: 0.85rem 0 0;
  color: var(--muted);
}

.landing-cta {
  display: flex;
  gap: 1.3rem;
  margin-top: 1.6rem;
}

.landing-cta a,
.landing-section-head a,
.project-card a {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  text-decoration: underline;
  text-underline-offset: 0.22em;
}

/* ── Typewriter ── */
.cursor {
  color: var(--accent);
  animation: cursorBlink 0.6s step-end infinite;
}

/* ── About ── */
.landing-about p {
  max-width: 68ch;
  margin: 0;
}

/* ── Projects grid ── */
.landing-section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.project-card {
  display: flex;
  /* Keeps cards equal height in the three-column grid. */
  min-height: 14rem;
  flex-direction: column;
  padding: 1rem;
  border: 1px solid var(--border);
  background: var(--bg-subtle);
}

.project-card h3 {
  margin: 0 0 0.8rem;
  font-family: var(--font-mono);
  font-size: 0.95rem;
}

.project-card p {
  margin: 0 0 0.85rem;
}

.project-card .project-tags {
  font-size: 0.72rem;
  line-height: 1.55;
}

.project-card a {
  margin-top: auto;
}

/* ── Currently ── */
.currently dl {
  display: grid;
  gap: 0.65rem;
  margin: 0;
}

.currently dl > div {
  display: grid;
  grid-template-columns: 6rem 1fr;
  gap: 1rem;
}

.currently dt,
.currently dd {
  margin: 0;
}

/* ── Mobile ── */
@media (max-width: 800px) {
  .landing {
    padding-top: 3.5rem;
  }

  .landing-hero {
    padding: 3rem 0;
  }

  .project-grid {
    grid-template-columns: 1fr;
  }

  .currently dl > div {
    grid-template-columns: 1fr;
    gap: 0.1rem;
  }
}
`

export default (() => Landing) satisfies QuartzComponentConstructor
