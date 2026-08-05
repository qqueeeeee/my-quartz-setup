---
title: STYLE_GUIDE
tags:
  - meta
  - conventions
categories:
  - Meta
---

# STYLE_GUIDE

conventions this vault follows after the "files over folders" migration. the older,
looser [[Vault Style Guide]] is kept for history — this file wins where they disagree.

## 1. minimal folders

there are exactly six locations, and no nesting inside them:

| location | holds |
| --- | --- |
| root | everything i write: personal notes, evergreen notes, project notes, programming notes, AI notes, career notes, journal fragments |
| `References/` | external things: books, people, technologies, libraries, papers, videos, courses, websites |
| `Clippings/` | anything copied from elsewhere: articles, blog posts, docs excerpts, tutorials |
| `Attachments/` | images and binaries |
| `Templates/` | Obsidian/Templater templates and `.base` files |
| `Daily/` | daily notes and short logs |

if a new folder feels necessary, it is almost always a link or a category instead.

## 2. categories replace folder hierarchy

the old path becomes a property, not a location:

```
Programming/Python/Async/Event Loop.md
```

becomes `Event Loop.md` at root with

```yaml
categories:
  - Programming
  - Python
  - Async
tags:
  - python
  - async
```

categories are Title Case and ordered broad → narrow. tags are lowercase, hyphenated,
and plural when they describe a set of things (`books`, `projects`, `references`).

## 3. dates

all dates use `YYYY-MM-DD`, in frontmatter properties `created` / `published`, never in
the filename except daily notes, which *are* `YYYY-MM-DD.md`.

## 4. heavy internal linking

link ideas the first time they appear in a note, naturally, in the sentence — not in a
"related" dump at the bottom. use aliases so the prose still reads normally:
`[[Dynamic Programming|dynamic programming]]`. one link per concept per note is enough.

links to notes that don't exist yet are fine and encouraged; they are the vault's todo
list, and they are collected in [[REPORT_BROKEN_LINKS]].

## 5. root is thinking, References is knowledge, Clippings is imported

- if i wrote it, it lives at root — even rough, even unfinished.
- if it describes a thing that exists in the world (a tool, a book, a person), it is a
  reference note.
- if someone else wrote the words, it is a clipping, and it keeps its `source:` property.

## 6. filenames

filenames are the note's title, in the casing i'd actually write it. no numbers, no
dates, no folder prefixes. renaming is allowed only when it improves consistency, and
old → new is recorded in [[REPORT_MOVED]].

## 7. index notes

broad topics get a hand-maintained index note at root ([[Programming]], [[AI]],
[[Projects]], [[Books]], [[Workflow]], [[Personal]], [[References]]) that links out.
indexes are navigation, not content — the thinking stays in the individual notes.

## 8. nothing is deleted

obsolete notes move to `Archive/` and are reported. merges are never automatic;
candidates go to [[REPORT_DUPLICATES]] for review.

## 9. navigation

quick switcher (`Ctrl+O`), search, backlinks and the graph — not the file tree. the file
tree is deliberately boring so the links have to carry the structure.
