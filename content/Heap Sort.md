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

# Heap Sort

Build a max heap, then repeatedly extract the max and place it at the end of the array.

```cpp
void heapify(vector<int>& arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;

    if (largest != i) {
        swap(arr[i], arr[largest]);
        heapify(arr, n, largest);
    }
}

void heapSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = n / 2 - 1; i >= 0; i--)  // build max heap
        heapify(arr, n, i);
    for (int i = n - 1; i > 0; i--) {      // extract elements
        swap(arr[0], arr[i]);
        heapify(arr, i, 0);
    }
}
```

O(n log n) time, O(1) space. Not as fast as quicksort in practice but has guaranteed O(n log n) worst case.

---

[[Heaps]] are the go-to whenever a problem involves "top k", "kth largest/smallest", or any scenario where you need fast access to the min or max of a dynamic set.

---

split out of [[Heaps]].
