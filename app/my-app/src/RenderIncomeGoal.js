export function renderIncomeGoal(project, goal, goalName, goals = []) {
  if (!goalName)
    goalName = <span>make <b>{goal}</b> monthly</span>

  var paidPlans = project.monetizationPlans
    .filter(plan => plan.price)

  if (goals.length) {
    return <table>
      <tr>
        <td></td>
        {paidPlans.map(plan => <td><b>{plan.name}'s</b></td>)}
      </tr>
      {goals.map(g=> {
        return <tr>
          <td style={{textAlign: 'right'}}><b>{g.name}</b><br />{g.goal}$</td>
          {paidPlans.map(plan =>
            <td key={"plan-in-incomeee." + plan.id} style={{color: g.color || 'white'}}>
              {Math.ceil(g.goal / plan.price)}
            </td>
          )}
        </tr>
      })}
    </table>
  }
  return <div>
    To {goalName}, you need one of
    <br/>
    <br/>
    <center>
      {paidPlans
        .map(plan =>
          <div key={"plan-in-incomeee." + plan.id}>
            <b>{plan.name}'s</b>: {Math.ceil(goal / plan.price)}
          </div>)}
    </center>
  </div>
}