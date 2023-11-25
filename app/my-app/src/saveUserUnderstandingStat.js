import {post} from "./PingBrowser";

export const saveUserUnderstandingStat = (userActionType, obj={}) => {
  post('/api/stats/inputs', {
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

export const openedFieldAdder = (placeholder) => {
  saveUserUnderstandingStat('FIELD_ADDER_OPENED', {placeholder})
}

export const savedFieldAdder = (placeholder) => {
  saveUserUnderstandingStat('FIELD_ADDER_SAVED', {placeholder})
}

export const openedFieldPicker = (placeholder) => {
  saveUserUnderstandingStat('FIELD_PICKER_OPENED', {placeholder})
}

export const savedFieldPicker = (placeholder) => {
  saveUserUnderstandingStat('FIELD_PICKER_SAVED', {placeholder})
}

export const removeField = (placeholder) => {
  saveUserUnderstandingStat('FIELD_PICKER_REMOVED', {placeholder})
}