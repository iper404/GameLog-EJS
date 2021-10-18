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

DATABASE_URL for .env is
mongodb+srv://user:password@cluster0.npjcq.mongodb.net/test

Current user -> user
Current password -> zzz

install Heroku CLI
heroku login
git push heroku main
	add local variables -> heroku -> settings -> config vars

Set up Mongo DB
	create cluster
	connect -> db user -> paste in connection link + pw

npm i body-parser

npm i multer
multer is used for storing files such as cover images
npm uninstall multer
no longer needed after filepond

use FilePond for storing files and integrating with heroku
insert the scripts into layouts.ejs from documentation for FilePond

install method-override for delete or put requests
npm i method-override
include library in server.js

DO NOT USE A router.get for DELETING BECAUSE IT WILL DELETE EVERYTHING
	use router.delete

to debug try / catch blocks, add:
catch (err){
console.log(err)
...
}