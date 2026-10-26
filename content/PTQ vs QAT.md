---
created: 2026-10-23
updated: 2026-10-23
categories:
  - AI
  - LLMs
  - Quantization
tags:
  - ai
  - llms
  - local-ai
  - quantization
aliases:
  - Post-training quantization vs quantization-aware training
  - PTQ
  - QAT
---

# PTQ vs QAT

part of [[Running good LLMs locally]].

basic idea: [[Quantization|quantization]] stores weights in fewer bits so the model is smaller and faster.

- **PTQ (post-training quantization):** take a finished model and round its weights down after the fact. cheap, but you're just hoping it survives.
- **QAT (quantization-aware training):** keep training the model *while* it's quantized, so it learns to work with the low-bit weights. it's an extra stage in the [[Training Loop|training loop]] that costs more but holds up much better.

question here: how good are both at 4, 3 and 2 bits, has anyone done 2–3-bit QAT of a big MoE, and how much compute does it take?

## short answer

**4-bit is solved.** good PTQ keeps ~97–99% of quality, and 4-bit QAT is now just what the labs do for frontier open MoEs:

- gpt-oss → MXFP4
- Kimi K2 Thinking / K2.6 → INT4
- DeepSeek V4 → FP4 experts
- Kimi K3 → MXFP4 weights / MXFP8 activations
- Gemma 4 → Q4_0

**below 4 bits, PTQ falls off a cliff**, especially for agents and tool calling. QAT evidence (ParetoQ, Apple's 2-bit on-device model, Gemma 4's mobile 2-bit parts, E8-QAT, PrismML's ternary 27B) says 2–2.5 bits can keep ~95–98% quality for not much compute.

**as of 2026-10-22, nobody (lab or community) has released a 2–3-bit QAT checkpoint of a large open MoE.**

## PTQ quality by bit width

### DeepSeek V3.1 (671B MoE) on Aider Polyglot

Unsloth dynamic GGUFs, 2025 runs (older). [Unsloth](https://unsloth.ai/docs/basics/dynamic-3.0-ggufs/unsloth-dynamic-ggufs-on-aider-polyglot)

| quant | size | non-thinking | thinking |
|---|---|---|---|
| full precision | 671GB | 71.6 | 76.1 |
| 5-bit (Q5_K_XL) | 484GB | 70.7 | – |
| 4-bit (Q4_K_XL) | 387GB | 69.7 | – |
| 3-bit (Q3_K_XL) | 300GB | 68.4 | 75.6 |
| 2-bit (Q2_K_XL) | 255GB | 65.8 | 66.7 |
| IQ2_XXS | 225GB | 61.2 | – |
| IQ1_M (1-bit) | 206GB | 55.7 | 57.8 |
| TQ1_0 | 170GB | 50.7 | – |

- community quants at similar sizes did worse (IQ2_XXS at 164GB: 43.6) or just failed / looped
- the page also claims a 192GB 1-bit file, which doesn't match the 206GB IQ1_M row

### Gemma 3 27B, MMLU 5-shot

BF16 = 71.5. older, 2025. [Unsloth Dynamic 2.0](https://unsloth.ai/docs/basics/unsloth-dynamic-2.0-ggufs)

| quant | size | MMLU | KLD |
|---|---|---|---|
| Q8_0 | – | 71.60 | – |
| Q4_K_XL | 15.6GB | 71.47 | 0.024 |
| Q3_K_XL | 12.8GB | 70.87 | 0.081 |
| Q2_K_XL | 9.95GB | 68.70 | 0.221 |
| IQ2_XXS | 7.3GB | 59.20 | 0.521 |
| IQ1_M | – | 48.10 | – |
| IQ1_S | 6.06GB | 41.87 | 0.973 |

Unsloth says its dynamic 4-bit is "2GB smaller with +1% accuracy" vs Google's QAT Q4_0 (70.64).

### Qwen3.8-27B

- Unsloth: 1-bit quants are "not for agentic use-cases" or tool calling. UD-Q2_K_XL (9.83GB) is the recommended one. UD-IQ1_S (6.2GB) keeps ~72% top-1 agreement. [Unsloth](https://unsloth.ai/docs/basics/unsloth-dynamic-2.0-ggufs)
- community comparison on 4x RTX 5090 (self-reported by the AtomicChat founder): [HF discussion](https://huggingface.co/Qwen/Qwen3.8-27B/discussions/65)
  - at 13.8GB (3-bit class), one quant got KLD 0.0325 / top-1 92.4%, vs 0.0484 for Unsloth Q3_K_M
  - IQ1_M (8.5GB): top-1 76.3%
  - "below 10GB every quant degrades quickly"
  - Q6 and Q8 are within noise of each other

### other PTQ findings

- **reasoning models:** W8A8 and W4A16 are lossless, lower carries "significant accuracy risks" (R1 distills 1.5–70B, QwQ-32B, Qwen3-8B). [arXiv 2504.04823](https://arxiv.org/abs/2504.04823) (older)
- **low-bit PTQ "favors undertrained LLMs".** heavily trained small models lose the most, and models trained on 100T+ tokens are predicted to quantize badly at low bits (based on 1,500+ checkpoints). [arXiv 2411.17691](https://arxiv.org/abs/2411.17691) (older). interesting because that means modern overtrained models are *harder* to PTQ.
- **KV-cache quant:** aggressive llama.cpp KV quant (`-ctk q4_0`) reportedly hurts tool-call accuracy. [InsiderLLM](https://insiderllm.com/guides/function-calling-local-llms/) (secondary, unverified)

## QAT releases

### Gemma 3 QAT (2025-04-18, older)

~5,000 QAT steps, using the non-quantized checkpoint's probabilities as targets (so basically self-distillation). cut Q4_0 perplexity degradation by 54%. 27B went 54GB → 14.1GB, 12B went 24GB → 6.6GB. [Google](https://developers.googleblog.com/en/gemma-3-quantized-aware-trained-state-of-the-art-ai-to-consumer-gpus/)

### Gemma 4 QAT (2026-06-05)

[Google](https://blog.google/innovation-and-ai/technology/developers-tools/quantization-aware-training-gemma-4/)

- Q4_0 QAT for all five sizes
- new mobile format for E2B/E4B:
  - precomputed (static) activation scales
  - channel-wise layout
  - "targeted 2-bit quantization" of the token-generating parts, with core reasoning layers kept at higher precision
  - compressed embeddings and KV cache
  - E2B drops to ~1GB
- MTP QAT checkpoints keep the multi-token-prediction speedup
- training compute not disclosed

**the runtime conversion can undo the QAT.** a naive llama.cpp conversion of the Gemma 4 QAT weights was only 24.77% byte-exact (F16 vs BF16 scales, bad scale selection). [Unsloth](https://unsloth.ai/docs/models/gemma-4/qat)

| model | top-1 agreement (fixed conversion) | top-1 (naive) |
|---|---|---|
| E2B | 98.16% | 89.29% |
| 12B | 88.76% | 74.08% |
| 26B-A4B | 85.63% | 70.20% |
| 31B | 96.67% | 87.91% |

the E2B "mobile mixture" is 2.19GB (61 tensors in TQ2_0) with 97.82% top-1.

Ollama's Jeffrey Morgan says the Gemma 4 12B QAT weights "perform function calling reliably" with Claude Code or Codex. [X](https://x.com/jmorgan/status/2062971904143901180) (snippet)

### the big MoEs

- **gpt-oss** (aug 2025, older): MoE weights (>90% of params) are MXFP4 at ~4.25 bits/param, applied in post-training. 120b fits one 80GB GPU. [model card](https://arxiv.org/html/2508.10925)
- **Kimi K2 Thinking** (nov 2025, older): INT4 weight-only QAT of the MoE parts during post-training. "lossless" ~2x generation speedup, all benchmarks reported at INT4 (HLE w/ tools 44.9, BrowseComp 60.2, SWE-bench Verified 71.3). [HF](https://huggingface.co/moonshotai/Kimi-K2-Thinking)
- **Kimi K2.6** (apr 2026): INT4 experts via native QAT + BF16 for the rest, ~594GB. [Lambda](https://lambda.ai/inference-models/moonshotai/kimi-k2.6) (secondary)
- **DeepSeek V4:** FP4 experts + FP8 elsewhere. [HF](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro). a PyTorch RFC says it's MXFP4 QAT on experts during post-training, dual-precision path FP32 → MXFP4 (1×32 blocks) → FP8 (128×128). [pytorch/ao #4408](https://github.com/pytorch/ao/issues/4408). **conflict:** a secondary source says FP4 was simulated during *pretraining*. [dasroot](https://dasroot.net/posts/2026/05/deepseek-v4-fp4-quantization-qat-stability-architectural-innovations/) (snippet)
- **Kimi K3** (jul 2026): MXFP4 weights + MXFP8 activations via QAT. [HF](https://huggingface.co/moonshotai/Kimi-K3)

### open tooling is behind

the PyTorch TorchAO RFC (2026-05-15) says "QAT is becoming standard for MoE models". then on jun 10–12 maintainers paused community implementation — they're designing a PyTorch-native MoE QAT flow and moving QAT into torchtitan and trl, no public design doc yet. so basically: **open MoE QAT tooling is immature.** [pytorch/ao #4408](https://github.com/pytorch/ao/issues/4408)

### Apple Foundation Models 2025 (older)

[arXiv 2507.13575](https://arxiv.org/html/2507.13575)

- ~3B on-device model: 2-bit QAT for decoder weights, 4-bit QAT for embeddings, 8-bit KV cache
- uses a balanced 2-bit set `{−1.5, −0.5, 0.5, 1.5}` (trains smoother than `{−2, −1, 0, 1}`), learnable scales, AdamW with an EMA of weights
- cost of going 16 → 2 bpw: MMLU 67.8 → 64.4, IFEval 85.1 → 82.3
- the server model uses 3.56-bpw ASTC compression after training (MMLU 80.0 → 79.2) + LoRA adapters to recover quality
- QAT "follows the same training stages as the base model but with fewer iterations"

### ParetoQ (Meta, feb 2025, NeurIPS 2025, older)

[arXiv 2502.02631](https://arxiv.org/html/2502.02631v2). probably the most useful paper for this whole question.

- LLaMA-3 8B: full precision 74.6 → 2-bit 71.2 (−3.4) → 1.58-bit 69.0 (−5.6, with 30B QAT tokens vs 100B in prior work) → 1-bit 67.8 (−6.8)
- QAT gains saturate at ~10B tokens for 3–4 bits and ~30B tokens for ≤2 bits
- with a fixed budget, best split is **~90% full-precision pretraining, ~10% QAT**
- there's a "learning transition" between 2 and 3 bits:
  - at 3+ bits, training just compensates around the original weights
  - at ≤2 bits, weights shift ~40% and form *new* representations
- ternary, 2-bit and 3-bit beat 4-bit and binary on the size–accuracy trade-off
- kernels: a 2-bit H100 kernel is 4.14x faster than FP16 and 1.24x faster than the 4-bit Machete kernel on 16384² matrices — but the 4 → 2-bit speedup is minimal for 1–8B models

### newer stuff

- **E8-QAT** (arXiv, 2026-10-20): 2-bit QAT using the E8 lattice as an implicit codebook. on Qwen3.6-35B-A3B it matches full precision on average across four tasks, beats SOTA baseline by +2.03% IFEval and +1.51% LiveCodeBench. peak memory −80%, decode throughput 1.97x BF16 at max batch. no weights or compute stated. [arXiv 2610.27699](https://arxiv.org/abs/2610.27699)
- **BitsMoE** (june 2026): mixed-precision PTQ with 2-bit results on Qwen3-30B-A3B-Base vs GPTQ. [arXiv listing](https://arxiv.org/catchup/cs.LG/2026-06-02?abs=True&page=1) (snippet)
- **EXL3:** streamlined QTIP (trellis quant) variant. conversion takes minutes to hours on one consumer GPU. supports DeepSeek V4, gpt-oss, Gemma 4, Qwen 3.5, with tensor/expert parallelism and CPU offload for MoE. still v0.0.6, ~1.7k stars. [exllamav3](https://github.com/turboderp-org/exllamav3)
- **NVFP4 pretraining** (sep 2025, older): a 12B trained on 10T tokens in NVFP4 matched the FP8 baseline (Hadamard transforms, 2D scaling, stochastic rounding). [arXiv 2509.25149](https://arxiv.org/abs/2509.25149). NVIDIA also publishes NVFP4 versions of community models, e.g. [nvidia/Qwen3.8-27B-NVFP4](https://huggingface.co/nvidia/Qwen3.8-27B-NVFP4)

### how much compute QAT actually took (what's disclosed)

- Gemma 3: ~5,000 steps (no batch size)
- ParetoQ: 10–30B tokens
- Apple: "fewer iterations" than base training
- Kimi, DeepSeek, Gemma 4, PrismML: not disclosed

## my takeaways

- **a 4-bit QAT project wouldn't be novel.** labs already ship it. the open territory is **2–2.5-bit (or ternary) QAT of the strongest MoEs** (DeepSeek V4 / V4.1 Flash + Pro, GLM-5.3 / 5.3-Flash, MiMo, Kimi K3), released together with matching llama.cpp and MLX kernels.
- **expected quality at 2 bits with QAT: ~95–99% retention.**
  - ParetoQ: −3.4 for an 8B at 2 bits, ≤30B tokens
  - Apple: −3.4 MMLU for a 3B at 2 bits
  - PrismML: 98.2% for a 27B at 1.76 bpw (see [[Ternary and 1-bit LLMs]])
  - E8-QAT: matches full precision for a 35B-A3B MoE at 2 bits
  - compare: best PTQ only gets ~88–92% at 2 bits (V3.1 on Aider: 65.8/71.6 non-thinking, 66.7/76.1 thinking)
- **the QAT advantage grows as bits shrink.** at 4 bits it's ≈0–1 point over good dynamic PTQ (Gemma 3). at 2 bits it's huge.
- **models released at native 4-bit make further PTQ messy.** for MXFP4/INT4 releases (gpt-oss, K2.x, V4, K3), squeezing below 4 bits after the fact stacks a second error on the first. QAT starting from the released 4-bit or BF16 weights, distilling from the full model, is the principled route. (my inference, not checked against a source.)
- **the toolchain matters as much as the training.** Gemma 4's naive conversion lost 10–15 top-1 points. any project has to ship exact-format kernels upstreamed to llama.cpp, MLX, Ollama, LM Studio on day 0.
- **agents and instruction following break first** (Bonsai's category drops, Unsloth's 1-bit warning). so the QAT data mix and evals should be agentic: Terminal-Bench, SWE-bench, tau2, BFCL.

## things i couldn't figure out

- none of the frontier labs disclosed GPU-hours or tokens for their QAT (Kimi INT4, DeepSeek FP4, K3 MXFP4, Gemma 4).
- whether DeepSeek V4's FP4 QAT happened in pretraining or post-training — sources conflict.
- E8-QAT hasn't been independently replicated, and i don't know the affiliation or whether weights exist.
- didn't verify Baidu ERNIE 4.5's 2-bit releases (2025).
- no systematic 2026 study measures 2–3-bit PTQ on agentic benchmarks for the newest hybrid-attention models.
