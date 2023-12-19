import {FieldAdder} from "./FieldAdder";
import actions from "./actions";
import {FieldPicker} from "./FieldPicker";

export function NotesList({project}) {
  var notes = project.notes || []

  return <div>
    <FieldAdder placeholder={"type your mind"} onAdd={val => actions.addNote(val)} defaultState={true}
                autoFocus={false}/>
    <br/>
    <br/>
    <ul className="list">
      {notes.map((n, i) => {
        return <li
          key={"note" + n.id}
          className="left paddings"
        >
          <FieldPicker
            autoFocus
            value={n.name}
            placeholder={"type your mind"}
            onAction={val => actions.editNote(n.id, val)}
            onRemove={() => {
              actions.removeNote(n.id)
            }}
          />
          {/*<button className={"right"} onClick={openNotePopup}>Convert To..</button>*/}
        </li>
      })}
    </ul>
  </div>
}