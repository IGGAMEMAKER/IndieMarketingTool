import {useState} from "react";
import {FieldAdder} from "./FieldAdder";
import actions from "./actions";
import {Iteration} from "./Iteration";
import {getNextID} from "./utils";

export function RiskAdder({it, project}) {
  const [name, onChangeName] = useState("");

  return (
    <div className="Risk-item">
      <FieldAdder onAdd={val => {
        if (it) {
          var nextRiskId = getNextID(project.risks)
          actions.addRisk(val)
          actions.addIterationGoal(it.id, Iteration.createRiskGoal(project, nextRiskId))
        } else {
          actions.addRisk(val)
        }
      }} placeholder={"Add risk"}/>
      {/*<textarea*/}
      {/*  value={name}*/}
      {/*  onChange={event => {*/}
      {/*    var v = event.target.value*/}

      {/*    onChangeName(v)*/}
      {/*  }}*/}
      {/*/>*/}
      {/*<br />*/}
      {/*<button onClick={() => {actions.addRisk(name); onChangeName("")}}>ADD</button>*/}
    </div>
  )
}