import {useState} from "react";
import actions from "./actions";
import {ARROW_LEFT, ARROW_RIGHT} from "./constants/symbols";
import {
  GOAL_TYPE_FEATURES,
  GOAL_TYPE_INCOME,
  GOAL_TYPE_MONETIZATION,
  GOAL_TYPE_RISK,
  GOAL_TYPE_USERS
} from "./constants/constants";
import {FieldPicker, NumberPicker} from "./FieldPicker";
import {getByID} from "./utils";
import {AudiencePicker} from "./AudiencePicker";
import {renderIncomeGoal} from "./RenderIncomeGoal";

function RiskPicker({onPick, defaultRisk=-1, risks=[], excluded=[]}) {
  var [r, setR] = useState(-1)

  const riskContainer = risks.map((r, i) => <option key={"rp." + r.id} value={r.id}>{r.name}</option>)

  return <select style={{width: '100%'}} value={r} onChange={ev => {
    var v = parseInt(ev.target.value)
    setR(v)
    onPick(v)
  }}>
    <option disabled selected value={-1}> -- select a risk --</option>
    {riskContainer}
  </select>
}


class Iteration {
  constructor(description, goals) {
    this.description = description
    this.goals = goals;

    this.duration = 1;
  }

  setDuration(duration) {
    this.duration = duration
    return this;
  }

  static getRiskGoal = (project, riskId)                         => ({goalType: GOAL_TYPE_RISK, riskId})
  static getIncomeGoal = (project, income)                       => ({goalType: GOAL_TYPE_INCOME, income})
  static getUserGoal = (project, audienceID, amount)             => ({goalType: GOAL_TYPE_USERS, userId: audienceID, amount})
  static getMonetizationGoal = (project, monetizationID, amount) => ({goalType: GOAL_TYPE_MONETIZATION, planId: monetizationID, amount})
  static getFeatureGoal = (project, text)                        => ({goalType: GOAL_TYPE_FEATURES, text})

  static getGoalsByGoalType = goalType => (it) => it.goals.filter(gg => gg.goalType === goalType)
  static getRiskGoals = Iteration.getGoalsByGoalType(GOAL_TYPE_RISK)
  static getIncomeGoals = (it) => it.goals.filter(g => g.goalType === GOAL_TYPE_INCOME)
}

const getBurnOutGoal = (project) => {
  var {desiredProfit=10000, monthlyExpenses=500, timeTillBurnout=1} = project

  return monthlyExpenses / timeTillBurnout
}
const getSustainabilityGoal = (project) => {
  var {desiredProfit=10000, monthlyExpenses=500, timeTillBurnout=1} = project

  return monthlyExpenses;
}
const getDreamGoal = (project) => {
  var {desiredProfit=10000, monthlyExpenses=500, timeTillBurnout=1} = project

  return desiredProfit;
}

function IterationEditor({project, chosenIterationId}) {
  // APPS/SERVICES
  // REDUCE RISKS
  // GROW / EARN
  // POLISH

  // GAMES
  // REDUCE RISKS
  // GROW
  // POLISH
  // EARN
  // POLISH MORE

  var [r, setR] = useState(-1)
  var [sprintLength, setSprintLength] = useState(7)

  if (chosenIterationId === -1)
    return ''

  var chosenRisks = []

  const riskContainer = project.risks.map((r, i) => <option key={"itp." + r.id} value={r.id}>{r.name}</option>)
  var possibleSolutions = ''
  if (r >= 0) {
    possibleSolutions = <ul>{project.risks[r].solutions.map(s => <li key={s.id}>{s}</li>)}</ul>
  }

  const durationSelector = <select value={sprintLength} onChange={ev => setSprintLength(ev.target.value)}>
    <option disabled selected value={-1}> -- select sprint duration --</option>
    <option value={1}>1 Day</option>
    <option value={7}>7 Days (Recommended)</option>
    <option value={14}>14 Days</option>
    <option value={30}>Month</option>
  </select>

  return <div id="editIteration">
    <br/>
    <br/>
    <h3>{project.iterations.find(it => it.id === chosenIterationId).description}</h3>
    <br/>
    <div className={"Container"}>
      <table style={{width: '100%'}}>
        <thead>
        <tr>
          <th>Grow</th>
        </tr>
        </thead>
        <tr>
          <td>
            {renderIncomeGoal(project, getSustainabilityGoal(project), 'become sustainable')}
          </td>
        </tr>
      </table>
    </div>

    <br/>
    <br/>
    <div className={"background-standard"}>
      <h3>DeRisk</h3>
      <h6>Which risks will you reduce?</h6>
      <select value={r} onChange={ev => {
        var v = parseInt(ev.target.value)
        setR(v)
      }}>
        <option disabled selected value={-1}> -- select a risk --</option>
        {riskContainer}
      </select>
      <br/>
      {possibleSolutions}

    </div>
    <br/>
    <br/>
    <div className={"Container"}>
      <h3>Tweak</h3>
    </div>
    <div>
      {durationSelector}
    </div>
  </div>
}

const getExcludedAudiencesFromMonetizationPlan = (project, monetizationId) => {
  var audiences = project.audiences;
  var mp = project.monetizationPlans[monetizationId];

  var used = {}
  mp.audiences.forEach(a => used[a] = 1)

  return audiences.filter(a => !used[a.id]).map(a => a.id)
}
const renderNecessaryUsers = (project, income, monetizationPlan) => {
  var plan = project.monetizationPlans[monetizationPlan]
  var needToSell = income / plan.price

  return <div>
    {`You need to find ${needToSell} ${plan.name}'s: `}
    <br/>
    <ul>
      {plan.audiences.map(a => {
        var name = project.audiences.find(aa => aa.id === a).name
        // return <div>{name}: {needToSell}</div>
        return <li key={"necessaryUsers." + plan.id}>{name}</li>
      })}
    </ul>
  </div>
}



function NumberGoalPicker({project, it}) {
  var [goalType, setGoalType] = useState(-1)
  var [users, setDesiredUsers] = useState(0)
  var [income, setDesiredIncome] = useState(0)
  var [audienceType, setAudienceType] = useState(-1)
  var [monetizationPlan, setMonetizationPlan] = useState(-1)
  var [risk, setRisk] = useState(-1)
  var [goals, setGoals] = useState([])

  var hasChanges = users || income || audienceType >= 0

  var goalPicker;
  var audiencePicker = <div>
    <AudiencePicker defaultAudience={audienceType} audiences={project.audiences} onPick={id => {setAudienceType(id)}}/>
    <br />
    {audienceType === -1 ? '' : <NumberPicker value={users} onAction={val => {
      setDesiredUsers(val)
      actions.addIterationGoal(it.id, Iteration.getUserGoal(project, audienceType, val))
    }}/>}
  </div>

  var monetizationPicker = <div>
    <select value={monetizationPlan} onChange={ev => setMonetizationPlan(parseInt(ev.target.value))}>
      <option disabled value={-1}>Choose monetization</option>
      {project.monetizationPlans.map((mp, i) => <option key={'mp_in_iteration.' + mp.id} value={mp.id}>{mp.name}</option>)}
    </select>
    {monetizationPlan >= 0 ?
      <div>
        {income > 0 ? renderNecessaryUsers(project, income, monetizationPlan) : ''}
        <AudiencePicker
          audiences={project.audiences}
          excluded={getExcludedAudiencesFromMonetizationPlan(project, monetizationPlan)}
        />
      </div>
      : ''}
  </div>

  if (goalType === GOAL_TYPE_INCOME) {
    // INCOME
    var sustainability = getSustainabilityGoal(project)
    var dream = getDreamGoal(project)
    goalPicker = <div>
      {income === sustainability ? '' : <button onClick={() => setDesiredIncome(sustainability)}>Survive</button>}
      {income === dream ? '' : <button onClick={() => setDesiredIncome(dream)}>Dream</button>}
      <NumberPicker
        value={income}
        onAction={val => setDesiredIncome(val)}
        normalValueRenderer={onChoose => <label style={{color: 'orange'}} onClick={onChoose}>{income}$/mo</label>}
      />
      {
        income > 0
          ?
          <div>
            How will you achieve this?
            <br/>
            {monetizationPicker}
          </div>
          :
          ''
      }
    </div>
  }

  if (goalType === GOAL_TYPE_USERS) {
    goalPicker = audiencePicker
  }

  if (goalType === GOAL_TYPE_MONETIZATION)
    goalPicker = monetizationPicker

  if (goalType === GOAL_TYPE_RISK)
    goalPicker = <div style={{width: '100%'}}>
      <RiskPicker risks={project.risks} onPick={val => {
        console.log('pick risk', {val, it})
        setRisk(val)
        actions.addIterationGoal(it.id, Iteration.getRiskGoal(project, val))
      }} defaultRisk={-1} excluded={[]} />
    </div>

  return <div>
    <select value={goalType} onChange={ev => setGoalType(parseInt(ev.target.value))}>
      <option value={-1} disabled>Choose goal</option>
      <option value={GOAL_TYPE_RISK}>REDUCE RISKS</option>
      <option value={GOAL_TYPE_INCOME}>EARN</option>
      <option value={GOAL_TYPE_USERS}>Get Users</option>
      <option value={GOAL_TYPE_MONETIZATION}>Sell X Plans</option>
    </select>
    {goalPicker}
  </div>
}

function renderIteration(project, it, i, setChosenIterationId) {
  var goals = (it.goals || [])
  var incomeGoal = goals.find(g => g.income)

  const evolvedIteration = new Iteration("PASTED", [])
  const simplifiedIteration = new Iteration("PASTED", [])

  const evolveButton = <button
    onClick={() => actions.addIteration(evolvedIteration, {pasteAfter: it.id})}
  >+</button>

  const simplifyButton = <button
    onClick={() => actions.addIteration(simplifiedIteration, {pasteBefore: it.id})}
  >+</button>

  const moveLeftButton = <button onClick={() => actions.changeIterationOrder(i, i - 1)}>{ARROW_LEFT}</button>
  const moveRightButton = <button onClick={() => actions.changeIterationOrder(i, i + 1)}>{ARROW_RIGHT}</button>

  const ideaIcon = <span style={{color: 'orange'}}>💡</span>
  const growthIcon = <span style={{color: 'green'}}>😄</span>
  const bigGrowthIcon = <span style={{color: 'green'}}>😄😄😄</span>
  const incomeIcon = bigGrowthIcon

  const onGoalRemove = gg => event => {
    if (event.detail === 2) {
      actions.removeIterationGoal(it.id, gg.id)
    }
  }

  var ideaGoals = Iteration.getRiskGoals(it)
  var userGoals = Iteration.getGoalsByGoalType(GOAL_TYPE_USERS)(it)
  var incomeGoals = Iteration.getGoalsByGoalType(GOAL_TYPE_INCOME)(it)

  return <div className={"Audience-item"} key={it.id}>
    {/*<div style={{display: 'grid', gridTemplateColumns: '25px 175px 25px'}}>*/}
    <div style={{display: 'grid', gridTemplateColumns: 'auto 25px'}}>
      {/*{simplifyButton}*/}
      <div style={{display: 'grid', gridTemplateRows: '450px 50px'}}>
        <div>
          <div>{moveLeftButton}{moveRightButton}</div>
          {/*<div><b>{it.id}</b></div>*/}
          <div className={"iteration-title"}>
            <FieldPicker
              value={it.description}
              onAction={val => actions.editIterationDescription(it.id, val)}
              onRemove={() => actions.removeIteration(it.id)}
              normalValueRenderer={onEdit => <div onClick={onEdit}><b>{it.description}</b></div>}
            />
          </div>

          {/*<br />*/}
          {/*{new Array(incomeGoals.length).fill(<b>{incomeIcon}</b>)}*/}
          {/*{new Array(ideaGoals.length).fill(<b>{ideaIcon}</b>)}*/}
          {/*{new Array(userGoals.length).fill(<b>{growthIcon}</b>)}*/}
          {/*<br />*/}
          <br/>
          {ideaGoals.map(gg => <div key={"ideaG." + gg.id} onClick={onGoalRemove(gg)}>
            {getByID(project.risks, gg.riskId)?.name} {/*project.risks[gg.riskId]?.name*/} {/*getByID(project.risks, gg.riskId)?.name*/} {/*JSON.stringify(gg)*/}
          </div>)}

          {/*<br />*/}
          {userGoals.map(gg => <div key={"userG." + gg.id} onClick={onGoalRemove(gg)}>
            Get {gg.amount} <span
            style={{color: 'green'}}>{getByID(project.audiences, gg.userId).name}</span> {/*JSON.stringify(gg)*/}
          </div>)}

          {/*<br />*/}
          <NumberGoalPicker project={project} it={it}/>
          <br/>
          <a href={"#editIteration"} onClick={() => setChosenIterationId(it.id)}>Edit</a>
        </div>
        <div>
          {incomeGoal ?
            <div style={{color: 'orange', fontWeight: '900'}}>${incomeGoal.income}/mo</div>
            : '???'
          }
        </div>
      </div>
      {evolveButton}
    </div>
  </div>
}

export function IterationPlanner({project}) {
  var [chosenIterationId, setChosenIterationId] = useState(-1)

  var goals = [
    {userId: 1, amount: 1000}, // failed peeps
    {planId: 1, amount: 100}, // dreamers
    {income: 10000}
  ]


  // not ready to pay:
  // *   I don't like paying, I don't have money,
  // **  I don't think, that this should cost money,
  // *** I don't want to pay for THIS solution

  // think like businessman with coding skills, not like coder, trying to make business
  // Test the interest, Reduce risks and grow ur audience


  var iterations = project.iterations || [];

  const onAutoGenerate = () => {
    var mockIterations = [
      new Iteration('Who needs this app more?', [
        Iteration.getRiskGoal(project, 0),
        Iteration.getRiskGoal(project, 1),
        Iteration.getMonetizationGoal(project, 0, 1000)
      ]),
      new Iteration('Do they find value and want to pay for it?', [
        Iteration.getRiskGoal(project, 3)
      ]),
      new Iteration('Get core users. Personal contact', [
        Iteration.getUserGoal(project, project.audiences[0].id, 100)]
      ),
      new Iteration('SURVIVE', [
        Iteration.getIncomeGoal(project, getBurnOutGoal(project))
      ]),
      new Iteration('BECOME SUSTAINABLE', [
        Iteration.getIncomeGoal(project, getSustainabilityGoal(project))
      ]),
      new Iteration("DREAM", [
        Iteration.getIncomeGoal(project, getDreamGoal(project))
      ]),
      // new Iteration("SELLOUT", [{income: getDreamGoal(project) * 20}] ),
    ]

    mockIterations.forEach(it => {
      actions.addIteration(it, {pasteAfter: project.iterations.length});
    })
  }

  return <div id="ITERATIONS">
    <h1>Iteration Planner</h1>
    <h2>Do the PROJECT, not just product</h2>
    <div className={""}>
      <h3>Earn</h3>
      You can earn by
      <center>
        <table style={{textAlign: 'right'}}>
          <tbody>
            <tr>
              <td><b>growing your audience</b></td>
              <td>100%+</td>
            </tr>
            <tr>
              <td>adding/tweaking monetization plans</td>
              <td>10%+</td>
            </tr>
            <tr>
              <td>by making features</td>
              <td>1%+</td>
            </tr>
          </tbody>
        </table>
      </center>
    </div>
    <br/>

    <div className={"Audience-Container"} style={{gridTemplateColumns: 'auto auto auto'}}>
      {iterations.length ? '' : <button onClick={onAutoGenerate}>Autogenerate Iterations</button>}
      {iterations.map(
        (it, i, array) => renderIteration(project, it, i, setChosenIterationId)
      )}
    </div>
    <br/>
    <br/>
    <IterationEditor project={project} chosenIterationId={chosenIterationId}/>
  </div>
}