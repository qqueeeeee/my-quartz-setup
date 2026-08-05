---
created: 2026-08-05
updated: 2026-08-05
categories:
  - Education
  - Computer Science
  - DSA
tags:
  - topic/dsa
  - area/education
  - cs/concepts
  - computer-science
aliases: []
---

# Types of Linked Lists

**Singly Linked List** - each node points to the next one only. You can only traverse forward.

```
[data|next] -> [data|next] -> [data|next] -> nullptr
```

**Doubly Linked List** - each node has a pointer to both next and previous. You can traverse in both directions. Costs more memory (extra pointer per node) but makes operations like deletion easier since you don't need to track the previous node manually.

```
nullptr <- [prev|data|next] <-> [prev|data|next] <-> [prev|data|next] -> nullptr
```

**Circular Linked List** - the last node points back to the head instead of nullptr. Used in things like round-robin scheduling. Less common in DSA problems but good to know it exists.

---

split out of [[Linked Lists]].
