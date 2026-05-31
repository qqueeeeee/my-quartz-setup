---
folder: Projects
tags:
  - area/projects
  - project
  - ml
  - c
  - systems
year: 2026
status: in-progress
---

# Writing a ML Library in C

i want to build a small ML library in C that can eventually classify MNIST
digits.

the point is not just "train a model." the point is understanding the mechanics
that higher-level libraries hide.

## why i'm doing this

i like projects that force me to work from first principles.

this is valuable because it makes me deal with:

- memory layout
- tensor math
- gradients and backpropagation
- the difference between understanding an API and understanding the mechanism

## what it needs

to get something like this working, i need at least:

1. tensor operations
2. gradient calculation
3. a layer abstraction that ties the model together
4. a training loop
5. enough infrastructure to load and evaluate data cleanly

## mental model

a model is still just a function that maps inputs to outputs.

in this case:

- input: an image of a handwritten digit
- output: a probability distribution over the digits 0 through 9

the interesting part is not that sentence. the interesting part is implementing
the chain of operations that makes it true.

## connected notes

- [[Pointers]]
- [[Stack vs Heap]]
- [[Arrays]]
- [[Graphs]]
