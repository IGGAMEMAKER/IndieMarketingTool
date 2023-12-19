import {Panel} from "./Panel";
import {MonetizationPlan} from "./MonetizationPlan";
import {MonetizationAdder} from "./MonetizationAdder";

export function MonetizationPanel({plans, audiences}) {
  var content = <div>Who will pay and for what?</div>

  return <div>
    <Panel id="Monetization" header={content}/>
    <div className="Audience-Container">
      {plans.map((p, i) => <MonetizationPlan key={'monetizationPlanX.' + p.id + ' ' + i} plan={p} index={i}
                                             audiences={audiences}/>)}
      <MonetizationAdder/>
    </div>
  </div>
}