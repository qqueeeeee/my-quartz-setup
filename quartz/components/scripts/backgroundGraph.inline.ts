import type { ContentDetails } from "../../plugins/emitters/contentIndex"
import {
	SimulationNodeDatum,
	SimulationLinkDatum,
	forceSimulation,
	forceManyBody,
	forceCenter,
	forceLink,
	forceCollide,
	forceRadial,
	zoomIdentity,
	select,
	drag,
	zoom,
} from "d3"
import { Text, Graphics, Application, Container, Circle } from "pixi.js"
import { Group as TweenGroup, Tween as Tweened } from "@tweenjs/tween.js"
import { removeAllChildren } from "./util"
import { FullSlug, SimpleSlug, getFullSlug, simplifySlug } from "../../util/path"

type NodeData = {
	id: SimpleSlug
	text: string
	tags: string[]
} & SimulationNodeDatum

type SimpleLinkData = {
	source: SimpleSlug
	target: SimpleSlug
}

type LinkData = {
	source: NodeData
	target: NodeData
} & SimulationLinkDatum<NodeData>

type GraphicsInfo = {
	color: string
	gfx: Graphics
	alpha: number
	active: boolean
}

type LinkRenderData = GraphicsInfo & { simulationData: LinkData }
type NodeRenderData = GraphicsInfo & { simulationData: NodeData; label: Text }
type TweenNode = { update: (time: number) => void; stop: () => void }

let history: FullSlug[] = []
let index = -1 
let showAllLabels = false


const localStorageKey = "graph-visited"
function getVisited(): Set<SimpleSlug> {
	return new Set(JSON.parse(localStorage.getItem(localStorageKey) ?? "[]"))
}

let bgGraphCleanup: (() => void) | null = null

async function renderBgGraph(container: HTMLElement, fullSlug: FullSlug) {
	removeAllChildren(container)

	const slug = simplifySlug(fullSlug)
	const visited = getVisited()

	const data: Map<SimpleSlug, ContentDetails> = new Map(
		Object.entries<ContentDetails>(await fetchData).map(([k, v]) => [
			simplifySlug(k as FullSlug),
			v,
		]),
	)

	const links: SimpleLinkData[] = []
	const validLinks = new Set(data.keys())

	for (const [source, details] of data.entries()) {
		for (const dest of details.links ?? []) {
			if (validLinks.has(dest)) {
				links.push({ source, target: dest })
			}
		}
	}

	const nodes = [...data.keys()].map((url) => ({
		id: url,
		text: data.get(url)?.title ?? url,
		tags: data.get(url)?.tags ?? [],
		isFolder: false,
	}))

	// extract and add folder nodes
	const folders = new Set<string>()
	for (const slug of data.keys()) {
		const parts = slug.split("/")
		for (let i = 0; i < parts.length - 1; i++) {
			folders.add(parts.slice(0, i + 1).join("/"))
		}
	}

	for (const folder of folders) {
		const name = folder.split("/").pop() ?? folder
		nodes.push({
			id: folder as any,
			text: name,
			tags: [],
			isFolder: true,
		})
	}

	const graphData = {
		nodes,
		links: links.map((l) => ({
			source: nodes.find((n) => n.id === l.source)!,
				target: nodes.find((n) => n.id === l.target)!,
		})).filter((l) => l.source && l.target),
	}

			const width = container.offsetWidth
			const height = container.offsetHeight

			const cssVars = ["--secondary", "--tertiary", "--gray", "--light", "--lightgray", "--dark", "--darkgray", "--bodyFont"] as const
			const style = cssVars.reduce((acc, key) => {
				acc[key] = getComputedStyle(document.documentElement).getPropertyValue(key)
				return acc
			}, {} as Record<(typeof cssVars)[number], string>)


			function nodeRadius(d: NodeData & { isFolder?: boolean }) {
				if (d.isFolder) return 8
					return 2 + Math.sqrt(graphData.links.filter((l) => l.source.id === d.id || l.target.id === d.id).length)
			}
			const color = (d: NodeData) => {
				if (d.id === slug) return style["--secondary"]
					if (visited.has(d.id)) return style["--tertiary"]
						return style["--gray"]
			}

			const simulation = forceSimulation<NodeData>(graphData.nodes as NodeData[])
			.force("charge", forceManyBody().strength(-80))
			.force("center", forceCenter().strength(0.7))
			.force("link", forceLink(graphData.links).distance(60))
			.force("collide", forceCollide<NodeData>((n) => nodeRadius(n)).iterations(3))
			.force("radial", forceRadial((Math.min(width, height) / 2) * 0.8).strength(0.15))

			const tweens = new Map<string, TweenNode>()
			const linkRenderData: LinkRenderData[] = []
			const nodeRenderData: NodeRenderData[] = []
			let hoveredNodeId: string | null = null
			let dragging = false
			let dragStartTime = 0

			const app = new Application()
			await app.init({
				width,
				height,
				antialias: true,
				autoStart: false,
				autoDensity: true,
				backgroundAlpha: 0,
				preference: "webgpu",
				resolution: window.devicePixelRatio,
				eventMode: "static",
			})
			container.appendChild(app.canvas)

			const stage = app.stage
			const labelsContainer = new Container<Text>({ zIndex: 3, isRenderGroup: true })
			const nodesContainer = new Container<Graphics>({ zIndex: 2, isRenderGroup: true })
			const linkContainer = new Container<Graphics>({ zIndex: 1, isRenderGroup: true })
			stage.addChild(nodesContainer, labelsContainer, linkContainer)

			for (const n of graphData.nodes) {
				const label = new Text({
					interactive: false,
					eventMode: "none",
					text: n.text,
					alpha: 0,
					anchor: { x: 0.5, y: 1.2 },
					style: {
						fontSize: 10,
						fill: style["--dark"],
						fontFamily: style["--bodyFont"],
					},
					resolution: window.devicePixelRatio * 4,
				})
				label.scale.set(1)

				const gfx = new Graphics({
					interactive: true,
					label: n.id,
					eventMode: "static",
					hitArea: new Circle(0, 0, nodeRadius(n)),
					cursor: "pointer",
				})
				.circle(0, 0, nodeRadius(n))
				.fill({ color: color(n) })
				.on("pointerover", (e) => {
					hoveredNodeId = e.target.label
					updateHover()
					if (!dragging) renderAll()
				})
			.on("pointerleave", () => {
				hoveredNodeId = null
				updateHover()
				if (!dragging) renderAll()
			})
		let searchActive = false

		function toggleSearch() {
			const container = document.getElementById("graph-search-container")
			if (!container) return
				searchActive = !searchActive
			container.classList.toggle("active", searchActive)
			if (searchActive) {
				document.getElementById("graph-search")?.focus()
			} else {
				const input = document.getElementById("graph-search") as HTMLInputElement
				if (input) input.value = ""
					// clear highlights
					for (const n of nodeRenderData) n.gfx.alpha = 1
			}
		}

		document.addEventListener("keydown", (e) => {
			if (e.key === "f" || e.key === "F") {
				if (document.activeElement?.id !== "graph-search") {
					e.preventDefault()
					toggleSearch()
				}
			}
			if (e.key === "Escape") {
				if (searchActive) toggleSearch()
					else closeModal()
			}
	if (e.key === "Tab") {
		e.preventDefault()
		showAllLabels = !showAllLabels
		renderAll()
	}
		})

		document.getElementById("graph-search-btn")?.addEventListener("click", toggleSearch)

		document.getElementById("graph-search")?.addEventListener("input", (e) => {
			const query = (e.target as HTMLInputElement).value.toLowerCase().trim()

			for (const n of nodeRenderData) {
				if (!query) {
					n.gfx.alpha = 1
					n.label.alpha = (n.simulationData as any).isFolder ? 1 : 0
				} else {
					const matches = n.simulationData.text.toLowerCase().includes(query)
					n.gfx.alpha = matches ? 1 : 0.1
					n.label.alpha = matches ? 1 : 0
				}
			}
		})

		nodesContainer.addChild(gfx)
		labelsContainer.addChild(label)
		nodeRenderData.push({ simulationData: n as NodeData, gfx, label, color: color(n), alpha: 1, active: false })
			}

			for (const l of graphData.links) {
				const gfx = new Graphics({ interactive: false, eventMode: "none" })
				linkContainer.addChild(gfx)
				linkRenderData.push({ simulationData: l as LinkData, gfx, color: style["--lightgray"], alpha: 1, active: false })
			}

			function updateHover() {
				if (!hoveredNodeId) {
					for (const n of nodeRenderData) n.active = false
						for (const l of linkRenderData) l.active = false
							return
				}
				for (const l of linkRenderData) {
					l.active = l.simulationData.source.id === hoveredNodeId || l.simulationData.target.id === hoveredNodeId
				}
				for (const n of nodeRenderData) {
					n.active = n.simulationData.id === hoveredNodeId ||
						linkRenderData.some((l) => l.active && (l.simulationData.source.id === n.simulationData.id || l.simulationData.target.id === n.simulationData.id))
				}
			}

			function renderAll() {
				// nodes
				const nodeTweens = new TweenGroup()
				for (const n of nodeRenderData) {
					const alpha = hoveredNodeId ? (n.active ? 1 : 0.2) : 1
					nodeTweens.add(new Tweened<Graphics>(n.gfx, nodeTweens).to({ alpha }, 200))
				}
				nodeTweens.getAll().forEach((t) => t.start())
				tweens.set("nodes", { update: nodeTweens.update.bind(nodeTweens), stop: () => nodeTweens.getAll().forEach((t) => t.stop()) })

				// links
				const linkTweens = new TweenGroup()
				for (const l of linkRenderData) {
					const alpha = hoveredNodeId ? (l.active ? 1 : 0.1) : 1
					l.color = l.active ? style["--gray"] : style["--lightgray"]
					linkTweens.add(new Tweened<LinkRenderData>(l).to({ alpha }, 200))
				}
				linkTweens.getAll().forEach((t) => t.start())
				tweens.set("links", { update: linkTweens.update.bind(linkTweens), stop: () => linkTweens.getAll().forEach((t) => t.stop()) })

				// labels
				for (const n of nodeRenderData) {
					const isHovered = n.simulationData.id === hoveredNodeId
						n.label.alpha = isHovered || showAllLabels ? 1 : 0
				}

			}

			// drag
			let currentTransform = zoomIdentity
			select<HTMLCanvasElement, NodeData | undefined>(app.canvas).call(
				drag<HTMLCanvasElement, NodeData | undefined>()
				.container(() => app.canvas)
				.subject(() => graphData.nodes.find((n) => n.id === hoveredNodeId) as NodeData)
				.on("start", (event) => {
					if (!event.active) simulation.alphaTarget(1).restart()
						event.subject.fx = event.subject.x
					event.subject.fy = event.subject.y
					event.subject.__initialDragPos = { x: event.subject.x, y: event.subject.y, fx: event.subject.fx, fy: event.subject.fy }
					dragStartTime = Date.now()
					dragging = true
				})
				.on("drag", (event) => {
					const p = event.subject.__initialDragPos
					event.subject.fx = p.x + (event.x - p.x) / currentTransform.k
					event.subject.fy = p.y + (event.y - p.y) / currentTransform.k

				})
				.on("end", async (event) => {
					if (!event.active) simulation.alphaTarget(0)
						event.subject.fx = null
					event.subject.fy = null
					dragging = false

					if (Date.now() - dragStartTime < 500) {
						const node = graphData.nodes.find((n) => n.id === event.subject.id)
						if (node) {
							await openNoteModal(node.id as FullSlug)
						}
					}
				}),
			)

			// zoom
			select<HTMLCanvasElement, NodeData>(app.canvas).call(
				zoom<HTMLCanvasElement, NodeData>()
				.extent([[0, 0], [width, height]])
				.scaleExtent([0.7, 4])
				.translateExtent([
					[-200, -200],  // how far left/up you can pan
					[width + 200, height + 200]  // how far right/down you can pan
				])
				.on("zoom", ({ transform }) => {
					currentTransform = transform
					stage.scale.set(transform.k, transform.k)
					stage.position.set(transform.x, transform.y)
				}),
			)

			// animate
			let stopAnimation = false
			function animate(time: number) {
				if (stopAnimation) return
					for (const n of nodeRenderData) {
						const { x, y } = n.simulationData
						if (!x || !y) continue
							n.gfx.position.set(x + width / 2, y + height / 2)
						n.label.position.set(x + width / 2, y + height / 2)
					}
					for (const l of linkRenderData) {
						const d = l.simulationData
						l.gfx.clear()
						l.gfx.moveTo(d.source.x! + width / 2, d.source.y! + height / 2)
						l.gfx.lineTo(d.target.x! + width / 2, d.target.y! + height / 2)
						.stroke({ alpha: l.alpha, width: 1, color: l.color })
					}
					tweens.forEach((t) => t.update(time))
					app.renderer.render(stage)
					requestAnimationFrame(animate)
			}
			requestAnimationFrame(animate)

			return () => {
				stopAnimation = true
				app.destroy()
			}
}

// History for NoteModals
async function openNoteModal(slug: FullSlug, pushToHistory = true) {
	if (pushToHistory){
		history.push(slug)
		console.log(history)
		console.log(index)
		index += 1
	}
	const response = await fetch("/" + slug)
	const html = await response.text()
	const parser = new DOMParser()
	const doc = parser.parseFromString(html, "text/html")
	const title = doc.querySelector(".page-header")
	const article = doc.querySelector("article")
	const pageListing = doc.querySelector(".page-listing")
	const pageHeader = doc.querySelector(".page-header")
	if (!article && !pageListing) return

		const modal = document.getElementById("bg-note-modal")
		if (!modal) return
			modal.innerHTML = `
		<div id="modal-nav">
		<button id="modal-back" ${index <= 0 ? "disabled" : ""}>←</button>
		<button id="modal-forward" ${index >= history.length - 1 ? "disabled" : ""}>→</button>
		</div>
		<button id="bg-modal-close">✕</button>
		${pageHeader ? pageHeader.outerHTML : ""}
		${article ? article.outerHTML : ""}
		${pageListing ? pageListing.outerHTML : ""}
		`

		modal.classList.add("active")
		document.getElementById("background-graph")?.classList.add("dimmed")

		document.getElementById("bg-modal-close")?.addEventListener("click", closeModal)
		document.addEventListener("click", (e) => {
			if (!modal.contains(e.target as Node) && modal.classList.contains("active")) {
				closeModal()

			}
		}, { once: true })
		document.getElementById("modal-back")?.addEventListener("click", async () => {
			index -= 1
			await openNoteModal(history[index] as FullSlug, false) // false = don't push to history
		})

		document.getElementById("modal-forward")?.addEventListener("click", async () => {
			index += 1
			await openNoteModal(history[index] as FullSlug, false)
		})

}

document.getElementById("bg-note-modal")?.addEventListener("click", async (e) => {
	const target = (e.target as HTMLElement).closest("a")
	if (!target) return
		e.preventDefault()
	e.stopPropagation()
	const slug = target.href.replace(window.location.origin + "/", "")
	await openNoteModal(slug as FullSlug, true)
})

function closeModal() {
	document.getElementById("bg-note-modal")?.classList.remove("active")
	document.getElementById("background-graph")?.classList.remove("dimmed")
	history = []
	index = -1
}

document.addEventListener("keydown", (e) => {
	if (e.key === "Escape") closeModal()
})



document.addEventListener("nav", async () => {
	// move our elements to body so they're independent of quartz
	for (const id of ["background-graph", "bg-note-modal", "graph-identity", "graph-search-container", "graph-search-btn", "graph-keybinds"]) {
		const el = document.getElementById(id)
		if (el && el.parentElement !== document.body) {
			document.body.appendChild(el)
		}
	}

	const container = document.getElementById("background-graph-canvas-container")
	if (!container) return

		if (bgGraphCleanup) {
			bgGraphCleanup()
			bgGraphCleanup = null
		}

		const slug = getFullSlug(window)
		bgGraphCleanup = await renderBgGraph(container, slug) ?? null

})
