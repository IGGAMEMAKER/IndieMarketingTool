import Dispatcher from './Dispatcher';
import {
  AUDIENCE_ADD,
  AUDIENCE_EDIT_STRATEGY,
  AUDIENCE_DESCRIPTION_EDIT,
  AUDIENCE_NAME_EDIT,
  MONETIZATION_ADD,
  MONETIZATION_AUDIENCE_ADD,
  MONETIZATION_AUDIENCE_REMOVE,
  MONETIZATION_EDIT_BENEFIT,
  MONETIZATION_EDIT_NAME,
  MONETIZATION_EDIT_PRICE,
  RISK_EDIT_NAME,
  RISK_ADD,
  RISK_ORDER_CHANGE,
  MONETIZATION_BENEFIT_ADD,
  MONETIZATION_BENEFIT_REMOVE,
  PROJECT_LOAD,
  PROJECT_SAVE,
  RISK_SOLUTION_ADD,
  RISK_SOLUTION_EDIT,
  RISK_REMOVE,
  RISK_SOLUTION_REMOVE,
  MONETIZATION_EDIT_DESCRIPTION,
  MONETIZATION_REMOVE,
  PROFILE_LOAD,
  PROJECT_ADD,
  PROJECT_REMOVE,
  PROJECT_RENAME, AUDIENCE_REMOVE, CHANNELS_ADD, CHANNELS_REMOVE, CHANNELS_NAME_EDIT
} from './constants/actionConstants';

export function loadProject(projectId) {
  Dispatcher.dispatch({
    actionType: PROJECT_LOAD,
    projectId
  })
}

export function editName(projectId, name) {
  Dispatcher.dispatch({
    actionType: PROJECT_RENAME,
    projectId,
    name
  })
}

export function removeProject(projectId) {
  Dispatcher.dispatch({
    actionType: PROJECT_REMOVE,
    projectId
  })
}

export function addProject(name, appType) {
  Dispatcher.dispatch({
    actionType: PROJECT_ADD,
    name,
    appType
  })
}

export function loadProfile() {
  Dispatcher.dispatch({
    actionType: PROFILE_LOAD
  })
}

export function saveProject(project) {
  Dispatcher.dispatch({
    actionType: PROJECT_SAVE,
    project
  })
}

export function addAudience(name) {
  Dispatcher.dispatch({
    actionType: AUDIENCE_ADD,
    name,
  });
}

export function removeAudience(audienceIndex) {
  Dispatcher.dispatch({
    actionType: AUDIENCE_REMOVE,
    audienceIndex,
  });
}

export function editAudienceName(name, audienceIndex) {
  Dispatcher.dispatch({
    actionType: AUDIENCE_NAME_EDIT,
    name,
    audienceIndex
  });
}

export function editAudienceDescription(description, audienceIndex) {
  Dispatcher.dispatch({
    actionType: AUDIENCE_DESCRIPTION_EDIT,
    description,
    audienceIndex
  })
}

export function editAudienceStrategy(strategy, audienceIndex, textIndex) {
  console.log({strategy, audienceIndex, textIndex})
  Dispatcher.dispatch({
    actionType: AUDIENCE_EDIT_STRATEGY,
    strategy,
    audienceIndex,
    textIndex
  })
}

// ----------- MONETIZATION --------------
export function addMonetizationPlan(name) {
  Dispatcher.dispatch({
    actionType: MONETIZATION_ADD,
    name,
  });
}
export function removeMonetizationPlan(monetizationIndex) {
  Dispatcher.dispatch({
    actionType: MONETIZATION_REMOVE,
    monetizationIndex,
  });
}

export function editMonetizationName(monetizationIndex, name) {
  Dispatcher.dispatch({
    actionType: MONETIZATION_EDIT_NAME,
    monetizationIndex,
    name
  })
}

export function editMonetizationBenefit(monetizationIndex, benefitIndex, benefit) {
  Dispatcher.dispatch({
    actionType: MONETIZATION_EDIT_BENEFIT,
    monetizationIndex,
    benefitIndex,
    benefit
  })
}

export function editMonetizationDescription(monetizationIndex, description) {
  Dispatcher.dispatch({
    actionType: MONETIZATION_EDIT_DESCRIPTION,
    monetizationIndex,
    description
  })
}

export function removeBenefitFromMonetizationPlan(monetizationIndex, benefitIndex) {
  Dispatcher.dispatch({
    actionType: MONETIZATION_BENEFIT_REMOVE,
    monetizationIndex,
    benefitIndex
  })
}

export function addBenefitToMonetizationPlan(monetizationIndex, benefit) {
  Dispatcher.dispatch({
    actionType: MONETIZATION_BENEFIT_ADD,
    monetizationIndex,
    benefit
  })
}

export function editMonetizationPrice(monetizationIndex, price) {
  Dispatcher.dispatch({
    actionType: MONETIZATION_EDIT_PRICE,
    monetizationIndex,
    price: parseInt(price)
  })
}

export function attachAudienceToMonetizationPlan(audienceIndex, monetizationIndex) {
  Dispatcher.dispatch({
    actionType: MONETIZATION_AUDIENCE_ADD,
    audienceIndex,
    monetizationIndex
  })
}

export function detachAudienceFromMonetizationPlan(audienceID, monetizationIndex) {
  Dispatcher.dispatch({
    actionType: MONETIZATION_AUDIENCE_REMOVE,
    audienceID,
    monetizationIndex
  })
}

export function editRiskName(index, name) {
  Dispatcher.dispatch({
    actionType: RISK_EDIT_NAME,
    riskIndex: index,
    name
  })
}

export function addRisk(name) {
  Dispatcher.dispatch({
    actionType: RISK_ADD,
    name
  })
}

export function removeRisk(riskIndex) {
  Dispatcher.dispatch({
    actionType: RISK_REMOVE,
    riskIndex
  })
}

export function removeRiskSolution(riskIndex, solutionIndex) {
  Dispatcher.dispatch({
    actionType: RISK_SOLUTION_REMOVE,
    riskIndex,
    solutionIndex
  })
}

export function addRiskSolution(riskIndex, solution) {
  Dispatcher.dispatch({
    actionType: RISK_SOLUTION_ADD,
    riskIndex,
    solution
  })
}

export function editRiskSolution(riskIndex, solutionIndex, solution) {
  Dispatcher.dispatch({
    actionType: RISK_SOLUTION_EDIT,
    riskIndex,
    solutionIndex,
    solution
  })
}

export function changeRiskOrder(index1, index2) {
  Dispatcher.dispatch({
    actionType: RISK_ORDER_CHANGE,
    index1,
    index2
  })
}


export function addChannel(url) {
  Dispatcher.dispatch({
    actionType: CHANNELS_ADD,
    url
  })
}


export function removeChannel(channelIndex) {
  Dispatcher.dispatch({
    actionType: CHANNELS_REMOVE,
    channelIndex
  })
}


export function editChannelName(channelIndex, name) {
  Dispatcher.dispatch({
    actionType: CHANNELS_NAME_EDIT,
    channelIndex,
    name
  })
}

export default {
  loadProject,
  loadProfile,

  addProject,
  editName,
  removeProject,

  addAudience,
  removeAudience,
  editAudienceName,
  editAudienceDescription,
  editAudienceStrategy,

  addMonetizationPlan,
  removeMonetizationPlan,
  editMonetizationName,
  editMonetizationPrice,
  editMonetizationBenefit,
  editMonetizationDescription,
  addBenefitToMonetizationPlan,
  removeBenefitFromMonetizationPlan,

  attachAudienceToMonetizationPlan,
  detachAudienceFromMonetizationPlan,

  addRisk,
  removeRisk,
  addRiskSolution,
  removeRiskSolution,
  editRiskSolution,
  editRiskName,
  changeRiskOrder,

  addChannel,
  removeChannel,
  editChannelName,
}

