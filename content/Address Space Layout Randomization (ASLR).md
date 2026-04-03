---
created: 2026-03-08T10:35:00
tags:
  - cs/security
  - systems
---
# Address Space Layout Randomization (ASLR)

Address Space Layout Randomization is a security technique where the memory locations of important parts of a process get randomized.

That includes things like:

- [[Stacks|the stack]]
- [[Heaps|the heap]]
- shared libraries
- executable code regions

The point is to make memory corruption attacks harder.

If an attacker wants to jump to a specific address, overwrite a return pointer, or chain together gadgets, it becomes much less reliable if those locations keep moving around.

## Why it matters

Without ASLR, memory layouts are much more predictable.

That predictability makes attacks like buffer overflows way easier to pull off, because the attacker has a better shot at knowing exactly where useful code or data lives.

ASLR does not magically solve the whole problem, but it raises the difficulty a lot, especially when combined with other protections.

