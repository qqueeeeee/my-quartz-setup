---
tags:
  - ai
  - rag
  - systems
---

# RAG

RAG stands for Retrieval-Augmented Generation.

The basic idea is simple: instead of asking an LLM to answer from whatever it already knows, you first retrieve relevant information from your own data and then give that context to the model.

That matters because the model is not forced to guess as much, and the response can be based on stuff that is actually specific to you or your app.

## Why I care about it

This is one of the main things that makes a project like [[SelfForge]] interesting to me.

If I am building a personal AI tool, I do not just want a generic chatbot. I want something that can pull from my notes, my writing, and my actual history in a way that feels useful.

## Rough mental model

1. store useful chunks of information
2. retrieve the most relevant ones for a query
3. pass those into the model as context
4. let the model answer with better grounding

That is the simple version, but the real challenge is figuring out what should be stored, what should be retrieved, and how to stop the whole thing from becoming noisy.
