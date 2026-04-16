import { FullSlug, SimpleSlug, getFullSlug, simplifySlug } from "../../util/path"
import type { ContentDetails } from "../../plugins/emitters/contentIndex"

if (window.self !== window.top) {
  const style = document.createElement("style")
  style.textContent = `
  #top-bar,
  #background-graph,
  #bg-note-modal,
  #graph-search-container,
  #graph-search-btn,
  #graph-keybinds,
  #graph-nav-panel,
  #graph-focus-panel,
  #graph-panel-scrim { display: none !important; }
  `
  document.head.appendChild(style)
  throw new Error("modal-iframe-bail")
} else {
  type NodeKind = "note" | "folder" | "tag"

  type NodeData = {
    id: SimpleSlug
    text: string
    tags: string[]
    description: string
    kind: NodeKind
    folder?: string
    val: number
    x?: number
    y?: number
    z?: number
  }

  type GraphLink = {
    source: string | NodeData
    target: string | NodeData
    kind: "link" | "tag" | "folder"
  }

  type BrowseItem = {
    id: string
    label: string
    meta: string
    kind: "note" | "folder" | "tag" | "collection"
    value: string
  }

  type FocusState =
    | { kind: "note"; slug: SimpleSlug }
    | { kind: "folder"; value: string }
    | { kind: "tag"; value: string }
    | { kind: "collection"; value: "popular" | "recent" | "home" }
    | { kind: "none" }

  let navHistory: FullSlug[] = []
  let historyIndex = -1
  let showAllLabels = false
  let searchActive = false
  let bgGraphCleanup: (() => void) | null = null
  let Graph3D: any = null
  let nodeMap = new Map<string, NodeData>()
  let nodeNeighbors = new Map<string, Set<string>>()
  let graphDetails = new Map<SimpleSlug, ContentDetails>()
  let graphLinks: GraphLink[] = []
  let graphDataReady = false
  let currentHighlighted = new Set<string>()
  let hoveredNodeId: string | null = null
  let modalOpen = false
  let currentSlug = simplifySlug(getFullSlug(window))
  let currentFocus: FocusState = { kind: "none" }
  let autoRotate = true
  let rotAngle = 0
  let rotTimer: ReturnType<typeof setTimeout> | null = null
  let nodeObjects = new Map<string, any>()
  let visitedListCache: SimpleSlug[] | null = null
  let visitedSetCache: Set<SimpleSlug> | null = null
  let visitedSnapshot = new Set<SimpleSlug>()
  let popularItemsCache: BrowseItem[] = []
  let folderMarkupCache = ""
  let tagMarkupCache = ""
  let searchRenderFrame = 0

  // @ts-ignore loaded from CDN
  let sharedCoreGeometry: any = null
  // @ts-ignore loaded from CDN
  let sharedHaloGeometry: any = null
  // @ts-ignore loaded from CDN
  let sharedFlareGeometry: any = null
  // @ts-ignore loaded from CDN
  let sharedRingGeometry: any = null

  const localStorageKey = "graph-visited"

  function getVisited(): Set<SimpleSlug> {
    if (visitedSetCache) return new Set(visitedSetCache)
    const list = getVisitedList()
    visitedSetCache = new Set(list)
    return new Set(visitedSetCache)
  }

  function getVisitedList(): SimpleSlug[] {
    if (visitedListCache) return [...visitedListCache]
    const stored = JSON.parse(localStorage.getItem(localStorageKey) ?? "[]")
    visitedListCache = Array.isArray(stored) ? (stored as SimpleSlug[]) : []
    return [...visitedListCache]
  }

  function isFirstVisit() {
    return getVisitedList().length === 0
  }

  function defaultLandingSlug(): SimpleSlug | null {
    if (graphDetails.has("/" as SimpleSlug)) return "/" as SimpleSlug
    if (graphDetails.has("index" as SimpleSlug)) return "index" as SimpleSlug
    return Array.from(graphDetails.keys())[0] ?? null
  }

  function trackVisited(slug: SimpleSlug) {
    const existing = getVisitedList().filter((entry) => entry !== slug)
    existing.push(slug)
    visitedListCache = existing.slice(-25)
    visitedSetCache = new Set(visitedListCache)
    visitedSnapshot = new Set(visitedListCache)
    localStorage.setItem(localStorageKey, JSON.stringify(visitedListCache))
  }

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

  function escapeHtml(value: string): string {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
  }

  function el<T extends HTMLElement>(id: string): T | null {
    return document.getElementById(id) as T | null
  }

  function fileSummary(details: ContentDetails | undefined): string {
    if (!details) return "No preview available yet."
    const source = details.description || details.content || ""
    return source.replace(/\s+/g, " ").trim().slice(0, 180) || "No preview available yet."
  }

  function folderPath(slug: SimpleSlug): string {
    const parts = slug.split("/")
    parts.pop()
    return parts.join("/")
  }

  function neighborhoodForNote(slug: SimpleSlug): SimpleSlug[] {
    const neighborIds = Array.from(nodeNeighbors.get(slug) ?? [])
      .filter((id) => graphDetails.has(id as SimpleSlug))
      .map((id) => id as SimpleSlug)
    return [slug, ...neighborIds]
  }

  function collectionNoteIds(kind: FocusState["kind"], value?: string): SimpleSlug[] {
    if (!graphDataReady) return []
    const noteIds = Array.from(graphDetails.keys())
    if (kind === "folder" && value) {
      return noteIds.filter((slug) => slug === value || slug.startsWith(value + "/"))
    }
    if (kind === "tag" && value) {
      const bareTag = value.replace(/^tags\//, "")
      return noteIds.filter((slug) => graphDetails.get(slug)?.tags?.includes(bareTag))
    }
    if (kind === "collection" && value === "recent") {
      return getVisitedList()
        .filter((slug) => graphDetails.has(slug))
        .reverse()
        .slice(0, 12)
    }
    if (kind === "collection" && value === "popular") {
      return noteIds
        .sort((a, b) => (nodeNeighbors.get(b)?.size ?? 0) - (nodeNeighbors.get(a)?.size ?? 0))
        .slice(0, 12)
    }
    if (kind === "collection" && value === "home") {
      return noteIds
    }
    return []
  }

  async function ensureGraphData() {
    if (graphDataReady) return

    const data = new Map<SimpleSlug, ContentDetails>(
      Object.entries<ContentDetails>(await fetchData).map(([k, v]) => [
        simplifySlug(k as FullSlug),
        v,
      ]),
    )

    graphDetails = data
    nodeMap = new Map()
    nodeNeighbors = new Map()
    graphLinks = []

    const edgeKeys = new Set<string>()

    function registerNode(node: NodeData) {
      if (!nodeMap.has(node.id)) nodeMap.set(node.id, node)
    }

    function registerNeighbor(a: string, b: string) {
      if (!nodeNeighbors.has(a)) nodeNeighbors.set(a, new Set())
      if (!nodeNeighbors.has(b)) nodeNeighbors.set(b, new Set())
      nodeNeighbors.get(a)!.add(b)
      nodeNeighbors.get(b)!.add(a)
    }

    function registerEdge(source: SimpleSlug, target: SimpleSlug, kind: GraphLink["kind"]) {
      if (source === target) return
      const key =
        kind === "link"
          ? [source, target].sort().join("::") + "::" + kind
          : `${source}::${target}::${kind}`
      if (edgeKeys.has(key)) return
      edgeKeys.add(key)
      graphLinks.push({ source, target, kind })
      registerNeighbor(source, target)
    }

    for (const [slug, details] of data.entries()) {
      registerNode({
        id: slug,
        text: details.title ?? slug,
        tags: details.tags ?? [],
        description: fileSummary(details),
        folder: folderPath(slug),
        kind: "note",
        val: 3,
      })

      const folder = folderPath(slug)
      if (folder) {
        const folderNodeId = `folder:${folder}` as SimpleSlug
        registerNode({
          id: folderNodeId,
          text: folder.split("/").pop() ?? folder,
          tags: [],
          description: `Folder cluster for ${folder}`,
          folder,
          kind: "folder",
          val: 5,
        })
        registerEdge(slug, folderNodeId, "folder")
      }

      for (const tag of details.tags ?? []) {
        const tagSlug = simplifySlug(("tags/" + tag) as FullSlug)
        registerNode({
          id: tagSlug,
          text: "#" + tag,
          tags: [],
          description: `Notes tagged with ${tag}`,
          kind: "tag",
          val: 4,
        })
        registerEdge(slug, tagSlug, "tag")
      }

      for (const rawLink of details.links ?? []) {
        const target = simplifySlug(rawLink as unknown as FullSlug)
        if (data.has(target)) registerEdge(slug, target, "link")
      }
    }

    for (const id of graphDetails.keys()) {
      const neighbors = nodeNeighbors.get(id)?.size ?? 0
      const node = nodeMap.get(id)
      if (node) node.val = Math.max(2.4, 2 + Math.sqrt(neighbors))
    }

    popularItemsCache = Array.from(graphDetails.keys())
      .sort((a, b) => (nodeNeighbors.get(b)?.size ?? 0) - (nodeNeighbors.get(a)?.size ?? 0))
      .slice(0, 6)
      .map((slug) => {
        const details = graphDetails.get(slug)
        return {
          id: slug,
          label: details?.title ?? slug,
          meta: `${nodeNeighbors.get(slug)?.size ?? 0} connections`,
          kind: "note" as const,
          value: slug,
        }
      })

    folderMarkupCache = Array.from(
      new Map(
        Array.from(graphDetails.keys())
          .map((slug) => folderPath(slug))
          .filter(Boolean)
          .map((folder) => [folder, collectionNoteIds("folder", folder).length]),
      ),
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([folder, count]) => {
        const shortName = folder.split("/").pop() ?? folder
        return `<button class="graph-chip" data-graph-item="folder" data-graph-value="${escapeHtml(folder)}">${escapeHtml(shortName)} <span>${count}</span></button>`
      })
      .join("")

    const tagCounts = new Map<string, number>()
    for (const details of graphDetails.values()) {
      for (const tag of details.tags ?? []) {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
      }
    }
    tagMarkupCache = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([tag, count]) => {
        const tagSlug = "tags/" + tag
        return `<button class="graph-chip" data-graph-item="tag" data-graph-value="${escapeHtml(tagSlug)}">#${escapeHtml(tag)} <span>${count}</span></button>`
      })
      .join("")

    graphDataReady = true
  }

  function labelTextForNode(node: NodeData): string {
    if (node.kind === "folder") return `Folder: ${node.text}`
    return node.text
  }

  function nodeColor(d: NodeData): string {
    const isHighlighted = currentHighlighted.size === 0 || currentHighlighted.has(d.id)
    if (!isHighlighted) return "rgba(126, 121, 112, 0.16)"
    if (currentFocus.kind === "note" && currentFocus.slug === d.id) return "#fff7e8"
    if (d.kind === "folder") return "#d8d0c3"
    if (d.kind === "tag") return "#bdb7ad"
    if (d.id === currentSlug) return "#eee6d8"
    if (visitedSnapshot.has(d.id)) return "#cfc7ba"
    return "#aaa49a"
  }

  function nodeVal(d: NodeData): number {
    if (currentHighlighted.size > 0 && currentHighlighted.has(d.id)) return d.val * 1.1
    if (currentHighlighted.size > 0) return Math.max(1.8, d.val * 0.55)
    return d.val
  }

  function nodeRadius(node: NodeData): number {
    const liveVal = nodeVal(node)
    const hoverBoost = hoveredNodeId === node.id ? 1.16 : 1
    if (node.kind === "folder") return Math.max(4.6, liveVal * 1.75) * hoverBoost
    if (node.kind === "tag") return Math.max(3.8, liveVal * 1.42) * hoverBoost
    if (currentFocus.kind === "note" && currentFocus.slug === node.id)
      return Math.max(4.6, liveVal * 1.65) * hoverBoost
    return Math.max(3.2, liveVal * 1.32) * hoverBoost
  }

  function linkColor(link: GraphLink): string {
    if (currentFocus.kind === "none") return "rgba(246, 235, 215, 0.022)"
    const sourceId = typeof link.source === "string" ? link.source : link.source.id
    const targetId = typeof link.target === "string" ? link.target : link.target.id
    const active =
      currentHighlighted.size === 0 ||
      (currentHighlighted.has(sourceId) && currentHighlighted.has(targetId))
    if (!active) return "rgba(246, 235, 215, 0.04)"
    if (
      currentFocus.kind === "note" &&
      (sourceId === currentFocus.slug || targetId === currentFocus.slug)
    )
      return "rgba(255, 244, 224, 0.32)"
    if (link.kind === "link") return "rgba(222, 213, 198, 0.18)"
    if (link.kind === "tag") return "rgba(184, 176, 162, 0.1)"
    return "rgba(190, 181, 166, 0.12)"
  }

  function linkWidth(link: GraphLink): number {
    if (currentFocus.kind === "none") return 0.05
    const sourceId = typeof link.source === "string" ? link.source : link.source.id
    const targetId = typeof link.target === "string" ? link.target : link.target.id
    const active =
      currentHighlighted.size === 0 ||
      (currentHighlighted.has(sourceId) && currentHighlighted.has(targetId))
    if (!active) return 0.12
    if (currentFocus.kind === "note") {
      const sourceId = typeof link.source === "string" ? link.source : link.source.id
      const targetId = typeof link.target === "string" ? link.target : link.target.id
      if (sourceId === currentFocus.slug || targetId === currentFocus.slug) return 1
    }
    if (link.kind === "link") return 0.62
    return 0.28
  }

  function nodeHaloColor(node: NodeData): string {
    if (currentFocus.kind === "note" && currentFocus.slug === node.id) return "#fff7e8"
    if (node.kind === "folder") return "#d2c9ba"
    if (node.kind === "tag") return "#b8b0a3"
    if (visitedSnapshot.has(node.id)) return "#ded5c6"
    return "#aaa297"
  }

  function ensureSharedNodeGeometry() {
    if (sharedCoreGeometry) return
    // @ts-ignore loaded from CDN
    sharedCoreGeometry = new THREE.SphereGeometry(1, 10, 10)
    // @ts-ignore loaded from CDN
    sharedHaloGeometry = new THREE.SphereGeometry(1, 12, 12)
    // @ts-ignore loaded from CDN
    sharedFlareGeometry = new THREE.OctahedronGeometry(1, 0)
    // @ts-ignore loaded from CDN
    sharedRingGeometry = new THREE.TorusGeometry(1, 0.08, 8, 28)
  }

  function updateNodeObjectAppearance(node: NodeData, group: any) {
    const highlighted = currentHighlighted.size === 0 || currentHighlighted.has(node.id)
    const muted = !highlighted
    const isHovered = hoveredNodeId === node.id
    const pulse = isHovered ? 1 + (Math.sin(Date.now() / 170) + 1) * 0.06 : 1
    const baseRadius = nodeRadius(node)
    const core = group.userData?.core
    const halo = group.userData?.halo
    const ring = group.userData?.ring
    const flare = group.userData?.flare
    const baseHaloOpacity = muted ? 0.018 : node.kind === "note" ? 0.045 : 0.035

    if (core) {
      core.scale.setScalar(baseRadius * (isHovered ? pulse * 1.03 : 1))
      core.material.color.set(nodeColor(node))
      core.material.opacity = muted ? 0.22 : 0.96
    }

    if (halo) {
      halo.scale.setScalar(baseRadius * 2.25 * (isHovered ? pulse * 1.18 : 1.08))
      halo.material.color.set(nodeHaloColor(node))
      halo.material.opacity = isHovered ? 0.11 : baseHaloOpacity
    }

    if (ring) {
      ring.visible = node.kind !== "note"
      ring.scale.setScalar(baseRadius * 1.9)
      ring.material.color.set(nodeHaloColor(node))
      ring.material.opacity = muted ? 0.04 : 0.16
    }

    if (flare) {
      flare.visible = node.kind === "note"
      flare.scale.set(baseRadius * 1.7, baseRadius * 0.4, baseRadius * 0.4)
      flare.material.opacity = muted ? 0.025 : 0.08
    }
  }

  function buildNodeObject(node: NodeData) {
    ensureSharedNodeGeometry()
    // @ts-ignore loaded from CDN
    const group = new THREE.Group()

    // @ts-ignore loaded from CDN
    const core = new THREE.Mesh(
      sharedCoreGeometry,
      // @ts-ignore loaded from CDN
      new THREE.MeshBasicMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 1,
      }),
    )
    group.add(core)

    // @ts-ignore loaded from CDN
    const halo = new THREE.Mesh(
      sharedHaloGeometry,
      // @ts-ignore loaded from CDN
      new THREE.MeshBasicMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 1,
      }),
    )
    group.add(halo)

    // @ts-ignore loaded from CDN
    const ring = new THREE.Mesh(
      sharedRingGeometry,
      // @ts-ignore loaded from CDN
      new THREE.MeshBasicMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 1,
      }),
    )
    ring.rotation.x = Math.PI / 2
    group.add(ring)

    // @ts-ignore loaded from CDN
    const flare = new THREE.Mesh(
      sharedFlareGeometry,
      // @ts-ignore loaded from CDN
      new THREE.MeshBasicMaterial({
        color: "#ffffff",
        transparent: true,
        opacity: 1,
      }),
    )
    group.add(flare)

    group.userData = { core, halo, ring, flare }
    updateNodeObjectAppearance(node, group)
    nodeObjects.set(node.id, group)

    return group
  }

  function updateNodeObjects() {
    for (const [id, object] of nodeObjects.entries()) {
      const node = nodeMap.get(id)
      if (node) updateNodeObjectAppearance(node, object)
    }
  }

  function animateNodeObjects() {
    if (!hoveredNodeId) return
    const hovered = nodeObjects.get(hoveredNodeId)
    const hoveredNode = hoveredNodeId ? nodeMap.get(hoveredNodeId) : null
    if (hovered && hoveredNode) updateNodeObjectAppearance(hoveredNode, hovered)
  }

  function zoomToNodes(ids: string[], duration = 900) {
    if (!Graph3D || ids.length === 0) return
    const positioned = ids
      .map((id) => nodeMap.get(id))
      .filter((n): n is NodeData => !!n && n.x != null)

    if (positioned.length === 0) return

    if (positioned.length === 1) {
      const n = positioned[0]
      const dist = 135
      const mag = Math.hypot(n.x!, n.y ?? 0, n.z ?? 0) || 1
      const r = 1 + dist / mag
      Graph3D.cameraPosition({ x: n.x! * r, y: (n.y ?? 0) * r, z: (n.z ?? 0) * r }, n, duration)
      return
    }

    let minX = Infinity
    let maxX = -Infinity
    let minY = Infinity
    let maxY = -Infinity
    let minZ = Infinity
    let maxZ = -Infinity

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
      { x: cx, y: cy + 16, z: cz + Math.max(220, spread * 1.55) },
      { x: cx, y: cy, z: cz },
      duration,
    )
  }

  function zoomToOverview(duration = 1200) {
    zoomToNodes(Array.from(nodeMap.keys()), duration)
  }

  function refreshGraph() {
    if (!Graph3D) return
    Graph3D.nodeColor((n: NodeData) => nodeColor(n))
      .nodeVal((n: NodeData) => nodeVal(n))
      .linkColor((link: GraphLink) => linkColor(link))
      .linkWidth((link: GraphLink) => linkWidth(link))
      .nodeLabel((n: NodeData) =>
        showAllLabels || currentHighlighted.has(n.id) ? labelTextForNode(n) : "",
      )
    updateNodeObjects()
  }

  function pauseRotation() {
    autoRotate = false
    if (rotTimer) clearTimeout(rotTimer)
    rotTimer = setTimeout(() => {
      if (!modalOpen && currentFocus.kind === "none") autoRotate = true
    }, 4200)
  }

  function setIdentity(_title: string, subtitle: string) {
    const center = el<HTMLSpanElement>("top-bar-center")
    if (center) center.textContent = subtitle
  }

  function browseItemMarkup(item: BrowseItem): string {
    const meta = item.meta
      .split(" • ")
      .filter(Boolean)
      .map((part) => `<span class="graph-meta-pill">${escapeHtml(part)}</span>`)
      .join("")
    return `<button class="graph-list-item" data-graph-item="${item.kind}" data-graph-value="${escapeHtml(item.value)}">
      <strong>${escapeHtml(item.label)}</strong>
      <small class="graph-list-meta">${meta || escapeHtml(item.meta)}</small>
    </button>`
  }

  function renderNavPanel() {
    const recent = getVisitedList()
      .filter((slug, index, all) => graphDetails.has(slug) && all.lastIndexOf(slug) === index)
      .reverse()
      .slice(0, 6)
      .map((slug) => {
        const details = graphDetails.get(slug)
        return {
          id: slug,
          label: details?.title ?? slug,
          meta: details?.tags?.slice(0, 2).join(" • ") || "Recently opened",
          kind: "note" as const,
          value: slug,
        }
      })

    const recentEl = el<HTMLDivElement>("graph-recent-list")
    const popularEl = el<HTMLDivElement>("graph-popular-list")
    const folderEl = el<HTMLDivElement>("graph-folder-list")
    const tagEl = el<HTMLDivElement>("graph-tag-list")

    if (recentEl) recentEl.innerHTML = recent.map(browseItemMarkup).join("")
    if (popularEl) popularEl.innerHTML = popularItemsCache.map(browseItemMarkup).join("")
    if (folderEl)
      folderEl.innerHTML =
        folderMarkupCache ||
        `<div class="graph-empty-state">As your notes group into folders, they’ll appear here.</div>`
    if (tagEl)
      tagEl.innerHTML =
        tagMarkupCache ||
        `<div class="graph-empty-state">Add tags to notes to create thematic constellations.</div>`
  }

  function focusPanelMeta(lines: string[]): string {
    return lines.map((line) => `<span>${escapeHtml(line)}</span>`).join("")
  }

  function signalMarkup(label: string, value: number): string {
    const pct = Math.max(8, Math.min(100, Math.round(value)))
    return `<div class="graph-signal-row">
      <span>${escapeHtml(label)}</span>
      <div class="graph-signal-bar"><i style="width:${pct}%"></i></div>
    </div>`
  }

  function relatedNoteIdsFromFocus(): SimpleSlug[] {
    if (currentFocus.kind === "note") {
      return Array.from(nodeNeighbors.get(currentFocus.slug) ?? [])
        .filter((id) => graphDetails.has(id as SimpleSlug))
        .map((id) => id as SimpleSlug)
        .slice(0, 8)
    }
    if (currentFocus.kind === "folder")
      return collectionNoteIds("folder", currentFocus.value).slice(0, 8)
    if (currentFocus.kind === "tag") return collectionNoteIds("tag", currentFocus.value).slice(0, 8)
    if (currentFocus.kind === "collection")
      return collectionNoteIds("collection", currentFocus.value).slice(0, 8)
    return []
  }

  function updateFocusPanel() {
    const eyebrow = el<HTMLSpanElement>("graph-focus-eyebrow")
    const title = el<HTMLHeadingElement>("graph-focus-title")
    const description = el<HTMLParagraphElement>("graph-focus-description")
    const meta = el<HTMLDivElement>("graph-focus-meta")
    const related = el<HTMLDivElement>("graph-related-list")
    const openBtn = el<HTMLButtonElement>("graph-open-note")
    const centerBtn = el<HTMLButtonElement>("graph-center-note")
    const signal = el<HTMLDivElement>("graph-focus-signal")
    if (
      !eyebrow ||
      !title ||
      !description ||
      !meta ||
      !related ||
      !openBtn ||
      !centerBtn ||
      !signal
    )
      return

    if (currentFocus.kind === "note") {
      const details = graphDetails.get(currentFocus.slug)
      const folder = folderPath(currentFocus.slug) || "Root"
      const tags = (details?.tags ?? []).slice(0, 3)
      const connections = nodeNeighbors.get(currentFocus.slug)?.size ?? 0
      eyebrow.textContent = "Focused note"
      title.textContent = details?.title ?? currentFocus.slug
      description.textContent = fileSummary(details)
      meta.innerHTML = focusPanelMeta([
        `${connections} direct connections`,
        folder,
        tags.length > 0 ? tags.join(" • ") : "No tags yet",
      ])
      signal.innerHTML = [
        signalMarkup("Links", Math.min(100, connections * 9)),
        signalMarkup("Tags", Math.min(100, (details?.tags?.length ?? 0) * 22)),
        signalMarkup("Depth", Math.min(100, Math.max(14, (details?.content?.length ?? 0) / 18))),
      ].join("")
      openBtn.disabled = false
      openBtn.dataset.slug = currentFocus.slug
      centerBtn.dataset.kind = "note"
      centerBtn.dataset.value = currentFocus.slug
      setIdentity(
        details?.title ?? "Focused note",
        "Open the note and branch into its nearby constellation",
      )
    } else if (currentFocus.kind === "folder") {
      const ids = collectionNoteIds("folder", currentFocus.value)
      eyebrow.textContent = "Folder cluster"
      title.textContent = currentFocus.value.split("/").pop() ?? currentFocus.value
      description.textContent = `This cluster gathers ${ids.length} notes from the ${currentFocus.value} folder. Start anywhere inside it and expand outward through related notes.`
      meta.innerHTML = focusPanelMeta([`${ids.length} notes`, "Folder constellation"])
      signal.innerHTML = [
        signalMarkup("Density", Math.min(100, ids.length * 8)),
        signalMarkup(
          "Reach",
          Math.min(
            100,
            (ids.reduce((sum, id) => sum + (nodeNeighbors.get(id)?.size ?? 0), 0) /
              Math.max(1, ids.length)) *
              6,
          ),
        ),
      ].join("")
      openBtn.disabled = ids.length === 0
      openBtn.dataset.slug = ids[0] ?? ""
      centerBtn.dataset.kind = "folder"
      centerBtn.dataset.value = currentFocus.value
      setIdentity("Folder cluster", currentFocus.value)
    } else if (currentFocus.kind === "tag") {
      const ids = collectionNoteIds("tag", currentFocus.value)
      const bareTag = currentFocus.value.replace(/^tags\//, "")
      eyebrow.textContent = "Tag cluster"
      title.textContent = `#${bareTag}`
      description.textContent = `This theme links ${ids.length} notes. It’s a strong way to browse when you know the topic but not the exact destination.`
      meta.innerHTML = focusPanelMeta([`${ids.length} tagged notes`, "Theme constellation"])
      signal.innerHTML = [
        signalMarkup("Coverage", Math.min(100, ids.length * 9)),
        signalMarkup(
          "Reach",
          Math.min(
            100,
            (ids.reduce((sum, id) => sum + (nodeNeighbors.get(id)?.size ?? 0), 0) /
              Math.max(1, ids.length)) *
              6,
          ),
        ),
      ].join("")
      openBtn.disabled = ids.length === 0
      openBtn.dataset.slug = ids[0] ?? ""
      centerBtn.dataset.kind = "tag"
      centerBtn.dataset.value = currentFocus.value
      setIdentity(`#${bareTag}`, "Topic cluster")
    } else if (currentFocus.kind === "collection") {
      const ids = collectionNoteIds("collection", currentFocus.value)
      const label =
        currentFocus.value === "popular"
          ? "Popular constellation"
          : currentFocus.value === "recent"
            ? "Visited trail"
            : "Graph overview"
      eyebrow.textContent = "Collection"
      title.textContent = label
      description.textContent =
        currentFocus.value === "popular"
          ? "These notes are highly connected and make strong launch points into the graph."
          : currentFocus.value === "recent"
            ? "Pick up where you left off or retrace your trail through the graph."
            : "The full graph stays lit here, so you can read the whole space before drilling into a local cluster."
      meta.innerHTML = focusPanelMeta([`${ids.length} notes in view`])
      signal.innerHTML = [
        signalMarkup("Span", Math.min(100, ids.length * 8)),
        signalMarkup(
          "Intensity",
          Math.min(
            100,
            (ids.reduce((sum, id) => sum + (nodeNeighbors.get(id)?.size ?? 0), 0) /
              Math.max(1, ids.length)) *
              6,
          ),
        ),
      ].join("")
      openBtn.disabled = ids.length === 0
      openBtn.dataset.slug = ids[0] ?? ""
      centerBtn.dataset.kind = "collection"
      centerBtn.dataset.value = currentFocus.value
      setIdentity(label, "Start broad, then zoom into a local constellation only when you want to")
    } else {
      eyebrow.textContent = "Focus"
      title.textContent = "Graph overview"
      description.textContent =
        "The graph starts fully lit and zoomed out. Click a node once to open it, center it, and reveal its nearest connections."
      meta.innerHTML = ""
      signal.innerHTML = [
        signalMarkup("Coverage", 100),
        signalMarkup("Context", 78),
        signalMarkup("Focus", 32),
      ].join("")
      openBtn.disabled = true
      openBtn.dataset.slug = ""
      centerBtn.dataset.kind = "collection"
      centerBtn.dataset.value = "home"
      setIdentity(
        "Que's Notes",
        "Explore the full map first, then drop into whichever note pulls you in",
      )
    }

    const relatedIds = relatedNoteIdsFromFocus()
    related.innerHTML =
      relatedIds.length > 0
        ? relatedIds
            .map((slug) => {
              const details = graphDetails.get(slug)
              return browseItemMarkup({
                id: slug,
                label: details?.title ?? slug,
                meta: fileSummary(details),
                kind: "note",
                value: slug,
              })
            })
            .join("")
        : `<div class="graph-empty-state">Focus a note or cluster to see nearby ideas.</div>`
  }

  function applyCurrentFocus(zoom = false) {
    if (currentFocus.kind === "note") {
      currentHighlighted = new Set(neighborhoodForNote(currentFocus.slug))
    } else if (currentFocus.kind === "folder") {
      currentHighlighted = new Set(collectionNoteIds("folder", currentFocus.value))
    } else if (currentFocus.kind === "tag") {
      currentHighlighted = new Set(collectionNoteIds("tag", currentFocus.value))
    } else if (currentFocus.kind === "collection") {
      currentHighlighted = new Set(collectionNoteIds("collection", currentFocus.value))
    } else {
      currentHighlighted = new Set()
    }

    refreshGraph()
    updateFocusPanel()
    if (zoom) {
      if (currentFocus.kind === "none" || currentHighlighted.size === 0) zoomToOverview()
      else zoomToNodes(Array.from(currentHighlighted))
    }
  }

  function focusNote(slug: SimpleSlug, zoom = true) {
    currentFocus = { kind: "note", slug }
    pauseRotation()
    applyCurrentFocus(zoom)
  }

  function focusCollection(kind: "folder" | "tag" | "collection", value: string, zoom = true) {
    currentFocus =
      kind === "collection"
        ? { kind, value: value as "popular" | "recent" | "home" }
        : { kind, value }
    pauseRotation()
    applyCurrentFocus(zoom)
  }

  function formatDisplayLabel(value: string) {
    const segment = value.split("/").filter(Boolean).pop() ?? value
    return segment
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase())
  }

  function ensureModalDOM() {
    let modal = el<HTMLDivElement>("bg-note-modal")
    if (!modal) {
      modal = document.createElement("div")
      modal.id = "bg-note-modal"
      document.body.appendChild(modal)
    }

    if (modal.querySelector("#modal-iframe")) return modal

    modal.innerHTML = `
      <div id="modal-panel">
        <div id="modal-chrome">
          <div id="modal-nav">
            <button id="modal-back" disabled>&larr;</button>
            <button id="modal-forward" disabled>&rarr;</button>
          </div>
          <div id="modal-header">
            <span id="modal-kicker">Node view</span>
            <strong id="modal-title">Loading</strong>
            <small id="modal-subtitle">Preparing note</small>
          </div>
          <a id="modal-open-page" href="/" target="_self">Open page</a>
          <button id="bg-modal-close">&times;</button>
        </div>
        <iframe id="modal-iframe" src="about:blank"></iframe>
      </div>
    `

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal()
    })

    el<HTMLButtonElement>("bg-modal-close")?.addEventListener("click", closeModal)
    el<HTMLButtonElement>("modal-back")?.addEventListener("click", () => {
      if (historyIndex > 0) {
        historyIndex--
        navigateIframe(navHistory[historyIndex], false)
      }
    })
    el<HTMLButtonElement>("modal-forward")?.addEventListener("click", () => {
      if (historyIndex < navHistory.length - 1) {
        historyIndex++
        navigateIframe(navHistory[historyIndex], false)
      }
    })

    return modal
  }

  function syncModalMeta(slug: FullSlug) {
    const simple = simplifySlug(slug)
    const details = graphDetails.get(simple)
    const folder = folderPath(simple) || "root"
    const title = el<HTMLElement>("modal-title")
    const kicker = el<HTMLElement>("modal-kicker")
    const subtitle = el<HTMLElement>("modal-subtitle")
    const openLink = el<HTMLAnchorElement>("modal-open-page")
    const primaryTitle = details?.title?.trim() || formatDisplayLabel(simple)
    const tagLabel =
      details?.tags && details.tags.length > 0
        ? details.tags
            .slice(0, 2)
            .map((tag) => tag.replace(/^#/, ""))
            .join(" • ")
        : "linked note"
    if (kicker) kicker.textContent = `${folder.toUpperCase()} NODE`
    if (title) title.textContent = primaryTitle
    if (subtitle) {
      subtitle.textContent = `${tagLabel.toUpperCase()} • ${simple.toUpperCase()}`
    }
    if (openLink) openLink.href = slug === ("/" as FullSlug) ? "/" : `/${slug}`
  }

  function syncNavButtons() {
    const back = el<HTMLButtonElement>("modal-back")
    const forward = el<HTMLButtonElement>("modal-forward")
    if (back) back.disabled = historyIndex <= 0
    if (forward) forward.disabled = historyIndex >= navHistory.length - 1
  }

  function sizeModalToContent(iframe?: HTMLIFrameElement | null) {
    const modalPanel = el<HTMLDivElement>("modal-panel")
    const chrome = el<HTMLDivElement>("modal-chrome")
    const modalIframe = iframe ?? el<HTMLIFrameElement>("modal-iframe")
    if (!modalPanel || !chrome || !modalIframe) return

    try {
      const iDoc = modalIframe.contentDocument ?? modalIframe.contentWindow?.document
      if (!iDoc) return
      const body = iDoc.body
      const docEl = iDoc.documentElement
      const contentHeight = Math.max(
        body?.scrollHeight ?? 0,
        body?.offsetHeight ?? 0,
        docEl?.scrollHeight ?? 0,
        docEl?.offsetHeight ?? 0,
      )

      const chromeHeight = chrome.getBoundingClientRect().height
      const viewportCap = Math.min(window.innerHeight * 0.86, 920)
      const iframeHeight = Math.max(220, Math.min(contentHeight + 8, viewportCap - chromeHeight))
      modalIframe.style.height = `${iframeHeight}px`
      modalPanel.style.height = `${Math.min(viewportCap, chromeHeight + iframeHeight)}px`
    } catch {}
  }

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
    #graph-nav-panel,
    #graph-focus-panel,
    #graph-panel-scrim,
    .sidebar,
    .page > header,
    .page > footer,
    .toc,
    .backlinks {
      display: none !important;
    }
    body {
      background:
        linear-gradient(rgba(244, 234, 216, 0.014) 1px, transparent 1px),
        linear-gradient(90deg, rgba(244, 234, 216, 0.01) 1px, transparent 1px),
        radial-gradient(circle at 18% 0%, rgba(141, 47, 39, 0.16), transparent 34%),
        linear-gradient(180deg, #171817, #101111) !important;
      background-size:
        58px 58px,
        58px 58px,
        100% 100%,
        100% 100% !important;
    }
    .page {
      max-width: 100% !important;
      margin: 0 !important;
    }
    .page .page-title,
    .page .page-title a,
    .page .page-header > .popover-hint,
    .page .page-footer,
    #quartz-body > footer,
    .page footer {
      display: none !important;
    }
    .page > #quartz-body > .center > hr,
    .page article + hr {
      display: none !important;
    }
    .page .page-header {
      margin: 0 !important;
      padding: 0 !important;
    }
    .page > #quartz-body {
      display: block !important;
    }
    .page > #quartz-body > .center {
      max-width: 820px;
      margin: 0 auto;
      padding: 0.8rem 1.25rem 2rem;
      box-sizing: border-box;
    }
    .page article {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid rgba(244, 234, 216, 0.14);
      background:
        linear-gradient(rgba(244, 234, 216, 0.018) 1px, transparent 1px),
        linear-gradient(90deg, rgba(244, 234, 216, 0.012) 1px, transparent 1px),
        linear-gradient(180deg, rgba(244, 234, 216, 0.026), rgba(244, 234, 216, 0.006)),
        rgba(255, 255, 255, 0.01);
      background-size:
        44px 44px,
        44px 44px,
        100% 100%,
        100% 100%;
      padding: 0.95rem 1.15rem 1.4rem;
      margin-top: 0 !important;
    }
    .page article > h1:first-child,
    .page article > .article-title:first-child,
    .page article > .content-meta:first-of-type,
    .page article > .article-meta:first-of-type {
      display: none !important;
    }
    .page article h1,
    .page article .article-title {
      display: none !important;
    }
    .page article p,
    .page article li,
    .page article blockquote {
      color: rgba(244, 234, 216, 0.84) !important;
    }
    .page article hr {
      border-color: rgba(244, 234, 216, 0.12) !important;
    }
    .page article a {
      color: #fff3df !important;
      text-decoration-color: rgba(141, 47, 39, 0.72) !important;
    }
    .page article blockquote {
      border-left: 1px solid rgba(244, 234, 216, 0.34) !important;
      background: rgba(141, 47, 39, 0.12) !important;
      padding: 0.8rem 1rem !important;
    }
    .page article pre,
    .page article code {
      border-radius: 0 !important;
    }
    .page article pre {
      border: 1px solid rgba(244, 234, 216, 0.12) !important;
      background: rgba(0, 0, 0, 0.32) !important;
    }
    `
    iDoc.head.appendChild(style)
  }

  function attachIframeInterceptor(iframe: HTMLIFrameElement) {
    try {
      const iDoc = iframe.contentDocument ?? iframe.contentWindow?.document
      if (!iDoc) return
      injectIframeStyles(iDoc)
      sizeModalToContent(iframe)
      const prev = (iframe as any).__clickHandler
      if (prev) iDoc.removeEventListener("click", prev)
      const prevResize = (iframe as any).__resizeObserver
      prevResize?.disconnect?.()

      const handler = (e: MouseEvent) => {
        const anchor = (e.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null
        if (!anchor) return
        const href = anchor.getAttribute("href")!
        if (href.startsWith("http") || href.startsWith("//") || href.startsWith("#")) return
        e.preventDefault()
        e.stopPropagation()
        const slug = href.replace(/^\//, "").replace(/\.html$/, "") as FullSlug
        openNoteModal(slug, true)
      }

      ;(iframe as any).__clickHandler = handler
      iDoc.addEventListener("click", handler)
      if ("ResizeObserver" in window) {
        const observer = new ResizeObserver(() => sizeModalToContent(iframe))
        if (iDoc.body) observer.observe(iDoc.body)
        const article = iDoc.querySelector(".page article")
        if (article) observer.observe(article)
        ;(iframe as any).__resizeObserver = observer
      }
    } catch {}
  }

  function navigateIframe(slug: FullSlug, push = true, focusGraph = true, zoomGraph = true) {
    const iframe = el<HTMLIFrameElement>("modal-iframe")
    if (!iframe) return

    if (push) {
      navHistory.splice(historyIndex + 1)
      navHistory.push(slug)
      historyIndex = navHistory.length - 1
    }
    syncNavButtons()

    const simple = simplifySlug(slug)
    trackVisited(simple)
    visitedSnapshot = getVisited()
    syncModalMeta(slug)

    const path = slug === ("/" as FullSlug) ? "/" : "/" + slug
    if (!iframe.src.endsWith(path) && !iframe.src.endsWith(path + "/")) {
      iframe.src = path
      iframe.onload = () => attachIframeInterceptor(iframe)
    }

    if (focusGraph) focusNote(simple, zoomGraph)
    renderNavPanel()
  }

  async function openNoteModal(
    slug: FullSlug,
    push = true,
    options?: { focusGraph?: boolean; zoomGraph?: boolean },
  ) {
    const modal = ensureModalDOM()
    navigateIframe(slug, push, options?.focusGraph ?? true, options?.zoomGraph ?? true)
    modal.classList.add("active")
    el<HTMLDivElement>("background-graph")?.classList.add("dimmed")
    modalOpen = true
  }

  function closeModal() {
    el<HTMLDivElement>("bg-note-modal")?.classList.remove("active")
    el<HTMLDivElement>("background-graph")?.classList.remove("dimmed")
    const iframe = el<HTMLIFrameElement>("modal-iframe")
    const panel = el<HTMLDivElement>("modal-panel")
    if (iframe) iframe.style.height = ""
    if (panel) panel.style.height = ""
    modalOpen = false
  }

  function searchResults(query: string): BrowseItem[] {
    const q = query.toLowerCase().trim()
    const entries: Array<BrowseItem & { score: number }> = []

    for (const [slug, details] of graphDetails.entries()) {
      const haystack = `${details.title} ${details.content} ${(details.tags ?? []).join(" ")} ${folderPath(slug)}`
      if (!q || haystack.toLowerCase().includes(q)) {
        const titleHit = q && details.title.toLowerCase().includes(q) ? 3 : 0
        const tagHit =
          q && (details.tags ?? []).some((tag) => tag.toLowerCase().includes(q)) ? 2 : 0
        const folderHit = q && folderPath(slug).toLowerCase().includes(q) ? 1 : 0
        const degree = nodeNeighbors.get(slug)?.size ?? 0
        entries.push({
          id: slug,
          label: details.title ?? slug,
          meta: `${folderPath(slug) || "Root"} • ${details.tags?.slice(0, 3).join(" • ") || "note"}`,
          kind: "note",
          value: slug,
          score: titleHit + tagHit + folderHit + degree / 20,
        })
      }
    }

    return entries.sort((a, b) => b.score - a.score).slice(0, q ? 12 : 8)
  }

  function renderSearchResults(query: string) {
    const container = el<HTMLDivElement>("graph-search-results")
    if (!container) return
    const results = searchResults(query)
    container.innerHTML =
      results.length > 0
        ? results.map(browseItemMarkup).join("")
        : `<div class="graph-empty-state">No exact match. Try a folder name, tag, or broader term.</div>`

    if (query) {
      currentHighlighted = new Set(results.map((item) => item.value))
      refreshGraph()
    } else {
      applyCurrentFocus(false)
    }
  }

  function queueSearchResults(query: string) {
    if (searchRenderFrame) cancelAnimationFrame(searchRenderFrame)
    searchRenderFrame = requestAnimationFrame(() => {
      searchRenderFrame = 0
      renderSearchResults(query)
    })
  }

  function toggleSearch(force?: boolean) {
    const next = force ?? !searchActive
    const container = el<HTMLDivElement>("graph-search-container")
    if (!container) return
    searchActive = next
    container.classList.toggle("active", next)
    updateScrim()
    if (next) {
      renderSearchResults("")
      el<HTMLInputElement>("graph-search")?.focus()
    } else {
      const input = el<HTMLInputElement>("graph-search")
      if (input) input.value = ""
      applyCurrentFocus(false)
    }
    syncTopBarButtons()
  }

  function updateScrim() {
    const overlayActive =
      searchActive ||
      !!el<HTMLDivElement>("graph-nav-panel")?.classList.contains("open") ||
      !!el<HTMLDivElement>("graph-focus-panel")?.classList.contains("open")
    el<HTMLDivElement>("graph-panel-scrim")?.classList.toggle("active", overlayActive)
  }

  function isDesktopLayout(): boolean {
    return window.matchMedia("(min-width: 981px)").matches
  }

  function syncTopBarButtons() {
    const navButton = el<HTMLButtonElement>("top-bar-notes")
    const focusButton = el<HTMLButtonElement>("top-bar-help")
    const searchButton = el<HTMLButtonElement>("top-bar-search")
    navButton?.classList.toggle(
      "active",
      !!el<HTMLDivElement>("graph-nav-panel")?.classList.contains("open"),
    )
    focusButton?.classList.toggle(
      "active",
      !!el<HTMLDivElement>("graph-focus-panel")?.classList.contains("open"),
    )
    searchButton?.classList.toggle("active", searchActive)
  }

  function setPanelOpen(panelId: "graph-nav-panel" | "graph-focus-panel", open?: boolean) {
    const panel = el<HTMLDivElement>(panelId)
    if (!panel) return
    const next = open ?? !panel.classList.contains("open")
    if (isDesktopLayout()) panel.classList.toggle("panel-hidden", !next)
    panel.classList.toggle("open", next)
    updateScrim()
    syncTopBarButtons()
  }

  function closePanels() {
    el<HTMLDivElement>("graph-nav-panel")?.classList.remove("open")
    el<HTMLDivElement>("graph-focus-panel")?.classList.remove("open")
    if (isDesktopLayout()) {
      el<HTMLDivElement>("graph-nav-panel")?.classList.add("panel-hidden")
      el<HTMLDivElement>("graph-focus-panel")?.classList.add("panel-hidden")
    }
    updateScrim()
    syncTopBarButtons()
  }

  function handleGraphAction(action: string) {
    if (action === "home") {
      currentFocus = { kind: "collection", value: "home" }
      applyCurrentFocus(true)
      return
    }
    if (action === "random") {
      const notes = Array.from(graphDetails.keys())
      const random = notes[Math.floor(Math.random() * notes.length)]
      if (random) focusNote(random, true)
      return
    }
    if (action === "recent") {
      currentFocus = { kind: "collection", value: "recent" }
      applyCurrentFocus(true)
      return
    }
    if (action === "popular") {
      currentFocus = { kind: "collection", value: "popular" }
      applyCurrentFocus(true)
      return
    }
    if (action === "neighbors" && currentFocus.kind === "note") {
      zoomToNodes(neighborhoodForNote(currentFocus.slug))
    }
  }

  async function renderBgGraph(container: HTMLElement, fullSlug: FullSlug) {
    container.innerHTML = ""
    Graph3D = null
    currentSlug = simplifySlug(fullSlug)

    await ensureGraphData()
    visitedSnapshot = getVisited()
    renderNavPanel()

    const nodes = Array.from(nodeMap.values())
    nodeObjects = new Map()

    // @ts-ignore loaded from CDN
    const Graph = ForceGraph3D({ antialias: true, alpha: true })(container)
      .width(container.offsetWidth)
      .height(container.offsetHeight)
      .backgroundColor("rgba(0,0,0,0)")
      .graphData({ nodes, links: graphLinks })
      .nodeLabel((n: NodeData) => labelTextForNode(n))
      .nodeVal((n: NodeData) => nodeVal(n))
      .nodeColor((n: NodeData) => nodeColor(n))
      .nodeThreeObject((n: NodeData) => buildNodeObject(n))
      .nodeThreeObjectExtend(false)
      .nodeOpacity(0.94)
      .nodeResolution(6)
      .linkColor((link: GraphLink) => linkColor(link))
      .linkWidth((link: GraphLink) => linkWidth(link))
      .linkDirectionalParticles(0)
      .onNodeClick((node: NodeData) => {
        if (node.kind !== "note") {
          if (node.kind === "folder") focusCollection("folder", node.folder ?? node.text, true)
          if (node.kind === "tag") focusCollection("tag", node.id, true)
          return
        }
        openNoteModal(node.id as unknown as FullSlug, true, { focusGraph: true, zoomGraph: true })
      })
      .onNodeHover((node: NodeData | null) => {
        const nextHover = node?.id ?? null
        if (hoveredNodeId !== nextHover) {
          const previousHover = hoveredNodeId
          hoveredNodeId = nextHover
          if (previousHover) {
            const prevObject = nodeObjects.get(previousHover)
            const prevNode = nodeMap.get(previousHover)
            if (prevObject && prevNode) updateNodeObjectAppearance(prevNode, prevObject)
          }
          if (nextHover) {
            const nextObject = nodeObjects.get(nextHover)
            const nextNode = nodeMap.get(nextHover)
            if (nextObject && nextNode) updateNodeObjectAppearance(nextNode, nextObject)
          }
        }
        container.style.cursor = node ? "pointer" : "grab"
      })
      .onBackgroundClick(() => {
        currentFocus = { kind: "none" }
        applyCurrentFocus(true)
      })

    Graph3D = Graph
    Graph.linkOpacity(0.85)
    Graph.cameraPosition({ x: 0, y: 48, z: 760 })
    Graph.d3Force("charge")?.strength?.(-50)
    Graph.d3Force("link")?.distance?.(30)
    Graph.d3Force("center")?.strength?.(0.2)

    currentFocus = { kind: "none" }
    applyCurrentFocus(false)
    window.setTimeout(() => zoomToOverview(0), 650)

    const landingSlug = defaultLandingSlug()
    if (isFirstVisit() && landingSlug) {
      window.setTimeout(() => {
        openNoteModal(landingSlug as unknown as FullSlug, true, {
          focusGraph: false,
          zoomGraph: false,
        })
      }, 280)
    }

    container.addEventListener("mousedown", pauseRotation)
    container.addEventListener("touchstart", pauseRotation)

    Graph.onEngineTick(() => {
      animateNodeObjects()
      if (!autoRotate || modalOpen || currentFocus.kind !== "none") return
      rotAngle += 0.00045
      Graph.cameraPosition({
        x: 860 * Math.sin(rotAngle),
        y: 42 + 16 * Math.sin(rotAngle * 0.6),
        z: 860 * Math.cos(rotAngle),
      })
    })

    const onResize = () => {
      Graph.width(container.offsetWidth).height(container.offsetHeight)
      if (modalOpen) sizeModalToContent()
    }
    window.addEventListener("resize", onResize)

    return () => {
      window.removeEventListener("resize", onResize)
      try {
        Graph._destructor?.()
      } catch {}
      container.innerHTML = ""
      Graph3D = null
      nodeObjects = new Map()
    }
  }

  document.addEventListener("keydown", (e) => {
    const tag = (document.activeElement as HTMLElement | null)?.tagName
    const typing = tag === "INPUT" || tag === "TEXTAREA"

    if (e.key === "Tab" && !typing) {
      e.preventDefault()
      showAllLabels = !showAllLabels
      refreshGraph()
      return
    }

    if (e.ctrlKey && e.key === "f") {
      e.preventDefault()
      if (!typing) toggleSearch()
      return
    }

    if (e.key === "Enter" && !typing && currentFocus.kind === "note") {
      e.preventDefault()
      openNoteModal(currentFocus.slug as unknown as FullSlug, true, {
        focusGraph: true,
        zoomGraph: true,
      })
      return
    }

    if (e.key === "Escape") {
      if (searchActive) toggleSearch(false)
      else if (modalOpen) closeModal()
      else closePanels()
    }
  })

  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement
    const notesToggle = target.closest("#top-bar-notes")
    if (notesToggle) {
      setPanelOpen("graph-nav-panel")
      return
    }
    const searchToggle = target.closest("#top-bar-search, #graph-search-btn")
    if (searchToggle) {
      toggleSearch()
      return
    }
    const helpToggle = target.closest("#top-bar-help")
    if (helpToggle) {
      setPanelOpen("graph-focus-panel")
      return
    }
    const labelsToggle = target.closest("#top-bar-labels")
    if (labelsToggle) {
      showAllLabels = !showAllLabels
      refreshGraph()
      return
    }
    const openNoteButton = target.closest("#graph-open-note")
    if (openNoteButton) {
      const slug = el<HTMLButtonElement>("graph-open-note")?.dataset.slug as FullSlug | undefined
      if (slug) openNoteModal(slug, true, { focusGraph: true, zoomGraph: true })
      return
    }
    const centerButton = target.closest("#graph-center-note")
    if (centerButton) {
      applyCurrentFocus(true)
      return
    }
    const action = target.closest("[data-graph-action]") as HTMLElement | null
    if (action) {
      handleGraphAction(action.dataset.graphAction!)
      closePanels()
      return
    }

    const item = target.closest("[data-graph-item]") as HTMLElement | null
    if (item) {
      const kind = item.dataset.graphItem
      const value = item.dataset.graphValue ?? ""
      if (kind === "note")
        openNoteModal(value as FullSlug, true, { focusGraph: true, zoomGraph: true })
      if (kind === "folder") focusCollection("folder", value, true)
      if (kind === "tag") focusCollection("tag", value, true)
      closePanels()
      if (searchActive) toggleSearch(false)
      return
    }
  })
  el<HTMLDivElement>("graph-panel-scrim")?.addEventListener("click", () => {
    closePanels()
    if (searchActive) toggleSearch(false)
  })
  el<HTMLInputElement>("graph-search")?.addEventListener("input", (e) => {
    queueSearchResults((e.target as HTMLInputElement).value)
  })

  document.addEventListener("nav", async () => {
    currentSlug = simplifySlug(getFullSlug(window))

    for (const id of [
      "background-graph",
      "bg-note-modal",
      "graph-search-container",
      "graph-search-btn",
      "graph-keybinds",
      "top-bar",
      "graph-nav-panel",
      "graph-focus-panel",
      "graph-panel-scrim",
    ]) {
      const element = document.getElementById(id)
      if (element && element.parentElement !== document.body) document.body.appendChild(element)
    }

    const container = el<HTMLDivElement>("background-graph-canvas-container")
    if (!container) return

    if (searchActive) toggleSearch(false)

    if (bgGraphCleanup) {
      bgGraphCleanup()
      bgGraphCleanup = null
    }

    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js")
    await loadScript("https://unpkg.com/3d-force-graph@1.73.3/dist/3d-force-graph.min.js")

    bgGraphCleanup = (await renderBgGraph(container, getFullSlug(window))) ?? null
    if (isDesktopLayout()) {
      el<HTMLDivElement>("graph-nav-panel")?.classList.add("open")
      el<HTMLDivElement>("graph-focus-panel")?.classList.add("open")
      el<HTMLDivElement>("graph-nav-panel")?.classList.remove("panel-hidden")
      el<HTMLDivElement>("graph-focus-panel")?.classList.remove("panel-hidden")
      updateScrim()
      syncTopBarButtons()
    } else {
      closePanels()
    }
  })
}
