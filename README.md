Project will look for enviromnent variables stored in the files .env.test and .env.development. Use .env-example as a template when setting up your project.

To setup the test/development databases use npm run setup-dbs
To seed the development database use npm run seed
To seed test database with test data add:
  const data = require('../db/data/test-data');
  beforeEach(() => seed(data))
  afterAll(() => db.end())
to the top of your test file.