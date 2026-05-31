import { QuartzComponent, QuartzComponentConstructor } from "./types"

type NavLink = {
  label: string
  href: string
}

// Navbar.tsx
// Top navigation shared by every page. To add a nav link, add it to NAV_LINKS.
// Keep labels short; this header has to fit next to Quartz search.

// ── Edit these when navigation changes ───────────────────────────────
const HOME_LINK: NavLink = { label: "sq", href: "/" }

const NAV_LINKS: NavLink[] = [
  { label: "projects", href: "/projects" },
  { label: "notes", href: "/notes" },
  { label: "about", href: "/about" },
]
// ────────────────────────────────────────────────────────────────────

const Navbar: QuartzComponent = () => {
  return (
    <nav class="site-nav" aria-label="Main navigation">
      <a class="site-nav-mark" href={HOME_LINK.href}>
        {HOME_LINK.label}
      </a>
      <div class="site-nav-links">
        {NAV_LINKS.map((link) => (
          <a href={link.href}>{link.label}</a>
        ))}
      </div>
    </nav>
  )
}

Navbar.css = `
/* ── Layout ── */
.site-nav {
  display: contents;
}

.site-nav-links {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-left: auto;
}

/* ── Links ── */
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

.site-nav-mark:hover,
.site-nav-links a:hover {
  color: var(--accent);
  text-decoration: underline;
}
`

export default (() => Navbar) satisfies QuartzComponentConstructor
