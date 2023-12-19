import {useState} from "react";
import actions from "./actions";
import {FieldAdder} from "./FieldAdder";

export function MonetizationAdder({}) {
  const [planName, onChangeName] = useState("");

  return (
    <div className="Audience-item">
      <textarea
        className={"monetisation"}
        value={planName}
        placeholder={"monetization name f.e: starter, demo, pro"}
        onChange={event => {
          onChangeName(event.target.value)
        }}
      />
      <br/>
      <button onClick={() => {
        actions.addMonetizationPlan(planName);
        onChangeName("")
      }}>ADD
      </button>
    </div>
  )

  return <FieldAdder
    onAdd={val => {
      actions.addMonetizationPlan(val)
    }}
    defaultValue={""}
    placeholder={"Monetization plan"}
  />
}