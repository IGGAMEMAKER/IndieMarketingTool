const domain = 'https://releasefaster.com'

export const refresh = (time = 800) => {
  setTimeout(() => window.location.reload(true), time)
}

// https://stackoverflow.com/questions/1655065/redirecting-to-a-relative-url-in-javascript
// https://stackoverflow.com/questions/503093/how-do-i-redirect-to-another-webpage/506004#506004
export const navigate = url => {
  // window.location.href = domain + url
  window.location.href = url
}

export const openNewProject = newId => {
  // var newUrl = 'http://www.indiemarketingtool.com/projects/' + newId
  navigate('/projects/' + newId)
}

export const autoRedirect = (response) => {
  if (response.redirectTo)
    navigate(response.redirectTo)
}