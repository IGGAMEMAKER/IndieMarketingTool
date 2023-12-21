import {ChannelList} from "./ChannelList";
import {Panel} from "./Panel";

export function AudienceChannelsList({channels}) {
  return <div>
    <Panel id="Sources" header="Where will you find your audience?"/>
    {/*<h3>Where will you find your audience?</h3>*/}
    <div className="Container">
      <ChannelList channels={channels}/>
    </div>
  </div>
}