---
title: "SelfForge"
date: 2026-05-07
category: project
status: growing
tags: ["#systems", "#tools", "#devenv", "#career", "#projects"]
related: ["[[RAG]]", "[[Tauri]]", "[[Python]]", "[[Writing|writing]]"]
---

# SelfForge

SelfForge is a personal AI tool I want to use as an actual part of my day-to-day life, not just as a demo project.

The core idea is simple: help me reflect better, remember what happened, and spot what I am missing across days instead of treating journaling like a dead archive.

## Why I am building it

I care about this project for three reasons:

1. It solves a real personal problem instead of being a fake portfolio app.
2. It pushes me into product decisions around memory, privacy, and UX.
3. It naturally connects AI tooling with the notes and systems I already use.

## What it should do

- keep a daily log of what I actually did
- store data locally by default
- support an LLM chat that can reflect on the day with context
- use [[RAG]] on my notes so the assistant becomes more useful over time
- have a strong desktop-first UI instead of feeling like a disposable web app
- support both cloud models and eventually local models

## Current direction

The current direction is:

- desktop shell with [[Tauri]]
- application logic with [[Python]]
- note-aware memory system on top of my existing [[Writing|writing]]

## What makes it a meaningful project

SelfForge is not just an AI wrapper. The interesting part is the system design:

- how memory is stored
- what context should be retrieved
- how the tool stays useful without becoming noisy
- how much of the product should feel like chat versus structured reflection

## Connected notes

## Connections

- [[RAG]] - This is part of the toolchain or technical texture, so it belongs close to the build notes.
- [[Tauri]] - This is part of the toolchain or technical texture, so it belongs close to the build notes.
- [[Python]] - This is part of the toolchain or technical texture, so it belongs close to the build notes.
- [[Writing|writing]] - This sits near the same build thread, where the idea becomes less abstract and more like something I can actually ship.
