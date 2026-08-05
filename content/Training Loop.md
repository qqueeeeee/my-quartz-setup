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

# Training Loop

Training a neural network consists of repeatedly performing the following steps:

```text
1. Forward pass
2. Compute loss
3. Backpropagation
4. Gradient descent update
5. Repeat
```

Let's break down each step:

## 1. Forward pass

The network receives inputs and produces a prediction.

Example:

```text
Input → Neural Network → Prediction
```

## 2. Compute loss

We compare the prediction to the correct answer and calculate how wrong the network was.

A larger loss means the prediction was worse.

A smaller loss means the prediction was better.

## 3. Backpropagation

[[Backpropagation]] computes gradients for every parameter in the network.

At this stage, nothing has been updated yet.

We are only gathering information about how each parameter affects the loss.

## 4. Gradient descent update

Now we use the gradients to adjust the weights.

Weights that increase the loss are pushed in the opposite direction.

Weights that decrease the loss are adjusted accordingly.

This is the step where actual learning occurs.

## 5. Repeat

The process is repeated thousands or millions of times.

Over time, the network gradually finds better parameter values and the loss decreases.

---

split out of [[Backpropagation]].
