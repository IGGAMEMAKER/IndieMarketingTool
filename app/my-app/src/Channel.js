import {useState} from "react";
import {getUrlWithoutPrefixes} from "./utils/getDomains";
import {FieldPicker} from "./FieldPicker";
import actions from "./actions";

export function Channel({channel}) {
  var [isDangerous, setDangerous] = useState(false)
  var {link, name, users} = channel
  var l = name || getUrlWithoutPrefixes(link)


  // SOURCE TYPE
  // human
  // publisher (games)
  // press (journals)
  // video channel
  // text channels

  const namePicker = <FieldPicker
    value={name}
    placeholder={"Add short name"}
    onAction={val => {
      actions.editChannelName(channel.id, val)
    }}
  />

  return (
    // <div className="Channel-item">
    <tr style={{textAlign: 'left', backgroundColor: isDangerous ? 'red' : 'white'}}>
      <td style={{width: '250px'}}>
        <a href={link} target={"_blank"}>{l}</a>
      </td>
      <td style={{width: '250px'}}>
        {namePicker}
      </td>
      <td>
        <button
          onMouseLeave={() => setDangerous(false)}
          onMouseEnter={() => setDangerous(true)}
          onClick={() => {
            actions.removeChannel(channel.id)
          }}
        >x
        </button>
      </td>
    </tr>
  )
}