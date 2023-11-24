// TODO duplicated in routes/users.js
const AUTHENTICATION_FAILED_ERROR = 'AUTHENTICATION_FAILED_ERROR'

const customErrorHandler = (err, req, res, next) => {
  console.error('custom error handler', req.url, req.method)
  if (err) {
    console.log(err, {err})
  }

  if (err === AUTHENTICATION_FAILED_ERROR) {
    res.redirect('/login')
    return
  }

  next(err)
}
const standardErrorHandler = (err, req, res, next) => {
  console.error(err, req.url);

  res.status(500);
  res.json({ error: err });
}

module.exports = {
  customErrorHandler,
  standardErrorHandler
}