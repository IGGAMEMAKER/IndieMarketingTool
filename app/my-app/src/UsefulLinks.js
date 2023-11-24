import {FieldPicker} from "./FieldPicker";
import actions from "./actions";
import {Panel} from "./Panel";
import {LinkAdder} from "./LinkAdder";
import {LINK_TYPE_DOCS, LINK_TYPE_SIMILAR} from "./constants/constants";

export function UsefulLinks({links}) {
  var list = []

  links.forEach(l => {
    // var l = links[i]

    list.push(<div key={"useful-links.link." + l.id}><a target={"_blank"} href={l.link}>Link</a></div>)
    list.push(<FieldPicker
      key={"links-field" + l.id}
      value={l.note}
      onAction={val => actions.editLinkNotes(l.id, val)}
    />)

    list.push(<div key={"useful-links.select." + l.id}>
      <select className="link-select" value={l.linkType} onChange={ev => {
        actions.editLinkType(l.id, parseInt(ev.target.value))
      }}>
        <option value={LINK_TYPE_DOCS}>Docs</option>
        <option value={LINK_TYPE_SIMILAR}>Similar</option>
      </select>
    </div>)

    list.push(<div key={"useful-links.remove." + l.id}>
      <button onClick={() => actions.removeLink(l.id)}>x</button>
    </div>)
  })

  return <div>
    <Panel id="Links" header="Save useful links here" noHelp/>
    <div><LinkAdder/></div>
    <br/>
    <div className="Container links list">
      {list}
    </div>
  </div>
}