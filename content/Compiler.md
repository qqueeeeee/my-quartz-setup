---
created: 2026-04-03
tags:
  - topic/programming-systems
  - area/education
  - cs/c
  - computer-science
  - languages
categories:
  - Education
  - Computer Science
  - Languages
  - C++
updated: 2026-08-05
aliases: []
---

"files have no meaning" in C++.

unlike Java, C++ doesn't care about file names or package hierarchy. the
compiler just gets told which files to treat as `.cpp` files. those become
translation units, and translation units get compiled into `.obj` files.

but `.cpp file` and `translation unit` are not exactly the same thing.

if you include all your `.cpp` files into one massive `.cpp` file, then that
whole thing becomes one translation unit. weird, but that's the point.

### first stage: pre-processing

the [[Compiler]] handles preprocessor statements first:

- `#include`
- `#define`
- `#if`
- `#ifdef`

there are also [[pragma]] statements, which tell the compiler specific things to
do.

compiler also does stuff like [[Constant Folding]] and other optimizations.
