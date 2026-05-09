---
title: "Duplicate Items" 
date: 2026-05-07 
category: concept 
status: seedling 
tags: ["#dsa", "#algorithms", "#concepts"] 
related: ["[[Arrays]]", "[[Hash Maps]]", "[[Sets]]", "[[Two Pointers]]"]
---
The approach I used/use for this is:

```python
visited = set()
for item in items:
	if item in visited: 
		return True
	visited.add(item)
```

But I've seen a lot of people use this instead:
```python

if len(set(items)) == len(items)
	return True
return False
```

Both have time complexity of O(n) and space complexity of O(n)
I like my approach better since on non-worst case scenarios; it finishes faster as, the set() function first finishes turning EVERYTHING into a set and then checks it, but it really doesn't matter that much, this is just to note the reasoning behind why I do that, the difference in compute time can be easily ignored it's very minute.