Two pointers is a technique where you maintain two indices into an array and move them strategically to solve a problem in O(n) that would naively require O(n²).

It's not a data structure, it's a pattern. Once you recognize it, a whole class of problems becomes obvious.

---

## The Core Idea

Instead of checking every pair of elements with a nested loop (O(n²)), you use two pointers that move intelligently based on what you observe. Because each pointer only moves forward, the total number of steps across both pointers is at most 2n, giving you O(n).

The key condition: the array usually needs to be sorted, or the problem has some monotonic property you can exploit.

---

## Pattern 1: Opposite ends

Two pointers start at opposite ends of the array and move toward each other. Stop when they meet.

Classic example — **Two Sum on a sorted array**: find two numbers that add to a target.

```
sorted arr = [1, 3, 5, 7, 9], target = 10

left = 0 (value 1), right = 4 (value 9)
1 + 9 = 10 → found

If sum < target: move left right (need bigger sum)
If sum > target: move right left (need smaller sum)
```

```cpp
vector<int> twoSum(vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) return {left, right};
        else if (sum < target) left++;
        else right--;
    }
    return {};
}
```

This works because the array is sorted — moving left right always increases the sum, moving right left always decreases it.

Other problems using this pattern: valid palindrome, container with most water, 3Sum.

---

## Pattern 2: Same direction (slow and fast)

Both pointers start at the same end and move in the same direction but at different speeds or conditions.

Classic example — **Remove duplicates from sorted array in-place**:

```cpp
int removeDuplicates(vector<int>& arr) {
    int slow = 0;
    for (int fast = 1; fast < arr.size(); fast++) {
        if (arr[fast] != arr[slow]) {
            slow++;
            arr[slow] = arr[fast];
        }
    }
    return slow + 1;
}
```

`slow` tracks where to write the next unique element. `fast` scans through everything. When fast finds something new, slow advances and writes it.

Other problems: move zeroes to end, remove element, partition array.

---

## Pattern 3: Fast and slow (Floyd's cycle detection)

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

## Recognizing when to use it

Look for these signals in a problem:
- Sorted array + find pair/triplet with some property
- In-place modification of an array
- Cycle detection in a linked list
- Finding the middle of a linked list
- Palindrome checking

If you see a nested loop in your first solution and the array is sorted, two pointers can probably replace it.

---

## Time and Space

**Time:** O(n) — each pointer moves at most n steps total
**Space:** O(1) — just two index variables, no extra space

This is the main appeal. O(n) time and O(1) space is hard to beat.

---

Two pointers is one of the most frequently tested patterns in interviews. It's simple once you see it but requires recognizing the right moment to apply it.