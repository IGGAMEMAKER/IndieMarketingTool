import {Panel} from "./Panel";
import {FieldPicker} from "./FieldPicker";
import actions from "./actions";

function GlobalStrategyPlanner({project}) {
  return <div>
    <Panel id="Strategy" header="Your strategy"/>
    <FieldPicker
      value={project?.strategy || ''}
      placeholder={"who you will test first, who will you get second, e.t.c. which features will you add before/after"}
      onAction={val => actions.editStrategy(val)}
      autoFocus={false}
    />
  </div>
}