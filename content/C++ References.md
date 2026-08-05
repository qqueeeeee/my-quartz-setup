---
created:
tags:
  - area/notes
  - cs/concepts
  - education
  - computer-science
  - languages
  - c
categories:
  - Education
  - Computer Science
  - Languages
  - C++
---
a reference is an alias. another name for the same variable.

once set, it can't be repointed.

it does a lot of what pointers can do, but cleaner. basically pointer-ish
behavior without writing pointer syntax everywhere.

Related to [[C++ Intro]] and [[Pointers]].

```cpp
int a = 10;
int& ref = a;  // ref IS a, not a copy
ref = 20;      // a is now 20
```
