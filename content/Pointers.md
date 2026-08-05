---
created: 2026-04-03
tags:
  - topic/programming-systems
  - area/education
  - cs/concepts
  - computer-science
  - languages
  - c
categories:
  - Education
  - Computer Science
  - Languages
  - C++
updated: 2026-08-05
aliases: []
---

a pointer stores the memory address of something.

basically just a variable holding an address. the address might point to a real
object, or it might be garbage if you mess it up.

```cpp
int a = 10;
int* ptr = &a;  // ptr holds the address of a
cout << *ptr;   // dereference: gives you the value at that address → 10
*ptr = 20;      // changes a to 20
```
