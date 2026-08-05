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

A graph is a collection of nodes (vertices) connected by edges. It's the most general data structure, everything else is a special case of a graph. A [[Trees|tree]] is just a graph with no cycles and one root.


Graphs model anything with relationships — social networks, maps, the internet, dependencies between tasks, flight routes. If your problem involves connections between things, it's probably a graph problem.

## atomic notes

- [[Graph Representations]]
- [[BFS]]
- [[DFS]]
- [[Topological Sort]]

---

## terminology

**Vertex (node)** — a point in the graph
**Edge** — a connection between two vertices
**Directed graph** — edges have direction, A → B doesn't mean B → A
**Undirected graph** — edges go both ways
**Weighted graph** — edges have a cost or distance
**Cycle** — a path that starts and ends at the same vertex
**Connected graph** — every vertex is reachable from every other vertex
**Degree** — number of edges connected to a vertex

---

## traversals

Two fundamental ways to explore a graph. These are the building blocks for almost every graph algorithm.

## BFS vs DFS

|                | BFS                        | DFS                                  |
| -------------- | -------------------------- | ------------------------------------ |
| Data structure | Queue                      | Stack / [[Recursion]]                    |
| Shortest path  | Yes (unweighted)           | No                                   |
| Memory         | O(V) worst case            | O(depth)                             |
| Good for       | Shortest path, level order | Cycles, components, [[Topological Sort|topological sort]] |

---

## common graph problems

**Number of connected components** — run DFS/BFS from each unvisited node, count how many times you start a new traversal.

**Cycle detection** — in DFS, if you visit a node that's already in the current path (not just visited), there's a cycle.

**Bipartite check** — can you colour the graph with 2 colours such that no two adjacent nodes share a colour? Use BFS, alternating colours. If you ever need to give a node the same colour as its neighbour, it's not bipartite.

**Topological sort** — order vertices in a directed acyclic graph (DAG) such that for every edge u → v, u comes before v. Used for task scheduling, build systems. Only works on DAGs (no cycles).

**Shortest path (unweighted)** — BFS gives you this directly.

**Shortest path (weighted) — Dijkstra's algorithm** — use a min [[Heaps|heap]], always process the closest unvisited node. O((V + E) log V).

```cpp
vector<int> dijkstra(vector<vector<pair<int,int>>>& adj, int src) {
    int V = adj.size();
    vector<int> dist(V, INT_MAX);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;

    dist[src] = 0;
    pq.push({0, src}); // {distance, node}

    while (!pq.empty()) {
        auto [d, u] = pq.top(); pq.pop();
        if (d > dist[u]) continue; // outdated entry

        for (auto [v, w] : adj[u]) {
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.push({dist[v], v});
            }
        }
    }
    return dist;
}
```

---

## time complexity

| Algorithm | Time | Space |
|---|---|---|
| BFS | O(V + E) | O(V) |
| DFS | O(V + E) | O(V) |
| Dijkstra | O((V + E) log V) | O(V) |
| [[Topological Sort]] | O(V + E) | O(V) |

---

Graphs are where everything comes together. BFS uses a queue, DFS uses recursion/stack, Dijkstra uses a heap. Every prior topic feeds into this one.
