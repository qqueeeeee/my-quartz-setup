---
created: 2026-08-05
updated: 2026-08-05
categories:
  - Education
  - Computer Science
  - ML
  - fundamentals
tags:
  - topic/ai
  - area/education
  - ai
  - computer-science
  - ml
  - fundamentals
aliases: []
---

# Micrograd

Micrograd is not primarily a neural network library.

Its main purpose is to demonstrate how an **autograd engine** works.

An autograd engine automatically computes gradients for arbitrary mathematical expressions.

Micrograd does this by:

1. Building a [[Computation Graph|computation graph]].
2. Remembering how every value was created.
3. Traversing the graph backwards.
4. Computing gradients for every node.

For example, if we have:

```python
a = 2
b = 3

c = a * b
loss = c + 4
```

Micrograd stores the relationships between these values in a graph.

Later, when we call [[Backpropagation|backpropagation]], it walks backward through that graph and computes gradients such as:

```text
dLoss/da
dLoss/db
dLoss/dc
```

Each value in the graph receives a `.grad` attribute.

For example:

```python
a.grad
b.grad
c.grad
```

These gradients tell us how much each value influenced the final loss.

This is the foundation of modern deep learning frameworks such as PyTorch, TensorFlow, and JAX. Micrograd is simply a minimal implementation designed to help you understand the underlying mechanics.

---

split out of [[Backpropagation]].
