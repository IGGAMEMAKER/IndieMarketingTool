import actions from "./actions";
import {FieldPicker} from "./FieldPicker";
import {ARROW_LEFT, ARROW_RIGHT} from "./constants/symbols";


export function Audience({name, description, id, index, usages=[], isFull = false}) {
  var f = ''
  var left = <button onClick={() => {actions.changeAudienceOrder(index, index - 1)}}>{ARROW_LEFT}</button>
  var right = <button onClick={() => {actions.changeAudienceOrder(index, index + 1)}}>{ARROW_RIGHT}</button>

  var descriptionPicker = <FieldPicker
    value={description}
    placeholder={"Describe audience"}
    normalValueRenderer={onEdit => <label onClick={() => onEdit(true)}>{description}</label>}
    onAction={val => actions.editAudienceDescription(val, id)}
  />


  var namePicker = <FieldPicker
    value={name}
    placeholder={"Audience name"}
    normalValueRenderer={onEdit => <div className={"audience-title"}>
      {left}{right}
      <div><b onClick={onEdit}>{name}</b></div>
    </div>}
    onAction={newName => {actions.editAudienceName(newName, id)}}
    onRemove={() => {
      // if is used a lot, make an alert, which tells, where it is used
      if (usages.length) {
        alert('This segment is used in ' + usages.map(u => u.toUpperCase()).join(', ') + '. Remove it from there and try again')
      } else {
        actions.removeAudience(id)
      }
    }}
  />

  const facePicker = (emoji, color, isChosen) => <span style={{color, fontSize: isChosen ? 32 : 20, fontWeight: isChosen ? 800 : 100}}>{emoji}</span>

  // 🤪
  if (isFull) {
    f = <div>
      {/*<br/>*/}
      {/*<div>{facePicker('😅', 'green', true)}{facePicker('😐', 'orange', false)}</div>*/}
      {/*{facePicker('😡', 'red', false)}*/}
      {descriptionPicker}
      <h3>{id}</h3>
      {/*<br/>*/}
      {/*{strategy.map(s => <div><i style={{color: 'green'}}>{s}</i></div>)}*/}
    </div>
  }

  return (
    <div className="Audience-item" key={`audience${id}`}>
      {namePicker}
      {f}
    </div>
  );
}