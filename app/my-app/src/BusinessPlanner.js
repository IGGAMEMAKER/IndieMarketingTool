import {NumberPicker} from "./FieldPicker";
import actions from "./actions";
import {Panel} from "./Panel";
import {renderIncomeGoal} from "./RenderIncomeGoal";

export function BusinessPlanner({project, showAudiencesToo = true, mustSetDesiredIncome = false}) {
  var {desiredProfit = 10000, monthlyExpenses = 500, timeTillBurnout = 1} = project

  var desiredProfitPicker = <NumberPicker
    value={desiredProfit}
    // normalValueRenderer={v => <label>{v}$</label>}
    placeholder={"Type your desired profit"}
    onAction={val => actions.editProjectDesiredProfit(parseInt(val))}
    defaultState={false}
  />

  var monthlyExpensesPicker = <NumberPicker
    value={monthlyExpenses}
    placeholder={"What are ur expenses"}
    onAction={val => actions.editProjectMonthlyExpenses(parseInt(val))}
    defaultState={false}
  />

  var timeTillBurnoutPicker = <NumberPicker
    value={timeTillBurnout}
    placeholder={"How many months can you spend on that venture?"}
    onAction={val => actions.editProjectTimeTillBurnout(parseInt(val))}
    defaultState={false}
  />

  if (!showAudiencesToo) {
    const needsToSetDesiredIncome = project?.desiredProfit <= 0;

    let moneyError;
    if (needsToSetDesiredIncome)
      moneyError = <div className={"error"}>Set your desired income to continue</div>

    return <div>
      <Panel id="Goals" header={"How much do you want to earn?"} noHelp/>
      {moneyError}
      <p>{desiredProfitPicker}$</p>
    </div>
  }

  return <div>
    <Panel id="Goals" header={"Can you get this many users?"} noHelp/>
    {/*<p>How much do you want to earn?<br/>{desiredProfitPicker}$</p>*/}

    {/*{renderIncomeGoal(project, desiredProfit, "earn")}*/}

    {/*<p>Your monthly expenses?<br/>{monthlyExpensesPicker}</p>*/}
    {/*{renderIncomeGoal(project, monthlyExpenses, "Survive")}*/}

    {/*<p>Time till money burnout {timeTillBurnoutPicker}</p>*/}
    {/*<br/>*/}
    {/*<br/>*/}
    <center>

    {renderIncomeGoal(project, 1, '??', [
      {goal: monthlyExpenses, name: 'Sustainability', color: 'orange', editor: actions.editProjectMonthlyExpenses},
      {goal: desiredProfit, name: 'Dream', color: 'green', editor: actions.editProjectDesiredProfit},
      // {goal: monthlyExpenses / timeTillBurnout, name: 'Survive', color: 'red'},
    ])}
    </center>

    {/*<div className={"Audience-Container"}>*/}
    {/*  <table>*/}
    {/*    <tbody>*/}
    {/*    <tr className={"Audience-item"}>*/}
    {/*      <td>*/}
    {/*        How much do you want to earn?*/}
    {/*        {desiredProfitPicker}*/}
    {/*        <div>monthly</div>*/}
    {/*      </td>*/}
    {/*      <td>*/}
    {/*        Your monthly expenses?*/}
    {/*        {monthlyExpensesPicker}*/}
    {/*      </td>*/}
    {/*      <td>*/}
    {/*        Time till money burnout*/}
    {/*        {timeTillBurnoutPicker}*/}
    {/*        <div>months</div>*/}
    {/*      </td>*/}
    {/*    </tr>*/}

    {/*    <tr className={"Audience-item"}>*/}
    {/*      <td>{renderIncomeGoal(project, desiredProfit)}</td>*/}
    {/*      <td>{renderIncomeGoal(project, monthlyExpenses, 'become sustainable')}</td>*/}
    {/*      <td>{renderIncomeGoal(project, monthlyExpenses / timeTillBurnout, 'SURVIVE')}</td>*/}
    {/*    </tr>*/}
    {/*    </tbody>*/}
    {/*  </table>*/}
    {/*</div>*/}
    <br/>
    <br/>
  </div>
}