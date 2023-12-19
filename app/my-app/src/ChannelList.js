import {getDomain} from "./utils/getDomains";
import {Channel} from "./Channel";
import {FieldAdder} from "./FieldAdder";
import actions from "./actions";

function ChannelAdder({}) {
  return <FieldAdder
    placeholder={"audience source link"}
    onAdd={val => {
      actions.addChannel(val)
    }}
  />
}

export function ChannelList({channels}) {
  var groupedChannels = {}

  channels.forEach((c, i) => {
    var domain = getDomain(c.link)

    if (!groupedChannels[domain])
      groupedChannels[domain] = []

    groupedChannels[domain].push({c, i})
  })

  var mapped = channels
    .sort((c1, c2) => c2.users - c1.users)
    .map(cc => <Channel key={"channel." + cc.id} channel={cc}/>)

  return <table>
    <thead>
    <tr>
      <th>Name</th>
      <th>Link</th>
      <th></th>
    </tr>
    </thead>
    <tbody>
    {mapped}
    <tr>
      <th>
        <ChannelAdder/>
      </th>
    </tr>
    </tbody>
  </table>
}