A reference is an alias, another name for the same variable. Once set, it can't be repointed. They do pretty much what a pointer does, they're basically syntax sugar for pointers as anything a reference does, a pointer can do, but it just looks cleaner.

int a = 10;
int& ref = a;  // ref IS a, not a copy
ref = 20;      // a is now 20