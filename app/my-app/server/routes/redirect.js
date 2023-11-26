const redirect = (res, url, actualRedirect = true) => {
  if (actualRedirect)
    res.redirect(url)
  else
    res.json({redirectTo: url})
}

module.exports = {
  redirect
}