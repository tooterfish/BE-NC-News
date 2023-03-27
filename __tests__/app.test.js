const data = require('../db/data/test-data')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')

const request = require('supertest')

const app = require('../app')

beforeEach(() => seed(data))
afterAll(() => db.end())

describe('GET /api/topics', () => {
  test('200: responds with an array of topic objects, each with the properties: slug, description', () => {
    const expected = 
    {
      slug: expect.any(String),
      description: expect.any(String)
    }

    return request(app).get('/api/topics')
    .expect(200)
    .then((response) => {
      const { topics } = response.body
      expect(topics).toHaveLength(3)
      topics.forEach((topic) => {
        expect(topic).toEqual(expected)
      })
    })
  })
})