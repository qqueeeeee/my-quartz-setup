
A trie (pronounced "try", short for retrieval) is a tree-like data structure used to store strings where each node represents a single character. The path from the root to any node spells out a prefix.

Unlike a [[Hash Maps|hash map]] which stores complete strings, a trie shares prefixes between words. All words starting with "ca" share the same path down to the 'a' node. This makes tries extremely efficient for prefix-based operations.

---

## Structure

The root node is empty. Each node has up to 26 children (for lowercase English letters), one per possible character. A boolean flag on each node marks whether a complete word ends there.

```
Insert "cat", "car", "card", "dog":

        root
       /    \
      c      d
      |      |
      a      o
     / \     |
    t   r    g*
    *   |
        d*
        |
        (card continues...)

* = end of word marker
```

"cat" and "car" share the path c → a before branching. That shared prefix is the whole point.

---

## Core Operations

**Insert** — walk down the trie character by character, creating nodes as needed. Mark the last node as end of word. O(L) where L is word length.

**Search** — walk down character by character. If any character is missing, word doesn't exist. Check end-of-word flag at the last node. O(L).

**Starts with (prefix search)** — same as search but don't check the end-of-word flag, just check if the path exists. O(L).

All operations are O(L) where L is the length of the string. Independent of how many words are stored.

---

## When to use a trie

Any problem involving prefixes, autocomplete, or word searches.

**Autocomplete** — given a prefix, find all words that start with it. Walk to the prefix node, then DFS from there.

**Spell checker** — check if a word exists or find the closest match.

**Word search in a grid** — [[Backtracking]] through a grid while checking a trie is much faster than checking each word independently.

**Longest common prefix** — find where paths diverge in the trie.

If you're just doing exact lookups with no prefix operations, a [[Hash Maps|hash map]] is simpler. Tries shine when prefixes matter.

---

## Time and Space

| Operation | Time |
|---|---|
| Insert | O(L) |
| Search | O(L) |
| Prefix search | O(L) |
| Delete | O(L) |

Space: O(total characters across all words × 26) in the worst case. More than a hash map for the same data, but prefix operations are something a hash map can't do efficiently.

---

## In C++

```cpp
struct TrieNode {
    TrieNode* children[26];
    bool isEnd;

    TrieNode() : isEnd(false) {
        for (int i = 0; i < 26; i++)
            children[i] = nullptr;
    }
};

struct Trie {
    TrieNode* root;
    Trie() { root = new TrieNode(); }

    void insert(string word) {
        TrieNode* curr = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!curr->children[idx])
                curr->children[idx] = new TrieNode();
            curr = curr->children[idx];
        }
        curr->isEnd = true;
    }

    bool search(string word) {
        TrieNode* curr = root;
        for (char c : word) {
            int idx = c - 'a';
            if (!curr->children[idx]) return false;
            curr = curr->children[idx];
        }
        return curr->isEnd;
    }

    bool startsWith(string prefix) {
        TrieNode* curr = root;
        for (char c : prefix) {
            int idx = c - 'a';
            if (!curr->children[idx]) return false;
            curr = curr->children[idx];
        }
        return true; // don't check isEnd
    }
};
```

The `c - 'a'` trick converts a character to an index 0-25. 'a' becomes 0, 'b' becomes 1, and so on.

---

Tries are niche but when a problem involves prefixes, they're the perfect tool. Autocomplete and word search problems are the most common places you'll reach for one.
