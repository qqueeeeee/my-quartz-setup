---
created:
tags:
  - topic/programming-systems
  - area/education
  - cs/concepts
---
in C++, stack and heap matter a lot because they behave very differently.

stack memory is automatic. when you declare `int x = 5;` inside a function, it
lives on the stack and gets destroyed when the function returns. very fast, but
limited size.

heap memory is manual. if you use `new`, it stays there until you explicitly
delete it. this is where bigger/dynamic data structures usually live.

```cpp
int x = 5;             // stack memory
int* y = new int(5);   // heap memory
delete y;
```

languages like Python have garbage collectors. C++ doesn't do that by default,
but modern C++ has `unique_ptr` and `shared_ptr` so you don't manually delete
everything like a maniac.
