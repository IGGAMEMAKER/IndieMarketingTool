import Dispatcher from './Dispatcher';
import {
  AUDIENCE_ADD, AUDIENCE_EDIT_STRATEGY, AUDIENCE_EDIT_DESCRIPTION, AUDIENCE_EDIT_NAME
} from './constants/actionConstants';


export function addAudience(name) {
  Dispatcher.dispatch({
    actionType: AUDIENCE_ADD,
    name,
  });
}

export function editAudienceName(name) {
  Dispatcher.dispatch({
    actionType: AUDIENCE_EDIT_NAME,
    name,
  });
}

export function editAudienceDescription(description) {
  Dispatcher.dispatch({
    actionType: AUDIENCE_EDIT_DESCRIPTION,
    description
  })
}

export function editAudienceStrategy(description) {
  Dispatcher.dispatch({
    actionType: AUDIENCE_EDIT_STRATEGY,
    description
  })
}
