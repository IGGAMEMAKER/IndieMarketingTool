import {useState} from "react";
import actions from "./actions";

function FieldPicker({value, onAction, onEditDescriptionStatus, placeholder}) {
  var [newValue, onValueChange] = useState(value)
  var saveButton = ''
  if (newValue.length || value.length) {
    const onSave = () => {
      onAction(newValue);
      onValueChange("")
      onEditDescriptionStatus(false)
    }

    saveButton = <button onClick={onSave}>save</button>
  }

  return <div>
    <textarea
      value={newValue}
      placeholder={placeholder}
      onChange={event => onValueChange(event.target.value)}
    />
    {saveButton}
  </div>
}

export function MonetizationPlan({plan, index, audiences}) {
  var [editName, onChangeName] = useState(false)

  var namePicker;
  if (!plan.name.length || editName)
    namePicker = <FieldPicker onEditDescriptionStatus={() => onChangeName(false)} value={plan.name} placeholder={"Monetization type name"} onAction={newName => {actions.editMonetizationName(index, newName)}} />
  else
    namePicker = <b onClick={() => onChangeName(true)}>{plan.name}</b>

  var includedAudiences = (plan?.audiences || [])

  return <div className="Audience-item">
    <div>{namePicker}</div>
    <div>{plan.description}</div>
    <div>{includedAudiences.map(i => <i style={{color: 'green'}}>{audiences[i].name}</i>)}</div>
  </div>
}