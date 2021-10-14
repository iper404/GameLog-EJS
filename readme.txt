installations required:
JSON Files
npm init -y

In JSON File: main: server.js

npm i express ejs express-ejs-layouts

npm i --savedev nodemon

In JSON File:
Scripts: start: node server.js
devStart: nodemon server.js

Install MongoDB
npm i mongoose
	place Database URL in .env file

set up .env library for local 
	npm i --save-dev dotenv