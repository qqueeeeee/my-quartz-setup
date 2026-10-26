---
created: 2026-10-23
updated: 2026-10-23
categories:
  - AI
  - Local AI
tags:
  - ai
  - local-ai
  - product
  - research
aliases:
  - Local AI user wants
---

# What local AI users actually want

part of [[Running good LLMs locally]].

question here: what do people running local AI want most that doesn't exist yet?

## short answer

four things stand out:

1. **claude-level coding and agent reliability on their own hardware.** local coding right now is "boring and reliable" but not claude-level. tool calling and long multi-turn agent loops are the weak spots.
2. **much stronger models on 128–512GB machines and on phones** without the quality collapsing. you can see the demand in the massive ternary 27B downloads and the [[OpenClaw]]-driven Mac mini demand.
3. **stable long context and fast prompt processing.**
4. **open weights to keep coming** as Qwen and Kimi gate their flagships.

## what i found

### pain points from the april 2026 megathread (secondary)

[Big Guy on Stuff](https://bigguyonstuff.com/best-local-llm-2026-megathread-synthesis/)

- prompt caching is broken for Qwen models in [[llama.cpp]]
- a vLLM KV cache allocation bug hits Gemma 4 31B and Qwen 3.5 27B
- Gemma 4 26B-A4B crashes about twice a week under sustained load
- local coding is "boring and reliable", not as good as claude. people turn thinking *off* for tool calls
- people run 100–176K context on 48GB
- Qwen 3.5 produced finnish gibberish where gpt-oss-120b worked lol
- hardware cost: a used 3090 at $800–1,000 + $400–500 in upgrades. the author argues cloud subscriptions are cheaper for most hobbyists

### tool use gets worse with scale

performance fell 7–85% as the tool catalog grew, and 13–40% over longer multi-turn conversations. [arXiv 2505.10570](https://arxiv.org/abs/2505.10570v1) (older, via search summary)

### OpenClaw

open-source personal agent that runs on your own devices with hosted or local models. **392.8k stars and 82.6k forks** on 2026-10-22. [GitHub](https://github.com/openclaw/openclaw)

- drove demand for 24GB and 32GB Mac minis, with pickup windows stretching to march 18 (early 2026). [hyper.ai](https://hyper.ai/en/stories/c31004209e9b1421ed79477072240c2e) (snippet)
- Tim Cook reportedly cited Mac mini and Mac Studio demand "as platforms for local AI" on Apple's Q2 2026 earnings call. [Decrypt](https://decrypt.co/366389/openclaw-apple-mac-mini-shortage-ai-2026?amp=1) (unverified — 403 on fetch)

### demand for extreme compression

Ternary Bonsai 2 27B GGUF: **2.48M downloads last month**. [HF](https://huggingface.co/prism-ml/Ternary-Bonsai-2-27B-gguf). see [[Ternary and 1-bit LLMs]].

### most downloaded stuff is small

Qwen3-0.6B 26.7M, Qwen3-4B 11.6M, and the local TTS model Kokoro-82M at 10.3M. [HF](https://huggingface.co/models?sort=downloads)

### open weights receding

Qwen's Max tier stayed closed four releases in a row, with a 91-day stretch with no new open Qwen models. [Digital Applied](https://www.digitalapplied.com/blog/qwen-closed-flagship-pivot-open-weight-retreat-2026)

### hallucination

AA measured hallucination rates of 94% (V4 Pro) and 96% (V4 Flash), and open models trail on Omniscience. [AA](https://artificialanalysis.ai/articles/deepseek-is-back-among-the-leading-open-weights-models-with-v4-pro-and-v4-flash). a forum user says ChatGPT 5.2 hallucinates way less than local DeepSeek. [Blind](https://www.teamblind.com/post/could-you-imagine-finding-a-local-70b-model-useful-dgnadfa0) (snippet)

### people mix local and cloud

[[Ollama]] added hosted cloud models, web search and coding agent integrations in 2025–26. [Wikipedia](https://en.wikipedia.org/wiki/Ollama) (snippet)

## my takeaways

the stuff that doesn't exist yet with the clearest pull, in order:

1. **a near-frontier open model (AA ~42–46) that runs at interactive speed** (≥30–50 tok/s decode, fast prefill) on a single 128GB machine and reliably drives an agent harness over long context. this is the missing model for the 128GB tier.
2. **a frontier open model (V4 Pro / MiMo / K3 class) on a single 512GB M5 Ultra.**
3. **a "local claude code" on 24GB** with reliable tool calling at ≤3 bits.

other things:

- users are cost-sensitive and hardware's getting more expensive, so **compression is worth more than new architectures that need new hardware.**
- a project's credibility will come down to agentic evals (Terminal-Bench, SWE-bench, tau2, BFCL), stable long-context runtimes, and day-0 support in Ollama, LM Studio, llama.cpp and MLX. those are literally the pain points people complain about.

## things i couldn't figure out

- didn't get any direct r/LocalLLaMA, HN or X threads or polls. no actual survey of what users want.
- the Tim Cook quote is unverified.
