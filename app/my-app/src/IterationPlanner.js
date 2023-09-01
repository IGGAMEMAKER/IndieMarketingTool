import {useState} from "react";
import actions, {solveIterationGoal} from "./actions";
import {ARROW_LEFT, ARROW_RIGHT} from "./constants/symbols";
import {GOAL_TYPE_FEATURES, GOAL_TYPE_INCOME, GOAL_TYPE_RISK, GOAL_TYPE_USERS} from "./constants/constants";
import {FieldPicker, NumberPicker} from "./FieldPicker";
import {getByID} from "./utils";
import {AudiencePicker} from "./AudiencePicker";
import {FieldAdder} from "./FieldAdder";
import {RiskAdder} from "./RiskAdder";
import {Iteration} from "./Iteration";
import {RiskList, RiskView} from "./RiskView";
import {Panel} from "./Panel";

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

const renderRiskGoals = (project, it, showSolutions = false) => {
  var goals = Iteration.getGoalsByGoalType(GOAL_TYPE_RISK)(it)

  return goals.map(gg => {
    var risk = getByID(project.risks, gg.riskId);
    console.log('render risk goals', gg.riskId)

    if (showSolutions)
      return <RiskView risk={risk} goal={gg} it={it} orderingAllowed={false} />

    return <div key={"ideaG." + gg.id} onClick={onGoalRemove(it, gg)}>{risk?.name}</div>
  })
}

const renderFeatureGoals = (project, it) => {
  var goals = Iteration.getGoalsByGoalType(GOAL_TYPE_FEATURES)(it)

  return goals.map(gg => <li key={"featureG." + gg.id} onClick={onGoalRemove(it, gg)}>
    <b className={gg.solved ? 'solved feature' : 'feature'} style={{color: gg.solved ? 'gold' : 'white'}}>{gg.text}</b>
    <input type={"checkbox"} checked={gg.solved} value={"Solve"} onChange={ev => {
      var v = ev.target.checked
      console.log(v)
      actions.solveIterationGoal(it.id, gg.id, !!v)
    }}/>
  </li>)
}

const renderUserGoals = (project, it) => {
  var goals = Iteration.getGoalsByGoalType(GOAL_TYPE_USERS)(it)

  return goals.map(gg => {
    var audience = getByID(project.audiences, gg.userId)

    return <div key={"userG." + gg.id} onClick={onGoalRemove(it, gg)}>
      Get {gg.amount} <span style={{color: 'green'}}>{audience?.name}</span>
    </div>
  })
}

function IterationPopup({project, chosenIterationId, onChoose}) {
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

  var [sprintLength, setSprintLength] = useState(7)

  if (chosenIterationId === -1)
    return ''

  const durationSelector = <select value={sprintLength} onChange={ev => setSprintLength(ev.target.value)}>
    <option disabled selected value={-1}> -- select sprint duration --</option>
    <option value={1}>1 Day</option>
    <option value={7}>7 Days (Recommended)</option>
    <option value={14}>14 Days</option>
    <option value={30}>Month</option>
  </select>

  var it = getByID(project.iterations, chosenIterationId);
  var popupCloser = <div onClick={() => onChoose(-1)} className={"iteration-container"} />


  return <div id="editIteration" className={"edit-iteration"}>
    {popupCloser}
    <div>
      {/*<h3>{it.description}</h3>*/}
      <FieldPicker
        value={it.description}
        onAction={val => actions.editIterationDescription(it.id, val)}
        onRemove={() => {
          actions.removeIteration(it.id)
          onChoose(-1)
        }}
        normalValueRenderer={onEdit => <h3 onClick={onEdit}><b>{it.description}</b></h3>}
      />
      {/*<div>{durationSelector}</div>*/}
      <NumberGoalPicker project={project} it={it} />
    </div>
    {popupCloser}
  </div>
}

const getExcludedAudiencesFromMonetizationPlan = (project, monetizationId) => {
  var audiences = project.audiences;
  var mp = getByID(project.monetizationPlans, monetizationId)

  var used = {}
  mp.audiences.forEach(a => used[a] = 1)

  return audiences.filter(a => !used[a.id]).map(a => a.id)
}

const getNecessaryUsers = (project, planId, income) => {
  var plan = getByID(project.monetizationPlans, planId) //project.monetizationPlans[monetizationPlan]
  var needToSell = Math.ceil(income / plan.price)

  return needToSell
}

const getGoalsAboutGettingSpecificAudience = (it, audienceId) => {
  return Iteration.getGoalsByGoalType(GOAL_TYPE_USERS)(it).filter(g => g.userId === audienceId)
}
const isHasGoalToGetSpecificAudience = (it, audienceId) => {
  return getGoalsAboutGettingSpecificAudience(it, audienceId).length
}

const renderNecessaryUsers = (project, income, planId, it) => {
  var plan = getByID(project.monetizationPlans, planId) //project.monetizationPlans[monetizationPlan]
  var needToSell = getNecessaryUsers(project, planId, income)

  return <div>
    <br />
    {`You need to find ${needToSell} ${plan.name}'s: `}
    <br/>
    <ul>
      {plan.audiences.map(audienceId => {
        // console.log({audienceId}, plan)

        var name = getByID(project.audiences, audienceId).name
        var hasGoalToGetTheseUsers = isHasGoalToGetSpecificAudience(it, audienceId) // Iteration.getGoalsByGoalType(GOAL_TYPE_USERS)(it).filter(g => g.userId === audienceId).length

        // return <li key={"necessaryUsers." + plan.id + "." + a.id}>{name}</li>
        return <li
          key={"necessaryUsers." + audienceId}
          style={{color: hasGoalToGetTheseUsers ? 'green': 'gray'}}
          onClick={() => {
            if (hasGoalToGetTheseUsers) {
              var goals = getGoalsAboutGettingSpecificAudience(it, audienceId)
              goals.forEach(gg => {
                actions.removeIterationGoal(it.id, gg.id)
              })
            } else {
              actions.addIterationGoal(it.id, Iteration.createUserGoal(project, audienceId, needToSell))
            }
          }}>{name}</li>
      })}
    </ul>
  </div>
}

const onGoalRemove = (it, gg) => event => {
  if (event.detail === 2) {
    actions.removeIterationGoal(it.id, gg.id)
  }
}

function renderIncomeSection(project, it, income, planId, setMonetizationPlan) {
  if (income <= 0) return ''

  var mp;
  if (planId >= 0) {
    mp = <div>
      {income > 0 ? renderNecessaryUsers(project, income, planId, it) : ''}
      {/*<AudiencePicker*/}
      {/*  audiences={project.audiences}*/}
      {/*  excluded={getExcludedAudiencesFromMonetizationPlan(project, planId)}*/}
      {/*  onPick={v => {actions.addIterationGoal(it.id, Iteration.createUserGoal(project, v, getNecessaryUsers(project, planId, income)))}}*/}
      {/*/>*/}
    </div>
  }

  return <div>
    <br/>
    {/*How will you achieve this?*/}
    {/*<br/>*/}
    You need to sell <select value={planId} onChange={ev => {
    var planId = parseInt(ev.target.value)

    setMonetizationPlan(planId)
    var needToSell = getNecessaryUsers(project, planId, income)
    actions.addIterationGoal(it.id, Iteration.createMonetizationGoal(project, planId, needToSell))
  }}>
    <option disabled value={-1}>Choose monetization</option>
    {project.monetizationPlans.map(mp => {
      var needToSell = getNecessaryUsers(project, mp.id, income)

      return <option key={'mp_in_iteration.' + mp.id} value={mp.id}>{mp.name}</option>
    })}
  </select>
    {mp}
    <br />
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

  var [r, setR] = useState(-1)


  var hasChanges = users || income || audienceType >= 0

  var possibleSolutions = ''
  if (r >= 0) {
    possibleSolutions = <ul>{project.risks[r].solutions.map(s => <li key={s.id}>{s.name}</li>)}</ul>
  }

  var goalPicker;
  var audiencePicker = <div>
    <AudiencePicker defaultAudience={audienceType} audiences={project.audiences} onPick={id => {setAudienceType(id)}}/>
    <br />
    {audienceType === -1 ? '' : <NumberPicker value={users} onAction={val => {
      setDesiredUsers(val)
      actions.addIterationGoal(it.id, Iteration.createUserGoal(project, audienceType, val))
    }}/>}
    {renderUserGoals(project, it)}
  </div>

  var featurePicker = <div>
    <h2>Don't feature creep</h2>
    <br />
    Think, which problem will this feature solve? And is it a strongest pick in terms of time/money
    <br />
    <br />
    <ol>{renderFeatureGoals(project, it)}</ol>
    <br />
    <br />
    <FieldAdder
      placeholder={"Add new feature"}
      onAdd={val => {
        actions.addIterationGoal(it.id, Iteration.createFeatureGoal(project, val))
      }}
    />
  </div>

  // if (goalType === -1)
  //   goalPicker = priorityMockup

  if (goalType === GOAL_TYPE_INCOME) {
    var sustainability = getSustainabilityGoal(project)
    var dream = getDreamGoal(project)

    const onIncomeSet = v => {
      setDesiredIncome(v)
      actions.addIterationGoal(it.id, Iteration.createIncomeGoal(project, v))
    }

    goalPicker = <div>
      <h3>How much do you want to earn?</h3>
      {income === sustainability ? '' : <button onClick={() => onIncomeSet(sustainability)}>Survive</button>}
      {income === dream          ? '' : <button onClick={() => onIncomeSet(dream)}>Dream</button>}
      <NumberPicker
        value={income}
        onAction={val => onIncomeSet(val)}
        normalValueRenderer={onChoose => <label style={{color: 'orange'}} onClick={onChoose}>{income}$/mo</label>}
      />
      {renderIncomeSection(project, it, income, monetizationPlan, setMonetizationPlan)}
    </div>
  }


  if (goalType === GOAL_TYPE_USERS) {
    goalPicker = audiencePicker
  }

  if (goalType === GOAL_TYPE_FEATURES) {
    goalPicker = featurePicker
  }

  // if (goalType === GOAL_TYPE_MONETIZATION)
  //   goalPicker = monetizationPicker

  if (goalType === GOAL_TYPE_RISK) {
    goalPicker = <div style={{width: '100%'}}>
      <div className={"background-standard scrollable-goal-wrapper"}>
        {/*<h6>DeRisk</h6>*/}
        <h3>Which risks will you reduce?</h3>
        <ol>
          {renderRiskGoals(project, it, true)}
        </ol>

        <RiskPicker risks={project.risks} onPick={val => {
          setRisk(val)
          actions.addIterationGoal(it.id, Iteration.createRiskGoal(project, val))
        }} defaultRisk={-1} excluded={[]}/>
        <RiskAdder it={it} project={project} />
        <br/>
        {possibleSolutions}
      </div>
    </div>
  }


  const gt = (goalType1, name) => {
    var goals = Iteration.getGoalsByGoalType(goalType1)(it).length
    return <button
      onClick={() => setGoalType(goalType1)}
      style={{backgroundColor: goalType === goalType1 ? 'yellow' : 'white'}}
    >{name}{goals ? ' (' + goals + ')' : ''}</button>
  }

  return <div>
    <div>
      {gt(GOAL_TYPE_RISK, 'REDUCE RISKS')}
      {gt(GOAL_TYPE_INCOME, 'EARN')}
      {gt(GOAL_TYPE_USERS, 'GROW')}
      {gt(GOAL_TYPE_FEATURES, 'Features')}
    </div>
    {/*<select value={goalType} onChange={ev => setGoalType(parseInt(ev.target.value))}>*/}
    {/*  <option value={-1}>Choose goal</option>*/}
    {/*  <option value={GOAL_TYPE_RISK}>REDUCE RISKS</option>*/}
    {/*  <option value={GOAL_TYPE_INCOME}>EARN</option>*/}
    {/*  <option value={GOAL_TYPE_USERS}>Get Users</option>*/}
    {/*  /!*<option value={GOAL_TYPE_MONETIZATION}>Sell X Plans</option>*!/*/}
    {/*  <option value={GOAL_TYPE_FEATURES}>Features</option>*/}
    {/*</select>*/}
    <br />
    {/*<br />*/}
    {goalPicker}
    {/*{renderUserGoals(project, it)}*/}
  </div>
}

function renderIteration(project, it, i, setChosenIterationId) {
  const evolvedIteration = new Iteration("NEW ITERATION", [])
  const simplifiedIteration = new Iteration("NEW ITERATION", [])

  const evolveButton = <button
    onClick={() => actions.addIteration(evolvedIteration, {pasteAfter: it.id})}
  >+</button>

  const simplifyButton = <button
    onClick={() => actions.addIteration(simplifiedIteration, {pasteBefore: it.id})}
  >+</button>

  const moveLeftButton = <button onClick={ev => {
    ev.preventDefault()
    actions.changeIterationOrder(i, i - 1)
  }}>{ARROW_LEFT}</button>

  const moveRightButton = <button onClick={ev => {
    ev.preventDefault()
    actions.changeIterationOrder(i, i + 1)
  }}>{ARROW_RIGHT}</button>

  const editLink = <a href={"#editIteration"} onClick={() => setChosenIterationId(it.id)}>Edit</a>

  const ideaIcon = <span style={{color: 'orange'}}>?</span> // 💡
  const growthIcon = <span style={{color: 'green'}}>😄</span>
  const bigGrowthIcon = <span style={{color: 'green'}}>😄😄😄</span>
  const featureIcon = <span style={{color: 'red'}}>⚙︎</span>
  const incomeIcon = bigGrowthIcon

  var ideaGoals     = Iteration.getGoalsByGoalType(GOAL_TYPE_RISK)(it)
  var userGoals     = Iteration.getGoalsByGoalType(GOAL_TYPE_USERS)(it)
  var featureGoals  = Iteration.getGoalsByGoalType(GOAL_TYPE_FEATURES)(it)
  var incomeGoals   = Iteration.getGoalsByGoalType(GOAL_TYPE_INCOME)(it)

  var incomeGoal = ''
  if (incomeGoals.length) {
    var g = incomeGoals[0]

    incomeGoal = <div className={"income-goal"} onClick={onGoalRemove(it, g)}>+${g.income}/mo</div>
  }

  return <div className={"Audience-item"} key={it.id} onClick={() => setChosenIterationId(it.id)}>
    {/*<div style={{display: 'grid', gridTemplateColumns: '25px 175px 25px'}}>*/}
    <div style={{display: 'grid', gridTemplateColumns: 'auto 25px'}}>
      {/*{simplifyButton}*/}
      <div style={{display: 'grid', gridTemplateRows: '250px 50px'}}>
        <div>
          {/*<div>{moveLeftButton}{moveRightButton} {editLink}</div>*/}
          <div>{moveLeftButton}{moveRightButton}</div>
          <div className={"iteration-title"}>
            {it.description}
          </div>

          <br />
          {new Array(incomeGoals.length).fill(<b>{incomeIcon}</b>)}
          {new Array(ideaGoals.length).fill(<b>{ideaIcon}</b>)}
          {new Array(userGoals.length).fill(<b>{growthIcon}</b>)}
          {new Array(featureGoals.length).fill(<b>{featureIcon}</b>)}
          <br/>
          {/*{renderRiskGoals(project, it)}*/}
          {/*{renderUserGoals(project, it)}*/}
        </div>
        <div>
          {incomeGoal}
        </div>
      </div>
      {evolveButton}
    </div>
  </div>
}

const priorityMockup =     <div>
  <h3>You can earn by</h3>
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


export function IterationPlanner({project}) {
  var [chosenIterationId, setChosenIterationId] = useState(-1)

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
        // Iteration.getRiskGoal(project, 0),
        // Iteration.getRiskGoal(project, 1),
        Iteration.createMonetizationGoal(project, 0, 1000)
      ]),
      new Iteration('Do they find value and want to pay for it?', [
        // Iteration.getRiskGoal(project, 3)
      ]),
      new Iteration('Get core users. Personal contact', [
        // Iteration.getUserGoal(project, project.audiences[0].id, 100)
      ]),
      new Iteration('SURVIVE', [
        Iteration.createIncomeGoal(project, getBurnOutGoal(project))
      ]),
      new Iteration('BECOME SUSTAINABLE', [
        Iteration.createIncomeGoal(project, getSustainabilityGoal(project))
      ]),
      new Iteration("DREAM", [
        Iteration.createIncomeGoal(project, getDreamGoal(project))
      ]),
      // new Iteration("SELLOUT", [{income: getDreamGoal(project) * 20}] ),
    ]

    mockIterations.forEach(it => {
      actions.addIteration(it, {pasteAfter: project.iterations.length});
    })
  }

  // style={{gridTemplateColumns: 'auto auto auto'}}
  return <div>
    <Panel id="ITERATIONS" header="Iteration Planner" />
    <h3>Do the PROJECT, not just product</h3>
    {priorityMockup}
    <br/>

    <div className={"Audience-Container"}>
      {iterations.length ? '' : <button onClick={onAutoGenerate}>Autogenerate Iterations</button>}
      {iterations.map((it, i) => renderIteration(project, it, i, setChosenIterationId))}
    </div>
    <br/>
    <br/>
    <IterationPopup project={project} chosenIterationId={chosenIterationId} onChoose={setChosenIterationId} />
  </div>
}