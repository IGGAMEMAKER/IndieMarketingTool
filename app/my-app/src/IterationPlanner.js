import {useState} from "react";
import actions, {solveIterationGoal} from "./actions";
import {ARROW_LEFT, ARROW_RIGHT} from "./constants/symbols";
import {GOAL_TYPE_FEATURES, GOAL_TYPE_INCOME, GOAL_TYPE_RISK, GOAL_TYPE_USERS} from "./constants/constants";
import {FieldPicker, NumberPicker} from "./FieldPicker";
import {getByID, getNextID} from "./utils";
import {AudiencePicker} from "./AudiencePicker";
import {FieldAdder} from "./FieldAdder";
import {RiskAdder} from "./RiskAdder";
import {Iteration} from "./Iteration";
import {RiskList, RiskView} from "./RiskView";
import {Panel} from "./Panel";
import {getEstimateDescription} from "./utils/getEstimateDescription";
import {getFeatureIterationId} from "./utils/getFeatureIterationId";
import {renderTimeButton} from "./utils/renderTimeButton";

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

function RenderPickableFeatureGoals ({project, it}) {
  var [chosenTimerId, setTimerId] = useState(-1)
  var goals = Iteration.getGoalsByGoalType(GOAL_TYPE_FEATURES)(it)

  return goals.map(gg => {
    var feature = getByID(project.features, gg.featureId)
    var needsEstimates = !feature?.timeCost
    const completionCheckbox = <input type="checkbox" checked={gg.solved} value="Solve" onChange={ev => {
      var v = ev.target.checked

      console.log(v)
      actions.solveIterationGoal(it.id, gg.id, !!v)
    }}/>

    var setEstimate;
    if (needsEstimates) {
      var timeButton = t => renderTimeButton(t, feature, () => {
        setTimerId(-1)
      })
      var dayDurationHours = 8

      setEstimate = <div>{timeButton(15)} {timeButton(60)} {timeButton(4 * 60)} {timeButton(dayDurationHours * 60)} {timeButton(dayDurationHours * 3 * 60)} {timeButton(dayDurationHours * 7 * 60)}</div>
    } else {
      setEstimate = completionCheckbox
    }

    var estimate;
    if (!needsEstimates)
      estimate = getEstimateDescription(feature.timeCost)


    var solved = gg.solved ? 'solved' : ''
    needsEstimates = needsEstimates ? 'needsEstimates': ''

    return <li className="left" key={"featureG." + gg.id} onClick={onGoalRemove(it, gg)}>
      {estimate} <b className={`left feature ${solved} ${needsEstimates}`}>{feature?.name}</b>
      {setEstimate}
    </li>
  })
}

const renderUserGoals = (project, it) => {
  var goals = Iteration.getGoalsByGoalType(GOAL_TYPE_USERS)(it)

  return goals.map(gg => {
    var audience = getByID(project.audiences, gg.userId)

    return <div key={"userG." + gg.id} onClick={onGoalRemove(it, gg)} className="left iteration-secondary-text">
      +{gg.amount} <span style={{color: 'green'}}>{audience?.name}</span>
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
      <IterationGoalPicker project={project} it={it} />
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

function IterationGoalPicker({project, it}) {
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

  var addNewFeature = <FieldAdder
    defaultState={true}
    placeholder={"Add new feature"}
    onAdd={val => {
      var nextId = getNextID(project.features);

      actions.addFeature(val)
      actions.addIterationGoal(it.id, Iteration.createFeatureGoal(project, nextId))
    }}
  />
  var chooseFromBacklog = <select
    style={{width: '150px'}}
    value={-1}
    onChange={event => {
      var val = event.target.value
      console.log(val)

      if (val >= 0)
        actions.addIterationGoal(it.id, Iteration.createFeatureGoal(project, parseInt(val)))
    }}
  >
    <option disabled value={-1}> -- select feature --</option>
    {project.features
      .filter(f => !(f.solved || getFeatureIterationId(project, f.id)))
      .map((f,fi) => {
        var disabled = !f.timeCost
        var description = f.name;

        if (disabled) {
          description = `(No execution time) ${description}`
        } else {
          description = `(${getEstimateDescription(f.timeCost)}) ${description}`
        }

        return <option value={f.id} disabled={disabled}>{description}</option>
      })}
  </select>
  var featurePicker = <div>
    <h2>Do less</h2>
    <h3>Which problem will this feature solve?</h3>
    <h4>Is it a strongest pick in terms of time/money</h4>

    {/*<br />*/}
    {/*<br />*/}
    {/*<ul>*/}

    {/*<li>*/}
      <table style={{marginLeft: '15px'}}>
        <tr>
          <td>
            {chooseFromBacklog}
          </td>
          <td>
            /
          </td>
          <td>
            {addNewFeature}
          </td>
        </tr>
      </table>
    {/*</li>*/}
    {/*</ul>*/}
    <ol>
      {/*<li>*/}
      {/*  {chooseFromBacklog} / {addNewFeature}*/}
      {/*</li>*/}
      {/*<li></li>*/}
      <RenderPickableFeatureGoals project={project} it={it} />
    </ol>
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
    var chosen = goalType === goalType1

    return <button
      onClick={() => setGoalType(goalType1)}
      className={`toggle ${chosen ? 'chosen' : ''}`}
      // style={{backgroundColor: goalType === goalType1 ? 'yellow' : 'white'}}
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
    {/*<br />*/}
    {/*<br />*/}
    {goalPicker}
    {/*{renderUserGoals(project, it)}*/}
  </div>
}

function IterationView({project, it, index, setChosenIterationId}) {
  const indexName = "iterationIndex"
  var [isDragging, setDragging] = useState(false)
  var [isDraggingTarget, setDraggingTarget] = useState(false)
  var isCorrectTypeDrag = e => {
    try {
      var d = parseInt(e.dataTransfer.getData(indexName))
      var resp = !isNaN(d)
      console.log('d=', d, indexName, resp)

      return true
    } catch (err) {
      console.error('error in drag', indexName)
      return false
    }
  }

  var onStartDragging = (e, dragging) => {
    e.dataTransfer.setData(indexName, index)
    setDragging(dragging)
    setDraggingTarget(false)
  }

  var onDraggedUpon = (e, target) => {
    e.preventDefault()

    if (isCorrectTypeDrag(e))
      setDraggingTarget(target)
  }
  var onDrop = e => {
    var draggedOnMeId = parseInt(e.dataTransfer.getData(indexName))
    // console.log(draggedOnMeId, typeof draggedOnMeId, index - 1)

    var was = draggedOnMeId;
    var next = index;

    setDraggingTarget(false)
    actions.changeIterationOrder(was, next)
  }

  const stopPropagation = e => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }

  const ideaIcon = <span style={{color: 'orange'}}>?</span> // 💡
  const growthIcon = <span style={{color: 'green'}}>😄</span>
  const bigGrowthIcon = <span style={{color: 'green'}}>😄😄😄</span>
  const featureIcon = <span style={{color: 'red'}}>⚙︎</span>
  const incomeIcon = bigGrowthIcon

  var ideaGoals     = Iteration.getGoalsByGoalType(GOAL_TYPE_RISK)(it).filter(g => getByID(project.risks, g.riskId)?.name?.length)
  var userGoals     = Iteration.getGoalsByGoalType(GOAL_TYPE_USERS)(it)
  var featureGoals  = Iteration.getGoalsByGoalType(GOAL_TYPE_FEATURES)(it)
  var incomeGoals   = Iteration.getGoalsByGoalType(GOAL_TYPE_INCOME)(it)

  var incomeGoal = ''
  if (incomeGoals.length) {
    var g = incomeGoals[0]

    incomeGoal = <div className={"income-goal"} onClick={onGoalRemove(it, g)}>+${g.income}/mo</div>
  }

  var goals = Iteration.getGoalsByGoalType(GOAL_TYPE_FEATURES)(it)
  var features = project.features || []

  var countableFeatures = features.filter(f => {
    return goals.find(g => f.id === g.featureId)
  })

  var totalHours = countableFeatures
    .map(f => f.timeCost || 0)
    .reduce((p, c) => p + c, 0)
  var remainingHours = countableFeatures.filter(f => !f.solved)
    .map(f => f.timeCost || 0)
    .reduce((p, c) => p + c, 0)

  var minimize = name => {
    return name.substr(0, 20) + (name.length > 20 ? '...' : '')
  }

  return <div
    draggable
    onDragStart={e => {onStartDragging(e, true)}}
    onDragEnd={e => {onStartDragging(e, false)}}

    onDragLeave={e => onDraggedUpon(e,false)}
    onDragOver={e => onDraggedUpon(e, true)}

    onDrop={e => {onDrop(e)}}

    className={`Audience-item ${isDragging ? 'dragging' : ''} ${isDraggingTarget ? 'dragging-target' : ''}`}

    key={it.id}
    onClick={() => setChosenIterationId(it.id)}
  >
    {/*<div style={{display: 'grid', gridTemplateColumns: '25px 175px 25px'}}>*/}
    <div style={{display: 'grid', gridTemplateColumns: 'auto {/*25px*/}'}}>
      {/*<div style={{display: 'grid', gridTemplateRows: '250px 50px'}}>*/}
      <div style={{display: 'grid', gridTemplateRows: '250px'}}>
        <div style={{position: 'relative'}}>
          {/*<div className="iteration-solve"><input type="checkbox" onInput={ev => {*/}
          {/*  stopPropagation(ev)*/}
          {/*  // ev.preventDefault()*/}
          {/*  actions.solveIteration(it.id, ev.target.checked)}*/}
          {/*}/></div>*/}
          <div className="iteration-title">{it.description}</div>
          <div className="iteration-estimate">{remainingHours ? getEstimateDescription(remainingHours) : ''}</div>


          {renderUserGoals(project, it)}
          {/*{renderRiskGoals(project, it)}*/}
          {ideaGoals.map(g => <div className="left iteration-secondary-text">{ideaIcon} {g.riskId} {getByID(project.risks, g.riskId)?.name}</div>)}
          {featureGoals.filter(g=> !g.solved).map(g => <div className="left iteration-secondary-text">{featureIcon} {minimize(getByID(project.features, g.featureId)?.name)}</div>)}

          {/*<br />*/}
          {/*{new Array(incomeGoals.length).fill(<b>{incomeIcon}</b>)}*/}
          {/*{new Array(ideaGoals.length).fill(<b>{ideaIcon}</b>)}*/}
          {/*{new Array(userGoals.length).fill(<b>{growthIcon}</b>)}*/}
          {/*{new Array(featureGoals.length).fill(<b>{featureIcon}</b>)}*/}
          {/*<br/>*/}
          {/*{renderUserGoals(project, it)}*/}
        </div>
        <div>
          {incomeGoal}
        </div>
      </div>
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

  const insertIterationOnDoubleClick = pasteAfter => e => {
    if (e.detail === 2) {
      e.preventDefault()
      // alert('add iteration ' + pasteAfter)
      actions.addIteration(new Iteration(), {pasteAfter})
    }
  }

  const stopPropagation = e => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  }

  var mappedIterations = []
  for (var i = 0; i < iterations.length; i++) {
    const it = iterations[i];
    const pasteAfter = it.id;

    mappedIterations.push(<IterationView project={project} it={it} index={i} setChosenIterationId={setChosenIterationId} />)
    mappedIterations.push(<button
      onClick={ev => {
        stopPropagation(ev)
        var next = getNextID(iterations)
        actions.addIteration(new Iteration(), {pasteAfter})

        setChosenIterationId(next)
      }}
    >+</button>)
    // mappedIterations.push(<div onClick={insertIterationOnDoubleClick(pasteAfter)}/>)
  }

  // style={{gridTemplateColumns: 'auto auto auto'}}
  return <div>
    <Panel id="ITERATIONS" header="Iteration Planner" />
    {/*<h3>Do the PROJECT, not just product</h3>*/}
    {/*{priorityMockup}*/}
    <br/>

    <div className={"Iteration-Grid"}>
      {iterations.length ? '' : <button onClick={onAutoGenerate}>Autogenerate Iterations</button>}
      {mappedIterations}
    </div>
    <br/>
    <br/>
    <IterationPopup project={project} chosenIterationId={chosenIterationId} onChoose={setChosenIterationId} />
  </div>
}