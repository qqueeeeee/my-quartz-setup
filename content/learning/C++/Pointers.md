A pointer stores the memory address of *something*, this can be anything in our memory - or not in memory, pointers are simply just int variable holding a memory address.

int a = 10;
int* ptr = &a;  // ptr holds the address of a
cout << *ptr;   // dereference: gives you the value at that address → 10
*ptr = 20;      // changes a to 20