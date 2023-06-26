import {useState} from "react";
import actions from "./actions";
import {FieldPicker} from "./FieldPicker";

function DescriptionPicker({index, description, onEditDescriptionStatus}) {
  var [newDescription, onChangeDescription] = useState(description)
  var saveButton = ''
  if (newDescription.length || description.length) {
    const onSave = () => {
      actions.editAudienceDescription(newDescription, index);
      onChangeDescription("")
      onEditDescriptionStatus(false)
    }

    saveButton = <button onClick={onSave}>save</button>
  }

  var descriptionInp = <div>
    <textarea
      value={newDescription}
      placeholder={"Describe audience"}
      onChange={event => onChangeDescription(event.target.value)}
    />
    {saveButton}
  </div>

  return descriptionInp
}

function StrategyPicker({index, strategy, onEditStrategyStatus}) {
  var [newStrategy, onChangeStrategy] = useState(strategy)
  var saveButton = ''
  if (newStrategy.length || strategy.length) {
    var onSave = () => {
      actions.editAudienceStrategy(newStrategy, index, strategy.length);
      onChangeStrategy("")
      onEditStrategyStatus(false)
    }

    saveButton = <button onClick={onSave}>save</button>
  }


  var strategyInp = <div>
    <textarea
      value={newStrategy}
      placeholder={"how will you reach them"}
      onChange={event => onChangeStrategy(event.target.value)}
    />
    {saveButton}
  </div>

  return strategyInp
}

function NamePicker({index, name, onEditNameStatus}) {
  var [newName, onChangeName] = useState(name)
  var saveButton = ''
  if (newName.length || name.length) {
    const onSave = () => {
      actions.editAudienceName(newName, index);
      onChangeName("")
      onEditNameStatus(false)
    }

    saveButton = <button onClick={onSave}>save</button>
  }

  var descriptionInp = <div>
      <textarea
        value={newName}
        placeholder={"Describe audience"}
        onChange={event => onChangeName(event.target.value)}
      />
    {saveButton}
  </div>

  return descriptionInp
}

export function Audience({
                           name, description, strategy, id, index, usages=[], isFull = false, onToggleFullInfo = () => {
  }
                         }) {
  var f = ''

  var [editName, onEditNameStatus] = useState(false)
  var [editDescription, onEditDescriptionStatus] = useState(false)
  var [editStrategy, onEditStrategyStatus] = useState(false)



  var descriptionPicker;
  if (!description.length || editDescription)
    descriptionPicker = <DescriptionPicker index={index} description={description} onEditDescriptionStatus={onEditDescriptionStatus}/>
  else
    descriptionPicker = <label onClick={() => onEditDescriptionStatus(true)}>{description}</label>

  var namePicker;
  if (!name.length || editName)
    namePicker = <NamePicker index={index} name={name} onEditNameStatus={onEditNameStatus} />
  else
    namePicker = <div className={"audience-title"}><b onClick={() => onEditNameStatus(true)}>{name}</b></div>

  namePicker = <FieldPicker
    value={name}
    placeholder={"Audience name"}
    normalValueRenderer={onEdit => <div className={"audience-title"}><b onClick={onEdit}>{name}</b></div>}
    onAction={newName => {
      if (newName.length)
        actions.editAudienceName(newName, index)
      else {
        // if is used a lot, make an alert, which tells, where it is used
        if (usages.length) {
          alert('This segment is used in ' + usages.map(u => u.toUpperCase()).join(', ') + '. Remove it from there and try again')
        } else {
          actions.removeAudience(index)
        }
      }
    }}
  />


  var strategyPicker;
  if (!strategy.length || editStrategy)
    strategyPicker = <StrategyPicker strategy={strategy} index={index} onEditStrategyStatus={onEditStrategyStatus} />
  else
    strategyPicker = <div onClick={() => onEditStrategyStatus(true)}><i style={{color: 'green'}}>{strategy}</i></div>

  const facePicker = (emoji, color, isChosen) => <span style={{color, fontSize: isChosen ? 32 : 20, fontWeight: isChosen ? 800 : 100}}>{emoji}</span>

  // 🤪
  if (isFull) {
    f = <div>
      {/*<br/>*/}
      <div>{facePicker('😅', 'green', true)}{facePicker('😐', 'orange', false)}</div>
      {/*{facePicker('😡', 'red', false)}*/}
      {descriptionPicker}
      <h3>{id}</h3>
      {/*<br/>*/}
      {/*{strategyPicker}*/}
      {/*{strategy.map(s => <div><i style={{color: 'green'}}>{s}</i></div>)}*/}
    </div>
  }

  return (
    <div className="Audience-item">
      {namePicker}
      {f}
    </div>
  );
}