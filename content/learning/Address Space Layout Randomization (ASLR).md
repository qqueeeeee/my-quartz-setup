---
created: 2026-03-08T10:35:00
tags:
  - cs
---
Address Space Layout Randomization is a computer security technique that randomizes the memory locations of key data areas ([[Stacks]], [[Heaps]], libraries, executable code) of a process. By making these locations unpredictable, ASLR makes it difficult for attackers to execute memory-corruption attacks, such as buffer overflows.