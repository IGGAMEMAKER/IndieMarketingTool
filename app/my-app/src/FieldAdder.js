import {useState} from "react";

export function FieldAdder({onAdd, placeholder, defaultState = false, defaultWord = "+", defaultValue = ""}) {
  var [value, onChange] = useState(defaultValue);
  var [needsToAdd, setNeedsToAdd] = useState(defaultState)

  if (!needsToAdd) {
    return <button onClick={() => {
      setNeedsToAdd(true)
    }}>{defaultWord}</button>
  }

  return <div>
    <input autoFocus value={value} placeholder={placeholder} onChange={ev => onChange(ev.target.value)}/>
    <button onClick={() => {
      onAdd(value)
      // actions.addBenefitToMonetizationPlan(index, value)
      onChange("")
      setNeedsToAdd(false)
    }}>Add
    </button>
  </div>
}