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
  test('404: respond with 404 article not found if article of given id does not exist', () => {
    return request(app).get('/api/articles/999999')
    .expect(404)
    .then((response) => {
      const { msg } = response.body
      expect(msg).toBe('article not found')
    })
  })
  test('400: respond with 400 bad request if given id is not a valid id', () => {
    return request(app).get('/api/articles/not-a-number')
    .expect(400)
    .then((response) => {
      const { msg } = response.body
      expect(msg).toBe('invalid input syntax')
    })
  })
})

describe.only('GET /api/articles', () => {
  test('200: respond with array of article objects with all properties + comment_count', () => {
    const expected = 
    {
      article_id: expect.any(Number),
      title: expect.any(String),
      topic: expect.any(String),
      author: expect.any(String),
      body: expect.any(String),
      created_at: expect.any(String),
      votes: expect.any(Number),
      article_img_url: expect.any(String),
      comment_count: expect.any(Number)
    }
    let expectedTotalComments = 0
    return request(app).get('/api/articles')
    .expect(200)
    .then((response) => {
      const { articles } = response.body
      expect(articles).toBeInstanceOf(Array)
      expect(articles).toHaveLength(12)
      articles.forEach((article) => {
        expect(article).toEqual(expected)
        expectedTotalComments += article.comment_count
      })
      expect(expectedTotalComments).toBe(18)
    })
  });
});

describe('/*', () => {
  test('404: respond with general 404 if endpoint does not exist', () => {
    return request(app).get('/apu/artucals')
    .expect(404)
    .then((response) => {
      const { msg } = response.body
      expect(msg).toBe('page not found')
    })
  })
})