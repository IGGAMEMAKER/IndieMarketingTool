import {useState} from "react";

export function FieldPicker({value, onAction, placeholder, normalValueRenderer}) {
  var [editName, onChangeName] = useState(false)
  var [newValue, onValueChange] = useState(value)

  if (value.length && !editName)
    return normalValueRenderer(onChangeName)

  var saveButton = ''
  if (newValue?.length || value?.length) {
    const onSave = () => {
      onAction(newValue);
      onChangeName(false)
    }

    saveButton = <button onClick={onSave}>save</button>
  }

  return <div key={value}>
    <textarea
      value={newValue}
      placeholder={placeholder}
      onChange={event => onValueChange(event.target.value)}
    />
    {saveButton}
  </div>
}

export function NumberPicker({value, onAction, placeholder, normalValueRenderer}) {
  var [editName, onChangeName] = useState(false)
  var [newValue, onValueChange] = useState(value)

  if (!editName)
    return normalValueRenderer(onChangeName)

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
      value={newValue}
      placeholder={placeholder}
      onChange={event => onValueChange(event.target.value)}
    />
    {saveButton}
  </div>
}