import actions from "./actions";
import {NumberPicker} from "./FieldPicker";

export function renderIncomeGoal(project, goal, goalName, goals = []) {
  if (!goalName)
    goalName = <span>make <b>{goal}</b> monthly</span>

  var paidPlans = project.monetizationPlans
    .filter(plan => plan.price)

  if (goals.length) {
    // return <table>
    //   <tr>
    //     <td></td>
    //     {paidPlans.map(plan => <td><b>{plan.name}'s</b></td>)}
    //   </tr>
    //   {goals.map(g=> {
    //     return <tr>
    //       <td style={{textAlign: 'right'}}><b>{g.name}</b><br />{g.goal}$</td>
    //       {paidPlans.map(plan =>
    //         <td key={"plan-in-incomeee." + plan.id} style={{color: g.color || 'white'}}>
    //           {Math.ceil(g.goal / plan.price)}
    //         </td>
    //       )}
    //     </tr>
    //   })}
    // </table>

    return <table>
      <tr>
        <td></td>
        {/*{goals.map(g => <td><b>{g.name}</b><br/>{g.goal}$</td>)}*/}
        {goals.map(g => <td>
          <b>{g.name}</b>
          <br/>
          <NumberPicker
            value={g.goal}
            // normalValueRenderer={onEditClick => <label onClick={onEditClick}>{g.goal}$</label>}
            placeholder={"Type your desired profit"}
            onAction={val => g.editor(parseInt(val))}
            defaultState={false}
          />$
        </td>)}
      </tr>
      {paidPlans.map(plan => {
        return <tr>
          <td style={{textAlign: 'right'}}>{plan.name}'s</td>
          {goals.map(g => {
            return <td key={"plan-in-incomeee." + plan.id + "." + g.name} style={{color: g.color || 'white'}}>
              {Math.ceil(g.goal / plan.price)} <span className={"required-users"}>👤</span>
              {/*<svg viewBox="0 0 150 300">*/}
              {/*  <circle cx="75" cy="55" r="50"/>*/}
              {/*  <path d="M75,105 L75,200 L25,300 M75,200 L125,300 M0,150 L150,150"></path>*/}
              {/*</svg>*/}
            </td>
          })}
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