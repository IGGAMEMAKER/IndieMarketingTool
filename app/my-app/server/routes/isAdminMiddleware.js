let devIP;

const getIP = (req) => {
  return req.header('x-forwarded-for') // was ipAddresses ?? returns multiple ips???
}
const isDevIP = (req) => {
  return getIP(req) === devIP
  // return !!req.cookies["isDevIP"]
}



const saveDevIP = (req, res) => {
  const ipAddresses = getIP(req);
  console.log({ipAddresses})
  devIP = ipAddresses

  // res.cookie('isDevIP', true)

  res.json({
    cookieSet: true,
    ipAddresses
  })
}

const flushDevIP = (req, res) => {
  devIP = ''
  // res.cookie('isDevIP', false)

  res.json({
    cookieFlushed: true
  })
}

const isAdminMiddleware = (req, res, next) => {
  if (isDevIP(req)) {
    next()
  } else {
    next('you are not the admin!')
  }
}

module.exports = {
  isAdminMiddleware,
  saveDevIP,
  flushDevIP,

  isDevIP
}