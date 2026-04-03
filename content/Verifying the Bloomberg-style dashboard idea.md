---
created: 2026-03-22
tags:
  - ai
  - career
  - cs
  - finance
  - frontend
  - games
  - hackathon
  - job-search
  - learning
  - linux
  - product
  - project/lumina-invest
  - project/pathforge-ai
  - project/selfforge
  - projects
  - systems
  - tooling
  - topic/auth
  - topic/c++
  - topic/career-planning
  - topic/clipboard
  - topic/compatibility
  - topic/csv-import
  - topic/dashboard
  - topic/data-structures
  - topic/dsa
  - topic/games
  - topic/hackathon
  - topic/interview-prep
  - topic/job-search
  - topic/linux
  - topic/lumina-invest
  - topic/neovim
  - topic/pathforge-ai
  - topic/rag
  - topic/resume
  - topic/selfforge
  - topic/wsl2
  - workflow
people:
  - Que
places:
  - India
projects:
  - Lumina Invest
  - PathForge AI
  - SelfForge
themes:
  - ai
  - career
  - cs
  - finance
  - frontend
  - games
  - hackathon
  - job-search
  - learning
  - linux
  - product
  - projects
  - systems
  - tooling
  - workflow
topics:
  - auth
  - c++
  - career-planning
  - clipboard
  - compatibility
  - csv-import
  - dashboard
  - data-structures
  - dsa
  - games
  - hackathon
  - interview-prep
  - job-search
  - linux
  - lumina-invest
  - neovim
  - pathforge-ai
  - rag
  - resume
  - selfforge
  - wsl2
orgs:
  - TCS
related:
  - "[[About Me]]"
  - "[[C++]]"
  - "[[Data Structures]]"
  - "[[Featured Work]]"
  - "[[Keyboard Centric Workflow]]"
  - "[[Lumina Invest]]"
  - "[[Neovim]]"
  - "[[PathForge AI]]"
  - "[[Python]]"
  - "[[Quartz]]"
  - "[[RAG]]"
  - "[[SelfForge]]"
  - "[[Skills]]"
  - "[[Tiling Window Managers]]"
  - "[[Writing]]"
---

# Verifying the Bloomberg-style dashboard idea

This is the note behind the Bloomberg-style dashboard idea that later connects into [[Lumina Invest]].

## Notes

I was working with a friend, DisguisedMango, who actively trades stocks and wanted a custom Bloomberg-style research and portfolio dashboard. started when I shared an Instagram post claiming [[Python]] tools could basically replace Bloomberg Terminal for free, and Claude called that technically grounded but massively overhyped. Claude broke down Bloomberg's actual data infrastructure, why yfinance is limited by comparison, and why OpenBB is probably the most serious open-source alternative here. The real goal was building a personalized trading dashboard for DisguisedMango using the open-source lumina-invest repo (React + Express + Yahoo Finance) as a base, then customizing it with supply chain analysis, a trade journal, and a custom broker CSV importer. I do not have a finance background, but I do have the programming side covered, while DisguisedMango knows the finance side. I use [[Neovim]] on Windows, so this chat also covered getting lumina-invest running locally, fixing the missing `/api` proxy to `localhost:3001` in `vite.config.js`, verifying the live data, and building a custom CSV importer for DisguisedMango's broker (Moomoo/Universal account format). The importer was added as a second tab alongside the existing Revolut importer in `ImportModal.jsx`. One of the important bugs was that the broker's date format (`"Mar 23, 2026 05:01:56 ET"`) contains commas inside quoted strings, which breaks naive `.split(',')` parsing, so that got fixed by switching to `papaparse`. By the end the importer was finding 3 open positions, but Malaysian Bursa tickers still needed the `.KL` suffix for Yahoo Finance and MSOS still needed open/closed status verification against the actual holdings.

## Related notes

- [[About Me]]
- [[C++]]
- [[Data Structures]]
- [[Featured Work]]
- [[Keyboard Centric Workflow]]
- [[Lumina Invest]]
- [[Neovim]]
- [[PathForge AI]]
- [[Python]]
- [[Quartz]]
- [[RAG]]
- [[SelfForge]]
- [[Skills]]
- [[Tiling Window Managers]]
- [[Writing]]
