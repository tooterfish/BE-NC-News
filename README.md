# NC News

## Link to Hosted Version
https://nc-news-1jvx.onrender.com/api/

## Project Summary
NC News is a simple web api allowing users to read, post and comment on news articles.

Created as part of the Northcoder's web development bootcamp, it serves as a portfolio project to demonstrate skills and understanding of building a backend web api using node and postgres.

### Setup
*Built with: Node v19.7.0, Postgres 14.7*

To setup the project locally:
- Clone this repository
- Run ```npm install```
- Set up the databases using ```npm run setup-dbs```
- Seed the development database using ```npm run seed``` 

**.env**\
Project will look for enviromnent variables stored in the files ```.env.test``` and ```.env.development```. Add the lines ```PGDATABASE=nc_news_test``` and ```PGDATABASE=nc_news``` to each file respectively.

To run local tests use ```ǹpm test```

A smaller dataset has been provided for testing purposes, this database is re-seeded before each test is run.
