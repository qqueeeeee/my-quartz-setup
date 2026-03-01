---
created:
tags:
  - cs/concepts
---
A greedy algorithm makes the locally optimal choice at each step, hoping that these local choices lead to a globally optimal solution. No backtracking, no reconsideration — just take the best option available right now and move on.

The hard part isn't the implementation, it's knowing when greedy actually works. A greedy approach gives the correct answer for some problems and a completely wrong answer for others. The difference isn't always obvious.

---

## When greedy works

Greedy works when the problem has **greedy choice property**: a locally optimal choice can always be extended to a globally optimal solution. Making the best local choice never prevents you from reaching the best global outcome.

It also needs **optimal substructure** — the same property [[Dynamic Programming]] requires. The difference is that in DP you consider all possible choices; in greedy you only consider one (the locally best).

If greedy doesn't work, DP usually can.

---

## Classic Examples

### Activity Selection / Interval Scheduling

Given a set of intervals, select the maximum number of non-overlapping intervals.

Greedy choice: always pick the interval that ends earliest. This leaves maximum room for future intervals.

```
Intervals: [(1,4), (2,3), (3,5), (4,6)]
Sort by end time: [(2,3), (1,4), (3,5), (4,6)]

Pick (2,3) ← ends earliest
Skip (1,4) ← overlaps with (2,3)
Pick (3,5) ← starts at or after 3
Pick (4,6) ← starts at or after 5... wait, 4 < 5, skip
Result: 2 intervals

Actually: pick (2,3), then (3,5), then (4,6)? No, 4 < 5.
Result: [(2,3), (3,5)] = 2 non-overlapping
```

```cpp
int maxNonOverlapping(vector<pair<int,int>>& intervals) {
    sort(intervals.begin(), intervals.end(), [](auto& a, auto& b) {
        return a.second < b.second; // sort by end time
    });

    int count = 1, end = intervals[0].second;
    for (int i = 1; i < intervals.size(); i++) {
        if (intervals[i].first >= end) {
            count++;
            end = intervals[i].second;
        }
    }
    return count;
}
```

### Coin Change (Greedy version)

With denominations [1, 5, 10, 25], make change for amount n using minimum coins.

Greedy: always pick the largest coin that fits.

This works for standard coin systems but NOT for arbitrary denominations. With coins [1, 3, 4] and target 6: greedy picks 4+1+1 = 3 coins, but optimal is 3+3 = 2 coins. This is why coin change in interviews is usually solved with [[Dynamic Programming]], not greedy.

### Jump Game

Array where each element is your max jump length. Can you reach the end?

Greedy: track the furthest index reachable so far. At each position, update it. If current position exceeds furthest reachable, you're stuck.

```cpp
bool canJump(vector<int>& nums) {
    int maxReach = 0;
    for (int i = 0; i < nums.size(); i++) {
        if (i > maxReach) return false;       // can't reach here
        maxReach = max(maxReach, i + nums[i]); // update furthest reachable
    }
    return true;
}
```

### Gas Station

Can you complete a circuit visiting all stations? Each station gives you gas, each leg costs gas.

Greedy insight: if total gas >= total cost, a solution exists. The starting point is the first station after the last deficit.

---

## Proving greedy correctness

In an interview you're rarely asked to formally prove it, but being able to argue why the greedy choice is safe shows deeper understanding.

The standard argument is an **exchange argument**: assume there's an optimal solution that makes a different choice at some step. Show that swapping that choice for the greedy choice doesn't make things worse. Therefore greedy is at least as good as optimal, so greedy IS optimal.

---

## Greedy vs DP

| | Greedy | DP |
|---|---|---|
| Choices considered | One (local best) | All possible |
| Time | Usually faster | Usually slower |
| Correctness | Problem-specific | Always correct if applicable |
| Backtracking | Never | Not needed (memoization handles it) |

When in doubt, try greedy first. If you can't prove it's correct or find a counterexample, switch to DP.

---

## Time Complexity

Greedy algorithms are usually O(n log n) due to sorting as a preprocessing step, followed by an O(n) scan. The scan itself is O(n). So the bottleneck is almost always the sort.

---

Greedy is elegant when it works because the code is simple and fast. The skill is in the recognition — seeing that the locally optimal choice is always globally safe.
