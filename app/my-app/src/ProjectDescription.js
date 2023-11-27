import {Panel} from "./Panel";
import {FieldPicker} from "./FieldPicker";
import actions from "./actions";

export function ProjectDescription({project, projectId}) {
  return <div>
    <Panel id="Description" header={"What are you doing?"} noHelp/>
    <FieldPicker
      value={project?.description || ""}
      placeholder={"What will you create? Just dream. No filters and limitations"}
      onAction={val => {
        actions.editDescription(projectId, val)
      }}
    />
  </div>
}