import {useState} from "react";
import storage from "./Storage";
import {AudienceSourcesPanel} from "./AudienceSourcesPanel";
import {MessagePlanner} from "./MessagePlanner";
import {AudienceChannelsList} from "./AudienceChannelsList";

export function GrowthPanel({project, channels, audiences}) {
  const GROWTH_MODE_HOW_TO_REACH = "How";
  const GROWTH_MODE_WHERE = "Where";
  const GROWTH_MODE_MESSAGE = "Message";

  var [mode, setMode] = useState(GROWTH_MODE_HOW_TO_REACH)

  var {
    isFilledEssence, isFilledAudiences, isDefaultName, hasPaidPlans
  } = storage.getProjectFillingStats(project)

  const getSubModes = () => {
    var subModes = [GROWTH_MODE_HOW_TO_REACH] //, VISION_MODE_AUDIENCE, VISION_MODE_MONETIZATION]

    // if (isFilledEssence)
      subModes.push(GROWTH_MODE_WHERE)

    // if (isFilledAudiences)
      subModes.push(GROWTH_MODE_MESSAGE)

    if (subModes.length === 1)
      subModes = []

    return subModes
  }

  var content;
  if (mode === GROWTH_MODE_HOW_TO_REACH)
    content = <AudienceSourcesPanel channels={channels} audiences={audiences}/>

  if (mode === GROWTH_MODE_WHERE)
    content = <AudienceChannelsList channels={channels}/>

  if (mode === GROWTH_MODE_MESSAGE)
    content = <MessagePlanner project={project}/>

  return <div>
    {getSubModes().map(m => <button className={`item ${mode === m ? 'chosen' : ''}`} onClick={() => {
      setMode(m)
    }}>{m}</button>)}
    <br/>
    <br/>
    {content}
  </div>
}