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

# Topological Sort

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

split out of [[Graphs]].
