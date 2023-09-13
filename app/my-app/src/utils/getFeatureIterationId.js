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

export const getRiskIterationId = (project, riskId) => {
  var used = 0;

  project.iterations.forEach(it => {
    it.goals.forEach(g => {
      if (g.riskId === riskId)
        used = it.id
    })
  })

  return used
}