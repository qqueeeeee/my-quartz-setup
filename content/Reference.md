---
title: "Reference"
date: 2026-05-07
category: concept
status: seedling
tags: ["#dsa", "#algorithms", "#research", "#concepts"]
related: ["[[Pointers|pointers]]", "[[Data Structures]]", "[[Algorithms]]"]
---

A reference is an alias, another name for the same variable. Once set, it can't be repointed. They do pretty much what a pointer does, they're basically syntax sugar for [[Pointers|pointers]] as anything a reference does, a pointer can do, but it just looks cleaner.

int a = 10;
int& ref = a;  // ref IS a, not a copy
ref = 20;      // a is now 20

## Connections

- [[Pointers|pointers]] - This is the next layer of the idea, the place I would go when this note starts feeling too small.
- [[Data Structures]] - This is the nearby idea I would compare it with, confuse it with, or reach for right after it.
- [[Algorithms]] - This is the nearby idea I would compare it with, confuse it with, or reach for right after it.
