import {useState} from "react";
import {openedFieldAdder, savedFieldAdder} from "./saveUserUnderstandingStat";

export function FieldAdder({onAdd, placeholder, defaultState = false, autoFocus = false, defaultWord = "+", defaultValue = ""}) {
  var [value, onChange] = useState(defaultValue);
  var [needsToAdd, setNeedsToAdd] = useState(defaultState)

  if (!needsToAdd) {
    return <button onClick={() => {
      openedFieldAdder(placeholder)
      setNeedsToAdd(true)
    }}>{defaultWord}</button>
  }

  let bb;
  if (value.length) {
    bb = <button onClick={() => {
      onAdd(value)
      savedFieldAdder(placeholder)
      onChange("")
      setNeedsToAdd(false)
    }}>Add
    </button>
  }

  return <div>
    <input
      autoFocus={autoFocus}
      value={value}
      placeholder={placeholder}
      onChange={ev => onChange(ev.target.value)}
    />
    {bb}
  </div>
}