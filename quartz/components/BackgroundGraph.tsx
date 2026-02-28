import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import script from "./scripts/backgroundGraph.inline"

const BackgroundGraph: QuartzComponent = () => {
  return (
    <div id="background-graph">
      <canvas id="background-graph-canvas"></canvas>
    </div>
  )
}

BackgroundGraph.afterDOMLoaded = script
export default (() => BackgroundGraph) satisfies QuartzComponentConstructor
