// quartz/components/BackgroundGraph.tsx
// Renders a full-page 3D force graph on the index page.
// Clicking a node does a real window.location navigation to that page —
// no modals, no iframes, no CSS hiding.

import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/backgroundGraph.inline"

const BackgroundGraph: QuartzComponent = () => {
  return (
    <>
      <div id="top-bar">
        <span id="top-bar-title">Que's Notes</span>
        <span id="top-bar-center">Graph View</span>
        <div id="top-bar-actions">
          <button id="top-bar-search" aria-label="Search">⌕</button>
          <button id="top-bar-labels" aria-label="Toggle labels">⊹</button>
        </div>
      </div>

      <div id="graph-search-container">
        <input id="graph-search" type="text" placeholder="Search notes..." />
      </div>

      <div id="background-graph">
        <div id="background-graph-canvas-container" style="width:100%;height:100%"></div>
      </div>

      <div id="graph-keybinds">
        <span><kbd>Ctrl+F</kbd> search</span>
        <span><kbd>Tab</kbd> labels</span>
        <span><kbd>Click</kbd> open note</span>
      </div>
    </>
  )
}

BackgroundGraph.afterDOMLoaded = script

export default (() => BackgroundGraph) satisfies QuartzComponentConstructor
