---
title: "Turning my Quartz site into a 3D graph"
date: 2026-03-08
category: project
status: seedling
tags: ["#dsa", "#algorithms", "#systems", "#tools", "#projects"]
related: ["[[graph]]", "[[Quartz]]"]
---

# Turning my Quartz site into a 3D [[graph]]

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

## Connections

- [[graph]] - This sits near the same build thread, where the idea becomes less abstract and more like something I can actually ship.
- [[Quartz]] - This is the actual project gravity in the note, the thing the whole thought keeps bending back toward.
