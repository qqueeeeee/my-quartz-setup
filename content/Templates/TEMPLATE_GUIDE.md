---
title: TEMPLATE_GUIDE
created: {{date}}
updated: {{date}}
categories:
  - Meta
tags:
  - meta
  - conventions
aliases: []
---

# TEMPLATE_GUIDE

how the `Templates/` folder works. the vault is atomic-notes-first: small notes, one idea
each, wired together with links and gathered by MOCs. templates exist to make that cheap,
not to add ceremony.

## the default

**[[Atomic Concept Template]] is the default.** if you are unsure which template to use,
use that one. everything else is a container that eventually *produces* atomic concepts.

a note earns a different template only when it is a source (paper, book, lecture), an
artifact (project, experiment, ADR, bug), or a navigation surface (MOC, logs).

## shared properties

every template uses the same names so bases and queries keep working:

| property | meaning |
| --- | --- |
| `created` / `updated` | dates, `YYYY-MM-DD` |
| `categories` | broad bucket: `AI`, `DSA`, `Projects`, `Papers`, `Books`, `Interview`, `Index` … |
| `tags` | lowercase topical tags |
| `status` | `seedling` → `growing` → `evergreen` for concepts; `active`/`paused`/`shipped` for projects; `reading`/`done`; `open`/`fixed`; `running`/`done` |
| `aliases` | other names you'd search for |
| `related` | links to sibling notes when a body link isn't enough |

only keep the properties that mean something for the note. delete the rest.

## when to use each

| template | use it when |
| --- | --- |
| Atomic Concept | you can state a single question the note answers. **default.** |
| Project | a piece of software you intend to keep working on for months |
| Research Paper | reading an arXiv/conference paper |
| Book | starting a technical or non-fiction book |
| Lecture | a talk or video lecture (Karpathy, MIT, CMU, conference talks) |
| Interview Question | a question you want to be able to answer out loud, cold |
| Technology | a tool or library: FastAPI, PyTorch, Docker, Redis, tmux |
| Experiment | any run with a hypothesis and a metric |
| Bug | a debugging session worth remembering |
| ADR | an architecture choice on a project that would be expensive to reverse |
| Daily Log | an engineering log for the day — not a diary |
| Weekly Review | sunday: wins, gaps, project + interview progress |
| MOC | a topic has ~8+ notes and needs a front door |

Fleeting and Clipping templates stay for quick capture and web imports; both are inboxes,
not destinations. drain them into atomic concepts.

## recommended workflow

```text
watch karpathy lecture
        ↓
Lecture note  (key concepts, things i didn't understand)
        ↓
split into Atomic Concept notes — one question each
        ↓
link them into the AI MOC
        ↓
connect to Project Echo (Related Notes ↔ Projects using this)
        ↓
Experiment note: hypothesis → results → lessons
        ↓
ADR if the experiment changes the architecture
        ↓
Weekly Review picks up the gaps and the progress
```

other loops that matter:

- **paper loop** — Research Paper → atomic concepts for each new idea → experiment reproducing one claim.
- **debug loop** — Bug note → if the root cause was conceptual, spawn an atomic concept and link it under Prevention.
- **interview loop** — Weekly Review flags a weak area → Interview Question notes → each answer links to the atomic concept behind it. if you can't link one, you don't understand it yet.

## rules of thumb

- write the **Question** before the explanation. no question, no note.
- prefer a link over a paragraph re-explaining something you already wrote.
- "Questions I still have" should rarely be empty; that section is where the next study session comes from.
- a concept is `evergreen` only once a project or experiment links to it.
- templates are lightweight on purpose — delete sections that don't apply rather than filling them with filler.
