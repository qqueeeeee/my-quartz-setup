import { QuartzComponent, QuartzComponentConstructor } from "./types"

const Navbar: QuartzComponent = () => {
  return (
    <nav class="site-nav" aria-label="Main navigation">
      <a class="site-nav-mark" href="/">
        sq
      </a>
      <div class="site-nav-links">
        <a href="/projects">projects</a>
        <a href="/notes">notes</a>
        <a href="/about">about</a>
      </div>
    </nav>
  )
}

Navbar.css = `
.site-nav {
  display: contents;
}

.site-nav-mark,
.site-nav-links a {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--muted);
  text-decoration: none;
}

.site-nav-mark {
  color: var(--text);
}

.site-nav-links {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-left: auto;
}

.site-nav-mark:hover,
.site-nav-links a:hover {
  color: var(--accent);
  text-decoration: underline;
}
`

export default (() => Navbar) satisfies QuartzComponentConstructor
