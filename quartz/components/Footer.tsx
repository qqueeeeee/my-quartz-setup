import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

type FooterLink = {
  label: string
  href: string
}

// Footer.tsx
// Small site footer shared by normal pages. Update FOOTER_LINKS when profiles
// or contact details change.

// ── Edit these when contact links change ─────────────────────────────
const COPYRIGHT = "© 2025 sq"

const FOOTER_LINKS: FooterLink[] = [
  { label: "gh", href: "https://github.com/shotzling" },
  { label: "li", href: "https://www.linkedin.com/in/sasank-kodamarthy/" },
  { label: "mail", href: "mailto:sasank.kodamarthy@gmail.com" },
]
// ────────────────────────────────────────────────────────────────────

export default (() => {
  const Footer: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    return (
      <footer class={`${displayClass ?? ""} site-footer`}>
        <p>{COPYRIGHT}</p>
        <nav aria-label="Footer links">
          {FOOTER_LINKS.map((link, index) => (
            <>
              {index > 0 && <span>·</span>}
              <a href={link.href}>{link.label}</a>
            </>
          ))}
        </nav>
      </footer>
    )
  }

  Footer.css = `
/* ── Layout ── */
.site-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 3rem;
  padding: 1rem 0;
  border-top: 1px solid var(--border);
  color: var(--muted);
  font-size: 12px;
}

.site-footer p {
  margin: 0;
  color: var(--muted);
}

.site-footer nav {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-family: var(--font-mono);
}

/* ── Links ── */
.site-footer a,
.site-footer span {
  color: var(--muted);
}

.site-footer a:hover {
  color: var(--accent);
}
`
  return Footer
}) satisfies QuartzComponentConstructor
