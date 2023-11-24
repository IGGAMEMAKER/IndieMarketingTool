import {useState} from "react";
import {FieldAdder} from "./FieldAdder";
import actions from "./actions";
import {Iteration} from "./Iteration";
import {getNextID} from "./utils";


export function RiskAdder({it, project}) {
  return (
    <div className="Risk-item">
      <FieldAdder
        placeholder={"Add risk"}
        defaultState={true}
        autoFocus={false}

        onAdd={val => {
          var nextRiskId = getNextID(project.risks)
          actions.addRisk(val)

          if (it) {
            // if part of iteration, add it to iteration too
            actions.addIterationGoal(it.id, Iteration.createRiskGoal(project, nextRiskId))
          }
        }}
      />
    </div>
  )
}