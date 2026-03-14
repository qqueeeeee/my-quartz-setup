import type { ContentDetails } from "../../plugins/emitters/contentIndex"
import { FullSlug, SimpleSlug, getFullSlug, simplifySlug, resolveRelative } from "../../util/path"

const localStorageKey = "graph-visited"
function getVisited(): Set<SimpleSlug> {
  return new Set(JSON.parse(localStorage.getItem(localStorageKey) ?? "[]"))
}
function addToVisited(slug: SimpleSlug) {
  const visited = getVisited()
  visited.add(slug)
  localStorage.setItem(localStorageKey, JSON.stringify([...visited]))
}

function getStyleVar(v: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(v).trim()
}

function loadScript(src: string): Promise<void> {
  return new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) { res(); return }
    const s = document.createElement("script")
    s.src = src; s.onload = () => res(); s.onerror = rej
    document.head.appendChild(s)
  })
}

let graphInstance: any = null

async function initGraph() {
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js")
  await loadScript("https://unpkg.com/3d-force-graph@1.73.3/dist/3d-force-graph.min.js")

  const container = document.getElementById("graph-canvas")
  if (!container) return

  // destroy previous instance if any
  if (graphInstance) {
    try { graphInstance._destructor?.() } catch {}
    graphInstance = null
    container.innerHTML = ""
  }

  const slug = simplifySlug(getFullSlug(window))
  const visited = getVisited()

  // ── build data the same way quartz does ──────────────────────────────────────

  const data: Map<SimpleSlug, ContentDetails> = new Map(
    Object.entries<ContentDetails>(await fetchData).map(([k, v]) => [
      simplifySlug(k as FullSlug), v,
    ])
  )

  const validLinks = new Set(data.keys())
  const tags: SimpleSlug[] = []
  const links: { source: string; target: string }[] = []

  for (const [source, details] of data.entries()) {
    // outgoing links
    for (const dest of (details.links ?? [])) {
      if (validLinks.has(dest)) {
        links.push({ source, target: dest })
      }
    }
    // tags
    const localTags = (details.tags ?? []).map(
      tag => simplifySlug(("tags/" + tag) as FullSlug)
    )
    for (const tag of localTags) {
      if (!tags.includes(tag)) tags.push(tag)
      links.push({ source, target: tag })
    }
  }

  const nodes = [
    ...[...data.entries()].map(([id, details]) => ({
      id,
      name: details.title ?? id,
      tags: details.tags ?? [],
      isTag: false,
    })),
    ...tags.map(tag => ({
      id: tag,
      name: "#" + tag.substring(5),
      tags: [],
      isTag: true,
    })),
  ]

  // ── same color logic as quartz ────────────────────────────────────────────────

  function nodeColor(node: any) {
    if (node.id === slug)        return getStyleVar("--secondary")
    if (node.isTag)              return getStyleVar("--tertiary")
    if (visited.has(node.id))   return getStyleVar("--tertiary")
    return getStyleVar("--gray")
  }

  function nodeVal(node: any) {
    const numLinks = links.filter(l => l.source === node.id || l.target === node.id).length
    return 2 + Math.sqrt(numLinks)
  }

  // ── build graph ───────────────────────────────────────────────────────────────

  // @ts-ignore
  const Graph = ForceGraph3D({ antialias: true, alpha: true })(container)
    .width(container.offsetWidth)
    .height(container.offsetHeight)
    .backgroundColor("rgba(0,0,0,0)")
    .graphData({ nodes, links })
    .nodeLabel((n: any) => n.name)
    .nodeVal((n: any) => nodeVal(n))
    .nodeColor((n: any) => nodeColor(n))
    .nodeOpacity(0.95)
    .nodeResolution(16)
    .linkColor(() => getStyleVar("--lightgray") || "rgba(255,255,255,0.2)")
    .linkWidth(0.4)
    .linkDirectionalParticles(1)
    .linkDirectionalParticleWidth(0.7)
    .linkDirectionalParticleColor(() => getStyleVar("--secondary"))
    .onNodeClick((node: any) => {
      addToVisited(node.id)
      window.location.href = "/" + node.id
    })
    .onNodeHover((node: any) => {
      container.style.cursor = node ? "pointer" : "grab"
    })

  graphInstance = Graph

  // ── auto rotate ───────────────────────────────────────────────────────────────

  let autoRotate = true
  let angle = 0
  let rotTimer: any

  container.addEventListener("mousedown", () => {
    autoRotate = false
    clearTimeout(rotTimer)
    rotTimer = setTimeout(() => { autoRotate = true }, 3500)
  })

  Graph.onEngineTick(() => {
    if (!autoRotate) return
    angle += 0.0007
    Graph.cameraPosition({ x: 450 * Math.sin(angle), z: 450 * Math.cos(angle) })
  })

  window.addEventListener("resize", () => {
    Graph.width(container.offsetWidth).height(container.offsetHeight)
  })
}

function setupToggle() {
  document.getElementById("reveal-btn")?.addEventListener("click", () => {
    document.getElementById("graph-overlay")!.style.display = "none"
    document.getElementById("quartz-root")!.style.display = "flex"
  })

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.getElementById("graph-overlay")!.style.display = "flex"
      document.getElementById("quartz-root")!.style.display = "none"
    }
  })
}

document.addEventListener("nav", () => {
  initGraph()
  setupToggle()
})
