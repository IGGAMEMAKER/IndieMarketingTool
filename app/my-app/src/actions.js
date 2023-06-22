import Dispatcher from './Dispatcher';
import {
  AUDIENCE_ADD, AUDIENCE_EDIT_STRATEGY, AUDIENCE_EDIT_DESCRIPTION, AUDIENCE_EDIT_NAME,
  MONETIZATION_ADD,
  MONETIZATION_AUDIENCE_ADD,
  MONETIZATION_AUDIENCE_REMOVE,
  MONETIZATION_EDIT_DESCRIPTION,
  MONETIZATION_EDIT_NAME
} from './constants/actionConstants';


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

export function editMonetizationDescription(monetizationIndex, description) {
  Dispatcher.dispatch({
    actionType: MONETIZATION_EDIT_DESCRIPTION,
    monetizationIndex,
    description
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

export default {
  addAudience,
  editAudienceName,
  editAudienceDescription,
  editAudienceStrategy,

  addMonetizationPlan,
  editMonetizationName,
  editMonetizationDescription,
  attachAudienceToMonetizationPlan,
  detachAudienceFromMonetizationPlan
}

