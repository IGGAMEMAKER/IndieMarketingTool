import {useState} from "react";
import storage from "./Storage";
import {AudienceSourcesPanel} from "./AudienceSourcesPanel";
import {MessagePlanner} from "./MessagePlanner";
import {AudienceChannelsList} from "./AudienceChannelsList";
import {NotesList} from "./NotesList";
import {UsefulLinks} from "./UsefulLinks";

export function NotesPanel({project, links}) {
  const MODE_NOTES = "How";
  const MODE_LINKS = "Where";

  var [mode, setMode] = useState(MODE_NOTES)

  const getSubModes = () => {
    var subModes = [MODE_NOTES] //, VISION_MODE_AUDIENCE, VISION_MODE_MONETIZATION]

    // if (isFilledEssence)
    subModes.push(MODE_LINKS)

    // if (isFilledAudiences)

    if (subModes.length === 1)
      subModes = []

    return subModes
  }

  var content;
  if (mode === MODE_NOTES)
    content = <NotesList project={project}/>

  if (mode === MODE_LINKS)
    content = <UsefulLinks links={links}/>

  return <div>
    {getSubModes().map(m => <button className={`item ${mode === m ? 'chosen' : ''}`} onClick={() => {
      setMode(m)
    }}>{m}</button>)}
    <br/>
    <br/>
    {content}
  </div>
}