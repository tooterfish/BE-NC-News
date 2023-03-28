const data = require('../db/data/test-data')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')

const request = require('supertest')

const app = require('../app')
const { sort } = require('../db/data/test-data/articles')

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
      expect(topics).toBeInstanceOf(Array)
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

describe('GET /api/articles', () => {
  test('200: respond with an array of article objects with all article properties + comment_count', () => {
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
  })
  test('200: by default articles should be sorted by created_at in descending order', () => {
    return request(app).get('/api/articles')
    .expect(200)
    .then((response) => {
      const { articles } = response.body
      expect(articles).toBeSortedBy('created_at', { descending: true })
    })
  })
})

describe('GET /api/articles/:article_id/comments', () => {
  test('200: respond with array of comments for given article_id', () => {
    const expected = {
      comment_id: expect.any(Number),
      votes: expect.any(Number),
      created_at: expect.any(String),
      author: expect.any(String),
      body: expect.any(String),
      article_id: expect.any(Number)
    }
    return request(app).get('/api/articles/1/comments')
    .expect(200)
    .then((response) => {
      const { comments } = response.body
      expect(comments).toBeInstanceOf(Array)
      expect(comments).toHaveLength(11)
      comments.forEach((comment) => {
        expect(comment).toEqual(expected)
      })
    })
  })
  test('200: comments should be sorted with most recent comments first', () => {
    return request(app).get('/api/articles/1/comments')
    .expect(200)
    .then((response) => {
      const { comments } = response.body
      expect(comments).toBeSortedBy('created_at', { descending: false })
    })
  })
  test('200: respond with an empty array if article for given id has no comments', () => {
    return request(app).get('/api/articles/4/comments')
    .expect(200)
    .then((response) => {
      const { comments } = response.body
      expect(comments).toEqual([])
    })
  })
  test('400: respond with 400 bad request if given invalid article_id', () => {
    return request(app).get('/api/articles/article/comments')
    .expect(400)
    .then((response) => {
      const { msg } = response.body
      expect(msg).toBe('invalid input syntax')
    })
  })
  test('404: respond with 404 not found if article for given id does not exist', () => {
    return request(app).get('/api/articles/999999/comments')
    .expect(404)
    .then((response) => {
      const { msg } = response.body
      expect(msg).toBe('article not found')
    })
  })
})

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