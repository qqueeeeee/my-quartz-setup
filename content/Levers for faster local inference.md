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
  - inference
  - architecture
aliases:
  - Local inference levers
---

# Levers for faster local inference

part of [[Running good LLMs locally]].

question here: besides quantization, what else helps? [[Mixture of Experts|MoE]] with few active params, hybrid / linear attention and state-space models, [[KV Cache|KV cache]] compression, [[Speculative Decoding|speculative decoding]] / MTP / EAGLE, [[Distillation|distillation]], on-device architectures. which ones give the most real-world gain per GPU-hour?

## short answer

biggest gains per GPU-hour come from:

1. **compressing models that are already strong (QAT).** thousands to tens of thousands of GPU-hours buys enough memory reduction to drop a model down a whole hardware tier.
2. **cheap draft heads or MTP.** 2–6x faster decoding.
3. **training-free KV cache compression.**

hybrid linear attention (Qwen3.5+, Kimi KDA, DeepSeek CSA/HCA, Granite 4, Nemotron) and MoEs with 3–18B active params are now just standard in new releases, which is what makes long context practical locally. distillation (especially on-policy) is cheap, but the big labs already milk it.

## MoEs with few active params

| model | active / total |
|---|---|
| gpt-oss-120b | 5.13B / 116.83B ([card](https://arxiv.org/html/2508.10925)) |
| Qwen3.6-35B-A3B | 3B / 35B ([HF](https://huggingface.co/Qwen/Qwen3.6-35B-A3B)) |
| Gemma 4 26B-A4B | 3.8B / 25.2B ([HF](https://huggingface.co/google/gemma-4-31B-it)) |
| Qwen3-Next-80B-A3B | 3B / 80B, 512 experts, 10+1 active ([HF](https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Instruct)) |
| DeepSeek V4 Flash | 13B / 284B ([AA](https://artificialanalysis.ai/articles/deepseek-is-back-among-the-leading-open-weights-models-with-v4-pro-and-v4-flash)) |
| Laguna S 2.1 | 8B / 118B ([Digital Applied](https://www.digitalapplied.com/blog/qwen-closed-flagship-pivot-open-weight-retreat-2026)) |

## hybrid / linear attention

- **Qwen3-Next** (sep 2025, older): Gated DeltaNet + Gated Attention at 3:1, 15T tokens. base model beats Qwen3-32B-Base "with 10% of the total training cost" and has "10 times inference throughput for context over 32K tokens". [HF](https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Instruct)
- **Qwen3.6-27B / 3.8-27B** repeat the pattern: 16 blocks of (3 DeltaNet + 1 attention). [HF](https://huggingface.co/Qwen/Qwen3.8-27B). so ~75% linear, ~25% full attention per the [Bonsai card](https://huggingface.co/prism-ml/Ternary-Bonsai-2-27B-gguf)
- **Kimi K3:** 69 KDA layers + 24 Gated MLA layers. [HF](https://huggingface.co/moonshotai/Kimi-K3)
- **DeepSeek V4:** CSA + HCA, 10% of V3.2's KV cache at 1M context. [HF](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro)
- **Gemma 4 31B:** 1024-token sliding window + global layers. [HF](https://huggingface.co/google/gemma-4-31B-it)
- **IBM Granite 4.0** (2025-10-02, older): Mamba-2 + Transformer at 9:1. claims "over 70% reduction in RAM" for long inputs and concurrent batches. H-Small is 32B / 9B active, H-Tiny 7B / 1B. at launch llama.cpp and MLX support was "still in progress" for throughput. [IBM](https://www.ibm.com/new/announcements/ibm-granite-4-0-hyper-efficient-high-performance-hybrid-models)

## KV cache compression

- **Google TurboQuant** (2026-03-24): 3-bit KV cache, at least 6x less KV memory, "zero accuracy loss" in the authors' own tests (LongBench, NIAH, ZeroSCROLLS, RULER, L-Eval on Gemma and Mistral). up to 8x faster attention logits at 4 bits on H100. **no training needed** (PolarQuant + 1-bit QJL residual). [Google Research](https://research.google/blog/turboquant-redefining-ai-efficiency-with-extreme-compression/)
- **Apple's on-device model** shares KV cache across layers: −37.5% KV memory and ~−37.5% time to first token. [arXiv 2507.13575](https://arxiv.org/html/2507.13575)
- **Gemma 3n** KV sharing doubles prefill speed vs Gemma 3 4B. [Google](https://developers.googleblog.com/en/introducing-gemma-3n-developer-guide/) (older)
- **Gemma 4's mobile format** compresses the KV cache too. [Google](https://blog.google/innovation-and-ai/technology/developers-tools/quantization-aware-training-gemma-4/)

long context in practice:

- people run 100–176K context on 48GB or dual-3090 setups. [megathread synthesis](https://bigguyonstuff.com/best-local-llm-2026-megathread-synthesis/) (secondary)
- a 70B dense model at 128K needs ~140GB for KV cache *alone*, so practitioners cap at 32–64K. [Enterprise DNA](https://enterprisedna.co/resources/blog/practitioner-llama-local/) (secondary)

## speculative decoding and MTP

- **EAGLE-3** (mar 2025, older): up to 6.5x speedup, 1.4x over EAGLE-2, 1.38x throughput at batch 64 in SGLang. [arXiv 2503.01840](https://arxiv.org/abs/2503.01840)
- Qwen3-Next / 3.6 / 3.8 are trained with MTP, served via SGLang/vLLM spec decoding. [HF](https://huggingface.co/Qwen/Qwen3-Next-80B-A3B-Instruct)
- Gemma 4 added MTP, and its QAT checkpoints keep the speedup. [Google](https://blog.google/innovation-and-ai/technology/developers-tools/quantization-aware-training-gemma-4/)
- Unsloth ships Qwen3.8's MTP module separately (Q4_0, ~500MB). [Unsloth](https://unsloth.ai/docs/basics/unsloth-dynamic-2.0-ggufs)
- a commenter got Qwen3.8-27B to 140 tok/s with spec decoding (NVFP4 + Q5_K) on one RTX Pro 6000. [HF discussion](https://huggingface.co/Qwen/Qwen3.8-27B/discussions/65)
- Bonsai 27B supports spec decoding. [PrismML](https://prismml.com/news/bonsai-27b)

## distillation

- **on-policy distillation** hit 74.4% on AIME'24 with **1,800 GPU-hours**, vs RL's 67.6% with 17,920 GPU-hours (Qwen3 report, table 21). Thinking Machines estimates it's 9–30x cheaper than off-policy SFT distillation. [Thinking Machines](https://thinkingmachines.ai/blog/on-policy-distillation/) (older)
- gpt-oss was trained with "large-scale distillation and reinforcement learning". [arXiv 2508.10925](https://arxiv.org/abs/2508.10925)
- DeepSeek V4 merged domain experts via on-policy distillation. [HF](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro)

## on-device architectures

- **Gemma 3n** (2025-06-26, older): E2B/E4B have 5B/8B raw params but run in 2GB/3GB, using MatFormer nesting + Per-Layer Embeddings computed on the CPU. E4B was the first sub-10B model past 1300 on LMArena. [Google](https://developers.googleblog.com/en/introducing-gemma-3n-developer-guide/)
- **Gemma 4 E2B** in the mobile format is ~1GB. [Google](https://blog.google/innovation-and-ai/technology/developers-tools/quantization-aware-training-gemma-4/)
- **streaming weights from flash:** "Flash-MoE" ran a 400B MoE on an iPhone 17 Pro at 0.6 tok/s by streaming experts from SSD (mar 2026). started a big HN debate. [dev.to](https://dev.to/max_quimby/iphone-17-pro-just-ran-a-400b-llm-on-device-ai-changes-everything-2026-53bm) (secondary)

## the serving stack changes results

same gpt-oss-120b weights, tool-calling scores ranged from **22% to 37%** across endpoints (aug 2026). [ecorpit](https://ecorpit.com/open-model-production-gap-tooling-decision-2026/) (secondary). so the runtime is not a detail.

## my ranking (gain per GPU-hour)

my own estimates:

1. **low-bit QAT of strong existing MoEs.** ~2–50k GPU-hours per run (see [[What 500k B200 hours can buy]]). cuts memory a further 1.8–2.2x beyond 4-bit, which crosses a hardware tier, and roughly doubles bandwidth-bound decode speed.
2. **draft heads / MTP.** a few thousand GPU-hours at most, ~2–3x local speedup. novelty's shrinking since new models ship with MTP built in. quantized MTP heads need care — Unsloth dropped the MTP head from its smallest quants, and one Qwen3.8 file quantized it to IQ3.
3. **KV compression.** free (TurboQuant) or a small fine-tune. matters less for hybrid models since their KV cache is already small.
4. **distillation into small dense models.** 10–150k GPU-hours. Qwen and Google already ship great small models, so beating Qwen3.8-27B or Gemma 4 needs frontier-teacher data and the payoff's uncertain.
5. **new pretraining (hybrid or ternary).** 50k–600k GPU-hours, highest risk.

## the bandwidth thing

decoding on unified-memory machines is bandwidth-bound:

```text
tok/s ≈ bandwidth ÷ (active params × bytes per weight)
```

observed gpt-oss-120b decode is ~40–60% of that limit (my math from the secondary benchmarks, assuming 5.13B active at 4.25 bpw):

| machine | observed | theoretical limit |
|---|---|---|
| M5 Max | 87.9 tok/s | ~225 |
| DGX Spark | 58.7 | ~100 |
| Strix Halo | 54.5 | ~94 |

so for MoEs with few active params, **halving the bits roughly doubles the speed.**

and the levers stack: few-active MoE × hybrid attention × 2-bit QAT × MTP. the most leveraged training-time project is one that does QAT *and* keeps MTP + hybrid-attention kernels working in local runtimes.

## things i couldn't figure out

- current state of llama.cpp's MTP / spec decoding support for Qwen3.8 and Gemma 4 (ran out of search budget).
- no 2026 architecture details for Nemotron 3 or 3.5.
- no independent verification of TurboQuant, or whether it's in llama.cpp.
