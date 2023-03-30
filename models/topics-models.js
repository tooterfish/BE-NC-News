const db = require('../db/connection')

exports.fetchTopics = () => {
  return db.query(`SELECT slug, description FROM topics`)
  .then((result) => { return result.rows })
}

exports.createTopic = (description, slug) => {
  if (!(description && slug)) return Promise.reject({ status: 400, msg: 'invalid body properties' })
  queryStr = `
  INSERT INTO topics
  (description, slug)
  VALUES
  ($1, $2)
  RETURNING *
  `
  return db.query(queryStr, [ description, slug ])
  .then((result) => { return result.rows[0] })
}