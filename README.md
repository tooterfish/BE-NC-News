# NC News - Back End

## Link to Hosted Version
https://nc-news-1jvx.onrender.com/api/

## Project Summary
NC News - Back End is a simple web api allowing users to read, post and comment on news articles. It was made to serve the corresponding [NC News - Front End](https://github.com/tooterfish/fe-nc-news) project

Created as part of the Northcoders web development bootcamp, together these serve as portfolio projects to demonstrate skills and understanding of full stack development using node and react.

### Setup
*Built with: Node v19.7.0, Postgres 14.7*

To setup the project locally:

- Clone this repository
- Run ```npm install```
- Set up .env files
- Set up the databases using ```npm run setup-dbs```
- Seed the development database using ```npm run seed``` 

**.env**\
Project will look for enviromnent variables stored in the files ```.env.test``` and ```.env.development```. Add the lines ```PGDATABASE=nc_news_test``` and ```PGDATABASE=nc_news``` to each file respectively.

To run local tests use ```ǹpm test```

A smaller dataset has been provided for testing purposes, this database is re-seeded before each test is run.
