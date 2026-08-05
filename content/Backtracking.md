---
created: 2026-04-03
tags:
  - topic/dsa
  - area/education
  - cs/concepts
  - computer-science
categories:
  - Education
  - Computer Science
  - DSA
updated: 2026-08-05
aliases: []
---

Backtracking is a technique for solving problems by building a solution incrementally, and abandoning a path as soon as you determine it can't lead to a valid solution. You go forward when things look promising, backtrack when they don't.


It's essentially [[Recursion]] with an undo step. At each point you make a choice, recurse to explore it, then unmake the choice and try the next option.

## atomic notes

- [[Permutations]]
- [[Subsets]]
- [[N-Queens]]
- [[Pruning]]

---

## the template

Every backtracking solution follows the same shape:

```
function backtrack(current_state):
    if current_state is a solution:
        add to results
        return

    for each choice available:
        if choice is valid:
            make the choice
            backtrack(new_state)
            undo the choice    ← this is the backtrack step
```

The undo step is what makes it backtracking and not just [[Recursion|recursion]]. After exploring a path fully, you restore the state so other paths can be explored cleanly.

---

## when to use backtracking

- Generate all combinations, [[Permutations|permutations]], or [[Subsets|subsets]]
- Constraint satisfaction problems ([[N-Queens]], Sudoku)
- Word search in a grid
- Any problem where you need to explore all possibilities but can eliminate invalid paths early

---

## time complexity

Backtracking is inherently exponential in the worst case — you're exploring a tree of possibilities. But the actual runtime depends heavily on how much [[Pruning|pruning]] you do.

[[Permutations]] of n elements: O(n × n!) — n! permutations, each of length n.
[[Subsets]] of n elements: O(2^n) — there are 2^n subsets.

These are unavoidable when you need all solutions. The question is how fast you can rule out dead ends.

---

Backtracking is the brute-force-but-smart approach. When a problem asks "find all valid X" or "does any arrangement satisfy these constraints", backtracking is usually the answer.

The undo step is the thing people forget when first learning it. Always ask: if I make this choice and recurse, what do I need to undo before trying the next choice?
