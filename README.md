# SQS + TYPESCRIPT SAMPLE PROJECT

## Author
edcampossouza@gmail.com
https://github.com/edcampossouza

## Description
This is a node.js program that continually reads messages from an AWS SQS queue - called the "request queue", processes them and writes a response to another queue - called the "response queue".

## Configuration and Installation
### 1- Configuring environment variables
Create a the file .env in the root of the project, and set the REQUEST_QUEUE_URL and RESPONSE_QUEUE_URL variables. 

You can use the .env.example file as an example

### 2- run ```npm install ```


## Execution
run ```npm start``` to compile the typescript source and execute the program

Alternatively, run ```npm run exec``` to run the compiled javascript source, bypassing the compilation step. You should have run ``` npm run build``` beforehand.




