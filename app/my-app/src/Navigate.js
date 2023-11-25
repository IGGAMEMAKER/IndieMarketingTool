const domain = 'https://releasefaster.com'

export const refresh = (time = 800) => {
  setTimeout(() => window.location.reload(true), time)
}

export const openNewProject = newId => {
  // var newUrl = 'http://www.indiemarketingtool.com/projects/' + newId
  navigate('/projects/' + newId)
}

export const navigate = url => {
  window.location.href = domain + url
}