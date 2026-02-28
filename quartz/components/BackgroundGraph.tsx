import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/backgroundGraph.inline"

const BackgroundGraph: QuartzComponent = () => {
	return (
		<>
		<div id="graph-identity">
		<span id="graph-name">Sasank Kodamarthy</span>
		<span id="graph-bio">CS student · Full Stack · AI</span>
		</div>
		<div id="background-graph">
		<div id="background-graph-canvas-container" style="width:100%;height:100%"></div>
		</div>
		<div id="bg-note-modal"></div>
		</>
	)
}

BackgroundGraph.afterDOMLoaded = script
export default (() => BackgroundGraph) satisfies QuartzComponentConstructor
