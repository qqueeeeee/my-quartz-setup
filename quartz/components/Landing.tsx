import { QuartzComponent, QuartzComponentConstructor } from "./types"

const typewriterScript = `
(() => {
  const target = document.getElementById("typewriter")
  if (!target) return

  const phrases = ["systems thinker.", "full-stack dev.", "builds things that work."]
  let phraseIndex = 0
  let charIndex = 0
  let deleting = false

  const tick = () => {
    const phrase = phrases[phraseIndex]
    target.textContent = phrase.slice(0, charIndex)

    if (!deleting && charIndex < phrase.length) {
      charIndex += 1
      window.setTimeout(tick, 76)
      return
    }

    if (!deleting) {
      deleting = true
      window.setTimeout(tick, 1150)
      return
    }

    if (charIndex > 0) {
      charIndex -= 1
      window.setTimeout(tick, 34)
      return
    }

    deleting = false
    phraseIndex = (phraseIndex + 1) % phrases.length
    window.setTimeout(tick, 220)
  }

  tick()
})()
`

const Landing: QuartzComponent = ({ fileData }) => {
  if (fileData.slug !== "index") {
    return null
  }

  return (
    <div class="landing">
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

      <section class="landing-section landing-about" aria-labelledby="about-heading">
        <h2 id="about-heading">about</h2>
        <p>
          Final year CS at AVN, Hyderabad. I build full-stack systems, lately FastAPI backends,
          React frontends, and tools that scratch my own itches. I care about how things are
          structured more than how they look. I use Hyprland, write configs obsessively, and have
          opinions about window managers.
        </p>
      </section>

      <section class="landing-section" aria-labelledby="selected-projects-heading">
        <div class="landing-section-head">
          <h2 id="selected-projects-heading">selected projects</h2>
          <a href="/projects">all work ↗</a>
        </div>
        <div class="project-grid">
          <article class="project-card">
            <h3>SelfForge</h3>
            <p>AI self-improvement platform with custom auth and a RAG pipeline over user notes.</p>
            <p class="project-tags">FastAPI, PostgreSQL, LangChain, FAISS, React, AWS</p>
            <a href="/projects">view ↗</a>
          </article>
          <article class="project-card">
            <h3>Lumina Invest</h3>
            <p>Portfolio tracker with custom CSV imports for Moomoo and Revolut exports.</p>
            <p class="project-tags">React, Express, Yahoo Finance API, papaparse</p>
            <a href="/projects">view ↗</a>
          </article>
          <article class="project-card">
            <h3>Knowledge Graph Portfolio</h3>
            <p>This site: Quartz notes, Cloudflare Workers, and a graph layer for navigation.</p>
            <p class="project-tags">Quartz v4, Three.js, Cloudflare Workers</p>
            <a href="/graph">view ↗</a>
          </article>
        </div>
      </section>

      <section class="landing-section currently" aria-labelledby="currently-heading">
        <h2 id="currently-heading">currently</h2>
        <dl>
          <div>
            <dt>building</dt>
            <dd>resq, a Win32 tray resolution manager</dd>
          </div>
          <div>
            <dt>reading</dt>
            <dd>—</dd>
          </div>
          <div>
            <dt>listening</dt>
            <dd>—</dd>
          </div>
        </dl>
      </section>

      <script dangerouslySetInnerHTML={{ __html: typewriterScript }} />
    </div>
  )
}

Landing.css = `
.landing {
  width: min(100%, 980px);
  margin: 0 auto;
  padding: 5.5rem 0 3rem;
  animation: pageFade 300ms ease both;
}

.landing-hero {
  padding: 5rem 0 4.5rem;
}

.landing-kicker,
.landing-section h2,
.currently dt,
.project-tags {
  font-family: var(--font-mono);
  color: var(--muted);
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

.cursor {
  color: var(--accent);
  animation: cursorBlink 0.6s step-end infinite;
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

.landing-about p {
  max-width: 68ch;
  margin: 0;
}

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
