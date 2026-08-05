---
created: 2026-08-05
updated: 2026-08-05
categories:
  - Education
  - Computer Science
  - DSA
tags:
  - topic/dsa
  - area/education
  - cs/concepts
  - computer-science
aliases: []
---

# DFS

Go as deep as possible before [[Backtracking|backtracking]]. Uses [[Recursion]] (or an explicit [[Stacks|stack]]).

Good for detecting cycles, [[Topological Sort|topological sort]], connected components, and pathfinding.

```cpp
void dfs(vector<vector<int>>& adj, int node, vector<bool>& visited) {
    visited[node] = true;
    cout << node << " ";

    for (int neighbour : adj[node]) {
        if (!visited[neighbour]) {
            dfs(adj, neighbour, visited);
        }
    }
}
```

The `visited` array is critical. Without it you loop forever on [[Graphs|graphs]] with cycles.

---

split out of [[Graphs]].
