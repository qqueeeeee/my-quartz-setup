---
created:
tags:
  - topic/programming-systems
  - area/education
  - cs/concepts
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
