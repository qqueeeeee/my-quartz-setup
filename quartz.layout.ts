import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import type { FullSlug } from "./quartz/util/path"

// quartz.layout.ts
// This is the map from Quartz page types to the components they render.
//
// SharedLayout renders once around every page: head, header, afterBody, footer.
// PageLayout fills the page slots: beforeBody is above the article, left/right
// are the sidebars. ConditionalRender keeps one layout file while letting a
// component opt into specific slugs.

// Pages that skip article chrome (title, tags, TOC, backlinks).
const isSpecialPage = (slug: FullSlug | undefined) => slug === "index" || slug === "graph"
const isHomePage = (slug: FullSlug | undefined) => slug === "index"
const isGraphPage = (slug: FullSlug | undefined) => slug === "graph"

// Components shared across all pages.
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [Component.Navbar(), Component.Search(), Component.Darkmode()],
  afterBody: [
    // The graph page owns the full-screen graph; lazy avoids loading Three.js everywhere.
    Component.ConditionalRender({
      component: Component.BackgroundGraph(),
      condition: (page) => isGraphPage(page.fileData.slug),
    }),
  ],
  footer: Component.Footer(),
}

// Components for pages that display a single page (for example, a single note).
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    // Homepage gets its custom landing component instead of article chrome.
    Component.ConditionalRender({
      component: Component.Landing(),
      condition: (page) => isHomePage(page.fileData.slug),
    }),
    // Breadcrumbs only make sense on normal content pages.
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => !isSpecialPage(page.fileData.slug),
    }),
    // Normal notes keep Quartz's generated page title.
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
      condition: (page) => !isSpecialPage(page.fileData.slug),
    }),
    // Content metadata is hidden on the homepage and graph canvas.
    Component.ConditionalRender({
      component: Component.ContentMeta(),
      condition: (page) => !isSpecialPage(page.fileData.slug),
    }),
    // Tags belong to article pages, not the custom landing or graph views.
    Component.ConditionalRender({
      component: Component.TagList(),
      condition: (page) => !isSpecialPage(page.fileData.slug),
    }),
  ],
  left: [
    // The table of contents is useful for notes, but noisy on special pages.
    Component.ConditionalRender({
      component: Component.DesktopOnly(Component.TableOfContents()),
      condition: (page) => !isSpecialPage(page.fileData.slug),
    }),
  ],
  right: [
    // Backlinks stay with normal content pages where relationship context helps.
    Component.ConditionalRender({
      component: Component.Backlinks(),
      condition: (page) => !isSpecialPage(page.fileData.slug),
    }),
  ],
}

// Components for pages that display lists of pages (for example, tags or folders).
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  // List pages stay narrow and focused; no TOC or backlinks sidebars here.
  left: [],
  right: [],
}
