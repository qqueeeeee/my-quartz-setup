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
  - compute
  - ideas
  - project
aliases:
  - 10 H200 plan
---

# What we can actually do with 10 H200s

## what this much hardware is actually good for

three things, roughly in order of how doable they are:

1. **running and properly testing the big open models.** V4 Pro at native FP4 is ~865GB, fits across our cards. nobody outside the labs publishes clean, independent agentic numbers for these. we could.
2. **compressing models up to ~30–35B.** QAT or the fancier quant methods (trellis stuff like EXL3) on a Qwen3.8-27B-class model. conversion is cheap — minutes to hours on a *single* card — so 10 of them is honestly luxurious for cranking out and benchmarking quant variants.
3. **the boring glue nobody ships: kernels + an agentic eval harness.** this is the real bottleneck (see [[PTQ vs QAT]] and [[Levers for faster local inference]]). a good quant with no day-0 llama.cpp/MLX kernel is useless, and a bad conversion silently throws away 10–15 points.

what we can't do: anything that needs the whole model's optimizer state in memory at once. full-param AdamW QAT of a 284B model wants ~4.5TB just for optimizer state. doesn't fit. so if we touch the big ones, it's freeze-most-of-it, 8-bit optimizer, LoRA-ish, or blockwise, not the real thing.

## so what i'd actually pitch

the honest version:

> we take one strong open model in the 27–35B range, push it to ~2–2.5 bits with QAT, and ship it with working kernels and real agentic evals on day 0. the result is a model that fits a 16–24GB card or a phone and still holds ~95%+ of its quality on tool-use and coding, not just MMLU.

that's the thing that's missing right now. everyone benchmarks MMLU and calls it done, then the model falls apart the second you point an agent at it. the gap is real (the whole point of [[What local AI users actually want]]), and it's small enough to fit 10 H200s.

why this is a good ask for a senior:

- **cheap to say yes to.** it's a few thousand GPU-hours, not a cluster booking. low risk.
- **it produces a thing, not a paper.** a downloadable model + a repo + a leaderboard screenshot. [[Why local AI demos go viral|that's what travels]].
- **it fails safely.** worst case we get a solid eval harness and a pile of quant comparisons, both of which are reusable.

## the actual pitch structure

keep it to one page / 5 min:

1. here's the gap (strong models don't fit local, and the ones that fit break on agents)
2. here's what 10 H200s *can't* do, so you know i've done the math
3. here's the one thing it *can* do that matters
4. here's what you get at the end (model, kernels, evals) and roughly when
5. here's the fallback if it flops

lead with #2. owning the limit up front is the whole reason they'll believe #3.

## open questions before i pitch

- how long do we actually get the cards for? a weekend vs a month changes everything.
- are the 10 H200s networked for one job, or 10 separate boxes? matters a lot for the bigger models.
- is there a result they specifically want (a demo? a number? a blog post?), or is "impactful + shippable" enough.
