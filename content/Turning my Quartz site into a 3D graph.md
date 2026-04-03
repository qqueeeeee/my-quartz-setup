---
created: 2026-03-08
tags:
  - ai
  - career
  - cs
  - design
  - frontend
  - games
  - hackathon
  - job-search
  - learning
  - linux
  - project/pathforge-ai
  - project/quartz
  - projects
  - reverse-engineering
  - security
  - systems
  - tooling
  - topic/c++
  - topic/career-planning
  - topic/clipboard
  - topic/compatibility
  - topic/data-structures
  - topic/dsa
  - topic/games
  - topic/graph
  - topic/hackathon
  - topic/interview-prep
  - topic/job-search
  - topic/linux
  - topic/neovim
  - topic/pathforge-ai
  - topic/portfolio
  - topic/quartz
  - topic/resume
  - topic/reverse-engineering
  - topic/security
  - topic/sfd
  - topic/wsl2
  - workflow
people:
  - Que
places:
  []
projects:
  - PathForge AI
  - Quartz
themes:
  - ai
  - career
  - cs
  - design
  - frontend
  - games
  - hackathon
  - job-search
  - learning
  - linux
  - projects
  - reverse-engineering
  - security
  - systems
  - tooling
  - workflow
topics:
  - c++
  - career-planning
  - clipboard
  - compatibility
  - data-structures
  - dsa
  - games
  - graph
  - hackathon
  - interview-prep
  - job-search
  - linux
  - neovim
  - pathforge-ai
  - portfolio
  - quartz
  - resume
  - reverse-engineering
  - security
  - sfd
  - wsl2
orgs:
  []
related:
  - "[[About Me]]"
  - "[[Address Space Layout Randomization (ASLR)|ASLR]]"
  - "[[C++]]"
  - "[[Data Structures]]"
  - "[[Digital Garden]]"
  - "[[Featured Work]]"
  - "[[Keyboard Centric Workflow]]"
  - "[[Neovim]]"
  - "[[PathForge AI]]"
  - "[[Quartz]]"
  - "[[Skills]]"
  - "[[Superfighters Deluxe]]"
  - "[[Tiling Window Managers]]"
  - "[[Writing]]"
---

# Turning my Quartz site into a 3D graph

This note is about the technical and design decisions behind turning my [[Quartz]] site into a 3D graph interface.

## Notes

The whole point here was to make [[Quartz]] feel like an actual explorable space instead of a normal notes site with a graph sitting off to the side.

I wanted the landing experience to be the graph itself, and I wanted node clicks to open note content in a modal instead of throwing people out of the flow.

The architecture decisions that mattered most were:

- render the graph separately from normal page content
- keep the actual note page available inside a modal / iframe flow
- avoid hacky CSS hiding tricks that break the site in weird ways
- keep most of the graph logic in the inline script layer instead of stuffing everything into the component file

I hit a few dead ends first. Early approaches using CSS hiding and iframe bail-outs caused broken explorer behavior and blank content, so I dropped that direction. The cleaner version was separating the graph from the normal Quartz page layout and using dedicated iframe-rendered note pages for modal content.

The technical details that actually mattered were:

- adding a `mainGraph` field to the layout config
- rendering `MainGraph` outside `quartz-root`
- using `quartz-root` as the modal container
- creating iframe-only page output so the modal does not recursively render the graph again
- keeping `BackgroundGraph.tsx` mostly structural and pushing the heavy logic into `backgroundgraph.inline.ts`

This note is less about one exact final implementation and more about the direction: if I want the site to feel like a graph-native portfolio / garden, the graph cannot just be decoration. It has to become the main navigation system.

## Related notes

- [[About Me]]
- [[Address Space Layout Randomization (ASLR)|ASLR]]
- [[C++]]
- [[Data Structures]]
- [[Digital Garden]]
- [[Featured Work]]
- [[Keyboard Centric Workflow]]
- [[Neovim]]
- [[PathForge AI]]
- [[Quartz]]
- [[Skills]]
- [[Superfighters Deluxe]]
- [[Tiling Window Managers]]
- [[Writing]]
