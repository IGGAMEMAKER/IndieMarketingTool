import {getFeatureIterationId} from "./getFeatureIterationId";
import {getByID} from "../utils";

export const getAudienceUsageCount = (monetizationPlans, a) => { // audienceObject
  var usages = [];
  var isUsedInMonetizationPlans = false

  monetizationPlans.forEach((m, i) => {
    // console.log({m})
    if (m.audiences.includes(a.id))
      isUsedInMonetizationPlans = true
  })

  if (isUsedInMonetizationPlans)
    usages.push('monetization plans')

  if (a?.messages?.length)
    usages.push('unique messaging')

  return usages
}

export const getFeatureUsageCount = (project, featureId) => {
  var usages = [];

  var iterationId = getFeatureIterationId(project, featureId)
  if (iterationId) {
    var it = getByID(project.iterations, iterationId)
    usages.push('iteration: ' + it?.description /*+ ' ' + JSON.stringify(it)*/)
  }

  return usages;
}

export const getRiskUsageCount = (project, riskId) => {
  var usages = []


}