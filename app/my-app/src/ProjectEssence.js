import {isGame} from "./utils/projectUtils";
import {Panel} from "./Panel";
import {FieldPicker} from "./FieldPicker";
import actions from "./actions";

export function ProjectEssence({project}) {
  var essence;
  var header;
  var placeholder

  if (isGame(project)) {
    essence = project?.mainFeeling;
    header = "Which feel do you want to create?"
    placeholder = "main feel"
  } else {
    essence = project?.mainProblem;
    header = "Which problem are you trying to solve?"
    placeholder = "main problem"
  }

  return <div>
    <Panel id="Problem" header={header}/>
    <div className="panel-instructions">
      {/*<h3>Most important part of the project/!*. 99% importance*!/</h3>*/}
      <h3>MOST IMPORTANT QUESTION{/*. 99% importance*/}</h3>
      <h4>If you cannot formulate it clearly, the rest is FANTASY</h4>
    </div>
    {/*<hr />*/}
    {/*<h5>Which can still be fine</h5>*/}
    <FieldPicker
      value={essence || ""}
      placeholder={placeholder}
      onAction={val => {
        actions.editMainProblem(val)
      }}
    />
  </div>
}