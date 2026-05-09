---
title: "Writing a ML Library in C"
date: 2026-05-07
category: project
status: growing
tags: ["#dsa", "#algorithms", "#fullstack", "#systems", "#projects"]
related: ["[[Writing]]", "[[Pointers]]", "[[Stack vs Heap]]", "[[Arrays]]"]
---

# [[Writing]] a ML Library in C

I want to build a small machine learning library in C that can eventually classify digits from the MNIST dataset.

The point is not just "train a model." The point is to understand the mechanics that higher-level libraries normally hide.

## Why I am doing this

I like projects that force me to work from first principles.

Writing a small ML library in C is valuable because it makes me deal with:

- memory layout
- tensor math
- gradients and backpropagation
- the difference between understanding an API and understanding the mechanism

## What the system needs

To get something like this working, I need at least:

1. tensor operations
2. gradient calculation
3. a layer abstraction that ties the model together
4. a training loop
5. enough infrastructure to load and evaluate data cleanly

## Mental model

A model is still just a function that maps inputs to outputs.

In this case:

- input: an image of a handwritten digit
- output: a probability distribution over the digits 0 through 9

The interesting part is not the sentence above. The interesting part is implementing the chain of operations that makes it true.

## Connected notes

- [[Pointers]]
- [[Stack vs Heap]]
- [[Arrays]]
- [[Graphs]]

## Connections

- [[Writing]] - This sits near the same build thread, where the idea becomes less abstract and more like something I can actually ship.
- [[Pointers]] - This sits near the same build thread, where the idea becomes less abstract and more like something I can actually ship.
- [[Stack vs Heap]] - This sits near the same build thread, where the idea becomes less abstract and more like something I can actually ship.
- [[Arrays]] - This sits near the same build thread, where the idea becomes less abstract and more like something I can actually ship.
