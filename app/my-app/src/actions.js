import Dispatcher from './Dispatcher';
import {
  AUDIENCE_ADD,
  AUDIENCE_STRATEGY_EDIT,
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
  PROJECT_RENAME,
  AUDIENCE_REMOVE,
  CHANNELS_ADD,
  CHANNELS_REMOVE,
  CHANNELS_NAME_EDIT,
  LINKS_ADD,
  LINKS_REMOVE,
  LINKS_NOTES_EDIT,
  LINKS_TYPE_EDIT,
  MONETIZATION_ORDER_CHANGE,
  MARKETING_CAMPAIGN_ADD,
  MARKETING_CAMPAIGN_AUDIENCE_EDIT,
  AUDIENCE_STRATEGY_ADD,
  AUDIENCE_STRATEGY_REMOVE,
  AUDIENCE_ORDER_CHANGE,
  AUDIENCE_MESSAGE_ADD,
  AUDIENCE_MESSAGE_EDIT,
  PROJECT_EDIT_DESIRED_PROFIT,
  PROJECT_EDIT_EXPENSES,
  PROJECT_EDIT_BURNOUT_TIME,
  ITERATIONS_ADD,
  ITERATIONS_DESCRIPTION_EDIT,
  ITERATIONS_REMOVE,
  ITERATIONS_ORDER_CHANGE,
  AUDIENCE_MESSAGE_REMOVE,
  ITERATIONS_GOAL_EDIT,
  ITERATIONS_GOAL_ADD,
  ITERATIONS_GOAL_REMOVE,
  ITERATIONS_GOAL_SOLVE,
  PROFILE_LOGIN,
  RISK_SOLUTION_ORDER_CHANGE, PROJECT_EDIT_DESCRIPTION
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

export function editDescription(projectId, description) {
  Dispatcher.dispatch({
    actionType: PROJECT_EDIT_DESCRIPTION,
    projectId,
    description
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

export function addAudienceMessage(message, audienceIndex) {
  Dispatcher.dispatch({
    actionType: AUDIENCE_MESSAGE_ADD,
    message,
    audienceIndex,
  })
}

export function removeAudienceMessage(audienceIndex, messageIndex) {
  Dispatcher.dispatch({
    actionType: AUDIENCE_MESSAGE_REMOVE,
    messageIndex,
    audienceIndex,
  })
}

export function editAudienceMessage(message, audienceIndex, messageIndex) {
  Dispatcher.dispatch({
    actionType: AUDIENCE_MESSAGE_EDIT,
    messageIndex,
    audienceIndex,
    message
  })
}

export function addAudienceStrategy(strategy, audienceIndex) {
  Dispatcher.dispatch({
    actionType: AUDIENCE_STRATEGY_ADD,
    strategy,
    audienceIndex,
  })
}

export function editAudienceStrategy(strategy, audienceIndex, textIndex) {
  console.log({strategy, audienceIndex, textIndex})
  Dispatcher.dispatch({
    actionType: AUDIENCE_STRATEGY_EDIT,
    strategy,
    audienceIndex,
    textIndex
  })
}

export function removeAudienceStrategy(audienceIndex, textIndex) {
  Dispatcher.dispatch({
    actionType: AUDIENCE_STRATEGY_REMOVE,
    audienceIndex,
    textIndex
  })
}

export function changeAudienceOrder(audienceIndex1, audienceIndex2) {
  Dispatcher.dispatch({
    actionType: AUDIENCE_ORDER_CHANGE, // ID, no
    audienceIndex1,
    audienceIndex2
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

export function changeMonetizationOrder(monetizationIndex1, monetizationIndex2) {
  Dispatcher.dispatch({
    actionType: MONETIZATION_ORDER_CHANGE,
    monetizationIndex1,
    monetizationIndex2
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

export function changeSolutionOrder(riskIndex, index1, index2) {
  Dispatcher.dispatch({
    actionType: RISK_SOLUTION_ORDER_CHANGE,
    riskIndex,
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



export function addLink(link) {
  Dispatcher.dispatch({
    actionType: LINKS_ADD,
    link
  })
}

export function removeLink(linkIndex) {
  Dispatcher.dispatch({
    actionType: LINKS_REMOVE,
    linkIndex
  })
}

export function editLinkNotes(linkIndex, note) {
  Dispatcher.dispatch({
    actionType: LINKS_NOTES_EDIT,
    linkIndex,
    note
  })
}

export function editLinkType(linkIndex, linkType) {
  Dispatcher.dispatch({
    actionType: LINKS_TYPE_EDIT,
    linkIndex,
    linkType
  })
}

export function addMarketingCampaign(audienceIndex, message, approach) {
  Dispatcher.dispatch({
    actionType: MARKETING_CAMPAIGN_ADD,
    audienceIndex,
    message,
    approach
  })
}

export function editMarketingCampaignAudience(campaignID, audienceIndex) {
  Dispatcher.dispatch({
    actionType: MARKETING_CAMPAIGN_AUDIENCE_EDIT,
    audienceIndex,
    campaignID
  })
}

export function editMarketingCampaignMessage(campaignID, audienceIndex) {
  Dispatcher.dispatch({
    actionType: MARKETING_CAMPAIGN_AUDIENCE_EDIT,
    audienceIndex,
    campaignID
  })
}

export function editProjectDesiredProfit(value) {
  Dispatcher.dispatch({
    actionType: PROJECT_EDIT_DESIRED_PROFIT,
    value
  })
}

export function editProjectMonthlyExpenses(value) {
  Dispatcher.dispatch({
    actionType: PROJECT_EDIT_EXPENSES,
    value
  })
}

export function editProjectTimeTillBurnout(value) {
  Dispatcher.dispatch({
    actionType: PROJECT_EDIT_BURNOUT_TIME,
    value
  })
}


export function addIteration(iteration, {pasteAfter = -1, pasteBefore = -1}) {
  // text goal
  // number goal

  // index: will paste to iterations[index]
  Dispatcher.dispatch({
    actionType: ITERATIONS_ADD,
    iteration,
    pasteAfter,
    pasteBefore
  })
}

export function removeIteration(id) {
  Dispatcher.dispatch({
    actionType: ITERATIONS_REMOVE,
    id
  })
}

export function changeIterationOrder(index1, index2) {
  Dispatcher.dispatch({
    actionType: ITERATIONS_ORDER_CHANGE,
    index1,
    index2
  })
}

export function editIterationDescription(id, description) {
  Dispatcher.dispatch({
    actionType: ITERATIONS_DESCRIPTION_EDIT,
    id,
    description
  })
}

export function editIterationGoal(id, numberGoalId, goal) {
  Dispatcher.dispatch({
    actionType: ITERATIONS_GOAL_EDIT,
    id,
    numberGoalId,
    goal
  })
}

export function addIterationGoal(id, goal) {
  Dispatcher.dispatch({
    actionType: ITERATIONS_GOAL_ADD,
    id,
    goal
  })
}

export function removeIterationGoal(id, goalIndex) {
  Dispatcher.dispatch({
    actionType: ITERATIONS_GOAL_REMOVE,
    id, goalIndex
  })
}

export function solveIterationGoal(id, goalIndex, solved = true) {
  Dispatcher.dispatch({
    actionType: ITERATIONS_GOAL_SOLVE,
    id, goalIndex, solved
  })
}

export function logIn(email, password) {
  Dispatcher.dispatch({
    actionType: PROFILE_LOGIN,
    email, password
  })
}

export default {
  logIn,
  loadProject,
  loadProfile,

  addProject,
  editName,
  editDescription,
  removeProject,



  addAudience,
  removeAudience,
  editAudienceName,
  editAudienceDescription,
  editAudienceStrategy,
  removeAudienceStrategy,
  addAudienceStrategy,
  changeAudienceOrder,
  addAudienceMessage,
  removeAudienceMessage,
  editAudienceMessage,

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
  changeMonetizationOrder,

  addRisk,
  removeRisk,
  addRiskSolution,
  removeRiskSolution,
  editRiskSolution,
  editRiskName,
  changeRiskOrder,
  changeSolutionOrder,

  addChannel,
  removeChannel,
  editChannelName,

  addLink,
  removeLink,
  editLinkNotes,
  editLinkType,

  addMarketingCampaign,

  editProjectDesiredProfit,
  editProjectMonthlyExpenses,
  editProjectTimeTillBurnout,

  addIteration,
  removeIteration,
  changeIterationOrder,
  editIterationDescription, // text description of the iteration goal

  editIterationGoal,
  addIterationGoal,
  removeIterationGoal,
  solveIterationGoal
}

