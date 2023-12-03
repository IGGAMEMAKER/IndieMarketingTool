import {useState} from "react";
import {openedFieldPicker, removeField, savedFieldPicker} from "./saveUserUnderstandingStat";


export function FieldPicker({value, onAction, onRemove, placeholder, autoFocus=false, normalValueRenderer}) {
  var [editName, onChangeName] = useState(false)
  var [newValue, onValueChange] = useState(value)

  var ff = ev => {
    openedFieldPicker(placeholder)
    onChangeName(ev)
  }

  if (value.length && !editName) {
    if (!normalValueRenderer)
      return <span className="editable" onClick={ff}>{value}</span>

    return <div className="editable">{normalValueRenderer(ff)}</div>
  }

  var saveButton = ''
  if (newValue?.length || value?.length) {
    const onSave = () => {
      if (onRemove && !newValue.length) {
        removeField(placeholder)
        onRemove()
      } else {
        savedFieldPicker(placeholder)
        onAction(newValue)
      }

      onChangeName(false)
    }

    saveButton = <button onClick={onSave}>save</button>
  }

  return <div key={value}>
    <textarea
      className="field-picker"
      autoFocus={autoFocus}
      value={newValue}
      placeholder={placeholder}
      onChange={event => onValueChange(event.target.value)}
    />
    {saveButton}
  </div>
}

export function NumberPicker({value, onAction, placeholder, normalValueRenderer, defaultState=false}) {
  var [editName, onChangeName] = useState(defaultState)
  var [newValue, onValueChange] = useState(value)

  if (!editName) {
    if (normalValueRenderer)
      return <div className="editable wavy">{normalValueRenderer(onChangeName)}</div>


    return <label className="editable wavy" onClick={() => onChangeName(true)}>{value}</label>
  }

  var saveButton = ''
  const onSave = () => {
    onAction(newValue);
    // onValueChange("")
    // onEditDescriptionStatus(false)
    onChangeName(false)
  }

  saveButton = <button onClick={onSave}>save</button>

  return <div>
    <textarea
      className={"number-picker"}
      value={newValue}
      placeholder={placeholder}
      onChange={event => {
        var val = parseFloat(event.target.value)

        if (isNaN(val))
          val = 0;

        onValueChange(val)
      }}
    />
    {saveButton}
  </div>
}