import {FieldAdder} from "./FieldAdder";
import actions from "./actions";

export function LinkAdder({}) {
  return <div>
    <div>
      <FieldAdder onAdd={val => {
        actions.addLink(val)
      }} placeholder="Add link" defaultState={true} autoFocus={false}/>
    </div>
  </div>
}