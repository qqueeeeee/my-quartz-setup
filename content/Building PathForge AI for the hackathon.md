---
title: "Building PathForge AI for the hackathon"
date: 2026-03-04
category: project
status: seedling
tags: ["#dsa", "#algorithms", "#fullstack", "#tools", "#projects"]
related: ["[[PathForge AI]]", "[[Future Self|Future Self]]", "[[resume feedback|resume feedback]]", "[[roadmap|roadmap]]"]
---

# Building PathForge AI for the hackathon

This note is about the direction, features, and product thinking behind [[PathForge AI]].

## Notes

[[PathForge AI]] started as a hackathon solution to the "career planning and resume mentor" problem statement, but I did not want it to feel like a generic career portal.

The interesting angle was the "[[Future Self|Future Self]]" concept:

- an AI persona that feels like a version of you a few years ahead
- [[resume feedback|resume feedback]] that does not feel dry and robotic
- [[roadmap|roadmap]] and [[interview help|interview help]] that feels personal instead of template-generated

The stack and product shape were roughly:

- [[FastAPI|FastAPI]] on the backend
- [[React|React]] + [[Tailwind|Tailwind]] on the frontend
- [[Groq|Groq]] models for inference
- resume analysis, roadmap generation, and interview-style features

What mattered most here was not just building features, but pushing the whole thing into something that actually felt memorable in a hackathon context.

The recurring work areas were:

- fixing frontend bugs and syntax messes quickly
- writing strong [[OpenCode|OpenCode]] prompts so implementation stayed on track
- improving the feature set without breaking the demo
- tightening the presentation and pitch side of the project

This is also one of the clearest examples of how I like working under pressure: get the core concept right, keep shipping changes fast, and make the product identity stronger than the average AI demo.

## Connections

- [[PathForge AI]] - This is the actual project gravity in the note, the thing the whole thought keeps bending back toward.
- [[Future Self|Future Self]] - This sits near the same build thread, where the idea becomes less abstract and more like something I can actually ship.
- [[resume feedback|resume feedback]] - This sits near the same build thread, where the idea becomes less abstract and more like something I can actually ship.
- [[roadmap|roadmap]] - This sits near the same build thread, where the idea becomes less abstract and more like something I can actually ship.
