---
title: "RAG"
date: 2026-05-07
category: project
status: seedling
tags: ["#tools", "#devenv", "#research", "#projects"]
related: ["[[SelfForge]]", "[[Writing|writing]]"]
---

# [[RAG|RAG]]

RAG stands for Retrieval-Augmented Generation.

The basic idea is simple: instead of asking an LLM to answer from whatever it already knows, you first retrieve relevant information from your own data and then give that context to the model.

That matters because the model is not forced to guess as much, and the response can be based on stuff that is actually specific to you or your app.

## Why I care about it

This is one of the main things that makes a project like [[SelfForge]] interesting to me.

If I am building a personal AI tool, I do not just want a generic chatbot. I want something that can pull from my notes, my [[Writing|writing]], and my actual history in a way that feels useful.

## Rough mental model

1. store useful chunks of information
2. retrieve the most relevant ones for a query
3. pass those into the model as context
4. let the model answer with better grounding

That is the simple version, but the real challenge is figuring out what should be stored, what should be retrieved, and how to stop the whole thing from becoming noisy.

## Connections

- [[SelfForge]] - This is the actual project gravity in the note, the thing the whole thought keeps bending back toward.
- [[Writing|writing]] - This sits near the same build thread, where the idea becomes less abstract and more like something I can actually ship.
