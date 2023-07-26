import {FieldPicker} from "./FieldPicker";
import actions from "./actions";
import {FieldAdder} from "./FieldAdder";
import {RiskAdder} from "./RiskAdder";

export function RiskList({risks}) {
  // key={"risk-list." + r.id}
  return (
    <ul>
      {risks.map((r, index) => <RiskView risk={r} index={index} />)}
      <li><RiskAdder /></li>
    </ul>
  )
}

function RiskSolutionAdder({riskIndex}) {
  return <li className="Risk-item">
    <FieldAdder
      onAdd={v => {actions.addRiskSolution(riskIndex, v)}}
      defaultValue={""}
      placeholder={"Solution"}
    />
  </li>
}

export function RiskView({risk, index, it, goal, orderingAllowed = true}) {
  var id = risk.id;

  var renderer = onChange => {
    var solutions = risk.solutions || []
    var solutionRenderer;
    if (solutions.length) {
      solutionRenderer = solutions.map(s => <li key={"risk." + id + ".solution" + s.id} className="text-secondary">
        <FieldPicker
          value={s.name}
          placeholder={"Add possible solution"}
          onAction={val => actions.editRiskSolution(id, s.id, val)}
          onRemove={() => actions.removeRiskSolution(id, s.id)}
        />
      </li>)
    }

    var movementBar;
    if (orderingAllowed) {
      var up = <button onClick={() => actions.changeRiskOrder(index, index - 1)}>Up</button>
      var down = <button onClick={() => actions.changeRiskOrder(index, index + 1)}>Down</button>

      movementBar = <span>{up} {down}</span>
    }

    const removeButton = <button style={{float: 'right'}} onClick={() => {actions.removeRisk(id)}}>x</button>
    var removeFromIterationButton;
    if (it) {
      removeFromIterationButton = <button style={{float: 'right'}} onClick={() => {actions.removeIterationGoal(it.id, goal.id)}}>remove from iteration</button>
    }

    return <div>
      <div>
        <span onClick={() => onChange(true)}>{risk.name}</span>
        {movementBar}{removeFromIterationButton}
      </div>
      <ul>
        {solutionRenderer}
        <RiskSolutionAdder riskIndex={id}/>
      </ul>
    </div>
  }

  var content = <FieldPicker
    value={risk?.name}
    normalValueRenderer={renderer}
    placeholder={"Risk"}
    onAction={val => actions.editRiskName(id, val)}
    onRemove={() => {
      if (!it)
        actions.removeRisk(id)
    }}
    key={'risk' + id}
  />

  return (
    <li className="Risk-item">
      {content}
    </li>
  )
}