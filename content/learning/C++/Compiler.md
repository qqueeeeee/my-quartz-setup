"Files have no meaning" - unlike Java, C++ doesn't care about the file, it's name or the package hierarchy, it's simply the compiler listening to what files to treat as .cpp files which are basically "Translation Units" which are converted into .obj file. 

However the terms .cpp file and translation units are not interchangeable because if you include all your .cpp files into one big .cpp file then there will be only one translation unit, so the rest of your files won't become a translation unit as they're being included in this massive file. If not include they will be created but this is just to understand why they're not the same thing.

### The First Stage of Compilation: Pre-Processing ###
In this stage the [[Compiler]] takes the pre-processing statements and evaluate them. These statements include items like \#include \#define \#if and \#ifdef. There's also [[pragma]] statements which tell the compilers exactly what to do.

Compiler also does stuff like [[Constant Folding]] and optimisations that will significantly improve your code speed etc.