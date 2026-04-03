---
created:
tags:
  - cs/concepts
---
A graph is a collection of nodes (vertices) connected by edges. It's the most general data structure, everything else is a special case of a graph. A [[Trees|tree]] is just a graph with no cycles and one root.

Graphs model anything with relationships — social networks, maps, the internet, dependencies between tasks, flight routes. If your problem involves connections between things, it's probably a graph problem.

---

## Terminology

**Vertex (node)** — a point in the graph
**Edge** — a connection between two vertices
**Directed graph** — edges have direction, A → B doesn't mean B → A
**Undirected graph** — edges go both ways
**Weighted graph** — edges have a cost or distance
**Cycle** — a path that starts and ends at the same vertex
**Connected graph** — every vertex is reachable from every other vertex
**Degree** — number of edges connected to a vertex

---

## Representing a Graph

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

Space: O(V + E) where V is vertices and E is edges. Good for sparse graphs.

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

## Traversals

Two fundamental ways to explore a graph. These are the building blocks for almost every graph algorithm.

### BFS (Breadth First Search)

Explore level by level. Start at a node, visit all its neighbours, then all their neighbours, and so on. Uses a [[Queues|queue]].

Gives you the shortest path in an unweighted graph because you always explore closer nodes first.

```cpp
void bfs(vector<vector<int>>& adj, int start) {
    int V = adj.size();
    vector<bool> visited(V, false);
    queue<int> q;

    visited[start] = true;
    q.push(start);

    while (!q.empty()) {
        int node = q.front(); q.pop();
        cout << node << " ";

        for (int neighbour : adj[node]) {
            if (!visited[neighbour]) {
                visited[neighbour] = true;
                q.push(neighbour);
            }
        }
    }
}
```

### DFS (Depth First Search)

Go as deep as possible before backtracking. Uses [[Recursion]] (or an explicit [[Stacks|stack]]).

Good for detecting cycles, topological sort, connected components, and pathfinding.

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

The `visited` array is critical. Without it you loop forever on graphs with cycles.

---

## BFS vs DFS

|                | BFS                        | DFS                                  |
| -------------- | -------------------------- | ------------------------------------ |
| Data structure | Queue                      | Stack / Recursion                    |
| Shortest path  | Yes (unweighted)           | No                                   |
| Memory         | O(V) worst case            | O(depth)                             |
| Good for       | Shortest path, level order | Cycles, components, topological sort |

---

## Common Graph Problems

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

## Topological Sort

```cpp
void topoHelper(vector<vector<int>>& adj, int node, vector<bool>& visited, stack<int>& st) {
    visited[node] = true;
    for (int neighbour : adj[node])
        if (!visited[neighbour])
            topoHelper(adj, neighbour, visited, st);
    st.push(node); // push after all descendants are processed
}

vector<int> topologicalSort(vector<vector<int>>& adj, int V) {
    vector<bool> visited(V, false);
    stack<int> st;
    for (int i = 0; i < V; i++)
        if (!visited[i]) topoHelper(adj, i, visited, st);
    vector<int> result;
    while (!st.empty()) { result.push_back(st.top()); st.pop(); }
    return result;
}
```

---

## Time Complexity

| Algorithm | Time | Space |
|---|---|---|
| BFS | O(V + E) | O(V) |
| DFS | O(V + E) | O(V) |
| Dijkstra | O((V + E) log V) | O(V) |
| Topological Sort | O(V + E) | O(V) |

---

Graphs are where everything comes together. BFS uses a queue, DFS uses recursion/stack, Dijkstra uses a heap. Every prior topic feeds into this one.