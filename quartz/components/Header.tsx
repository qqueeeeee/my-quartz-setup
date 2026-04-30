import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const Header: QuartzComponent = ({ children }: QuartzComponentProps) => {
  return children.length > 0 ? <header class="site-header">{children}</header> : null
}

Header.css = `
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  height: 44px;
  box-sizing: border-box;
  padding: 0 1.25rem;
  margin: 0;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
}

.site-header h1 {
  margin: 0;
  flex: auto;
}
`

export default (() => Header) satisfies QuartzComponentConstructor
