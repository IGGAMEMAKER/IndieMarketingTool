export function renderIncomeGoal(project, goal, goalName) {
  if (!goalName)
    goalName = <span>make <b>{goal}</b> monthly</span>

  return <div>
    To {goalName}, you need one of
    <br/>
    <br/>
    <center>
      <table>
        <tbody>
          <tr>
            {project.monetizationPlans.filter(plan => plan.price).map(plan => {
              var rounded = Math.ceil(goal / plan.price)
              return <td key={"plan-in-incomasdasdasd." + plan.id}>
                <b>{plan.name}'s</b>
                <br/>
                {rounded}
              </td>
            })}
          </tr>
        </tbody>
      </table>
    </center>
  </div>
}