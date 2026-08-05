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

# Call Stack

Every recursive call gets pushed onto the [[Stacks|call stack]]. When the base case is hit, the calls start returning and popping off one by one. This is literally the same call stack your program uses for all function calls.

This is why infinite [[Recursion|recursion]] causes a stack overflow — you just keep pushing frames onto the stack until it runs out of memory.

The maximum depth you can recurse is limited by the stack size, usually around 1000-10000 calls depending on the language and environment.

---

split out of [[Recursion]].
