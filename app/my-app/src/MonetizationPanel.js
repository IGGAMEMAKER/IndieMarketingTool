import {Panel} from "./Panel";
import {MonetizationPlan} from "./MonetizationPlan";
import {MonetizationAdder} from "./MonetizationAdder";

export function MonetizationPanel({plans, audiences, hasPaidPlans}) {
  var content = <div>Who will pay and for what?</div>
  var needOnePaidPlanAtLeast;
  if (!hasPaidPlans)
    needOnePaidPlanAtLeast = <div className={"error"}>Create at least one PAID plan and attach users, who will pay for it</div>

  return <div>
    <Panel id="Monetization" header={content}/>
    {needOnePaidPlanAtLeast}
    <div className="Audience-Container">
      {plans.map((p, i) => <MonetizationPlan key={'monetizationPlanX.' + p.id + ' ' + i} plan={p} index={i}
                                             audiences={audiences}/>)}
      <MonetizationAdder/>
    </div>
  </div>
}