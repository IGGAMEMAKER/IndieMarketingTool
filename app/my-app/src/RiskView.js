import {FieldPicker} from "./FieldPicker";
import actions from "./actions";
import {FieldAdder} from "./FieldAdder";
import {RiskAdder} from "./RiskAdder";
import {ARROW_DOWN, ARROW_UP} from "./constants/symbols";
import {useState} from "react";

export function RiskList({risks, project}) {
  // key={"risk-list." + r.id}
  return (
    <ol className="list">
      {risks.map((r, index) => <RiskView risk={r} index={index} />)}
      <li><RiskAdder project={project} /></li>
    </ol>
  )
}

function RiskSolutionAdder({riskIndex}) {
  return <li className="Risk-item">
    <FieldAdder
      onAdd={v => {actions.addRiskSolution(riskIndex, v)}}
      defaultValue={""}
      placeholder="add solution"
      defaultState={true}
    />
  </li>
}

export function SolutionView({riskIndex, s, id, index }) {
  const indexName = "solutionIndex"
  var [isDragging, setDragging] = useState(false)
  var [isDraggingTarget, setDraggingTarget] = useState(false)
  var isCorrectTypeDrag = e => {
    try {
      var d = parseInt(e.dataTransfer.getData(indexName))
      var resp = !isNaN(d)
      console.log('d=', d, indexName, resp)

      return true
    } catch (err) {
      console.error('error in drag', indexName)
      return false
    }
  }

  var onStartDragging = (e, dragging) => {
    e.dataTransfer.setData(indexName, index)
    setDragging(dragging)
    setDraggingTarget(false)
  }

  var onDraggedUpon = (e, target) => {
    e.preventDefault()

    if (isCorrectTypeDrag(e))
      setDraggingTarget(target)
  }
  var onDrop = e => {
    var draggedOnMeId = parseInt(e.dataTransfer.getData(indexName))
    // console.log(draggedOnMeId, typeof draggedOnMeId, index - 1)

    var was = draggedOnMeId;
    var next = index;

    setDraggingTarget(false)
    actions.changeSolutionOrder(riskIndex, was, next)
  }

  return <li
    key={"risk." + id + ".solution" + s.id}
    draggable
    onDragStart={e => {onStartDragging(e, true)}}
    onDragEnd={e => {onStartDragging(e, false)}}

    onDragLeave={e => onDraggedUpon(e,false)}
    onDragOver={e => onDraggedUpon(e, true)}

    onDrop={e => {onDrop(e)}}

    className={`text-secondary ${isDragging ? 'dragging' : ''} ${isDraggingTarget ? 'dragging-target' : ''}`}
    // className="text-secondary"
  >
    <FieldPicker
      value={s.name}
      placeholder={"Add possible solution"}
      onAction={val => actions.editRiskSolution(id, s.id, val)}
      onRemove={() => actions.removeRiskSolution(id, s.id)}
    />
  </li>
}

export function RiskView({risk, index, it, goal, orderingAllowed = true}) {
  const indexName = "riskIndex"
  var [isDragging, setDragging] = useState(false)
  var [isDraggingTarget, setDraggingTarget] = useState(false)
  var isCorrectTypeDrag = e => {
    try {
      var d = parseInt(e.dataTransfer.getData(indexName))
      var resp = !isNaN(d)
      console.log('d=', d, indexName, resp)

      return true
    } catch (err) {
      console.error('error in drag', indexName)
      return false
    }
  }

  var onStartDragging = (e, dragging) => {
    e.dataTransfer.setData(indexName, index)
    setDragging(dragging)
    setDraggingTarget(false)
  }

  var onDraggedUpon = (e, target) => {
    e.preventDefault()

    if (isCorrectTypeDrag(e))
      setDraggingTarget(target)
  }
  var onDrop = e => {
    var draggedOnMeId = parseInt(e.dataTransfer.getData(indexName))
    // console.log(draggedOnMeId, typeof draggedOnMeId, index - 1)

    var was = draggedOnMeId;
    var next = index;

    setDraggingTarget(false)
    actions.changeRiskOrder(was, next)
  }

  try {
    var id = risk.id;
    var solutions = risk.solutions || []

    var renderer = onChange => {
      var solutionRenderer;

      if (solutions.length) {
        solutionRenderer = solutions.map((s, si) => <SolutionView riskIndex={id} id={id} s={s} index={si} />)
      }

      var movementBar;
      if (orderingAllowed) {
        // var up = <button onClick={() => actions.changeRiskOrder(index, index - 1)}>{ARROW_UP}</button>
        // var down = <button onClick={() => actions.changeRiskOrder(index, index + 1)}>{ARROW_DOWN}</button>
        //
        // movementBar = <span>{up} {down}</span>
      }

      const removeButton = <button style={{float: 'right'}} onClick={() => {
        actions.removeRisk(id)
      }}>x</button>

      var removeFromIterationButton;
      if (it) {
        removeFromIterationButton = <button style={{float: 'right'}} onClick={() => {
          actions.removeIterationGoal(it.id, goal.id)
        }}>x</button>
        // }}>remove from iteration</button>
      }

      return <div>
        <div
          draggable={orderingAllowed}
          onDragStart={e => {onStartDragging(e, true)}}
          onDragEnd={e => {onStartDragging(e, false)}}

          onDragLeave={e => onDraggedUpon(e,false)}
          onDragOver={e => onDraggedUpon(e, true)}

          onDrop={e => {onDrop(e)}}

          // className={`Audience-item ${isDragging ? 'dragging' : ''} ${isDraggingTarget ? 'dragging-target' : ''}`}
          className={`${isDragging ? 'dragging' : ''} ${isDraggingTarget ? 'dragging-target' : ''}`}
        >
          {/*{movementBar}{removeFromIterationButton} <span onClick={() => onChange(true)}><b>{risk.name}</b></span>*/}
          {removeFromIterationButton} <span onClick={() => onChange(true)}><b>{risk.name}</b></span>
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
      <li
        // draggable={orderingAllowed}
        // onDragStart={e => {onStartDragging(e, true)}}
        // onDragEnd={e => {onStartDragging(e, false)}}
        //
        // onDragLeave={e => onDraggedUpon(e,false)}
        // onDragOver={e => onDraggedUpon(e, true)}
        //
        // onDrop={e => {onDrop(e)}}

        // className={`Audience-item ${isDragging ? 'dragging' : ''} ${isDraggingTarget ? 'dragging-target' : ''}`}
        // className={`Risk-item ${isDragging ? 'dragging' : ''} ${isDraggingTarget ? 'dragging-target' : ''}`}

        className="Risk-item"
      >
        {content}
      </li>
    )
  }
  catch (e) {
    console.error('NO RISK', risk, index, it, goal, orderingAllowed)

    return <div>You accidentally removed risk:(</div>
  }
}