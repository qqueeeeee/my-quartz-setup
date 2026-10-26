---
created: 2026-10-23
updated: 2026-10-23
categories:
  - AI
  - Projects
  - LLMs
tags:
  - ai
  - llms
  - local-ai
  - quantization
  - project
aliases:
  - Quant plan
---

# The quantization plan

we take one good open model, something in the Qwen 3.5 / DeepSeek R1 70B kind of range, doesn't matter which yet, and we quantize it down so it runs on hardware people actually have.

that's the whole thing. no pretraining, no training from scratch, no ternary moonshots. just take something strong and make it smaller without wrecking it.

this fits what we actually have (see [[What we can actually do with 10 H200s]]). quantizing is cheap. it's the one impactful thing that's genuinely in reach at our scale.

## the rough shape of it

1. pick the model. pick the target bit-width.
2. quantize it.
3. check it didn't fall apart, and i mean on real tasks ([[PTQ vs QAT|agent + tool use + coding]]), not just MMLU.
4. make sure it actually runs in a normal runtime (llama.cpp / MLX / whatever) with a working kernel. a quant nobody can load is pointless.
5. compare against the existing quants and write down the numbers.

## the workflow

basically a loop:

![[quantization-workflow.png]]

the whole point is steps 2–5 are fast, so we just go round the loop until a bit-width stops being worth it.

## why i'm not overthinking it

the research ([[Running good LLMs locally]]) pulled me toward a hundred fancy directions. most of them need a lab. this one doesn't.

a solid, honest, well-benchmarked quant of a model people already want is more useful than a half-baked attempt at something clever. start boring, get it working, then decide if there's room to push further.

specifics (which model, which method, which bit-width, which evals) come later. this note is just the plan.
