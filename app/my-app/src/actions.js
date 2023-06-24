import Dispatcher from './Dispatcher';
import {
  AUDIENCE_ADD,
  AUDIENCE_EDIT_STRATEGY,
  AUDIENCE_EDIT_DESCRIPTION,
  AUDIENCE_EDIT_NAME,
  MONETIZATION_ADD,
  MONETIZATION_AUDIENCE_ADD,
  MONETIZATION_AUDIENCE_REMOVE,
  MONETIZATION_EDIT_DESCRIPTION,
  MONETIZATION_EDIT_NAME,
  MONETIZATION_EDIT_PRICE,
  RISK_EDIT_NAME,
  RISK_ADD,
  RISK_ORDER_CHANGE,
  MONETIZATION_BENEFIT_ADD,
  MONETIZATION_BENEFIT_REMOVE, PROJECT_LOAD, PROJECT_SAVE, RISK_SOLUTION_ADD, RISK_SOLUTION_EDIT
} from './constants/actionConstants';

export function loadProject() {
  Dispatcher.dispatch({
    actionType: PROJECT_LOAD
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

export function editAudienceName(name, audienceIndex) {
  Dispatcher.dispatch({
    actionType: AUDIENCE_EDIT_NAME,
    name,
    audienceIndex
  });
}

export function editAudienceDescription(description, audienceIndex) {
  Dispatcher.dispatch({
    actionType: AUDIENCE_EDIT_DESCRIPTION,
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

export function editMonetizationName(monetizationIndex, name) {
  Dispatcher.dispatch({
    actionType: MONETIZATION_EDIT_NAME,
    monetizationIndex,
    name
  })
}

export function editMonetizationDescription(monetizationIndex, benefitIndex, benefit) {
  Dispatcher.dispatch({
    actionType: MONETIZATION_EDIT_DESCRIPTION,
    monetizationIndex,
    benefitIndex,
    benefit
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

export function detachAudienceFromMonetizationPlan(audienceIndex, monetizationIndex) {
  Dispatcher.dispatch({
    actionType: MONETIZATION_AUDIENCE_REMOVE,
    audienceIndex,
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

export default {
  loadProject,

  addAudience,
  editAudienceName,
  editAudienceDescription,
  editAudienceStrategy,

  addMonetizationPlan,
  editMonetizationName,
  editMonetizationPrice,
  editMonetizationDescription,
  addBenefitToMonetizationPlan,
  removeBenefitFromMonetizationPlan,

  attachAudienceToMonetizationPlan,
  detachAudienceFromMonetizationPlan,

  addRisk,
  addRiskSolution,
  editRiskSolution,
  editRiskName,
  changeRiskOrder,
}

