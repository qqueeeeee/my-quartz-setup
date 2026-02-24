In C++ it is very important to understand Stack and Heap as they serve different purposes and are used very often.

Stack memory is automatic when we declare int x = 5; in a function it is stored in the stack and gets automatically destroyed when the function returns. It's super fast but has limited size.

Heap memory is manual, We call it with "new" and it will stay in the memory until we explicitly delete it. This is where Data Structures live most of the time. 


int x = 5;  //Stack memory 
int* y = new int(5); // Heap memory 
delete y;

Languages like python have garbage collectors which delete automatically but C++ does not, though it has features like unique_ptr and shared_ptr. 