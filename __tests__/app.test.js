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

describe('GET /api/articles/:article_id', () => {
  test('200: respond with an article object corresponding with given id', () => {
    const expected = {
      article_id: 1,
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: '2020-07-09T20:11:00.000Z',
      votes: 100,
      article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
    }
    return request(app).get('/api/articles/1')
    .expect(200)
    .then((response) => {
      const { article } = response.body
      expect(article).toEqual(expected)
    })
  })
  test('404: respond with 404 not found if article of given id does not exist', () => {
    return request(app).get('/api/articles/999999')
    .expect(404)
    .then((response) => {
      const { msg } = response.body
      expect(msg).toBe('article not found')
    })
  })
})