import {useState} from "react";
import {isGame} from "./utils/projectUtils";
import {Panel} from "./Panel";
import {getAudienceUsageCount} from "./utils/getEntityUsageCount";
import {Audience} from "./Audience";
import {AudienceAdder} from "./AudienceAdder";

export function AudiencesList({audiences, monetizationPlans, project}) {
  const [isFullAudienceInfo, setIsFullInfo] = useState(false);

  var audiencePhrase

  if (isGame(project)) {
    audiencePhrase = 'Who will play your game?'
  } else {
    audiencePhrase = 'Who will use your service?'
  }

  var needAtLeastOneAudience;
  if (!audiences.length)
    needAtLeastOneAudience = <div className={"error"}>Type at least one user profile!</div>

  return <div>
    <Panel id="Audiences" header={audiencePhrase}/>
    {needAtLeastOneAudience}
    <div className="Audience-Container">
      {audiences.map((a, i) => {
          var usages = getAudienceUsageCount(monetizationPlans, a)

          return <Audience
            onToggleFullInfo={() => {
              setIsFullInfo(!isFullAudienceInfo)
            }}
            isFull={!isFullAudienceInfo}

            name={a.name}
            description={a.description}
            strategy={a.strategy}
            id={a.id}
            usages={usages}
            index={i}
            key={`audiencessss${a.id}`}
          />
        }
      )}
      <AudienceAdder placeholder={audiencePhrase}/>
    </div>
  </div>
}