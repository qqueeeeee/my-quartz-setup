import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/backgroundGraph.inline"

const BackgroundGraph: QuartzComponent = () => {
  return (
    <>
      <div id="starfield" aria-hidden="true">
        <div class="starfield-stars layer1"></div>
        <div class="starfield-stars layer2"></div>
      </div>

      <div id="top-bar">
        <span id="top-bar-title">Que&apos;s Atlas</span>
        <span id="top-bar-center">Interactive Knowledge Constellation</span>
        <div id="top-bar-actions">
          <button id="top-bar-notes" aria-label="Toggle navigation panel">
            ☰
          </button>
          <button id="top-bar-search" aria-label="Search notes">
            ⌕
          </button>
          <button id="top-bar-help" aria-label="Toggle detail panel">
            ◎
          </button>
          <button id="top-bar-labels" aria-label="Toggle labels">
            ⊹
          </button>
        </div>
      </div>

      <aside id="graph-nav-panel" class="graph-panel">
        <div class="graph-panel-header">
          <span class="graph-panel-kicker">Explore</span>
          <h2>Navigate the universe</h2>
          <p>
            Start from clusters, folders, tags, or popular notes. Click any node once to open it,
            center it, and light up its nearby connections.
          </p>
        </div>

        <div class="graph-actions">
          <button class="graph-action-button" data-graph-action="home">
            <span>Graph Overview</span>
            <small>Pull back and light up the full map</small>
          </button>
          <button class="graph-action-button" data-graph-action="random">
            <span>Random Jump</span>
            <small>Land somewhere unexpected</small>
          </button>
          <button class="graph-action-button" data-graph-action="recent">
            <span>Visited Trail</span>
            <small>See where you&apos;ve already been</small>
          </button>
        </div>

        <section class="graph-panel-section">
          <div class="graph-section-heading">
            <span class="graph-panel-kicker">Recent</span>
            <button class="graph-inline-action" data-graph-action="recent">View all</button>
          </div>
          <div id="graph-recent-list" class="graph-list"></div>
        </section>

        <section class="graph-panel-section">
          <div class="graph-section-heading">
            <span class="graph-panel-kicker">Constellations</span>
            <button class="graph-inline-action" data-graph-action="popular">Highlight</button>
          </div>
          <div id="graph-popular-list" class="graph-list"></div>
        </section>

        <section class="graph-panel-section">
          <div class="graph-section-heading">
            <span class="graph-panel-kicker">Folders</span>
          </div>
          <div id="graph-folder-list" class="graph-list graph-list-compact"></div>
        </section>

        <section class="graph-panel-section">
          <div class="graph-section-heading">
            <span class="graph-panel-kicker">Tags</span>
          </div>
          <div id="graph-tag-list" class="graph-chip-list"></div>
        </section>
      </aside>

      <aside id="graph-focus-panel" class="graph-panel">
        <div class="graph-panel-header">
          <span class="graph-panel-kicker" id="graph-focus-eyebrow">
            Focus
          </span>
          <h2 id="graph-focus-title">Choose a star to inspect</h2>
          <p id="graph-focus-description">
            The right panel becomes your guide: details, related notes, and quick actions all live
            here.
          </p>
        </div>

        <div id="graph-focus-meta" class="graph-focus-meta"></div>
        <div id="graph-focus-signal" class="graph-focus-signal"></div>

        <div class="graph-actions graph-actions-stacked">
          <button id="graph-open-note" class="graph-action-button graph-action-button-primary">
            <span>Open note</span>
            <small>Read the focused note in the modal</small>
          </button>
          <button id="graph-center-note" class="graph-action-button">
            <span>Center graph</span>
            <small>Reframe the camera around this selection</small>
          </button>
        </div>

        <section class="graph-panel-section">
          <div class="graph-section-heading">
            <span class="graph-panel-kicker">Related</span>
            <button class="graph-inline-action" data-graph-action="neighbors">Neighbors</button>
          </div>
          <div id="graph-related-list" class="graph-list"></div>
        </section>
      </aside>

      <div id="graph-search-container">
        <div id="graph-search-shell">
          <input
            id="graph-search"
            type="text"
            placeholder="Search titles, tags, folders, or ideas..."
          />
          <div id="graph-search-results"></div>
        </div>
      </div>

      <button id="graph-search-btn" aria-label="Search graph">
        ⌕
      </button>

      <div id="graph-panel-scrim"></div>

      <div id="background-graph">
        <div id="background-graph-canvas-container" style="width:100%;height:100%"></div>
      </div>

      <div id="bg-note-modal"></div>

      <div id="graph-keybinds">
        <span>
          <kbd>Click</kbd> open
        </span>
        <span>
          <kbd>Enter</kbd> open
        </span>
        <span>
          <kbd>Ctrl + F</kbd> search
        </span>
        <span>
          <kbd>Tab</kbd> labels
        </span>
      </div>
    </>
  )
}

BackgroundGraph.afterDOMLoaded = script
export default (() => BackgroundGraph) satisfies QuartzComponentConstructor
