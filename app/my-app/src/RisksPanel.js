import {Panel} from "./Panel";
import {RiskList} from "./RiskView";

export function RisksPanel({risks, project}) {
  return <div>
    <Panel id="Risks" header="What are your biggest risks / doubts / problems?"/>
    <div className="Container">
      <RiskList risks={risks} project={project}/>
    </div>
  </div>
}