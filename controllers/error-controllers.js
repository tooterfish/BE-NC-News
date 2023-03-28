exports.handleErrors = (err, req, res, next) => {
  if (err.status) handleStatusErrors(err, res)
  else if (err.code) handleDBErrors(err, res)
  else handleUnknownErrors(err)
}

const handleStatusErrors = (err, res) => {
  res.status( err.status ).send( { msg: err.msg } )
}

const handleDBErrors = (err, res) => {
  if (err.code === '22P02' ) res.status(400).send({ msg: 'invalid input syntax'})
  if (err.code === '23503' ) res.status(404).send({ msg: 'key not present' })
}

const handleUnknownErrors = (err) => {
  console.log(err, "<<<<<<<<<< unhandled error")
}