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

# Floyd's Cycle Detection

One pointer moves one step at a time, the other moves two. If there's a cycle, the fast pointer will eventually lap the slow one and they'll meet.

Used for detecting cycles in [[Linked Lists]]:

```cpp
bool hasCycle(Node* head) {
    Node* slow = head;
    Node* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}
```

Also used for finding the middle of a linked list — when fast reaches the end, slow is at the middle.

---

split out of [[Two Pointers]].
