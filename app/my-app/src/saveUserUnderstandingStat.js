import {post} from "./PingBrowser";

export const saveUserUnderstandingStat = (userActionType, obj={}) => {
  post('/stats/inputs', {
    action: Object.assign({
      actionType: userActionType
    }, obj)
  })
    .then(r => {
      console.log(r, userActionType);
    })
    .catch(err => {
      console.error('saveUserUnderstandingStat', userActionType, err)
    })
}

export const openedFieldPicker = (placeholder) => {
  saveUserUnderstandingStat('FIELD_ADDER_OPENED', {placeholder})
}

export const savedFieldPicker = (placeholder) => {
  saveUserUnderstandingStat('FIELD_ADDER_SAVED', {placeholder})
}