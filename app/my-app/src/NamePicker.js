import {isGame} from "./utils/projectUtils";
import {Panel} from "./Panel";
import {FieldPicker} from "./FieldPicker";
import actions from "./actions";

export function NamePicker({project, projectId, name}) {
  var wordedType;

  if (isGame(project)) {
    wordedType = 'game'
  } else {
    wordedType = 'service'
  }

  return <div>
    <Panel id="Name" header={`How will you name your ${wordedType}?`} noHelp/>
    <FieldPicker
      value={project?.name}
      placeholder={"name the project"}
      onAction={val => {
        actions.editName(projectId, val)
      }}
      // normalValueRenderer={onEdit => <h1 onClick={onEdit}>{name}</h1>}
      normalValueRenderer={onEdit => <h1 onClick={onEdit}>{project?.name}</h1>}
    />
  </div>
}