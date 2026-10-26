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
  - hardware
  - benchmarks
aliases:
  - Local LLM tiers
---

# Best local LLMs by hardware tier

part of [[Running good LLMs locally]]. question here: what are the strongest open-weight models people actually run locally, per hardware tier, and how big is the gap to the closed frontier? (as of 2026-10-22)

## short answer

the default local model in oct 2026 is a ~27B dense hybrid-attention Qwen — Qwen3.6-27B (april), then Qwen3.8-27B (aug 14). Gemma 4 (E2B / E4B / 12B / 26B-A4B / 31B, with official QAT checkpoints) covers phones up to 16GB. gpt-oss-20b/120b still gets cited for 16GB and 80GB setups.

on Artificial Analysis' (AA) index:

- best 24GB-class model: **Qwen3.8 27B = 34**
- best open model: **MiMo-V2.6-Pro = 46**
- best closed model: **Claude Opus 5.5 = 58**

the best open models are now 1–2.8T param MoEs that don't fit even a 512GB Mac at native ~4-bit. and the 64–128GB unified memory tier has nothing that actually uses its memory.

## the frontier gap

### AA leaderboard (accessed 2026-10-22)

no index version or date on the page, which is annoying. [source](https://artificialanalysis.ai/leaderboards/models)

closed top:

- Claude Opus 5.5 (max) 58
- Claude Sonnet 5.5 (max) 56
- Meta "Muse Wonder Full" (max) 56
- Claude Fable 5.1 (max) 53
- GPT-6 Astra (max) 53
- Gemini 4 Argon (high) 53

stuff you can actually run locally:

- Qwen3.8 27B (xhigh) 34 — medium 28, non-reasoning 20
- Qwen3.6 35B A3B 18
- Gemma 4 31B 15 (asterisked, no explanation)
- gpt-oss-120b (high) 12
- gpt-oss-20b (high) 9

### AA open-weights list

score, total / active params. [source](https://artificialanalysis.ai/models/open-source)

| model | score | total / active |
|---|---|---|
| MiMo-V2.6-Pro (Xiaomi) | 46 | 1.0T / 42B |
| DeepSeek V4.1 Flash 1017 (Max) | 45 | 552B / 16B |
| GLM-5.3 (Max) | 45 | 753B / 40B |
| Step 5 Preview | 44 | 600B / 27B |
| Kimi K3 (Max) | 44 | 2.8T / 104B |
| GLM-5.3-Flash | 42 | 320B / 18B |
| Meta Muse Spark Open | 39 | 816B / 42B |
| Qwen3.8 27B | 34 | dense — only model under 40B on the list |
| K2 Horizon 375B-A23B | 31 | 375B / 23B |
| Reflection Beam 1.0 | 30 | 501B / 23B |
| NVIDIA Nemotron 3.5 Super VL | 26 | 120B / 12B |
| Thinking Machines Inkling | 25 | 975B / 41B |

### how the gap has moved

- **april 2025:** best open (DeepSeek V3 0324) 22 vs Claude 3.7 Sonnet 35 → 13-point gap.
- **2026-04-30:** GPT-5.5 (xhigh) 60 vs Kimi K2.6 and MiMo V2.5 Pro at 54 → top three open models 3–6 points behind. [AA](https://artificialanalysis.ai/articles/recent-open-weights-model-launches)
- **late july 2026:** when Kimi K3's weights shipped, AA posted the gap was "just 4 points… the smallest it has been since the GLM-5 release in February". [AA on X](https://x.com/ArtificialAnlys/status/2081926991788626011) (unverified)
- a september secondary article has Kimi K3 at 59.7 vs Claude Fable 5.1 at 65.7. [pasqualepillitteri.it](https://pasqualepillitteri.it/en/news/14684/open-source-closes-gap-artificial-analysis) (secondary, unverified)

**careful:** the current leaderboard has Kimi K3 at 44 and Fable 5.1 at 53. so the index got re-based at some point. don't compare absolute numbers across dates.

### where the gap is widest

hard reasoning, agentic stuff, and knowledge (april 2026 numbers, [AA](https://artificialanalysis.ai/articles/recent-open-weights-model-launches)):

- **HLE:** open 34–36% vs 44% (GPT-5.5) and 45% (Gemini 3.1 Pro)
- **CritPt:** 4–12% vs 27%
- **TerminalBench Hard:** 43–46% vs 61%
- **Omniscience** (knowledge / hallucination): DeepSeek V4 Pro −10, Kimi K2.6 +6, vs Claude Opus 4.7 +26 and Gemini 3.1 Pro +33

## open frontier models (mostly too big for local)

### DeepSeek V4

released 2026-04-24, MIT license, 1M context.

- V4 Pro: 1.6T total / 49B active
- V4 Flash: 284B / 13B
- AA at release: Pro (Max) 52, Flash (Max) 47. AA put Flash at "Claude Sonnet 4.6 (max) level"
- hallucination rates: 94% (Pro), 96% (Flash) — yikes
- [AA](https://artificialanalysis.ai/articles/deepseek-is-back-among-the-leading-open-weights-models-with-v4-pro-and-v4-flash)

from the [V4 Pro model card](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro):

- released weights are FP4 for the MoE experts, FP8 for most of the rest
- hybrid attention: Compressed Sparse Attention (CSA) + Heavily Compressed Attention (HCA). at 1M context it uses 27% of V3.2's single-token FLOPs and 10% of its [[KV Cache|KV cache]]
- pretrained on 32T+ tokens
- benchmarks, V4 Pro Max vs Opus 4.6 Max / GPT-5.4 xHigh / Gemini 3.1 Pro High:
  - SWE-bench Verified 80.6 vs 80.8 / n/a / 80.6
  - HLE 37.7 vs 40.0 / 39.8 / 44.4
  - Terminal Bench 2.0 67.9 vs 65.4 / 75.1 / 68.5
  - SimpleQA-Verified 57.9 vs 46.2 / 45.3 / 75.6

download sizes: ~865–893GB for Pro, ~167GB for Flash. [morphllm](https://www.morphllm.com/deepseek-v4), [yottalabs](https://www.yottalabs.ai/post/deepseek-v4-release-date-specs-how-to-access-2026) (secondary)

### Kimi K3

weights out ~late july 2026. [HF](https://huggingface.co/moonshotai/Kimi-K3)

- 2.8T total / 104B active, 896 experts (16 active + 2 shared)
- weights in MXFP4 with MXFP8 activations, via quantization-aware training
- 69 Kimi Delta Attention (KDA) layers + 24 Gated MLA layers, 1M context
- vs closed: GPQA 93.5 vs 94.1 (GPT-5.6 Sol), Terminal-Bench 2.1 88.3 vs 88.8, HLE-Full (no tools / tools) 43.5 / 56.0 vs 44.5 / 58.0 (GPT-5.6 Sol) and 53.3 / 63.0 (Claude Fable 5)

launched closed on jul 17, open weights promised for jul 27. [Digital Applied](https://www.digitalapplied.com/blog/qwen-closed-flagship-pivot-open-weight-retreat-2026) (secondary)

### Qwen keeping its Max tier closed

Qwen3.6-Max-Preview (apr 20), Qwen3.7-Max (may 20), Qwen3.8-Max-Preview (jul 19, 2.4T, API only). no open Qwen model shipped between apr 22 and jul 22. poolside's Laguna S 2.1 (jul 21, 118B / 8B active, OpenMDW-1.1 license) got called the first western open model in its class since gpt-oss-120b. [Digital Applied](https://www.digitalapplied.com/blog/qwen-closed-flagship-pivot-open-weight-retreat-2026) (secondary)

## models people actually run

### Qwen3.8-27B

released 2026-08-14, Apache-2.0. [HF](https://huggingface.co/Qwen/Qwen3.8-27B), date from [GitHub](https://github.com/QwenLM/Qwen3.8) (snippet)

- 64-layer dense, hybrid of Gated DeltaNet + Gated Attention
- 262K native context, extendable to 1M
- trained with MTP, has vision input
- vendor benchmarks vs Claude Opus 4.6 Max:
  - SWE-bench Pro 61.7 vs 53.4
  - Terminal Bench 2.1 73.0 vs 78.2
  - GPQA 89.2 vs 91.3
  - HLE 30.8 vs 40.0
  - LiveCodeBench v6 90.3 vs 88.8
  - OSWorld-Verified 84.3 vs 72.7

### Qwen3.6-27B

2026-04-22. SWE-bench Verified 77.2 vs Claude 4.5 Opus 80.9, Terminal-Bench 2.0 59.3 (tied with Opus). [HF](https://huggingface.co/Qwen/Qwen3.6-27B). fits one consumer GPU as a 16.8GB Q4_K_M. [Digital Applied](https://www.digitalapplied.com/blog/qwen-closed-flagship-pivot-open-weight-retreat-2026)

### Qwen3.6-35B-A3B

35B total / 3B active, 256 experts (8 routed + 1 shared). SWE-bench Verified 73.4, Terminal-Bench 2.0 51.5, GPQA 86.0, HLE 21.4. [HF](https://huggingface.co/Qwen/Qwen3.6-35B-A3B)

### Gemma 4

Apache-2.0, released ~2026-04-02, tech report jul 2.

- 31B dense (30.7B params, 1024-token sliding window + global attention, 256K context)
- 26B-A4B MoE (25.2B total / 3.8B active, 8 of 128 experts + 1 shared)
- E2B, E4B, and a 12B added later
- 31B benchmarks: MMLU-Pro 85.2, GPQA 84.3, LiveCodeBench v6 80.0, AIME26 89.2, Tau2 76.9, HLE 19.5
- 26B-A4B only scores 8.7 on HLE
- [HF](https://huggingface.co/google/gemma-4-31B-it), [Wikipedia](https://en.wikipedia.org/wiki/Gemma_(language_model)) (secondary), [Google QAT blog](https://blog.google/innovation-and-ai/technology/developers-tools/quantization-aware-training-gemma-4/)

### gpt-oss (older, aug 2025)

- 120b: 116.83B total / 5.13B active, 60.8 GiB checkpoint
- 20b: 20.91B / 3.61B, 12.8 GiB, runs in 16GB
- [model card](https://arxiv.org/html/2508.10925)

### community picks per tier

from the r/LocalLLaMA "Best Local LLMs – Apr 2026" megathread (575 upvotes, 311 comments), but summarised by a third party who doesn't even run local LLMs themselves. [Big Guy on Stuff](https://bigguyonstuff.com/best-local-llm-2026-megathread-synthesis/) (secondary)

- **phone / <8GB:** Gemma 4 E4B (~31 tok/s on a 16GB Mac mini M4)
- **8–12GB:** Gemma 4 26B at Q4
- **12–16GB:** Gemma 4 12B
- **16–24GB:** Qwen3.5-27B at Q6
- **32–64GB:** Qwen3.6-27B at Q8, or Qwen3-Coder-Next
- **64–128GB:** Qwen3.5-122B or MiniMax M2.7
- **128GB+:** GLM-5.2 or Qwen3.5-397B, Kimi K2.7 Code for coding

other guides:

- oct 2026: Qwen3.6-27B is the "capability-first" pick, gpt-oss-20b has the clearest 16GB claim, Gemma 4 12B adds text + image + audio input. [BenchLM](https://benchlm.ai/best/local-llm) (secondary, snippet)
- aug 29 2026: Qwen3.8-27B "best overall" (~24GB RAM). Laguna XS 2.1 (poolside, jul 2, 33B/3B MoE) scores 70.9% SWE-bench Verified. GLM-5.2 (june) scored 51 on AA v4.1, #1 open at the time. [PromptQuorum](https://www.promptquorum.com/local-llms/local-llm-model-updates-2026) (secondary, low reliability — contradicts itself)

### HF all-time downloads (2026-10-22)

Qwen3-0.6B 26.7M, Qwen3-4B 11.6M, gemma-4-26B-A4B-it 9.44M, Qwen3-14B 9.21M, Kokoro-82M TTS 10.3M. [HF](https://huggingface.co/models?sort=downloads)

## hardware in 2026

### Apple Mac Studio (announced 2026-08-25)

[Apple Newsroom](https://www.apple.com/newsroom/2026/08/apple-introduces-new-mac-studio-with-m5-max-and-m5-ultra/)

- **M5 Max:** up to 128GB at 614GB/s, from $2,499
- **M5 Ultra:** up to 512GB at 1.2TB/s, 80-core GPU with Neural Accelerators, from $5,499. most configs shipped sep 22, the 512GB one ships late october 2026
- apple claims LM Studio prompt processing is 3.9x faster than M4 Max and 4x faster than M3 Ultra
- Thunderbolt 5 RDMA clustering: four Mac Studios = "up to 3x faster" inference

### AMD Ryzen AI Halo dev kit

reviewed 2026-07-06, $3,999. 128GB LPDDR5x-8000 on a 256-bit bus (~256GB/s). AMD says up to 200B params at 4-bit. reviewers say it's bandwidth-limited. [The Register](https://www.theregister.com/ai-and-ml/2026/07/06/amds-ryzen-ai-halo-makes-local-ai-look-easy-but-at-4k-easy-doesnt-come-cheap/5266711) (snippet)

the Medusa Halo successor is rumoured with 384-bit LPDDR6 at ~480–691GB/s, late 2027 or 2028. [Hardware Corner](https://www.hardware-corner.net/amd-medusa-halo-local-llm-20250823/) (older, rumour)

### DGX Spark vs Strix Halo vs M5 Max on gpt-oss-120b

all secondary, pulled from a search summary across comparison sites, unverified. [ComputingForGeeks](https://computingforgeeks.com/dgx-spark-vs-strix-halo-vs-mac-studio/), [ThinkSmart](https://thinksmart.life/research/posts/dgx-spark-vs-strix-halo-benchmark/)

| | DGX Spark (273GB/s) | Strix Halo | M5 Max |
|---|---|---|---|
| decode (one test) | ~58.7 tok/s | 54.5 (Vulkan) | 87.9 (MLX) |
| decode (another test) | 38.5 | 34 | – |
| prefill | ~1,723 tok/s | ~340 | ~1,325 |

dense 70B decodes at 2.6–4.4 tok/s on the Spark. painful.

### consumer GPUs

- the 24GB RTX 50 Super cards are on hold because 3GB GDDR7 chips cost ~$60–70 each vs ~$20 for 2GB modules. [TweakTown](https://www.tweaktown.com/news/112679/nvidias-rtx-50-super-gpus-have-reached-board-partners-but-launch-is-on-hold-over-3gb-gddr7-pricing/index.html)
- (secondary, unverified) NVIDIA cut RTX 50 consumer production 30–40% in H1 2026, GPU prices up ~19–20% since late 2025, used 3090s at $1,000–1,300 (aug 2026), RTX 5090 reported at $4,329. [tech-insider](https://tech-insider.org/rtx-5090-price-4329-rtx-60-delay-2028-2026/), [runaihome](https://www.runaihome.com/blog/nvidia-no-new-consumer-gpus-2026-home-lab-buying-guide/)

### phones

iPhone 17 Pro has 12GB RAM. Qualcomm claims up to 220 tok/s peak on Snapdragon 8 Elite Gen 5, and their Llama 3.2 1B at w4a16 does ~64 tok/s on a reference device. [Qualcomm HF](https://huggingface.co/qualcomm/Llama-v3.2-1B-Instruct), [llm-hub](https://www.llm-hub.app/blog/which-phones-run-local-ai-fastest) (secondary)

## my takeaways

- **memory capacity, bandwidth and price all bind at once, and price is going up.** that makes each bit-per-weight of compression worth more now than last year.
- **the gap is really two gaps:**
  1. best open vs best closed — ~12 points today, swung between 4 and 13 over the past year
  2. best open vs what fits locally — ~12 points at 24GB, more on smaller machines. training-time compression attacks this one directly.
- **64–128GB is the clearest hole.** best options are a 27B (34) that already fits on 24GB, or gpt-oss-120b (12). open MoEs scoring 42–45 (GLM-5.3-Flash 320B/18B, DeepSeek V4.1 Flash 552B/16B, V4 Flash 284B/13B) would need ~2–2.5 bits/weight to fit in ~100–110GB usable memory with room for KV cache.
- **512GB is close to "frontier on one box".** DeepSeek V4 Pro (MIT) at ~2.25 bpw is ~450GB → fits one M5 Ultra 512GB. at native FP4/FP8 it's ~865–893GB, so two machines.

## things i couldn't figure out

- couldn't reconcile AA's index versions / re-basing. the 4-point gap in july vs ~12 now is partly just new closed releases (Opus 5.5 etc).
- reddit wouldn't load, so the tier picks are secondhand.
- Gemma 4 31B at 15 (asterisked) conflicts with AA saying in april that Gemma 4 31B (Reasoning) was open top 10. maybe the 15 is the non-reasoning variant?
- didn't check licenses / weight availability for Muse Spark Open, Inkling, Beam 1.0, Step 5, MiMo-V2.6-Pro beyond the AA listing. DeepSeek V4.1 Flash's 552B/16B size is also unverified.
- all the hardware tok/s numbers are secondary.
