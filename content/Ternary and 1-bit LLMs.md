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
  - bitnet
aliases:
  - BitNet
  - Native low-bit models
  - Ternary LLMs
---

# Ternary and 1-bit LLMs

part of [[Running good LLMs locally]].

basic idea: instead of quantizing a normal model down (see [[PTQ vs QAT]]), use weights that are only `{-1, 0, 1}` (ternary, ~1.58 bits) or just signs (1-bit). either train it like that from scratch, or convert an existing model.

question here: where's BitNet b1.58 2B4T at, are there bigger ternary / 1-bit models, what are the open problems, and what about kernels?

## short answer

Microsoft's **BitNet b1.58 2B4T** (apr 2025) is *still* the biggest official natively-trained ternary model. no 7B+ from-scratch ternary model from a major lab exists as of oct 2026.

the action moved to **converting existing models.** PrismML's Bonsai line:

- 1-bit Bonsai 8B (mar 2026)
- Bonsai 27B (jul 2026)
- Ternary Bonsai 2 27B (sep 2026)

built on Qwen3.6 / 3.8-27B, keeping 90–98% quality at 1.1–1.8 bits/weight, and downloaded a ton. the catch: they need custom kernels and a [[llama.cpp]] fork. stock llama.cpp only has the generic TQ1_0 / TQ2_0 ternary types.

## BitNet

### BitNet b1.58 2B4T (apr 2025, older)

[arXiv 2504.12285](https://arxiv.org/abs/2504.12285)

- 2B params, trained on 4T tokens
- non-embedding memory 0.4GB vs 1.4–4.8GB for peers
- CPU decode 29 ms/token vs 41–124 ms
- energy ~0.028 J vs 0.186–0.649 J per token
- average score 54.19 vs Qwen2.5-1.5B's 55.23 — and it beats INT4 GPTQ/AWQ versions of Qwen2.5-1.5B

### bitnet.cpp

[microsoft/BitNet](https://github.com/microsoft/BitNet)

timeline:

- 2025-05-20: official GPU kernel
- 2026-01-15: parallel CPU kernels, +1.15–2.1x
- 2026-07-20: BitNet-embedding 0.6B and 270M
- 2026-07-23: VibeASR.cpp speech recognition

numbers:

- speedup vs full precision: 1.37–5.07x on ARM, 2.37–6.17x on x86
- energy savings: 55–70% ARM, 72–82% x86
- claims a 100B BitNet could run on one CPU at 5–7 tok/s — but that model doesn't exist
- biggest official model is still 2B4T. community ones: Llama3-8B-1.58-100B-tokens, Falcon3 1–10B (1.58-bit), Falcon-E 1–3B

a may 2026 white paper also says the biggest publicly trained + benchmarked BitNet is still 2B4T. [Continuum](https://www.continuumresourcesllc.com/continuum-edge-ai-bitnet-whitepaper.html) (secondary)

### BitDistill (oct 2025, older)

converts full-precision Qwen models to 1.58-bit for *specific downstream tasks*, using SubLN, MiniLM-style attention [[Distillation|distillation]] and a continual-pretraining warm-up. up to 10x memory savings and 2.65x faster CPU inference. [arXiv 2510.13998](https://arxiv.org/abs/2510.13998)

## PrismML Bonsai

### 1-bit Bonsai 8B / 4B / 1.7B (2026-03-31)

[PrismML](https://prismml.com/news/prismml-launches-worlds-first-1-bit-ai-model)

- sizes ~1GB (8B), 0.5GB (4B), 0.24GB (1.7B)
- "trained using Google v4 TPUs", Apache 2.0
- claims 14x smaller, 8x faster, 4–5x more energy efficient
- company is a Caltech spinout (CEO Babak Hassibi), backed by Khosla and Cerberus

The Register on Bonsai 8B: 1.15GB, sign-bit weights with per-group scales. Qwen3 8B is "slightly ahead" on MMLU-Redux, MuSR and GSM8K. PrismML's "intelligence density" metric gives 1.06/GB vs 0.10/GB. all vendor numbers. [The Register](https://www.theregister.com/2026/04/04/prismml_1bit_llm/)

**conflict:** secondary sources call Bonsai 8B a native 1-bit model trained from scratch, but PrismML's own page doesn't say if it's from scratch or derived.

### Bonsai 27B (2026-07-14)

built on Qwen3.6-27B. [PrismML](https://prismml.com/news/bonsai-27b)

- ternary: 5.9GB at 1.71 bpw, 95% retention
- 1-bit: 3.9GB at 1.125 bpw, 90% retention

| category | FP16 | ternary | 1-bit |
|---|---|---|---|
| agentic / tool calling | 80.0 | 74.0 | 66.0 |
| instruction following | 78.4 | 71.8 | 65.8 |
| knowledge | 83.1 | 77.0 | 73.4 |
| math | 95.3 | 93.4 | 91.7 |
| coding | 88.7 | 86.0 | 81.9 |

speed: RTX 5090 163 tok/s (1-bit) / 134 (ternary), M5 Max 87 / 58.

marketed as "the first 27B-class model to run on a phone".

community evals of it show regressions in instruction following, vision and tool reliability, while math and coding hold up. [ArmanJR benchmark](https://github.com/ArmanJR/PrismML-Bonsai-vs-Qwen3.5-Benchmark), [wavect review](https://wavect.io/blog/bonsai-27b-phone-local-ai-review/) (secondary)

### Ternary Bonsai 2 27B (2026-09-17)

built on Qwen3.8-27B. [PrismML](https://prismml.com/news/bonsai-2-27b)

- 1.76 bpw, 5.9GB, **98.2% retention** (83.9 vs 85.4)
- agentic 77.57 vs 79.74, coding 81.58 vs 82.17, knowledge 83.95 vs 86.66, vision 78.59 vs 81.64
- speed: RTX 5090 143 tok/s, M5 Max 46.8 tok/s
- method points to a whitepaper, compute not disclosed

the GGUF on HF: [prism-ml/Ternary-Bonsai-2-27B-gguf](https://huggingface.co/prism-ml/Ternary-Bonsai-2-27B-gguf)

- formats: PTQ1_0 (1.75 bpw, 5.95GB) and PQ2_0 (2.13 bpw, 7.21GB)
- stock llama.cpp rejects them, and a file labeled Q2_0 loads but "produces garbage". you need the PrismML-Eng/llama.cpp fork
- uses a blockwise Hadamard rotation (block size 1024) folded into the weights, 0.0976% of params stay at higher precision
- 14-benchmark average 84.78 vs 86.32 (98.2%)
- **2,484,375 downloads last month, 2.79k likes**
- llama-bench decode (TG128): RTX 5090 129.9 tok/s (PQ2_0), RTX 4090 81–91, M5 Pro 28.1

## other stuff

- llama.cpp has ternary types TQ1_0 and TQ2_0. Unsloth's Gemma 4 mobile mixture uses TQ2_0, Bonsai metadata references TQ1_0. [Unsloth](https://unsloth.ai/docs/models/gemma-4/qat). llama.cpp had 132.0k stars on 2026-10-22. [GitHub](https://github.com/ggml-org/llama.cpp)
- Intel BITCOS packs ternary weights below 1.58 bits. [blog](https://rohitghumare.com/blog/bitcos-below-ternary/) (secondary)
- TWLA: ternary weights + low-bit activations via PTQ. [arXiv 2606.13054](https://arxiv.org/pdf/2606.13054) (title only)
- "All for 1-Bit": genuine 1-bit PTQ. [arXiv 2609.06161](https://arxiv.org/pdf/2609.06161) (title only)
- ParetoQ's ternary 600M beats the previous best ternary 3B. at 8B, ternary costs −5.6 points with 30B QAT tokens. [arXiv 2502.02631](https://arxiv.org/html/2502.02631v2)

## open problems

1. **no public evidence that from-scratch ternary beats "pretrain in full precision, then ternary QAT" at equal compute.** ParetoQ's 90/10 split and PrismML's 95–98% retention both point to conversion being the better use of compute.
2. **runtime support is fragmented.** PrismML needs a fork, and TQ types aren't well optimized on every llama.cpp backend.
3. **GPU decode at ~1.75 bpw is kernel-limited, not memory-limited.** Bonsai 2 decodes at 120–143 tok/s on an RTX 5090, about 40–48% of the ~300 tok/s bandwidth limit (assuming the 5090's 1.79TB/s spec, which i didn't fetch).
4. **agents, instruction following and knowledge degrade first.**
5. **ternary MoEs and ternary hybrid-attention models are unproven** above small scale.

## my takeaways

- **"ternary 27B on a phone" is taken.** not a fresh viral hook anymore. the open slots are:
  - ternary or ~2-bit *frontier MoEs*
  - ternary formats with kernels *upstreamed* into llama.cpp / MLX
  - a fully open recipe (PrismML's method is undisclosed)
- **a from-scratch ternary 7–30B would be scientifically valuable** (it'd answer the scaling question) but riskier and less obviously viral.

## things i couldn't figure out

- PrismML's method and compute — didn't read the whitepaper, still unclear if Bonsai 8B was from scratch or converted.
- no independent replication of Bonsai's full benchmark suite.
- Microsoft's 7B/13B BitNet plans only show up in secondary claims.
- didn't verify release dates / benchmarks for Falcon-E and Falcon3-1.58bit.
