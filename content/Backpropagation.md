---
id: Backpropagation
aliases: []
tags:
  - topic/ai
  - area/education
  - ai
  - computer-science
  - ml
  - fundamentals
categories:
  - Education
  - Computer Science
  - ML
  - fundamentals
created: 2026-08-05
updated: 2026-08-05
---

# Backpropagation.md

## atomic notes

- [[Training Loop]]
- [[Micrograd]]

## The actual problem being solved

When training a neural network, the first thing we do is perform a **forward pass**. During the forward pass, we take some inputs, run them through a series of mathematical operations, and eventually produce a final output. From that output, we calculate a **loss**, which is a number that tells us how wrong the network's prediction was.

Consider this simple example:

```python
a = 2
b = 3

c = a * b
loss = c + 4
```

If we evaluate the code:

```text
c = 2 * 3 = 6
loss = 6 + 4 = 10
```

So we know that:

```text
loss = 10
```

However, knowing the final loss is not enough to improve our model. If we want to reduce the loss, we need to understand **which values contributed to it and by how much**.

For example:

```text
How much did a influence the loss?
How much did b influence the loss?
How much did c influence the loss?
```

These questions are extremely important because neural networks contain millions or even billions of parameters. To improve the network, we need a way to measure how sensitive the loss is to each parameter.

Those measurements are called **gradients**.

A [[Gradient|gradient]] tells us:

> "If I change this value slightly, how much will the final loss change?"

This is the core problem that backpropagation solves.

---

## What backpropagation does

Backpropagation is an algorithm that computes gradients for every value in a [[Computation Graph|computation graph]].

Given a final loss, backpropagation calculates quantities such as:

```text
dLoss/da
dLoss/db
dLoss/dc
...
```

These gradients tell us how strongly each variable affects the final loss.

For example:

```text
dLoss/da = 3
```

can be interpreted as:

> "If a increases by a small amount, the loss increases approximately 3 times that amount."

Backpropagation starts at the final loss and works **backwards** through the computation graph. As it moves backward, it applies the [[chain rule]] from calculus to determine how changes in earlier variables affect later variables.

Think of it like tracing the source of a bug in a program. You start with the final error and work backward through the code until you find which parts contributed to it.

Backpropagation does the same thing mathematically. It starts with the loss and traces backward through every operation to determine how much each value contributed to the final result.

---

## What backpropagation does NOT do

One of the most common misconceptions is that backpropagation is the same thing as training a neural network.

It is not.

Backpropagation does **not** update weights.

Backpropagation does **not** make predictions.

Backpropagation does **not** improve the model by itself.

Its only job is to compute [[gradient|gradients]].

You can think of backpropagation as a diagnostic tool. It tells us:

> "Here is how much each parameter is affecting the loss."

What we do with that information comes later.

The actual learning happens when we use those gradients to update the weights.

---

## Key takeaway

The most important idea to remember is:

> Backpropagation does not learn. Backpropagation computes gradients.

The purpose of those gradients is to answer the question:

> "If I change this value slightly, how will the loss change?"

Once we know that answer for every parameter, we can use gradient descent to update the weights and gradually reduce the loss.

---

## Related

* [[Gradient]]
* [[Gradient Descent]]
* [[Computation Graph]]
* [[Chain Rule]]
