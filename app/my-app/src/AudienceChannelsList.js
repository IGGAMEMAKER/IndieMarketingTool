import {ChannelList} from "./ChannelList";

export function AudienceChannelsList({channels}) {
  return <div>
    <h3>Where will you find your audience?</h3>
    <div className="Container">
      <ChannelList channels={channels}/>
    </div>
  </div>
}