---
id: Backpropagation
aliases: []
tags:
  - topic/ai
  - area/education
  - ai
---
# Backpropagation.md

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

A gradient tells us:

> "If I change this value slightly, how much will the final loss change?"

This is the core problem that backpropagation solves.

---

## What backpropagation does

Backpropagation is an algorithm that computes gradients for every value in a computation graph.

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

## The training loop

Training a neural network consists of repeatedly performing the following steps:

```text
1. Forward pass
2. Compute loss
3. Backpropagation
4. Gradient descent update
5. Repeat
```

Let's break down each step:

### 1. Forward pass

The network receives inputs and produces a prediction.

Example:

```text
Input → Neural Network → Prediction
```

### 2. Compute loss

We compare the prediction to the correct answer and calculate how wrong the network was.

A larger loss means the prediction was worse.

A smaller loss means the prediction was better.

### 3. Backpropagation

Backpropagation computes gradients for every parameter in the network.

At this stage, nothing has been updated yet.

We are only gathering information about how each parameter affects the loss.

### 4. Gradient descent update

Now we use the gradients to adjust the weights.

Weights that increase the loss are pushed in the opposite direction.

Weights that decrease the loss are adjusted accordingly.

This is the step where actual learning occurs.

### 5. Repeat

The process is repeated thousands or millions of times.

Over time, the network gradually finds better parameter values and the loss decreases.

---

## Micrograd's purpose

Micrograd is not primarily a neural network library.

Its main purpose is to demonstrate how an **autograd engine** works.

An autograd engine automatically computes gradients for arbitrary mathematical expressions.

Micrograd does this by:

1. Building a computation graph.
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

Later, when we call backpropagation, it walks backward through that graph and computes gradients such as:

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

