---
created: 2026-02-26
tags:
  - career
  - cs
  - job-search
  - learning
  - topic/c++
  - topic/data-structures
  - topic/dsa
  - topic/interview-prep
  - topic/job-search
  - topic/resume
people:
  - Que
places:
  []
projects:
  []
themes:
  - career
  - cs
  - job-search
  - learning
topics:
  - c++
  - data-structures
  - dsa
  - interview-prep
  - job-search
  - resume
orgs:
  []
related:
  - "[[About Me]]"
  - "[[C++]]"
  - "[[Data Structures]]"
  - "[[Featured Work]]"
  - "[[Skills]]"
---

# Warranty tracker idea for my friend's business

This note is the core product and implementation direction for a warranty tracker desktop app.

## Notes

I was planning a warranty management desktop app for a friend's business, where they buy a lot of products and need a clean way to track warranty periods. The core need was simple: add products, remove products, keep track of warranty timelines, and stop doing all of that manually. Claude first started going in a web-app direction, but I corrected it because I wanted Rust and Tauri from the start. After that the chat stayed in planning mode. We locked in React with TypeScript for the frontend, local SQLite for storage, and core features like product CRUD, expiry notifications, and receipt/document attachments. Claude then laid out the schema (`products` plus `attachments` with cascade deletion), the Rust Tauri commands, the frontend component structure, and a nine-step build order. The structure separates `src-tauri` from the React frontend, and notifications were planned through Tauri's notification plugin on launch plus a daily background thread. By the end, the next obvious move was just scaffolding it.

## Related notes

- [[About Me]]
- [[C++]]
- [[Data Structures]]
- [[Featured Work]]
- [[Skills]]
