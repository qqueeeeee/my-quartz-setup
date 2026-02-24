A linked list is a collection of nodes where each node holds some data and a pointer to the next node. Unlike [[Arrays]], the elements are not stored contiguously in memory. Each node can be anywhere in memory, and the pointers are what connect them together.

---

## How it actually looks in memory

In an array, elements are packed together so index math works. In a linked list, node A might be at address 100, node B at address 450, node C at address 230. They're scattered. The only way to get from A to C is to follow the chain: A tells you where B is, B tells you where C is.

This is why you can't do O(1) access by index. To get to index 4 you have to start at the head and hop 4 times. That's O(n).

---

## Types of Linked Lists

**Singly Linked List** - each node points to the next one only. You can only traverse forward.

```
[data|next] -> [data|next] -> [data|next] -> nullptr
```

**Doubly Linked List** - each node has a pointer to both next and previous. You can traverse in both directions. Costs more memory (extra pointer per node) but makes operations like deletion easier since you don't need to track the previous node manually.

```
nullptr <- [prev|data|next] <-> [prev|data|next] <-> [prev|data|next] -> nullptr
```

**Circular Linked List** - the last node points back to the head instead of nullptr. Used in things like round-robin scheduling. Less common in DSA problems but good to know it exists.

---

## Time Complexity

| Operation | Complexity | Why |
|---|---|---|
| Access by index | O(n) | Must traverse from head |
| Search | O(n) | Must traverse |
| Insert at head | O(1) | Just rewire pointers |
| Insert at tail | O(1) | If you keep a tail pointer |
| Insert in middle | O(n) | Traverse to position first |
| Delete at head | O(1) | Just move head forward |
| Delete in middle | O(n) | Traverse to position first |

The insert/delete being O(1) is only true once you're already at the position. The traversal to get there is what costs O(n). If you have a reference to the node directly, insertion next to it is O(1).

---

## When to reach for a linked list

When you're doing a lot of insertions and deletions and don't need random access. Good examples are implementing stacks, queues, or anything where you're constantly adding/removing from the ends.

In practice, [[Arrays]] (vectors) are often faster in the real world even for insertions because of [[Cache Locality]]. Memory that's contiguous is faster to access because of how CPU caches work. Linked list nodes are scattered in memory so every hop is potentially a cache miss. Worth knowing even if it doesn't change DSA problem solving much.

---
## In C++

You define a Node struct and build the list by wiring nodes together manually. The list itself just needs to keep track of the head (and optionally tail).

```cpp
struct Node {
    int data;
    Node* next;
    Node(int val) : data(val), next(nullptr) {}
};

struct LinkedList {
    Node* head;
    LinkedList() : head(nullptr) {}

    // insert at head, O(1)
    void prepend(int val) {
        Node* newNode = new Node(val);
        newNode->next = head;
        head = newNode;
    }

    // insert at tail, O(n) here since no tail pointer
    void append(int val) {
        Node* newNode = new Node(val);
        if (!head) { head = newNode; return; }
        Node* curr = head;
        while (curr->next) curr = curr->next;
        curr->next = newNode;
    }

    // delete by value
    void remove(int val) {
        if (!head) return;
        if (head->data == val) {
            Node* temp = head;
            head = head->next;
            delete temp;
            return;
        }
        Node* curr = head;
        while (curr->next && curr->next->data != val)
            curr = curr->next;
        if (curr->next) {
            Node* temp = curr->next;
            curr->next = curr->next->next;
            delete temp;
        }
    }

    // print the list
    void print() {
        Node* curr = head;
        while (curr) {
            cout << curr->data << " -> ";
            curr = curr->next;
        }
        cout << "nullptr" << endl;
    }
};
```

Always `delete` nodes you remove. You allocated them on the heap with `new`, nobody is cleaning them up for you.

For a doubly linked list you just add a `prev` pointer to the Node struct and update it during every insert/delete operation.

---

## C++ STL

C++ has `list<T>` (doubly linked) and `forward_list<T>` (singly linked) in the STL. You'll rarely use them for DSA problems since most problems expect you to implement it yourself, but they exist.

```cpp
#include <list>
list<int> l;
l.push_back(1);
l.push_front(0);
l.pop_back();
```

---

Linked lists are also the foundation for [[Stacks]] and [[Queues]], which are just linked lists with restricted access patterns.
