import {isGame} from "./utils/projectUtils";
import {FieldAdder} from "./FieldAdder";
import actions from "./actions";
import {DEFAULT_APP_NAME, DEFAULT_GAME_NAME} from "./constants/constants";



export function ProjectAdder({appType, defaultState}) {
  var defaultWord;
  if (isGame({type: appType}))
    defaultWord = DEFAULT_GAME_NAME
  else
    defaultWord = DEFAULT_APP_NAME

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