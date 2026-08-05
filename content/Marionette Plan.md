---
id: Plan
aliases: []
tags:
  - []
  - projects
  - marionette
categories:
  - Projects
  - Marionette
---
# Marionette — Initial Plan

## Context

[[Marionette]] is an AI agent that autonomously plays Discord bot games; check out [[My Own Shell]]
- Runs on consumer hardware, no GPU required
- No LLM in the loop — I want to *build* the intelligence, not prompt one
- Genuinely reactive: reads messages, understands context, decides actions, learns over time
- Heavy ML learning surface (this is a learning project)

The proposed the architecture: pretrained sentence encoder for language understanding, a DQN they train themselves for decisions, and a small classifier for anti-bot challenges. This plan captures the scaffolding, three additions, and the two decisions still open.

## Architecture 

```
Discord event (new message / state change)
        │
        ▼
   Sentence Encoder           all-MiniLM-L6-v2, ~90 MB, CPU, ~5 ms/message
   (text → 384-dim vector)
        │
        ▼
   Game State Builder         embedding + cooldowns + recent history + flags
        │
        ├──────────────────────────────────┐
        ▼                                  ▼
   Challenge Classifier            Outcome Classifier
   (math/typing/button/none)       (reward-event from last action's result)
        │                                  │
        │                                  ▼
        │                          Reward Signal → DQN Trainer (replay buffer)
        ▼                                  │
   Action Decision  ◄────────────  DQN Policy (epsilon-greedy)
        │
        ▼
   Interaction Layer           sends command to Discord (TBD — see decisions)
```

## Additions to be considered 

**1. Outcome classifier (separate from challenge classifier).**
The reward function (`gained_currency`, `challenge_triggered`, `command_on_cooldown`, …) needs *observation* — something has to read the next bot reply and label which event happened. A second small head on top of the same encoder embeddings does this. Without it, the DQN has no reward signal.

**2. Imitation-learning warmup before pure DQN.**
A cold-start DQN explores by sending random commands. On a Discord self-bot this is a fast path to a ban and very slow to converge. Fix: record the user playing for ~1 hour, save (state, action) pairs, pretrain the Q-network to mimic those choices, *then* switch to reward-driven RL. Same model, much safer bootstrap.

**3. Per-bot adapter layer.**
The action space, cooldown clock, and reward-event strings are all bot-specific. Keep the core (encoder, DQN, replay, trainer, classifiers) bot-agnostic; put each target bot's config in a thin adapter module. Lets Marionette retarget without touching the brain.

## Proposed layout

```
Marionette/
├── pyproject.toml
├── README.md
├── marionette/
│   ├── __init__.py
│   ├── encoder.py            # MiniLM wrapper, embedding cache
│   ├── state.py              # GameState dataclass + builder
│   ├── classifier.py         # Challenge + outcome classifiers (share encoder)
│   ├── rewards.py            # Reward function (consumes outcome classifier output)
│   ├── actions.py            # Action space abstract base
│   ├── agent/
│   │   ├── dqn.py            # Q-network (small MLP, ~200 lines)
│   │   ├── replay.py         # Experience replay buffer
│   │   ├── policy.py         # Epsilon-greedy selection
│   │   └── trainer.py        # Training loop (Bellman target, gradient steps)
│   ├── interaction/
│   │   ├── base.py           # Abstract InteractionLayer
│   │   └── <impl>.py         # Concrete impl — depends on decision below
│   ├── adapters/
│   │   └── <bot_name>.py     # Per-bot config: actions, cooldowns, patterns
│   ├── runner.py             # observe → decide → act → learn loop
│   └── config.py
├── data/
│   ├── challenges.jsonl      # Labeled anti-bot examples
│   ├── outcomes.jsonl        # Labeled reward-event examples
│   └── demos.jsonl           # Recorded gameplay for imitation warmup
├── scripts/
│   ├── label.py              # CLI tool to label captured messages
│   ├── record_demos.py       # Log (state, action) while user plays manually
│   ├── train_classifiers.py
│   ├── pretrain_dqn.py       # Imitation-learning warmup
│   └── run.py                # Launch Marionette
└── tests/
```

## Build order

We're going to start with DQN + reward. Order:

1. `agent/dqn.py` — small MLP Q-network
2. `agent/replay.py` — experience replay buffer
3. `rewards.py` — reward function with placeholder events
4. `agent/trainer.py` — Bellman update + gradient steps
5. `agent/policy.py` — epsilon-greedy
6. `state.py` + `actions.py` — abstractions so the agent compiles end-to-end
7. `encoder.py` — MiniLM wrapper
8. `classifier.py` — challenge + outcome classifiers (stubbed first, trained once data is labeled)
9. `adapters/owo.py` — OwO action space, cooldowns, response-pattern regex
10. `interaction/selfbot.py` — discord.py-self / selfcord wrapper implementing `InteractionLayer`
11. `runner.py` — wire together with a fake-Discord harness for tests, real client for live
12. Scripts last

## Decisions locked

- **Interaction layer**: `discord.py-self` (or current maintained fork, e.g. `selfcord`). Clean Python API, no OCR. Acknowledged ToS / ban risk — mitigations: use a throwaway account, route through a residential connection, keep the imitation-warmup phase so behavior looks human-paced from the start, hard-cap actions/minute in `runner.py`.
- **First target bot**: **OwO bot**. The first adapter (`marionette/adapters/owo.py`) defines:
  - **Action space (initial)**: `hunt`, `battle`, `pray`, `curse`, `daily`, `cowoncy`, `sell_all`, `answer_captcha`, `wait`. Expandable later.
  - **Cooldown table**: hunt/battle ~15s, daily 24h, pray/curse 5m — encoded as normalized "time remaining" floats in `GameState`.
  - **Response patterns**: regex/labels for "you found …", "captcha appeared", "on cooldown", etc., used as initial labels to bootstrap the outcome classifier before it's fully trained.

## Verification

- **DQN + replay + trainer**: unit-test against a toy gridworld to confirm the agent actually learns (loss curve drops, return improves).
- **Classifiers**: held-out test split of labeled `challenges.jsonl` / `outcomes.jsonl`, target ≥90% accuracy.
- **End-to-end**: a fake-Discord harness that scripts message sequences and asserts the agent picks correct actions. No real Discord traffic during dev.
- **Live**: dry-run on a private test server the user controls, every action logged for manual review before fully autonomous mode.
