const data = require('../db/data/test-data')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const request = require('supertest')
const app = require('../app')
const endpointsFile = require('../endpoints.json')

beforeEach(() => seed(data))
afterAll(() => db.end())

describe('GET /api', () => {
  test('respond with an object with the contents of endpoints.json file ', () => {
    return request(app).get('/api')
    .expect(200)
    .then((response) => {
      const { endpoints } = response.body
      expect(endpoints).toEqual(endpointsFile)
    })
  })
})

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
  test('200: respond with an article object corresponding with given id with all article properties + comment_count', () => {
    const expected = {
      article_id: 1,
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: '2020-07-09T20:11:00.000Z',
      votes: 100,
      comment_count: 11,
      article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
    }
    return request(app).get('/api/articles/1')
    .expect(200)
    .then((response) => {
      const { article } = response.body
      expect(article).toEqual(expected)
    })
  })
  test('200: article object should return properly if it has 0 comments', () => {
    return request(app).get('/api/articles/2')
    .expect(200)
    .then((response) => {
      const { article } = response.body
      expect(article.comment_count).toBe(0)
    })
  });
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
  test('200: filter articles by topic given in topic query', () => {
    return request(app).get('/api/articles?topic=mitch')
    .expect(200)
    .then((response) => {
      const { articles } = response.body
      expect(articles).toHaveLength(11)
      articles.forEach((article) => {
        expect(article.topic).toBe('mitch')
      })
    })
  })
  test('200: respond with empty array if given topic is valid but contains no articles', () => {
    return request(app).get('/api/articles?topic=paper')
    .expect(200)
    .then((response) => {
      const { articles } = response.body
      expect(articles).toEqual([])
    })
  })
  test('404: respond with 404 not found if given topic is not in topics', () => {
    return request(app).get('/api/articles?topic=marmalade')
    .expect(404)
    .then((response) => {
      const { msg } = response.body
      expect(msg).toBe('topic not found')
    })
  })
  test('200: sort articles by given sort_by query', () => {
    return request(app).get('/api/articles?sort_by=title')
    .expect(200)
    .then((response) => {
      const { articles } = response.body
      expect(articles).toBeSortedBy('title', { descending: true })
    })
  })
  test('400: respond with 400 if given sort_by query is not valid', () => {
    return request(app).get('/api/articles?sort_by=hammers')
    .expect(400)
    .then((response) => {
      const { msg } = response.body
      expect(msg).toBe('invalid query: sort_by')
    })
  })
  test('200: sort articles in order of given order query', () => {
    return request(app).get('/api/articles?order=ASC')
    .expect(200)
    .then((response) => {
      const { articles } = response.body
      expect(articles).toBeSortedBy('created_at', { descending: false })
    })
  })
  test('400: respond with 400 if given order query not valid', () => {
    return request(app).get('/api/articles?order=TOP')
    .expect(400)
    .then((response) => {
      const { msg } = response.body
      expect(msg).toBe('invalid query: order')
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

describe('POST /api/articles/:article_id/comments', () => {
  test('201: respond with new comment object', () => {
    const body = {
      username: 'icellusedkars',
      body: 'That\'s what they want you to think!'
    }
    const expected = {
      comment_id: expect.any(Number),
      body: 'That\'s what they want you to think!',
      article_id: 2,
      author: 'icellusedkars',
      votes: 0,
      created_at: expect.any(String)
    }
    return request(app).post('/api/articles/2/comments')
    .send(body)
    .expect(201)
    .then((response) => {
      const { comment } = response.body
      expect(comment).toEqual(expected)
    })
  })
  test('400: respond with 400 if given invalid article_id', () => {
    const body = {
      username: 'icellusedkars',
      body: 'That\'s what they want you to think!'
    }
    return request(app).post('/api/articles/not-a-number/comments')
    .send(body)
    .expect(400)
    .then((response) => {
      const { msg } = response.body
      expect(msg).toBe('invalid input syntax')
    })
  })
  test('404: respond with 404 if article of given article_id does not exist', () => {
    const body = {
      username: 'icellusedkars',
      body: 'That\'s what they want you to think!'
    }
    return request(app).post('/api/articles/999999/comments')
    .send(body)
    .expect(404)
    .then((response) => {
      const { msg } = response.body
      expect(msg).toBe('key not present')
    })
  })
  test('404: respond with 404 if user of given username does not exist', () => {
    const body = {
      username: 'socrates',
      body: 'I drank what!?'
    }
    return request(app).post('/api/articles/2/comments')
    .send(body)
    .expect(404)
    .then((response) => {
      const { msg } = response.body
      expect(msg).toBe('key not present')
    })
  })
  test('400: respond with 400 if request body does not have required properties', () => {
    const body = {
    }
    return request(app).post('/api/articles/2/comments')
    .send(body)
    .expect(400)
    .then((response) => {
      const { msg } = response.body
      expect(msg).toBe('invalid body properties')
    })
  })
})

describe('PATCH api/articles/:article_id', () => {
  test('200: responds with given article with votes modified by inc_votes parameter', () => {
    const body = {
      inc_votes: 1
    }
    const expected = {
      article_id: 1,
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: '2020-07-09T20:11:00.000Z',
      votes: 101,
      article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
    }
    return request(app).patch('/api/articles/1')
    .send(body)
    .expect(200)
    .then((response) => {
      const { article } = response.body
      expect(article).toEqual(expected)
    })
  })
  test('200: responds with given article with votes modified by negative inc_votes parameter', () => {
    const body = {
      inc_votes: -101
    }
    const expected = {
      article_id: 1,
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: '2020-07-09T20:11:00.000Z',
      votes: -1,
      article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
    }
    return request(app).patch('/api/articles/1')
    .send(body)
    .expect(200)
    .then((response) => {
      const { article } = response.body
      expect(article).toEqual(expected)
    })
  })
  test('400: respond with 400 if article_id is invalid type', () => {
    const body = {
      inc_votes: 1
    }
    return request(app).patch('/api/articles/not-a-number')
    .send(body)
    .expect(400)
    .then((response) => {
      const { msg } = response.body
      expect(msg).toBe('invalid input syntax')
    })
  })
  test('404: respond with 404 if article of given article_id does not exist', () => {
    const body = {
      inc_votes: 1
    }
    return request(app).patch('/api/articles/999999')
    .send(body)
    .expect(404)
    .then((response) => {
      const { msg } = response.body
      expect(msg).toBe('article not found')
    })
  })
  test('400: respond with 400 if request body does not have required properties', () => {
    const body = {
    }
    return request(app).patch('/api/articles/1')
    .send(body)
    .expect(400)
    .then((response) => {
      const { msg } = response.body
      expect(msg).toBe('invalid body properties')
    })
  })
  test('400: respond with 400 if inc_votes is incorrect type ', () => {
    const body = {
      inc_votes: 'not-a-number'
    }
    return request(app).patch('/api/articles/1')
    .send(body)
    .expect(400)
    .then((response) => {
      const { msg } = response.body
      expect(msg).toBe('invalid input syntax')
    })
  })
})

describe('GET /api/users', () => {
  const expected = {
    username: expect.any(String),
    name: expect.any(String),
    avatar_url: expect.any(String)
  }
  test('200: responds with array of user objects with the properties: username, name, avatar_url', () => {
    return request(app).get('/api/users')
    .expect(200)
    .then((response) => {
      const { users } = response.body
      expect(users).toBeInstanceOf(Array)
      expect(users).toHaveLength(4)
      users.forEach((user) => {
        expect(user).toEqual(expected)
      })
    })
  })
})

describe('DELETE /api/comments/:comment_id', () => {
  test('should delete comment with comment_id from database', () => {
    return request(app).delete('/api/comments/1')
    .then(() => {
      db.query('SELECT FROM comments WHERE comment_id = 1')
    .then((result) => {
      expect(result.rows).toEqual([])
      })
    })
  })
  test('204: responds with 204 on successful deletion', () => {
    return request(app).delete('/api/comments/1')
    .expect(204)
  })
  test('400: responds with 400 if comment_id is not valid type', () => {
    return request(app).delete('/api/comments/not-a-number')
    .expect(400)
    .then((response) => {
      const { msg } = response.body
      expect(msg).toBe('invalid input syntax')
    })
  })
  test('404: responds with 404 if comment of given comment_id does not exist', () => {
    return request(app).delete('/api/comments/999999')
    .expect(404)
    .then((response) => {
      const { msg } = response.body
      expect(msg).toBe('comment not found')
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