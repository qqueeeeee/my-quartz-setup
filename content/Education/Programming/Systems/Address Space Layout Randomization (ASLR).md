---
created: 2026-03-08T10:35:00
tags:
  - topic/programming-systems
  - area/education
  - cs/security
  - systems
---
# address space layout randomization (ASLR)

Address Space Layout Randomization is a security technique where important
memory locations in a process get randomized.

That includes things like:

- [[Stacks|the stack]]
- [[Heaps|the heap]]
- shared libraries
- executable code regions

point is to make memory corruption attacks harder.

if an attacker wants to jump to a specific address, overwrite a return pointer,
or chain gadgets together, it becomes way less reliable when those locations keep
moving.

## why it matters

without ASLR, memory layouts are much more predictable.

that makes attacks like buffer overflows easier because the attacker has a
better shot at knowing where useful code or data lives.

ASLR doesn't magically solve the whole problem, but it raises the difficulty a
lot, especially with other protections.
