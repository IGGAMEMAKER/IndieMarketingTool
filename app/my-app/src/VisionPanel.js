import {useState} from "react";
import storage from "./Storage";
import {ProjectEssence} from "./ProjectEssence";
import {AudiencesList} from "./AudiencesList";
import {MonetizationPanel} from "./MonetizationPanel";

export function VisionPanel({project, projectId, monetizationPlans, audiences}) {
  const VISION_MODE_ESSENCE = "Essence";
  const VISION_MODE_AUDIENCE = "Audience";
  const VISION_MODE_MONETIZATION = "Monetization";

  var [visionMode, setVisionMode] = useState(VISION_MODE_ESSENCE)

  var {
    isFilledEssence, isFilledAudiences, isDefaultName, hasPaidPlans
  } = storage.getProjectFillingStats(project)

  const getSubModes = () => {
    var subModes = [VISION_MODE_ESSENCE] //, VISION_MODE_AUDIENCE, VISION_MODE_MONETIZATION]

    if (isFilledEssence)
      subModes.push(VISION_MODE_AUDIENCE)

    if (isFilledAudiences)
      subModes.push(VISION_MODE_MONETIZATION)

    if (subModes.length === 1)
      subModes = []

    return subModes
  }

  var content;
  if (visionMode === VISION_MODE_ESSENCE)
    content = <ProjectEssence project={project} projectId={projectId}/>

  if (visionMode === VISION_MODE_AUDIENCE)
    content = <AudiencesList audiences={audiences} monetizationPlans={monetizationPlans} project={project}/>

  if (visionMode === VISION_MODE_MONETIZATION)
    content = <MonetizationPanel plans={monetizationPlans} audiences={audiences} hasPaidPlans={hasPaidPlans} />

  return <div>
    {/*<h1>Let's think</h1>*/}
    {getSubModes().map(m => <button className={`item ${visionMode === m ? 'chosen' : ''}`} onClick={() => {
      setVisionMode(m)
    }}>{m}</button>)}
    <br/>
    <br/>
    {content}
  </div>
}