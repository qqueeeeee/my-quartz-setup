---
created: 2026-10-23
updated: 2026-10-23
categories:
  - AI
  - LLMs
  - Local AI
tags:
  - ai
  - llms
  - local-ai
  - research
aliases:
  - Local LLMs
  - Running LLMs locally
---

# Running good LLMs locally

## atomic notes

- [[Best local LLMs by hardware tier]]
- [[PTQ vs QAT]]
- [[Ternary and 1-bit LLMs]]
- [[Levers for faster local inference]]
- [[What local AI users actually want]]
- [[What 500k B200 hours can buy]]
- [[Why local AI demos go viral]]

---

big research dump on where local LLMs are at as of 2026-10-22. what's actually runnable on consumer hardware, how far it is behind the closed frontier, and what you could do at *training time* to close that gap.

## how i got this

ran the research on 2026-10-22. the web search budget died halfway through, so the later stuff came from fetching primary sources directly (HF model cards, arXiv, vendor blogs, GitHub). reddit and X wouldn't load, so anything about community vibes is secondhand.

tags i use throughout these notes:

- **(older)** — source is from before 2026
- **(secondary)** — blog or aggregator, not the original
- **(unverified)** — only saw it in a search snippet, never opened the real source

## tl;dr

- the default local model right now is a ~27B dense hybrid-attention Qwen ([[Qwen]]3.8-27B). gemma 4 covers phones up to 16GB, gpt-oss still gets cited for 16GB and 80GB.
- best 24GB-class model scores **34** on AA's index. best open model scores **46**. best closed (Claude Opus 5.5) scores **58**. so ~12 points lost just from "has to fit on my GPU", and another ~12 on top of that from open vs closed.
- the best open models are now 1–2.8T param [[Mixture of Experts|MoEs]] that don't even fit on a 512GB Mac at native 4-bit.
- **the 64–128GB tier is the obvious hole.** nothing actually uses that much memory well.
- 4-bit [[Quantization|quantization]] is solved. below 4 bits, normal post-training quant falls apart — especially for agents and tool calling.
- QAT at 2–2.5 bits looks like it keeps ~95–98% quality for not much compute. **nobody has shipped a 2–3-bit QAT checkpoint of a big open MoE yet.** that's the gap.

## the whole thing in one table

my own synthesis, details in [[Best local LLMs by hardware tier]].

| tier | memory / bandwidth | best open option right now | AA score | what's missing |
|---|---|---|---|---|
| phone | 8–16GB RAM (iPhone 17 Pro = 12GB) | Gemma 4 E2B/E4B QAT (~1–5GB), Bonsai 27B 1-bit (3.9GB) / ternary (5.9GB) | n/a | agents/tool calling at ≤2 bits, speed |
| 8–16GB GPU / laptop | 16GB | gpt-oss-20b, Gemma 4 12B / 26B-A4B QAT, Qwen3.8-27B at ~3-bit (13.8GB) | 9–18 (34 with a 3-bit 27B) | good 27B quality in ≤12GB without collapse |
| 24–32GB GPU | 24–32GB, ~1–1.8TB/s | Qwen3.8-27B (Q4–Q6), Gemma 4 31B, Qwen3.6-35B-A3B | 34 | claude-level agent reliability |
| 64–128GB unified | 256–614GB/s | gpt-oss-120b, Qwen3.5-122B, MiniMax M2.7, low-bit PTQ of 300B+ MoEs | ≤34 effectively | a 42–46-class MoE at ~2 bpw |
| 256–512GB (M3/M5 Ultra) | 819GB/s–1.2TB/s | Qwen3.5-397B, GLM-5.x at ~4-bit | ~42–45 | V4 Pro / MiMo / K3 at ≤2.25 bpw |

## what i'd actually build

if i had ~500k B200 GPU-hours, ranked by impact × virality × feasibility (full math in [[What 500k B200 hours can buy]]):

1. **"frontier on one box"** — 2–2.5-bit QAT of DeepSeek V4 Pro (MIT license) so it fits one 512GB M5 Ultra at ~35–50 tok/s, *plus* the same for V4 Flash or GLM-5.3-Flash so they fit 128GB machines (laptops, Strix Halo, DGX Spark) at ~30–100 tok/s. ship it with upstreamed [[llama.cpp]] / MLX kernels and agentic evals. ~50–150k GPU-hours with ablations. fills the 128GB hole (AA 34 → ~42–47) and is a great demo.
2. **"local claude code on 24GB"** — agent-focused QAT + on-policy distillation of a ~27–35B hybrid model at ≤3 bpw, keeping MTP. ~20–80k GPU-hours. less novel because PrismML and Qwen are already close.
3. **open ternary scaling study** — 7–14B on 10T tokens, ~140–285k GPU-hours. good science, not very viral.
4. **distill a frontier model into an 8B phone model** — ~30–100k GPU-hours. you'd be fighting Gemma and Qwen head-on.

## the main ideas to remember

- three constraints bind together: **memory capacity, memory bandwidth, price** — and price is going *up* (GDDR7/DRAM shortage, 24GB GPU refresh stalled, used 3090s at $1,000+). so every bit-per-weight you shave off matters more in 2026 than it did in 2025.
- decoding is bandwidth-bound: `tok/s ≈ bandwidth ÷ (active params × bytes per weight)`. halve the bits, roughly double the speed.
- the levers multiply: few-active MoE × hybrid attention × 2-bit QAT × MTP.
- the toolchain matters as much as the training. a bad conversion can undo all the QAT work (see [[PTQ vs QAT]]).
- agents and instruction following break first when you compress. so the evals have to be agentic (Terminal-Bench, SWE-bench, tau2, BFCL).
