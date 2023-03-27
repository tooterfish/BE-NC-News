exports.handleErrors = (err, req, res, next) => {
  if (err.status) handleStatusErrors(err, res)
  if (err.code) handleDBErrors(err, res)
  else console.log(err)
}

const handleStatusErrors = (err, res) => {
  res.status( err.status ).send( { msg: err.msg } )
}

const handleDBErrors = (err, res) => {
  if (err.code === '22P02' ) res.status(400).send({ msg: 'invalid input syntax'})
  else console.log(err)
}