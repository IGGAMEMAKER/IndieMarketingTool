export const getFeatureIterationId = (project, featureId) => {
  var used = 0;

  project.iterations.forEach(it => {
    it.goals.forEach(g => {
      if (g.featureId === featureId)
        used = it.id
    })
  })

  return used
}