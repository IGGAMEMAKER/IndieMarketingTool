import {isGame} from "./utils/projectUtils";
import {FieldAdder} from "./FieldAdder";
import actions from "./actions";

export function ProjectAdder({appType, defaultState}) {
  var defaultWord;
  if (isGame({type: appType}))
    defaultWord = "new GAME"
  else
    defaultWord = "new APP"

  return <FieldAdder
    onAdd={name => {
      // WILL GO TO NEW PROJECT PAGE
      actions.addProject(name, appType)
    }}
    placeholder={"add?"}
    defaultWord={defaultWord}
    defaultValue={defaultWord}
    defaultState={defaultState}
  />
}