import {isApp, isGame} from "./utils/projectUtils";

export function TieredRisks({project}) {
  var essenceCheck;

  const getTieredRisk = (time, description) => <tr>
    <td className="left">{time}</td>
    <td></td>
    <td></td>
    <td>{description}</td>
  </tr>

  const saasThing = <div>
    <center>
      <table>
        {getTieredRisk("hours", "1) Who has that problem? Google forms + Search (SEO + Gum)")}
        {getTieredRisk("days", "2) Who has that problem? Landing page")}
        {getTieredRisk("week?", "If enough people subbed, split em (half for free testing / half for paid)")}
        {/*<tr><td className="left">hours</td><td></td><td></td><td></td></tr>*/}
        {/*<tr><td className="left">days</td><td></td><td></td><td>2) Who has that problem? Landing page</td></tr>*/}
        {/*<tr><td className="left">week?</td><td></td><td></td><td>If enough people subbed, split em (half for free testing / half for paid)</td></tr>*/}
      </table>
    </center>
  </div>

  const gameplayThing = <div>
    <center>
      <table>
        {getTieredRisk("hour", "1 sentence")}
        {getTieredRisk("hours", "Intro post (I want to make game like X, but Y; genre & main features)")}
        {getTieredRisk("hours", "Intro WITH screenshot")}
        {getTieredRisk("days", "Screenshots")}
        {getTieredRisk("week", "Trailer")}
        {getTieredRisk("day/week", "Prototype")}
        {/*<tr><td className="left">hour</td><td></td><td></td><td>1 sentence</td></tr>*/}
        {/*<tr><td className="left">hours</td><td></td><td></td><td>Intro post (I want to make game like X, but Y; genre & main features)</td></tr>*/}
        {/*<tr><td className="left">hours</td><td></td><td></td><td>Intro WITH screenshot</td></tr>*/}
        {/*<tr><td className="left">days</td><td></td><td></td><td>Screenshots</td></tr>*/}
        {/*<tr><td className="left">week</td><td></td><td></td><td>Fake Gameplay Trailer</td></tr>*/}
        {/*<tr><td className="left">day/week</td><td></td><td></td><td>Prototype</td></tr>*/}
      </table>
    </center>
  </div>

  if (isGame(project)) {
    essenceCheck = <div>
      <div>
        Do people want to play that?
      </div>

      <br/>
      {gameplayThing}
    </div>
  }

  if (isApp(project)) {
    essenceCheck = <p>
      <h2>Does the problem exist?</h2>
      {saasThing}
      {/*<br />*/}
      {/*{gameplayThing}*/}
    </p>
  }

  return <div>
    <div>{essenceCheck}</div>
  </div>
}