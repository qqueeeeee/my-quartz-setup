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

# Graph Representations

Two main ways to store a graph in code.

**Adjacency List** — for each vertex, store a list of its neighbours. This is what you'll use almost always.

```
Graph:  1 - 2
        |   |
        3 - 4

Adjacency list:
1: [2, 3]
2: [1, 4]
3: [1, 4]
4: [2, 3]
```

Space: O(V + E) where V is vertices and E is edges. Good for sparse [[Graphs|graphs]].

**Adjacency Matrix** — a 2D array where `matrix[i][j] = 1` means there's an edge from i to j.

Space: O(V²). Good for dense graphs or when you need to quickly check if a specific edge exists.

For most DSA problems you'll use an adjacency list.

```cpp
// adjacency list representation
int V = 5;
vector<vector<int>> adj(V);

// add edge between 0 and 1 (undirected)
adj[0].push_back(1);
adj[1].push_back(0);

// directed edge from 0 to 2
adj[0].push_back(2);

// weighted adjacency list
vector<vector<pair<int,int>>> wadj(V); // {neighbour, weight}
wadj[0].push_back({1, 5}); // edge from 0 to 1 with weight 5
```

---

split out of [[Graphs]].
