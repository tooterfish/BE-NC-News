const db = require('./db/connection')
const qs = {}

async function pregenQueriesSets() {
    const querySets = {}
    qs.allowedArticleSorts = new Set(['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'votes', 'comment_count'])
    qs.allowedOrders = new Set(['ASC', 'DESC'])
    qs.allowedArticleTopics = new Set(await pregenAllowedTopics())
}

function pregenAllowedTopics() {
  return db.query(`SELECT slug FROM topics`)
  .then((result) => {
    return result.rows.map(topic => topic.slug)
  })
}

function addAllowedArticleTopic(newTopic) {
  qs.allowedArticleTopics.add(newTopic)
}

module.exports = { qs, pregenQueriesSets, addAllowedArticleTopic }