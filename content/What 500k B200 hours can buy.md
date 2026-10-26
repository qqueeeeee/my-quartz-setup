---
created: 2026-10-23
updated: 2026-10-23
categories:
  - AI
  - LLMs
  - Training
tags:
  - ai
  - llms
  - local-ai
  - compute
  - training
aliases:
  - 500k GPU-hour feasibility
---

# What 500k B200 hours can buy

part of [[Running good LLMs locally]].

question here: with ~500k B200 GPU-hours, how much compute would each of these take?

- **(a)** 2–3-bit QAT of a 100B–1T+ MoE
- **(b)** pretraining a 7–30B ternary model from scratch
- **(c)** distilling a frontier open model into a small local model

## short answer

500k B200-hours ≈ **1.6–2.8e24 FLOPs**. that's roughly half of gpt-oss-120b's 2.1M H100-hour run, and ~0.5–0.85x DeepSeek-V3's pretraining.

- **(a) 2–3-bit QAT** of a 284B–2.8T MoE: ~2–50k GPU-hours per 30–100B-token run. tons of ablations fit easily. **the real constraint is memory** (~16 bytes/param for full AdamW → 64–512 GPUs), not FLOPs.
- **(b) ternary pretraining:** 7B on 4T ≈ 57k, 14B on 10T ≈ 285k, 30B on 10T ≈ 611k at BF16 (~350k at FP8). only 7–14B dense or a ~30B-A3B MoE fits comfortably.
- **(c) distilling a frontier teacher** into an 8–30B student (1–3T tokens with logits + on-policy distillation): ~30–200k GPU-hours.

## the facts i'm working from

- **DGX B200:** 8 GPUs, 1,440GB HBM3e total. FP4 72 PFLOPS dense / 144 sparse. FP8 72 PFLOPS sparse (dense is half). [NVIDIA](https://www.nvidia.com/en-us/data-center/dgx-b200/)
  - per GPU: ~180GB HBM, ~9 PF dense FP4, ~4.5 PF dense FP8
  - BF16 dense ~2.25 PF, assuming NVIDIA's usual half-of-FP8 ratio (not on the page i fetched)
- **gpt-oss-120b:** 2.1M H100-hours. gpt-oss-20b took almost 10x fewer. [model card](https://arxiv.org/html/2508.10925)
- **DeepSeek-V3:** 2.788M H800 GPU-hours, 14.8T tokens, 671B / 37B active. [arXiv 2412.19437](https://arxiv.org/abs/2412.19437) (older, didn't re-fetch)
- **how many tokens QAT needs:**
  - ParetoQ: saturates at ~10B tokens for 3–4 bits, ~30B for ≤2 bits. best split ~90% pretrain / 10% QAT. [arXiv 2502.02631](https://arxiv.org/html/2502.02631v2)
  - Gemma 3: ~5,000 steps. [Google](https://developers.googleblog.com/en/gemma-3-quantized-aware-trained-state-of-the-art-ai-to-consumer-gpus/)
  - Apple: "fewer iterations" than base training. [arXiv 2507.13575](https://arxiv.org/html/2507.13575)
- **on-policy distillation:** 1,800 GPU-hours vs 17,920 for RL (Qwen3, AIME'24). [Thinking Machines](https://thinkingmachines.ai/blog/on-policy-distillation/)
- **NVFP4 pretraining** matched FP8 for a 12B on 10T tokens. [arXiv 2509.25149](https://arxiv.org/abs/2509.25149)
- **BitNet b1.58 2B4T:** 2.4B params, 4T tokens. [microsoft/BitNet](https://github.com/microsoft/BitNet), [arXiv 2504.12285](https://arxiv.org/abs/2504.12285)
- model sizes from the [AA open-weights list](https://artificialanalysis.ai/models/open-source), [DeepSeek V4 card](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro), [Kimi K3 card](https://huggingface.co/moonshotai/Kimi-K3)
- memory / bandwidth: M5 Ultra 512GB at 1.2TB/s, M5 Max 128GB at 614GB/s ([Apple](https://www.apple.com/newsroom/2026/08/apple-introduces-new-mac-studio-with-m5-max-and-m5-ultra/)), Ryzen AI Halo ~256GB/s ([The Register](https://www.theregister.com/ai-and-ml/2026/07/06/amds-ryzen-ai-halo-makes-local-ai-look-easy-but-at-4k-easy-doesnt-come-cheap/5266711)), DGX Spark 273GB/s ([secondary](https://computingforgeeks.com/dgx-spark-vs-strix-halo-vs-mac-studio/))
- licenses: DeepSeek V4 is MIT, Kimi K3 is a custom "Kimi K3 License", Qwen3.8-27B is Apache-2.0

## my math

everything below is my own calculation. assumptions are stated, outputs are estimates, not sourced facts.

### the budget in FLOPs

500k GPU-hours = 1.8e9 GPU-seconds.

| precision + utilization (MFU) | effective per GPU | total |
|---|---|---|
| BF16 at 40% MFU | 0.9 PF/s | ≈1.6e24 FLOPs |
| FP8 at 35% MFU | 1.575 PF/s | ≈2.8e24 FLOPs |
| MoE training at ~27% of BF16 peak | 0.6 PF/s | ≈1.1e24 FLOPs |

- for comparison, DeepSeek-V3 pretraining ≈ 6 × 37e9 × 14.8e12 ≈ **3.3e24 FLOPs**
- 500k B200-hours ≈ 1.1M H100-hour equivalents at peak BF16 (assuming H100 SXM at 989 TFLOPS, didn't fetch the spec). so ~54% of gpt-oss-120b's run

### (a) low-bit QAT of big MoEs

cost model:

```text
FLOPs per token ≈ 9.6 × active params
               = (6N student + 2N teacher logits for distillation targets) × 1.2 fake-quant overhead
effective rate  = 0.6 PF/s per GPU
size at 2.25 bpw = params × 2.25 / 8      (2-bit codes + scales + a few higher-precision tensors)
decode limit     = bandwidth ÷ (active params × 2.25/8)   → expect 40–60% of this in practice
```

| target (total / active) | AA | size at 2.25 bpw | fits on | decode limit | QAT GPU-hours per 100B tokens (÷3.3 for 30B) |
|---|---|---|---|---|---|
| DeepSeek V4 Flash (284B / 13B) | 47 at release (old index) | ~80GB | 128GB machines | ~70–75 tok/s at 256–273GB/s, ~168 at 614GB/s | ~5.8k |
| GLM-5.3-Flash (320B / 18B) | 42 | ~90GB | 128GB | ~51–54, ~121 | ~8.0k |
| DeepSeek V4.1 Flash 1017 (552B / 16B) | 45 | ~155GB (~121GB at 1.75 bpw) | 192–256GB (128GB only at ~1.75 bpw) | ~136 at 614GB/s, ~267 at 1.2TB/s | ~7.1k |
| GLM-5.3 (753B / 40B) | 45 | ~212GB | 256GB / 512GB | ~107 at 1.2TB/s | ~17.8k |
| MiMo-V2.6-Pro (1.0T / 42B) | 46 | ~281GB | 512GB | ~102 | ~18.7k |
| DeepSeek V4 Pro (1.6T / 49B) | 52 at release (old index) | ~450GB | **one M5 Ultra 512GB** | ~87 → realistically ~35–50 | ~21.8k |
| Kimi K3 (2.8T / 104B) | 44 | ~788GB (~553GB even at 1.58 bpw) | 2× M5 Ultra | ~41 | ~46.2k |

memory for full-param QAT with AdamW is ~16 bytes/param (BF16 weights + grads, FP32 master copy, Adam moments) plus activations:

| model | optimizer state | min B200s (180GB each) | realistic |
|---|---|---|---|
| 284B | ~4.5TB | ≥25 | ~64 |
| 1.6T | ~25.6TB | ≥143 | ~256 |
| 2.8T | ~44.8TB | ≥249 | ~512 |

freezing non-expert weights, 8-bit optimizer states, or blockwise QAT would cut this down.

**conclusion for (a):** FLOPs are only 1–10% of the budget per run. the real cost is engineering:

- an MoE QAT stack (open tooling is immature, see the TorchAO RFC in [[PTQ vs QAT]])
- DeepSeek sparse attention + MTP support
- getting master weights — V4 ships FP4/FP8 and K3 ships MXFP4, so QAT might have to start from 4-bit weights
- upstreaming inference kernels

the budget easily covers 2.0 / 2.5 / 3.0-bit variants of 2–4 models, agentic RL "healing" passes, and big eval suites.

### (b) ternary pretraining from scratch

cost model: `6 × N × D × 1.1` (latent BF16 weights + quant overhead) at 0.9 PF/s for BF16.

| model + data | GPU-hours | fits? |
|---|---|---|
| 7B on 4T | ~57k | yes |
| 7B on 10T | ~143k | yes |
| 14B on 10T | ~285k | yes |
| 30B on 5T | ~306k | yes |
| 30B on 10T | ~611k BF16 (~349k if FP8 GEMMs work for ternary QAT — unproven) | no at BF16 |
| ternary MoE 30B-A3B on 15T (at 0.6 PF/s) | ~138k | yes |
| reference: BitNet 2B4T | ~18k equivalent | — |

risk: ParetoQ's 90/10 finding and PrismML's 95–98% retention suggest **converting an existing strong model beats pretraining a new ternary one** for local quality per GPU-hour. from-scratch ternary is a research bet and doesn't get the frontier-teacher quality a conversion inherits. (more in [[Ternary and 1-bit LLMs]])

### (c) distilling a frontier teacher into a small student

| component | model / data | GPU-hours |
|---|---|---|
| teacher logit pass (prefill, 1T tokens) | V4 Pro: 2 × 49e9 × 1e12 ≈ 9.8e22 FLOPs | ~18–30k |
| teacher logit pass (prefill, 1T tokens) | V4 Flash | ~5–8k |
| student training | 8B on 1T | ~15k |
| student training | 27B on 1T | ~50k |
| student training | 27B on 3T | ~150k |
| on-policy distillation for reasoning / agentic | — | ~2–10k (Qwen3 ref: 1,800) |
| synthetic generation (decode-bound) | 100B tokens, assuming ~2–20k output tok/s per B200 | ~1.4–14k |

**total ≈ 30–200k GPU-hours.** doable, but you're competing head-on with the Qwen and Gemma small-model teams using the exact same methods.

## project ranking

impact × virality × feasibility, my judgment:

1. **"frontier on one box"** — 2–2.5-bit QAT of DeepSeek V4 Pro (MIT) to fit one 512GB M5 Ultra at ~35–50 tok/s, *plus* the same for V4 Flash or GLM-5.3-Flash to fit 128GB laptops / Strix Halo / DGX Spark at ~30–100 tok/s. upstreamed llama.cpp/MLX kernels + agentic evals. ~50–150k GPU-hours with ablations. fills the 128GB gap (AA 34 → ~42–47) and has a headline demo.
2. **"local claude code on 24GB"** — agent-focused QAT + on-policy distillation of a ~27–35B hybrid at ≤3 bpw, with MTP. ~20–80k GPU-hours. lower novelty since PrismML and Qwen are already close.
3. **open ternary scaling study** (7–14B on 10T, ~140–285k GPU-hours). scientifically valuable, less viral.
4. **distill a frontier model into an 8B phone model** (~30–100k GPU-hours). head-on with Gemma 4 and Qwen small models.

## things i couldn't figure out

- real MFU for MoE QAT with fake quantization on B200 is unknown. i assumed 25–30%.
- ParetoQ's token-saturation numbers come from dense ≤8B models and might not transfer to 1T+ MoEs.
- whether BF16 master weights are even available. V4 ships FP4/FP8 (base FP8 mixed), K3 ships MXFP4, so 2-bit QAT might have to start from 4-bit weights. quality impact unknown.
- didn't review the license terms (custom Kimi K3 License, Modified MIT for K2.x).
- B200 inference throughput for synthetic data generation is an assumption.
