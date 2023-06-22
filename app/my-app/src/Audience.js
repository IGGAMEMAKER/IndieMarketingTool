import {useState} from "react";
import actions from "./actions";

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
                           name, description, strategy, index, isFull = false, onToggleFullInfo = () => {
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
    namePicker = <b onClick={() => onEditNameStatus(true)}>{name}</b>

  var strategyPicker;
  if (!strategy.length || editStrategy)
    strategyPicker = <StrategyPicker strategy={strategy} index={index} onEditStrategyStatus={onEditStrategyStatus} />
  else
    strategyPicker = <div onClick={() => onEditStrategyStatus(true)}><i style={{color: 'green'}}>{strategy}</i></div>

  if (isFull) {
    f = <div>
      <br/>
      {descriptionPicker}
      <br/>
      {strategyPicker}
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