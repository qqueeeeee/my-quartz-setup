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

# BFS

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

---

split out of [[Graphs]].
