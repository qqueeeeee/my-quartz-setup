import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
export default (() => {
  const Footer: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    return (
      <footer class={`${displayClass ?? ""} site-footer`}>
        <p>© 2025 sq</p>
        <nav aria-label="Footer links">
          <a href="https://github.com/shotzling">gh</a>
          <span>·</span>
          <a href="https://www.linkedin.com/in/sasank-kodamarthy/">li</a>
          <span>·</span>
          <a href="mailto:sasank.kodamarthy@gmail.com">mail</a>
        </nav>
      </footer>
    )
  }

  Footer.css = `
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
