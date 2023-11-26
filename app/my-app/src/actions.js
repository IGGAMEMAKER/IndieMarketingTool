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
  RISK_SOLUTION_ORDER_CHANGE,
  PROJECT_EDIT_DESCRIPTION,
  AUDIENCE_MESSAGE_ORDER_CHANGE,
  NOTES_ADD,
  NOTES_REMOVE,
  NOTES_EDIT,
  NOTES_ORDER_CHANGE,
  FEATURES_ADD,
  FEATURES_EDIT,
  FEATURES_REMOVE,
  FEATURES_ORDER_CHANGE,
  FEATURES_EDIT_TIME_COST,
  ITERATIONS_SOLVE,
  STRATEGY_EDIT,
  ITERATIONS_GOAL_EXECUTION_TIME_EDIT,
  ITERATIONS_GOAL_DESCRIPTION_EDIT,
  ITERATIONS_GROWTH_DESCRIPTION_EDIT,
  PROJECT_EDIT_ESSENCE,
  PROFILE_LOGIN_AS_GUEST,
  PROFILE_LOGIN_AS_GOOGLE, PROFILE_ATTACH_GOOGLE_TO_GUEST
} from './constants/actionConstants';

const DO = (actionType, obj={}) => Dispatcher.dispatch(Object.assign({actionType}, obj))

export function loadProject(projectId) {
  DO(PROJECT_LOAD, {projectId})
}

export function editName(projectId, name) {
  DO(PROJECT_RENAME,{projectId, name})
}

export function editDescription(projectId, description) {
  DO(PROJECT_EDIT_DESCRIPTION,{
    projectId, description
  })
}

export function editMainProblem(problem) {
  DO(PROJECT_EDIT_ESSENCE,{problem})
}

export function removeProject(projectId) {
  DO(PROJECT_REMOVE,{
    projectId
  })
}

export function addProject(name, appType) {
  DO(PROJECT_ADD,{
    name, appType
  })
}

export function loadProfile() {
  DO(PROFILE_LOAD)
}

export function saveProject(project) {
  DO(PROJECT_SAVE,{
    project
  })
}




export function addNote(name) {
  DO(NOTES_ADD,{
    name
  })
}

export function editNote(id, name) {
  DO(NOTES_EDIT,{
    id, name
  })
}

export function removeNote(id) {
  DO(NOTES_REMOVE,{
    id
  })
}

export function changeNoteOrder(index1, index2) {
  DO(NOTES_ORDER_CHANGE,{
    index1, index2
  })
}



export function addFeature(name) {
  DO(FEATURES_ADD,{
    name
  })
}

export function editFeatureName(id, name) {
  DO(FEATURES_EDIT, {id, name})
}

export function removeFeature(id) {
  DO(FEATURES_REMOVE,{id})
}

export function changeFeatureOrder(index1, index2) {
  DO(FEATURES_ORDER_CHANGE, {index1, index2})
}

export function changeFeatureTimeCost(id, timeCost) {
  DO(FEATURES_EDIT_TIME_COST, {id, timeCost})
}



export function addAudience(name) {
  DO(AUDIENCE_ADD, {name});
}

export function removeAudience(audienceIndex) {
  DO(AUDIENCE_REMOVE, {audienceIndex});
}

export function editAudienceName(name, audienceIndex) {
  DO(AUDIENCE_NAME_EDIT, {name, audienceIndex});
}

export function editAudienceDescription(description, audienceIndex) {
  DO(AUDIENCE_DESCRIPTION_EDIT, {description, audienceIndex})
}

export function addAudienceMessage(message, audienceIndex) {
  DO(AUDIENCE_MESSAGE_ADD, {message, audienceIndex})
}

export function removeAudienceMessage(audienceIndex, messageIndex) {
  DO(AUDIENCE_MESSAGE_REMOVE, {messageIndex, audienceIndex})
}

export function editAudienceMessage(message, audienceIndex, messageIndex) {
  DO(AUDIENCE_MESSAGE_EDIT, {messageIndex, audienceIndex, message})
}

export function addAudienceStrategy(strategy, audienceIndex) {
  DO(AUDIENCE_STRATEGY_ADD, {strategy, audienceIndex})
}

export function editAudienceStrategy(strategy, audienceIndex, textIndex) {
  console.log({strategy, audienceIndex, textIndex})
  DO(AUDIENCE_STRATEGY_EDIT, {strategy, audienceIndex, textIndex})
}

export function removeAudienceStrategy(audienceIndex, textIndex) {
  DO(AUDIENCE_STRATEGY_REMOVE, {audienceIndex, textIndex})
}

export function changeAudienceOrder(audienceIndex1, audienceIndex2) {
    // ID, no
  DO(AUDIENCE_ORDER_CHANGE, {
    audienceIndex1, audienceIndex2
  })
}

export function changeAudienceMessageOrder(audienceId, index1, index2) {
    // ID, no
  DO(AUDIENCE_MESSAGE_ORDER_CHANGE, {
    audienceId, index1, index2
  })
}

// ----------- MONETIZATION --------------
export function addMonetizationPlan(name) {
  DO(MONETIZATION_ADD, {
    name,
  });
}
export function removeMonetizationPlan(monetizationIndex) {
  DO(MONETIZATION_REMOVE, {
    monetizationIndex,
  });
}

export function editMonetizationName(monetizationIndex, name) {
  DO(MONETIZATION_EDIT_NAME, {
    monetizationIndex, name
  })
}

export function editMonetizationBenefit(monetizationIndex, benefitIndex, benefit) {
  DO(MONETIZATION_EDIT_BENEFIT, {monetizationIndex, benefitIndex, benefit})
}

export function editMonetizationDescription(monetizationIndex, description) {
  DO(MONETIZATION_EDIT_DESCRIPTION, {monetizationIndex, description})
}

export function removeBenefitFromMonetizationPlan(monetizationIndex, benefitIndex) {
  DO(MONETIZATION_BENEFIT_REMOVE, {monetizationIndex, benefitIndex})
}

export function addBenefitToMonetizationPlan(monetizationIndex, benefit) {
  DO(MONETIZATION_BENEFIT_ADD, {monetizationIndex, benefit})
}

export function editMonetizationPrice(monetizationIndex, price) {
  DO(MONETIZATION_EDIT_PRICE, {monetizationIndex, price: parseInt(price)})
}

export function attachAudienceToMonetizationPlan(audienceIndex, monetizationIndex) {
  DO(MONETIZATION_AUDIENCE_ADD, {audienceIndex, monetizationIndex})
}

export function detachAudienceFromMonetizationPlan(audienceID, monetizationIndex) {
  DO(MONETIZATION_AUDIENCE_REMOVE, {audienceID, monetizationIndex})
}

export function changeMonetizationOrder(monetizationIndex1, monetizationIndex2) {
  DO(MONETIZATION_ORDER_CHANGE, {monetizationIndex1, monetizationIndex2})
}



export function editRiskName(riskIndex, name) {
  DO(RISK_EDIT_NAME, {riskIndex, name})
}

export function addRisk(name) {
  DO(RISK_ADD, {name})
}

export function removeRisk(riskIndex) {
  DO(RISK_REMOVE, {
    riskIndex
  })
}

export function removeRiskSolution(riskIndex, solutionIndex) {
  DO(RISK_SOLUTION_REMOVE, {
    riskIndex, solutionIndex
  })
}

export function addRiskSolution(riskIndex, solution) {
  DO(RISK_SOLUTION_ADD, {
    riskIndex, solution
  })
}

export function editRiskSolution(riskIndex, solutionIndex, solution) {
  DO(RISK_SOLUTION_EDIT,{
    riskIndex, solutionIndex, solution
  })
}

export function changeRiskOrder(index1, index2) {
  DO(RISK_ORDER_CHANGE,{
    index1, index2
  })
}

export function changeSolutionOrder(riskIndex, index1, index2) {
  DO(RISK_SOLUTION_ORDER_CHANGE,{
    riskIndex, index1, index2
  })
}


export function addChannel(url) {
  DO(CHANNELS_ADD,{
    url
  })
}

export function removeChannel(channelIndex) {
  DO(CHANNELS_REMOVE,{
    channelIndex
  })
}

export function editChannelName(channelIndex, name) {
  DO(CHANNELS_NAME_EDIT,{
    channelIndex, name
  })
}



export function addLink(link) {
  DO(LINKS_ADD,{
    link
  })
}

export function removeLink(linkIndex) {
  DO(LINKS_REMOVE,{
    linkIndex
  })
}

export function editLinkNotes(linkIndex, note) {
  DO(LINKS_NOTES_EDIT,{
    linkIndex, note
  })
}

export function editLinkType(linkIndex, linkType) {
  DO(LINKS_TYPE_EDIT,{
    linkIndex, linkType
  })
}

export function addMarketingCampaign(audienceIndex, message, approach) {
  DO(MARKETING_CAMPAIGN_ADD,{
    audienceIndex, message, approach
  })
}

export function editMarketingCampaignAudience(campaignID, audienceIndex) {
  DO(MARKETING_CAMPAIGN_AUDIENCE_EDIT,{
    audienceIndex, campaignID
  })
}

export function editMarketingCampaignMessage(campaignID, audienceIndex) {
  DO(MARKETING_CAMPAIGN_AUDIENCE_EDIT,{
    audienceIndex, campaignID
  })
}

export function editProjectDesiredProfit(value) {
  DO(PROJECT_EDIT_DESIRED_PROFIT,{
    value
  })
}

export function editProjectMonthlyExpenses(value) {
  DO(PROJECT_EDIT_EXPENSES,{
    value
  })
}

export function editProjectTimeTillBurnout(value) {
  DO(PROJECT_EDIT_BURNOUT_TIME,{
    value
  })
}


export function addIteration(iteration, {pasteAfter = -1, pasteBefore = -1}) {
  // text goal
  // number goal

  // index: will paste to iterations[index]
  DO(ITERATIONS_ADD,{
    iteration, pasteAfter, pasteBefore
  })
}

export function removeIteration(id) {
  DO(ITERATIONS_REMOVE,{
    id
  })
}

export function changeIterationOrder(index1, index2) {
  DO(ITERATIONS_ORDER_CHANGE,{
    index1, index2
  })
}

export function editIterationDescription(id, description) {
  DO(ITERATIONS_DESCRIPTION_EDIT,{
    id, description
  })
}

export function editIterationGoal(id, numberGoalId, goal) {
  DO(ITERATIONS_GOAL_EDIT,{
    id, numberGoalId, goal
  })
}

export function addIterationGoal(id, goal) {
  DO(ITERATIONS_GOAL_ADD,{
    id, goal
  })
}

export function removeIterationGoal(id, goalIndex) {
  DO(ITERATIONS_GOAL_REMOVE,{
    id, goalIndex
  })
}

export function solveIterationGoal(id, goalIndex, solved = true) {
  DO(ITERATIONS_GOAL_SOLVE,{
    id, goalIndex, solved
  })
}

export function solveIteration(id, solved = true) {
  DO(ITERATIONS_SOLVE,{
    id, solved
  })
}

export function setIterationGoalExecutionTime(iterationId, goalIndex, timeCost) {
  DO(ITERATIONS_GOAL_EXECUTION_TIME_EDIT,{
    iterationId, goalIndex, timeCost
  })
}

export function setIterationGoalDescription(iterationId, goalIndex, description) {
  DO(ITERATIONS_GOAL_DESCRIPTION_EDIT,{
    iterationId, goalIndex, description
  })
}

export function editIterationGrowthStrategy(id, description) {
  DO(ITERATIONS_GROWTH_DESCRIPTION_EDIT,{
    id, description
  })
}

export function editStrategy(description) {
  DO(STRATEGY_EDIT,{
    description
  })
}

export function logIn(email, password) {
  DO(PROFILE_LOGIN,{
    email, password
  })
}

export function loginAsGuest() {
  DO(PROFILE_LOGIN_AS_GUEST)
}

export function loginViaGoogleOAuth(response) {
  DO(PROFILE_LOGIN_AS_GOOGLE, {response})
}

export function attachGoogleAccountToGuest(response) {
  DO(PROFILE_ATTACH_GOOGLE_TO_GUEST, {response})
}


export default {
  logIn,
  loadProject,
  loadProfile,
  loginAsGuest,
  loginViaGoogleOAuth,
  attachGoogleAccountToGuest,


  addProject,
  editName,
  editDescription,
  editMainProblem,
  removeProject,
  editStrategy,

  addNote,
  editNote,
  removeNote,
  changeNoteOrder,

  addFeature,
  editFeatureName,
  removeFeature,
  changeFeatureOrder,
  changeFeatureTimeCost,

  addAudience,
  removeAudience,
  editAudienceName,
  editAudienceDescription,
  editAudienceStrategy,
  removeAudienceStrategy,
  addAudienceStrategy,
  changeAudienceOrder,
  changeAudienceMessageOrder,
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
  solveIterationGoal,
  setIterationGoalExecutionTime,
  setIterationGoalDescription,
  editIterationGrowthStrategy,
  solveIteration,
}

