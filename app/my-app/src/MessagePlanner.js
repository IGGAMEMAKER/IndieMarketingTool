import {useState} from "react";
import {getByID} from "./utils";
import {AudienceMessageView} from "./AudienceMessageView";
import {FieldAdder} from "./FieldAdder";
import actions from "./actions";
import {Panel} from "./Panel";

export function MessagePlanner({project}) {
  var defaultId = project.audiences.length ? project.audiences[0].id : -1

  var [chosenAudience, setChosenAudience] = useState(defaultId)
  var audience = chosenAudience === -1 ? null : getByID(project.audiences, chosenAudience)

  const audiencePicker = project.audiences.map(a => {
    return <button
      className={`toggle ${chosenAudience === a?.id ? 'chosen' : ''}`}
      onClick={() => {
        try {
          setChosenAudience(a?.id)
        } catch (e) {

        }
      }}
    >{a.name} ({a.messages.length})</button>;
  })

  const renderAudience = ({description, id, name, messages = []}) => {
    return <tr key={"marketing-planner." + id} style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', textAlign: 'left'}}>
      <td>
        <b>What will you tell <span style={{color: 'green'}}>{name}</span>?</b>
        <br/>
        <label style={{color: 'gray'}}>{description}</label>
        <ol>
          {messages.map((m, mi) => <AudienceMessageView index={mi} m={m} id={id}/>)}
          <li>
            <FieldAdder
              onAdd={val => actions.addAudienceMessage(val, id)}
              placeholder={"what will you tell them?"}
            />
          </li>
        </ol>
      </td>
    </tr>
  }

  return <div>
    <Panel id="Message" header="Your message"/>
    {audiencePicker}
    <br/>

    <div className="Container">
      <table>
        <tbody>
        {audience ? renderAudience(audience) : ''}
        </tbody>
      </table>
    </div>
  </div>
}