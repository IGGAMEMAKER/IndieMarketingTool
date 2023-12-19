import {FieldPicker} from "./FieldPicker";
import {Link} from "react-router-dom";
import actions from "./actions";
import {FieldAdder} from "./FieldAdder";
import {Panel} from "./Panel";
import {AudienceChannelsList} from "./AudienceChannelsList";

export function AudienceSourcesPanel({channels, audiences}) {
  const renderAudienceStrats = ({description, id, name, strategy, messages = []}) => {
    if (!Array.isArray(strategy))
      strategy = [strategy]

    var strategyPicker = <ol>
      {strategy.map(s => {
        var strategyId = s.id
        // console.log(s.id, 'strategyPicker', {strategyId})

        var isTooBig = s.name.split(' ').find(word => word.length > 15);
        var style = {}
        if (isTooBig) {
          style = {overflow: 'hidden', width: '250px', textOverflow: 'elipsis'}
        }
        var isUrl = isTooBig && s.name.startsWith('http') || s.name.startsWith('www')

        return <li key={"strategy." + id + "." + strategyId}>
          <FieldPicker
            value={s.name}
            normalValueRenderer={onEdit => {
              if (isUrl) {
                return <div>
                  <div className="editable" style={style} onClick={() => onEdit(true)}>
                    edit
                  </div>
                  <Link to={s.name}>link</Link>
                </div>
              }

              return <div className="editable" onClick={() => onEdit(true)}>{s.name}</div>
            }}
            placeholder={"How will you reach them?"}
            onAction={newStrategy => actions.editAudienceStrategy(newStrategy, id, strategyId)}
            onRemove={() => actions.removeAudienceStrategy(id, strategyId)}
          />
        </li>
      })}
      <li>
        <FieldAdder onAdd={val => actions.addAudienceStrategy(val, id)} placeholder={"add more ways"}/>
      </li>
    </ol>

    return <tr className="Audience-item" key={"marketing-planner." + id}
               style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', textAlign: 'left'}}>
      <td>
        <b>How to reach <span style={{color: 'green'}}>{name}</span>?</b>
        <br/>
        <label className="audience-description">{description}</label>
        <br/>
        {strategyPicker}
      </td>
    </tr>
  }

  return <div>
    <Panel id="GROWTH" header="Growth strategy"/>
    <div className="Audience-Container">
      {audiences.map(a => renderAudienceStrats(a))}
    </div>
    <AudienceChannelsList channels={channels}/>
  </div>
}