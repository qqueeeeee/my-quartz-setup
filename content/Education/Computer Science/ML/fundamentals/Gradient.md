---
id: Gradients
aliases: []
tags: []
---
# Gradient.md

## The actual question gradients answer

A gradient measures how sensitive one value is to another value.

In machine learning, the most important question is:

> "If I change this weight slightly, what happens to the loss?"

The gradient answers that question.

When training a neural network, we are constantly trying to reduce the loss. The loss is simply a number that tells us how wrong the network's predictions are. If we know how changing a weight affects the loss, then we know which direction to move that weight to improve the network.

This is why gradients are so important. They provide the information needed to make learning possible.

---

## Example: Understanding a gradient without calculus

Suppose we have:

```text
loss = 5a + 2
```

Let's see what happens when we increase `a`.

If:

```text
a = 1
```

then:

```text
loss = 5(1) + 2
     = 7
```

Now increase `a` by 1:

```text
a = 2
```

The loss becomes:

```text
loss = 5(2) + 2
     = 12
```

The loss increased from:

```text
7 → 12
```

which is an increase of:

```text
+5
```

Let's try again.

If:

```text
a = 3
```

then:

```text
loss = 17
```

Again, increasing `a` by 1 caused the loss to increase by 5.

This tells us something important:

> Every time `a` increases by 1, the loss increases by 5.

That relationship is the gradient.

Mathematically we write:

```text
dLoss/da = 5
```

You can read this as:

> "The loss changes by 5 for every 1-unit change in `a`."

Or more intuitively:

> "If I nudge `a` upward, the loss goes up five times as fast."

---

## Understanding the notation

When you see something like:

```text
dLoss/dw
```

don't think of it as a scary [[calculus]] symbol.

Instead, translate it into plain English:

> "How much does the loss change when I change the weight?"

The top part:

```text
dLoss
```

means:

> "A small change in the loss."

The bottom part:

```text
dw
```

means:

> "A small change in the weight."

So:

```text
dLoss/dw
```

means:

> "How much does the loss change for a small change in the weight?"

This notation appears everywhere in machine learning because it tells us exactly how each parameter influences the final error.

---

## Interpreting the sign of a gradient

The sign of the gradient tells us which direction we should move a parameter.

### Positive gradient

```text
dLoss/dw > 0
```

A positive gradient means that increasing the weight causes the loss to increase.

Example:

```text
Weight goes up
↓
Loss goes up
```

Since our goal is to reduce the loss, increasing the weight is making things worse.

Therefore we should move the weight downward.

Think of it as:

> "This weight is pushing the loss upward, so we should decrease it."

---

### Negative gradient

```text
dLoss/dw < 0
```

A negative gradient means that increasing the weight causes the loss to decrease.

Example:

```text
Weight goes up
↓
Loss goes down
```

This is good because we want the loss to become smaller.

Therefore we should move the weight upward.

Think of it as:

> "Increasing this weight helps reduce the loss, so we should increase it."

---

## Why gradients matter in neural networks

Imagine a neural network with millions of weights.

For every weight, we need to answer:

```text
Should this weight go up?
Should this weight go down?
By how much?
```

Trying to figure this out manually would be impossible.

Gradients solve this problem.

For every weight in the network, the gradient tells us:

1. Which direction reduces the loss.
2. How strongly that weight affects the loss.

This information is what allows learning to happen.

Without gradients, a neural network would have no idea how to improve itself.

---

## The most important intuition

Whenever you see:

```text
dLoss/dw
```

translate it into this sentence:

> "If I change this weight a tiny bit, how much will the loss change?"

That single idea is the foundation of gradient descent, backpropagation, and neural network training.

Almost everything in modern deep learning is built on top of this concept.

## Related

* [[Backpropagation]]
* [[Gradient Descent]]
* [[Chain Rule]]

