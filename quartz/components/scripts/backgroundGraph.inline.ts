// quartz/components/scripts/backgroundGraph.inline.ts
import { FullSlug, SimpleSlug, getFullSlug, simplifySlug } from "../../util/path"
import type { ContentDetails } from "../../plugins/emitters/contentIndex"

if (window.self !== window.top) {
  // Still need to inject hide styles for the graph/top-bar elements
  const style = document.createElement("style")
  style.textContent = `
	#top-bar,
	#background-graph,
	#bg-note-modal,
	#graph-search-container,
	#graph-search-btn,
	#graph-keybinds { display: none !important; }
	`
  document.head.appendChild(style)
  // Stop — don't run any graph logic
  throw new Error("modal-iframe-bail")
} else {
  type NodeData = {
    id: SimpleSlug
    text: string
    tags: string[]
    isFolder: boolean
    isTag: boolean
    val: number
    x?: number
    y?: number
    z?: number
  }

  let navHistory: FullSlug[] = []
  let historyIndex = -1
  let showAllLabels = false
  let searchActive = false
  let bgGraphCleanup: (() => void) | null = null
  let Graph3D: any = null
  let nodeMap = new Map<string, NodeData>()
  let currentHighlighted = new Set<string>()
  let modalOpen = false

  const localStorageKey = "graph-visited"
  function getVisited(): Set<SimpleSlug> {
    return new Set(JSON.parse(localStorage.getItem(localStorageKey) ?? "[]"))
  }

  // ΓöÇΓöÇ CDN loader ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

  function loadScript(src: string): Promise<void> {
    return new Promise((res, rej) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        res()
        return
      }
      const s = document.createElement("script")
      s.src = src
      s.onload = () => res()
      s.onerror = rej
      document.head.appendChild(s)
    })
  }

  function nodeColor(d: NodeData, slug: SimpleSlug, visited: Set<SimpleSlug>): string {
    if (currentHighlighted.size > 0) {
      return currentHighlighted.has(d.id) ? "#ffffff" : "rgba(60,60,60,0.4)"
    }
    if (d.id === slug) return "#ffffff"
    if (d.isTag) return "#cccccc"
    if (d.isFolder) return "#888888"
    if (visited.has(d.id)) return "#aaaaaa"
    return "#666666"
  }

  function nodeVal(d: NodeData): number {
    if (d.isFolder) return 4
    if (currentHighlighted.size > 0 && currentHighlighted.has(d.id)) return d.val * 1.5
    return Math.max(1.5, d.val * 0.8)
  }

  // ΓöÇΓöÇ zoom helpers ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

  function zoomToNodes(ids: string[], duration = 900) {
    if (!Graph3D || ids.length === 0) return
    const positioned = ids
      .map((id) => nodeMap.get(id))
      .filter((n): n is NodeData => !!n && n.x != null)

    if (positioned.length === 0) return

    if (positioned.length === 1) {
      const n = positioned[0]
      const dist = 120
      const mag = Math.hypot(n.x!, n.y ?? 0, n.z ?? 0) || 1
      const r = 1 + dist / mag
      Graph3D.cameraPosition({ x: n.x! * r, y: (n.y ?? 0) * r, z: (n.z ?? 0) * r }, n, duration)
      return
    }

    let minX = Infinity,
      maxX = -Infinity
    let minY = Infinity,
      maxY = -Infinity
    let minZ = Infinity,
      maxZ = -Infinity
    for (const n of positioned) {
      minX = Math.min(minX, n.x!)
      maxX = Math.max(maxX, n.x!)
      minY = Math.min(minY, n.y ?? 0)
      maxY = Math.max(maxY, n.y ?? 0)
      minZ = Math.min(minZ, n.z ?? 0)
      maxZ = Math.max(maxZ, n.z ?? 0)
    }
    const cx = (minX + maxX) / 2
    const cy = (minY + maxY) / 2
    const cz = (minZ + maxZ) / 2
    const spread = Math.max(maxX - minX, maxY - minY, maxZ - minZ)
    Graph3D.cameraPosition(
      { x: cx, y: cy, z: cz + Math.max(180, spread * 1.4) },
      { x: cx, y: cy, z: cz },
      duration,
    )
  }

  function zoomToNode(slug: string, duration = 1000) {
    zoomToNodes([slug], duration)
  }

  function refreshGraph(slug: SimpleSlug, visited: Set<SimpleSlug>) {
    if (!Graph3D) return
    Graph3D.nodeColor((n: NodeData) => nodeColor(n, slug, visited))
      .nodeVal((n: NodeData) => nodeVal(n))
      .nodeLabel((n: NodeData) => (showAllLabels || currentHighlighted.has(n.id) ? n.text : ""))
  }

  // ΓöÇΓöÇ modal ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

  function ensureModalDOM() {
    // Modal wrapper
    let modal = document.getElementById("bg-note-modal")
    if (!modal) {
      modal = document.createElement("div")
      modal.id = "bg-note-modal"
      document.body.appendChild(modal)
    }

    // Only build internals once
    if (modal.querySelector("#modal-iframe")) {
      return modal
    }

    modal.innerHTML = `
		<div id="modal-panel">
		<div id="modal-chrome">
		<div id="modal-nav">
		<button id="modal-back" disabled>ΓåÉ</button>
		<button id="modal-forward" disabled>ΓåÆ</button>
		</div>
		<button id="bg-modal-close">Γ£ò</button>
		</div>
		<iframe id="modal-iframe" src="about:blank"></iframe>
		</div>
		`

    // Close on backdrop (clicking outside the panel)
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal()
    })

    document.getElementById("bg-modal-close")!.addEventListener("click", closeModal)

    document.getElementById("modal-back")!.addEventListener("click", () => {
      if (historyIndex > 0) {
        historyIndex--
        navigateIframe(navHistory[historyIndex], false)
      }
    })

    document.getElementById("modal-forward")!.addEventListener("click", () => {
      if (historyIndex < navHistory.length - 1) {
        historyIndex++
        navigateIframe(navHistory[historyIndex], false)
      }
    })

    return modal
  }

  function syncNavButtons() {
    const back = document.getElementById("modal-back") as HTMLButtonElement | null
    const forward = document.getElementById("modal-forward") as HTMLButtonElement | null
    if (back) back.disabled = historyIndex <= 0
    if (forward) forward.disabled = historyIndex >= navHistory.length - 1
  }

  // Hides top-bar / background graph elements inside the iframe
  function injectIframeStyles(iDoc: Document) {
    iDoc.documentElement.classList.add("modal-iframe")
    iDoc.getElementById("__modal-styles")?.remove()
    const style = iDoc.createElement("style")
    style.id = "__modal-styles"
    style.textContent = `
  #top-bar,
  #background-graph,
  #bg-note-modal,
  #graph-search-container,
  #graph-search-btn,
  #graph-keybinds,
  .sidebar,
  .page > header,
  .page > footer,
  .toc,
  .backlinks {
    display: none !important;
  }
  body {
    background: #000000 !important;
  }
  .page {
    max-width: 100% !important;
    margin: 0 !important;
  }
  .page > #quartz-body {
    display: block !important;
  }
  .page > #quartz-body > .center {
    max-width: 720px;
    margin: 0 auto;
    padding: 3rem 2rem;
  }
  .page > #quartz-body > .center article {
    font-size: 1rem;
    line-height: 1.7;
  }
  `
    iDoc.head.appendChild(style)
  }

  function attachIframeInterceptor(iframe: HTMLIFrameElement) {
    try {
      const iDoc = iframe.contentDocument ?? iframe.contentWindow?.document
      if (!iDoc) return
      injectIframeStyles(iDoc)

      // Remove previous handler
      const prev = (iframe as any).__clickHandler
      if (prev) iDoc.removeEventListener("click", prev)

      const handler = (e: MouseEvent) => {
        const a = (e.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null
        if (!a) return
        const href = a.getAttribute("href")!
        if (href.startsWith("http") || href.startsWith("//") || href.startsWith("#")) return
        e.preventDefault()
        e.stopPropagation()
        const slug = href.replace(/^\//, "").replace(/\.html$/, "") as FullSlug
        openNoteModal(slug, true)
      }
      ;(iframe as any).__clickHandler = handler
      iDoc.addEventListener("click", handler)
    } catch {
      // cross-origin guard
    }
  }

  function navigateIframe(slug: FullSlug, push = true) {
    const iframe = document.getElementById("modal-iframe") as HTMLIFrameElement | null
    if (!iframe) return

    if (push) {
      navHistory.splice(historyIndex + 1)
      navHistory.push(slug)
      historyIndex = navHistory.length - 1
    }
    syncNavButtons()

    // Track visited
    const visited = getVisited()
    visited.add(simplifySlug(slug))
    localStorage.setItem(localStorageKey, JSON.stringify([...visited]))

    // Build URL - no query params, just the plain slug path
    const path = slug === ("/" as FullSlug) ? "/" : "/" + slug

    // Only navigate if different
    if (!iframe.src.endsWith(path) && !iframe.src.endsWith(path + "/")) {
      iframe.src = path

      iframe.onload = () => {
        attachIframeInterceptor(iframe)
      }
    }

    // Update graph
    currentHighlighted.clear()
    refreshGraph(simplifySlug(getFullSlug(window)), getVisited())
    zoomToNode(simplifySlug(slug))
  }

  async function openNoteModal(slug: FullSlug, push = true) {
    const modal = ensureModalDOM()
    navigateIframe(slug, push)
    modal.classList.add("active")
    document.getElementById("background-graph")?.classList.add("dimmed")
    modalOpen = true
  }

  function closeModal() {
    document.getElementById("bg-note-modal")?.classList.remove("active")
    document.getElementById("background-graph")?.classList.remove("dimmed")
    modalOpen = false
    navHistory = []
    historyIndex = -1
  }

  // ΓöÇΓöÇ search ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

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
      currentHighlighted.clear()
      refreshGraph(simplifySlug(getFullSlug(window)), getVisited())
    }
  }

  function handleSearch(query: string) {
    const slug = simplifySlug(getFullSlug(window))
    if (!query) {
      currentHighlighted.clear()
      refreshGraph(slug, getVisited())
      return
    }
    const matches = Array.from(nodeMap.values()).filter(
      (n) =>
        n.text.toLowerCase().includes(query) ||
        n.id.toLowerCase().includes(query) ||
        n.tags.some((t) => t.toLowerCase().includes(query)),
    )
    currentHighlighted = new Set(matches.map((n) => n.id))
    refreshGraph(slug, getVisited())
    if (matches.length > 0) zoomToNodes(matches.map((n) => n.id))
  }

  // ΓöÇΓöÇ 3D graph renderer ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

  async function renderBgGraph(container: HTMLElement, fullSlug: FullSlug) {
    container.innerHTML = ""
    nodeMap = new Map()
    currentHighlighted = new Set()
    Graph3D = null

    const slug = simplifySlug(fullSlug)
    const visited = getVisited()

    const data: Map<SimpleSlug, ContentDetails> = new Map(
      Object.entries<ContentDetails>(await fetchData).map(([k, v]) => [
        simplifySlug(k as FullSlug),
        v,
      ]),
    )

    const linkPairs: { source: SimpleSlug; target: SimpleSlug }[] = []
    const tags: SimpleSlug[] = []

    for (const [source, details] of data.entries()) {
      const localTags = (details.tags ?? []).map((tag) => simplifySlug(("tags/" + tag) as FullSlug))
      tags.push(...localTags.filter((t) => !tags.includes(t)))
      for (const tag of localTags) linkPairs.push({ source, target: tag })
    }

    const nodes: NodeData[] = [...data.keys()].map((url) => ({
      id: url,
      text: data.get(url)?.title ?? url,
      tags: data.get(url)?.tags ?? [],
      isFolder: false,
      isTag: false,
      val: 2,
    }))

    const folders = new Set<string>()
    for (const s of data.keys()) {
      const parts = s.split("/")
      for (let i = 0; i < parts.length - 1; i++) folders.add(parts.slice(0, i + 1).join("/"))
    }
    for (const folder of folders) {
      nodes.push({
        id: folder as any,
        text: folder.split("/").pop() ?? folder,
        tags: [],
        isFolder: true,
        isTag: false,
        val: 8,
      })
    }
    for (const tag of tags) {
      nodes.push({
        id: tag as any,
        text: "#" + tag.substring(5),
        tags: [],
        isFolder: false,
        isTag: true,
        val: 3,
      })
    }

    const linkCount = new Map<string, number>()
    for (const l of linkPairs) {
      linkCount.set(l.source, (linkCount.get(l.source) ?? 0) + 1)
      linkCount.set(l.target, (linkCount.get(l.target) ?? 0) + 1)
    }
    for (const n of nodes) {
      if (!n.isFolder) n.val = 2 + Math.sqrt(linkCount.get(n.id) ?? 0)
      nodeMap.set(n.id, n)
    }

    const graphLinks = linkPairs
      .map((l) => ({ source: l.source, target: l.target }))
      .filter((l) => nodeMap.has(l.source) && nodeMap.has(l.target))

    // @ts-ignore ΓÇö loaded from CDN
    const Graph = ForceGraph3D({ antialias: true, alpha: true })(container)
      .width(container.offsetWidth)
      .height(container.offsetHeight)
      .backgroundColor("rgba(0,0,0,0)")
      .graphData({ nodes, links: graphLinks })
      .nodeLabel((n: NodeData) => n.text)
      .nodeVal((n: NodeData) => nodeVal(n))
      .nodeColor((n: NodeData) => nodeColor(n, slug, visited))
      .nodeOpacity(1)
      .nodeResolution(8)
      .linkColor(() => "rgba(255,255,255,0.06)")
      .linkWidth(0.2)
      .linkDirectionalParticles(0)
      .onNodeClick((node: NodeData) => openNoteModal(node.id as unknown as FullSlug))
      .onNodeHover((node: NodeData | null) => {
        container.style.cursor = node ? "pointer" : "grab"
      })

    Graph3D = Graph

    // ΓöÇΓöÇ auto-rotate ΓÇö pauses when modal is open OR user is interacting ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

    let autoRotate = true
    let rotAngle = 0
    let rotTimer: ReturnType<typeof setTimeout>

    function pauseRot() {
      autoRotate = false
      clearTimeout(rotTimer)
      // Only resume auto-rotate if modal isn't open
      rotTimer = setTimeout(() => {
        if (!modalOpen) autoRotate = true
      }, 3500)
    }

    // Pause on any interaction with the graph canvas
    container.addEventListener("mousedown", pauseRot)
    container.addEventListener("touchstart", pauseRot)

    Graph.onEngineTick(() => {
      // Don't rotate while modal is open ΓÇö prevents the camera spinning while
      // the user is reading a note
      if (!autoRotate || modalOpen) return
      rotAngle += 0.0007
      Graph.cameraPosition({ x: 450 * Math.sin(rotAngle), z: 450 * Math.cos(rotAngle) })
    })

    const onResize = () => Graph.width(container.offsetWidth).height(container.offsetHeight)
    window.addEventListener("resize", onResize)

    return () => {
      window.removeEventListener("resize", onResize)
      try {
        Graph._destructor?.()
      } catch {}
      container.innerHTML = ""
      Graph3D = null
    }
  }

  // ΓöÇΓöÇ keybinds ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

  document.addEventListener("keydown", (e) => {
    const tag = (document.activeElement as HTMLElement)?.tagName
    const typing = tag === "INPUT" || tag === "TEXTAREA"

    if (e.key === "Tab" && !typing) {
      e.preventDefault()
      showAllLabels = !showAllLabels
      if (Graph3D)
        Graph3D.nodeLabel((n: NodeData) =>
          showAllLabels || currentHighlighted.has(n.id) ? n.text : "",
        )
      return
    }
    if (e.ctrlKey && e.key === "f") {
      e.preventDefault()
      if (!typing) toggleSearch()
      return
    }
    if (e.key === " " && !typing) {
      e.preventDefault()
      if (modalOpen) closeModal()
      else openNoteModal("index" as FullSlug)
      return
    }
    if (e.key === "Escape") {
      if (searchActive) toggleSearch()
      else if (modalOpen) closeModal()
    }
  })

  document.getElementById("graph-search-btn")?.addEventListener("click", toggleSearch)
  document.getElementById("top-bar-search")?.addEventListener("click", toggleSearch)
  document
    .getElementById("top-bar-help")
    ?.addEventListener("click", () => openNoteModal("index" as FullSlug))
  document.getElementById("top-bar-labels")?.addEventListener("click", () => {
    showAllLabels = !showAllLabels
    if (Graph3D)
      Graph3D.nodeLabel((n: NodeData) =>
        showAllLabels || currentHighlighted.has(n.id) ? n.text : "",
      )
  })
  document.getElementById("graph-search")?.addEventListener("input", (e) => {
    handleSearch((e.target as HTMLInputElement).value.toLowerCase().trim())
  })

  // All Notes dropdown
  document.getElementById("top-bar-notes")?.addEventListener("click", async (e) => {
    e.stopPropagation()
    const dropdown = document.getElementById("notes-dropdown")
    if (!dropdown) return

    if (dropdown.classList.contains("active")) {
      dropdown.classList.remove("active")
      return
    }

    // Build dropdown content from graph data
    const data: Map<SimpleSlug, ContentDetails> = new Map(
      Object.entries<ContentDetails>(await fetchData).map(([k, v]) => [
        simplifySlug(k as FullSlug),
        v,
      ]),
    )

    const nodes = Array.from(data.entries())
      .map(([slug, details]) => ({
        slug,
        title: details.title ?? slug,
      }))
      .sort((a, b) => a.title.localeCompare(b.title))

    const folders = new Set<string>()
    for (const s of data.keys()) {
      const parts = s.split("/")
      for (let i = 0; i < parts.length - 1; i++) {
        folders.add(parts.slice(0, i + 1).join("/"))
      }
    }

    let html = `
      <div class="dropdown-section">
        <div class="dropdown-header">Home</div>
        <div class="dropdown-item" data-slug="index">Index</div>
      </div>
    `

    if (folders.size > 0) {
      html += `<div class="dropdown-section">
        <div class="dropdown-header">Folders</div>`
      const sortedFolders = Array.from(folders).sort()
      for (const folder of sortedFolders) {
        html += `<div class="dropdown-item folder" data-slug="${folder}">📁 ${folder.split("/").pop()}</div>`
      }
      html += `</div>`
    }

    html += `<div class="dropdown-section">
      <div class="dropdown-header">Notes (${nodes.length})</div>`
    for (const node of nodes) {
      html += `<div class="dropdown-item" data-slug="${node.slug}">${node.title}</div>`
    }
    html += `</div>`

    dropdown.innerHTML = html
    dropdown.classList.add("active")

    // Add click handlers
    dropdown.querySelectorAll(".dropdown-item").forEach((item) => {
      item.addEventListener("click", () => {
        const slug = (item as HTMLElement).dataset.slug as FullSlug
        openNoteModal(slug)
        dropdown.classList.remove("active")
      })
    })
  })

  // Close dropdown when clicking elsewhere
  document.addEventListener("click", () => {
    document.getElementById("notes-dropdown")?.classList.remove("active")
  })

  // ΓöÇΓöÇ nav ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

  document.addEventListener("nav", async () => {
    for (const id of [
      "background-graph",
      "bg-note-modal",
      "graph-search-container",
      "graph-search-btn",
      "graph-keybinds",
      "top-bar",
    ]) {
      const el = document.getElementById(id)
      if (el && el.parentElement !== document.body) document.body.appendChild(el)
    }

    const container = document.getElementById("background-graph-canvas-container")
    if (!container) return
    if (bgGraphCleanup) {
      bgGraphCleanup()
      bgGraphCleanup = null
    }

    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js")
    await loadScript("https://unpkg.com/3d-force-graph@1.73.3/dist/3d-force-graph.min.js")

    bgGraphCleanup = (await renderBgGraph(container, getFullSlug(window))) ?? null
  })

  // ΓöÇΓöÇ first visit ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

  if (!localStorage.getItem("hasVisited")) {
    localStorage.setItem("hasVisited", "true")
    setTimeout(() => openNoteModal("index" as FullSlug), 800)
  }
}
