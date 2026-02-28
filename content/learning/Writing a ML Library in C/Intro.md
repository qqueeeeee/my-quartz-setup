We're going to write a ML Library in C which is going to be able to understand the digits in the MNIST Dataset.

To write a ML Library in C we need some way to;
1) Do math (with Tensors)
2) Find Gradients
3) A layer that ties everything together

To write a ML model, it's literally just a function that maps inputs to outputs. The input can be anything, could be like, a huge bunch of text and the output could be the probability of x being the next word etc. 

For our purpose the input would be an image with a number handwritten or whatever, the output would be a probability distribution where the value at the output's number will be a higher probability. 
