const { pregenQueriesSets, addAllowedArticleTopic, qs } = require('../app-utils')
const db = require('../db/connection')

beforeEach(() => pregenQueriesSets())
afterAll(() => db.end())

describe('pregenQueriesSets()', () => {
  test('allowedArticleSorts key on qs contains set with all allowed sort queries for fetchArticles', () => {
    const allowedSorts = ['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'votes', 'comment_count']
    expect(qs.allowedArticleSorts).toBeInstanceOf(Set)
    allowedSorts.forEach(sortBy => expect(qs.allowedArticleSorts.has(sortBy)).toBe(true))
  })
  test('allowedOrders key on qs contains set with all allowed order queries for fetchArticles', () => {
    const allowedOrders = ['ASC', 'DESC']
    expect(qs.allowedOrders).toBeInstanceOf(Set)
    allowedOrders.forEach(orderBy => expect(qs.allowedOrders.has(orderBy)).toBe(true))
  })
  test('allowedArticleTopics key on qs contains set with all allowed topic filters for fetchArticles at time of server start-up', () => {
    const allowedTopics = []
    expect(qs.allowedArticleTopics).toBeInstanceOf(Set)
    allowedTopics.forEach(topic => expect(qs.allowedArticleTopics.has(topic)).toBe(true))
  })
})

describe('addAllowedArticleTopic()', () => {
  test('given a string should add the string to the qs.allowedArticleTopics set', () => {
    const newTopic = 'aeroplane'
    addAllowedArticleTopic(newTopic)
    expect(qs.allowedArticleTopics.has(newTopic)).toBe(true)
  })
})