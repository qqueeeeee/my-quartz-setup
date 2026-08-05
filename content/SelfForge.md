---
folder: Projects
tags:
  - area/projects
  - project
  - ai
  - product
  - local-first
  - selfforge
type:
  - app
org: []
start: 2026-01-28
year: 2026
url:
status: in-progress
categories:
  - Projects
  - SelfForge
created: 2026-04-03
updated: 2026-08-05
aliases: []
---

# SelfForge

SelfForge is a personal AI tool i actually want in my day-to-day life. not a
fake demo app.

the core idea is simple: help me reflect better, remember what happened, and
notice patterns across days. journaling is useful, but a lot of it becomes a
dead archive way too fast.

## why i'm building it

i care about this project for three reasons:

1. It solves a real personal problem instead of being a fake portfolio app.
2. It pushes me into product decisions around memory, privacy, and UX.
3. It connects AI tooling with the notes and systems I already use.

## what it should do

- keep a daily log of what I actually did
- store data locally by default
- support an LLM chat that can reflect on the day with context
- use [[RAG]] on my notes so the assistant becomes more useful over time
- have a strong desktop-first UI instead of feeling like a disposable web app
- support both cloud models and eventually local models

## current direction

right now the shape is:

- desktop shell with [[Tauri]]
- application logic with [[Python Intro]]
- note-aware memory system on top of my existing writing

## why this isn't just an AI wrapper

the interesting part is the [[System Design|system design]]:

- how memory is stored
- what context should be retrieved
- how the tool stays useful without becoming noisy
- how much of the product should feel like chat versus structured reflection

## connected notes

- [[RAG]]
- [[Python Intro]]
- [[Digital Garden]]
- [[How I use Obsidian]]
- [[Keyboard Centric Workflow]]
