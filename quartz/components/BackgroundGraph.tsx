import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/backgroundGraph.inline"

const BackgroundGraph: QuartzComponent = () => {
	return (
		<>
		<div id="graph-search-container">
		<input id="graph-search" type="text" placeholder="Search notes..." />
		</div>
		<button id="graph-search-btn">⌕</button>
		<div id="background-graph">
		<div id="background-graph-canvas-container" style="width:100%;height:100%"></div>
		</div>
		<div id="bg-note-modal"></div>
		<div id="graph-keybinds">
  <span><kbd>Ctrl + F</kbd> search</span>
  <span><kbd>Tab</kbd> labels</span>
  <span><kbd>Esc</kbd> close</span>
</div>
		</>
	)
}

BackgroundGraph.afterDOMLoaded = script
export default (() => BackgroundGraph) satisfies QuartzComponentConstructor
