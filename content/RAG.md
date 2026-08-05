---
tags:
  - topic/ai
  - area/education
  - ai
  - rag
  - systems
  - computer-science
categories:
  - Education
  - Computer Science
  - AI
---

# RAG

RAG stands for Retrieval-Augmented Generation.

basic idea: instead of asking an LLM to answer from whatever it already knows,
you first retrieve relevant information from your own data and give that context
to the model.

that matters because the model has to guess less, and the answer can be based on
stuff specific to you or your app.

## why i care

this is one of the main things that makes [[SelfForge]] interesting to me.

if i'm building a personal AI tool, i don't want a generic chatbot. i want
something that can pull from my notes, my writing, and my actual history in a
way that feels useful.

## rough mental model

1. store useful chunks of information
2. retrieve the most relevant ones for a query
3. pass those into the model as context
4. let the model answer with better grounding

simple version. the real challenge is figuring out what to store, what to
retrieve, and how to stop the whole thing from becoming noisy.
