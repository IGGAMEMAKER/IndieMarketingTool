import {Component, useState} from "react";
import storage from "./Storage";
import actions, {editDescription} from "./actions";
import {
  APP_TYPE_APP,
  APP_TYPE_GAME,
  GOAL_TYPE_FEATURES,
  LINK_TYPE_DOCS,
  LINK_TYPE_SIMILAR
} from "./constants/constants";
import {FieldPicker, NumberPicker} from "./FieldPicker";
import {IterationPlanner} from "./IterationPlanner";
import {Audience} from "./Audience";
import {MonetizationPlan} from "./MonetizationPlan";
import {FieldAdder} from "./FieldAdder";
import {renderIncomeGoal} from "./RenderIncomeGoal";
import {RiskList} from "./RiskView";
import {Panel} from "./Panel";
import {getByID} from "./utils";
import {getEstimateDescription} from "./utils/getEstimateDescription";
import {sortFeatures} from "./utils/sortFeatures";
import {getFeatureIterationId} from "./utils/getFeatureIterationId";
import {getAudienceUsageCount, getFeatureUsageCount} from "./utils/getEntityUsageCount";
import {renderTimeButton} from "./utils/renderTimeButton";
import {TimePicker} from "./TimePicker";
import {Link} from "react-router-dom";
import {Button} from "./UI";
import {isCompositeComponent} from "react-dom/test-utils";

const getUrlWithoutPrefixes = link => {
  try {
    return link.replace('https://', '').replace('www.', '')
  }
  catch (e) {

  }

  return link
}
const getDomain = link => {
  try {
    var w = getUrlWithoutPrefixes(link)
    var index = w.indexOf('.') // w.findIndex('.')

    return w.substr(0, index)
  } catch (e) {
    return link
  }
}

function AudienceAdder({placeholder}) {
  const [audienceName, onChangeName] = useState("");

  return (
    <div className="Audience-item">
      <textarea
        value={audienceName}
        placeholder={placeholder}
        onChange={event => {
          var v = event.target.value
          console.log({v})
          onChangeName(v)
        }}
      />
      <br />
      <button onClick={() => {actions.addAudience(audienceName); onChangeName("")}}>ADD</button>
    </div>
  )
}

function MonetizationAdder({}) {
  return <FieldAdder
    onAdd={val => {actions.addMonetizationPlan(val)}}
    defaultValue={""}
    placeholder={"Monetization plan"}
  />
}


function Channel({channel}) {
  var [isDangerous, setDangerous] = useState(false)
  var {link, name, users} = channel
  var l = name || getUrlWithoutPrefixes(link)


  // SOURCE TYPE
  // human
  // publisher (games)
  // press (journals)
  // video channel
  // text channels

  const namePicker = <FieldPicker
    value={name}
    placeholder={"Add short name"}
    onAction={val => {actions.editChannelName(channel.id, val)}}
  />
  const LLLLLL = <a href={link} target={"_blank"}>{l}</a>

  return (
    // <div className="Channel-item">
    <tr style={{textAlign: 'left', backgroundColor: isDangerous ? 'red': 'white'}}>
      {/*<td>{users}</td>*/}
      <td style={{width: '250px'}}>
        {LLLLLL}
        {/*<br />*/}
        {/*{namePicker}*/}
      </td>
      <td style={{width: '250px'}}>
        {/*{LLLLLL}*/}
        {namePicker}
      </td>
      <td>
        <button
          onMouseLeave={() => setDangerous(false)}
          onMouseEnter={() => setDangerous(true)}
          onClick={() => {actions.removeChannel(channel.id)}}
        >x</button>
      </td>
    </tr>
  )
}

function ChannelList({channels}) {
  var groupedChannels = {}

  channels.forEach((c, i) => {
    var domain = getDomain(c.link)

    if (!groupedChannels[domain])
      groupedChannels[domain] = []

    groupedChannels[domain].push({c, i})
  })

  var mapped = channels
    .sort((c1, c2) => c2.users - c1.users)
    .map(cc => <Channel key={"channel." + cc.id} channel={cc} />)

  return <table>
    <thead>
    <tr>
      <th>Name</th>
      <th>Link</th>
      <th></th>
    </tr>
    </thead>
    <tbody>
    {mapped}
    <tr>
      <th>
        <ChannelAdder />
      </th>
    </tr>
    </tbody>
  </table>
}

function ChannelAdder({}) {
  return <FieldAdder
    placeholder={"audience source link"}
    onAdd={val => {
      actions.addChannel(val)
    }}
  />
}

function AudienceSourcesPanel({channels, audiences}) {
  const renderAudienceStrats = ({description, id, name, strategy, messages = []}) => {
    if (!Array.isArray(strategy))
      strategy = [strategy]

    var strategyPicker = <ol>
      {strategy.map(s => {
        var strategyId = s.id
        // console.log(s.id, 'strategyPicker', {strategyId})

        var isTooBig = s.name.split(' ').find(word => word.length > 15);
        var style = {}
        if (isTooBig) {
          style = {overflow: 'hidden', width: '250px', textOverflow: 'elipsis'}
        }
        var isUrl = isTooBig && s.name.startsWith('http') || s.name.startsWith('www')

        return <li key={"strategy." + id + "." + strategyId}>
          <FieldPicker
            value={s.name}
            normalValueRenderer={onEdit => {
              if (isUrl) {
                return <div>
                  <div className="editable" style={style} onClick={() => onEdit(true)}>
                    edit
                  </div>
                  <Link to={s.name}>link</Link>
                </div>
              }

              return <div className="editable" onClick={() => onEdit(true)}>
                  {s.name}
                </div>
            }}
            placeholder={"How will you reach them?"}
            onAction={newStrategy => actions.editAudienceStrategy(newStrategy, id, strategyId)}
            onRemove={() => actions.removeAudienceStrategy(id, strategyId)}
          />
        </li>
      })}
      <li>
        <FieldAdder onAdd={val => actions.addAudienceStrategy(val, id)} placeholder={"add more ways"}/>
      </li>
    </ol>

    return <tr className="Audience-item" key={"marketing-planner." + id} style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', textAlign: 'left'}}>
      <td>
        <b>How to reach <span style={{color: 'green'}}>{name}</span>?</b>
        <br />
        <label className="audience-description">{description}</label>
        <br />
        {strategyPicker}
      </td>
    </tr>
  }

  return <div>
    <Panel id="GROWTH" header="Growth strategy" />
    <div className="Audience-Container">
      {audiences.map(a => renderAudienceStrats(a))}
    </div>
    <h3>Where will you find your audience?</h3>
    <div className="Container">
      <ChannelList channels={channels} />
    </div>
  </div>
}

function NotesList({project}) {
  var [isPopupOpened, setOpenedPopup] = useState(false)

  var notes = project.notes || []

  const openNotePopup = () => {
    setOpenedPopup(true)
  }

  if (isPopupOpened) {

  }

  return <div>
    <Panel id={"Notes"} header={"Notes"} noHelp />
    <h3>Save notes here</h3>

    <FieldAdder placeholder={"type your mind"} onAdd={val => actions.addNote(val)} defaultState={true} autoFocus={false} />
    <br />
    <br />
    <div className="list">
      {notes.map((n, i) => {
        return <div
          key={"note" + n.id}
          className="left paddings"
        >
          <FieldPicker
            autoFocus
            value={n.name}
            placeholder={"type your mind"}
            onAction={val => actions.editNote(n.id, val)}
            onRemove={() => {actions.removeNote(n.id)}}
          />
          {/*<button className={"right"} onClick={openNotePopup}>Convert To..</button>*/}
        </div>
      })}
    </div>
  </div>
}

function TimeTest({}) {
  var [value, setValue] = useState({})

  return <div>
    <div>
      TimePicker Test
    </div>
    <div>
      <TimePicker f={value} onClick={v => {setValue({timeCost: v})}} />
    </div>
  </div>
}
function FeatureList({project}) {
  var [chosenTimerId, setTimerId] = useState(-1)

  var features = project.features || []

  var sum = list => list.map(f => f.timeCost || 0).reduce((p, c) => p + c, 0)
  var countableFeatures = features.filter(f => !f.solved)
  var totalHours = sum(countableFeatures)
  var scheduledHours = sum(countableFeatures.filter(f => !!getFeatureIterationId(project, f.id)))

  var firstIterationWithFeatures = project.iterations.find(it => {
    if (it.goals.find(g => g.goalType === GOAL_TYPE_FEATURES))
      return true
    return false
  })

  return <div>
    <Panel id={"Features"} header={"Features"}/>
    <p>
      <b>Remaining: {getEstimateDescription(scheduledHours)}{/*, +Not assigned: {getEstimateDescription(totalHours)}*/}</b>
    </p>
    <p>
      if you work 8 Hours / day
    </p>
    <FieldAdder placeholder={"add new feature"} defaultState={true} autoFocus={false}
                onAdd={val => actions.addFeature(val)}/>
    <br/>
    <br/>
    <center>
      <table className="list">
        {features
          .sort(sortFeatures)
          .filter(f => {
            var isPartOfFirstIteration = getFeatureIterationId(project, f.id) === firstIterationWithFeatures?.id;
            if (f.solved)
              return false

            if (f.solved && !isPartOfFirstIteration) {
              return false
            }

            return true;
          })
          .map(f => {
            var dayDurationHours = 8;
            var timeButton = t => renderTimeButton(t, f, () => {
              setTimerId(-1)
            })


            var onPick = () => {
              setTimerId(f.id)
            }
            var timePicker = isNaN(f.timeCost) ?
              <button onClick={onPick}>Set Estimates</button>
              :
              <span className={"editable"} onClick={onPick}>{getEstimateDescription(f.timeCost)}</span>

            if (chosenTimerId === f.id) {
              timePicker = <div>
                {timeButton(15)} {timeButton(60)} {timeButton(4 * 60)} {timeButton(dayDurationHours * 60)} {timeButton(dayDurationHours * 3 * 60)} {timeButton(dayDurationHours * 7 * 60)}
                <br/>
              </div>
            }

            return <tr
              key={"feature" + f.id}
            >
              {/*<td>*/}
              {/*  <b>{f.id}</b>*/}
              {/*</td>*/}
              <td className={"left feature-tab"}>
                <FieldPicker
                  autoFocus
                  value={f.name}
                  placeholder={"type your mind"}
                  onAction={val => actions.editFeatureName(f.id, val)}
                  onRemove={() => {
                    var usages = getFeatureUsageCount(project, f.id)

                    if (usages.length) {
                      alert(`Can't remove this feature, cause it's used in\n\n${usages.join('\n')}`)
                    } else {
                      actions.removeFeature(f.id)
                    }
                  }}
                  normalValueRenderer={onEdit => {
                    var isPartOfFirstIteration = getFeatureIterationId(project, f.id) === firstIterationWithFeatures?.id;

                    var solved = f.solved ? 'solved' : ''
                    var used = getFeatureIterationId(project, f.id) ? 'used' : ''
                    var isNearestFeature = isPartOfFirstIteration && !f.solved ? 'nearest' : ''

                    return <div
                      onClick={onEdit}
                      className={`feature ${solved} ${used} ${isNearestFeature}`}
                    >{f.name}</div>
                  }}
                />
              </td>
              <td>
                {timePicker}
              </td>
            </tr>
          })}
      </table>
    </center>
  </div>
}



function BusinessPlanner({project}) {
  var {desiredProfit=10000, monthlyExpenses=500, timeTillBurnout=1} = project

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

  return <div>
    <Panel id="Goals" header={"Can you get these numbers?".toUpperCase()} noHelp />
    <p>How much do you want to earn?<br />{desiredProfitPicker}$</p>
    {renderIncomeGoal(project, desiredProfit, "earn")}
    {/*<p>Your monthly expenses?<br />{monthlyExpensesPicker}</p>*/}
    {/*{renderIncomeGoal(project, monthlyExpenses, "Survive")}*/}

    {/*<p>Time till money burnout {timeTillBurnoutPicker}</p>*/}
    {/*<br />*/}
    {/*<br />*/}
    {/*{renderIncomeGoal(project, 1, '??', [*/}
    {/*  {goal: monthlyExpenses, name: 'Sustainable', color: 'orange'},*/}
    {/*  {goal: desiredProfit, name: 'Dream', color: 'green'},*/}
    {/*  // {goal: monthlyExpenses / timeTillBurnout, name: 'Survive', color: 'red'},*/}
    {/*])}*/}

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



function AudienceMessageView({index, id, m})  {
  const indexName = "audienceMessageIndex"
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

    var was = draggedOnMeId;
    var next = index;

    setDraggingTarget(false)
    actions.changeAudienceMessageOrder(id, was, next)
  }

  const messageId = m.id

  return <li
    draggable
    onDragStart={e => {onStartDragging(e, true)}}
    onDragEnd={e => {onStartDragging(e, false)}}

    onDragLeave={e => onDraggedUpon(e,false)}
    onDragOver={e => onDraggedUpon(e, true)}

    onDrop={e => {onDrop(e)}}

    className={`${isDragging ? 'dragging' : ''} ${isDraggingTarget ? 'dragging-target' : ''}`}

    key={`audience-message-${id}-${messageId}`}
  >
    <FieldPicker
      value={m.name}
      placeholder={"What will you tell them?"}
      onAction={val => actions.editAudienceMessage(val, id, messageId)}
      onRemove={() => actions.removeAudienceMessage(id, messageId)}
    />
  </li>
}

function GlobalStrategyPlanner({project}) {
  return <div>
    <Panel id="Strategy" header="Your strategy" />
    <FieldPicker
      value={project?.strategy || ''}
      placeholder={"who you will test first, who will you get second, e.t.c. which features will you add before/after"}
      onAction={val => actions.editStrategy(val)}
      autoFocus={false}
    />
  </div>
}

function MessagePlanner({project}) {
  var defaultId = project.audiences.length ? project.audiences[0].id : -1

  var [chosenAudience, setChosenAudience] = useState(defaultId)
  var audience = chosenAudience === -1 ? null : getByID(project.audiences, chosenAudience)

  const audiencePicker = project.audiences.map(a => {
    return <button
      className={`toggle ${chosenAudience === a?.id ? 'chosen' : ''}`}
      onClick={() => {
        try {
          setChosenAudience(a?.id)
        } catch (e) {

        }
      }}
    >{a.name} ({a.messages.length})</button>;
  })

  const renderAudience = ({description, id, name, messages = []}) => {
    return <tr key={"marketing-planner." + id} style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', textAlign: 'left'}}>
      <td>
        <b>What will you tell <span style={{color: 'green'}}>{name}</span>?</b>
        <br />
        <label style={{color: 'gray'}}>{description}</label>
        <ol>
          {messages.map((m, mi) => <AudienceMessageView index={mi} m={m} id={id}/>)}
          <li>
            <FieldAdder
              onAdd={val => actions.addAudienceMessage(val, id)}
              placeholder={"what will you tell them?"}
            />
          </li>
        </ol>
      </td>
    </tr>
  }

  return <div>
    <Panel id="Message" header="Your message" />
    {audiencePicker}
    <br />

    <div className="Container">
      <table>
        <tbody>
        {audience ? renderAudience(audience) : ''}
        </tbody>
      </table>
    </div>
  </div>
}

function UsefulLinks({links}) {
  var list = []
  const adder = <div>
    <div>
      <FieldAdder onAdd={val => {
        actions.addLink(val)
      }} placeholder="Add link" defaultState={true} autoFocus={false}/>
    </div>
  </div>

  // list.push(adder)
  // list.push(    <div></div>)
  // list.push(    <div></div>)
  // list.push(    <div></div>)

  for (var i = links.length - 1; i >= 0; i--) {

  }
  links.forEach(l => {
    // var l = links[i]

    list.push(<div key={"useful-links.link." + l.id}><a target={"_blank"} href={l.link}>Link</a></div>)
    list.push(          <FieldPicker
      key={"links-field" + l.id}
      value={l.note}
      onAction={val => actions.editLinkNotes(l.id, val)}
    />)

    list.push(          <div key={"useful-links.select." + l.id}>
      <select className="link-select" value={l.linkType} onChange={ev => {
        actions.editLinkType(l.id, parseInt(ev.target.value))
      }}>
        <option value={LINK_TYPE_DOCS}>Docs</option>
        <option value={LINK_TYPE_SIMILAR}>Similar</option>
      </select>
    </div>)

    list.push(          <div key={"useful-links.remove." + l.id}>
      <button onClick={() => actions.removeLink(l.id)}>x</button>
    </div>)
  })

  // list.push()

  return <div>
    <Panel id="Links" header="Save useful links here" noHelp />
    <div>{adder}</div>
    <br />
    <div className="Container links list">
      {list}
    </div>
  </div>
}

function RisksPanel({risks}) {
  return <div>
    <Panel id="Risks" header="What are your biggest risks / doubts / problems?" />
    <div className="Container">
      <RiskList risks={risks} />
    </div>
  </div>
}


function MonetizationPanel({plans, audiences}) {
  var content = <div>How will you make money? <MonetizationAdder /></div>
  return <div>
    <Panel id="Monetization" header={content} />
    <h6>WHO WILL PAY & FOR WHAT?</h6>
    {/*<br />*/}
    {/*<br />*/}
    <div className="Audience-Container">
      {plans.map((p, i) => <MonetizationPlan key={'monetizationPlanX.' + p.id + ' ' + i} plan={p} index={i} audiences={audiences} />)}
    </div>
  </div>
}

function ProjectDescription({project, projectId}) {
  return <div>
    <Panel id="Description" header={"What are you doing?"} noHelp />
    <FieldPicker
      value={project?.description || ""}
      placeholder={"What will you create?"}
      onAction={val => {actions.editDescription(projectId, val)}}
    />
  </div>
}

function ProjectEssence({project, appType}) {
  var essence;
  var header;
  var placeholder

  if (appType === APP_TYPE_GAME) {
    essence = project?.mainFeeling;
    header = "Which emotion/feel do you want to create?"
    placeholder = "main feel"
  } else {
    essence = project?.mainProblem;
    header = "Which problem are you trying to solve?"
    placeholder = "main problem"
  }

  return <div>
    <Panel id="Problem" header={header} />
    <div className="panel-instructions">
      {/*<h3>Most important part of the project/!*. 99% importance*!/</h3>*/}
      <h3>MOST IMPORTANT QUESTION{/*. 99% importance*/}</h3>
      <h4>If you cannot formulate it clearly, the rest is FANTASY</h4>
    </div>
    {/*<hr />*/}
    {/*<h5>Which can still be fine</h5>*/}
    <FieldPicker
      value={essence || ""}
      placeholder={placeholder}
      onAction={val => {actions.editMainProblem(val)}}
    />
  </div>
}
function AudiencesList({audiences, state, audiencePhrase}) {
  const [isFullAudienceInfo, setIsFullInfo] = useState(false);
  const {monetizationPlans, risks, channels, name, appType} = state;

  return <div>
    <Panel id="Audiences" header={audiencePhrase} />
    <div className="Audience-Container">
      {audiences.map((a, i) => {
        var usages = getAudienceUsageCount(monetizationPlans, a)

        return <Audience
          onToggleFullInfo={() => {
            setIsFullInfo(!isFullAudienceInfo)
          }}
          isFull={!isFullAudienceInfo}

          name={a.name}
          description={a.description}
          strategy={a.strategy}
          id={a.id}
          usages={usages}
          index={i}
          key={`audiencessss${a.id}`}
        />}
      )}
      <AudienceAdder placeholder={audiencePhrase} />
    </div>
  </div>
}

function NamePicker({project, projectId, wordedType, name}) {
  return <div>
    <Panel id="Name" header={`How will you name your ${wordedType}?`} noHelp />
    <FieldPicker
      value={project?.name}
      placeholder={"name the project"}
      onAction={val => {actions.editName(projectId, val)}}
      normalValueRenderer={onEdit => <h1 onClick={onEdit}>{name}</h1>}
    />
  </div>
}

function Validator({project}) {
  var essenceCheck;

  const saasThing = <div>
    <center>
      <table>
        <tr><td className="left">hour</td><td></td><td></td><td>1) Does the problem exist? Who has that problem? Google forms + Search (SEO + Gum)</td></tr>
        <tr><td className="left">hours</td><td></td><td></td><td>2) Does the problem exist? Who has that problem? Landing page</td></tr>
        <tr><td className="left">days</td><td></td><td></td><td>If enough people subbed, split em (half for free testing increase gradually / half for paid)</td></tr>
        {/*<tr><td className="left">days</td><td></td><td></td><td>Screenshots</td></tr>*/}
        {/*<tr><td className="left">week</td><td></td><td></td><td>Fake Gameplay Trailer</td></tr>*/}
        {/*<tr><td className="left">day/week</td><td></td><td></td><td>Prototype</td></tr>*/}
      </table>
    </center>
  </div>

  const gameplayThing = <div>
    <center>
      <table>
        <tr><td className="left">hour</td><td></td><td></td><td>1 sentence</td></tr>
        <tr><td className="left">hours</td><td></td><td></td><td>Intro post (I want to make game like X, but Y; genre & main features)</td></tr>
        <tr><td className="left">hours</td><td></td><td></td><td>Intro WITH screenshot</td></tr>
        <tr><td className="left">days</td><td></td><td></td><td>Screenshots</td></tr>
        <tr><td className="left">week</td><td></td><td></td><td>Fake Gameplay Trailer</td></tr>
        <tr><td className="left">day/week</td><td></td><td></td><td>Prototype</td></tr>
      </table>
    </center>
  </div>

  if (project.type === APP_TYPE_GAME) {
    essenceCheck = <div>
      <div>
        Do people want to play that?
      </div>

      <br />
      {gameplayThing}
    </div>
  }

  if (project.type === APP_TYPE_APP) {
    essenceCheck = <p>
      Does the problem exist? Who has that problem?

      <br />
      <br />
      {saasThing}
      <br />
      {gameplayThing}
    </p>
  }

  return <div>
    <div>{essenceCheck}</div>
  </div>
}

const PROJECT_MODE_VISION = 1
const PROJECT_MODE_EXECUTION = 2
const PROJECT_MODE_STRATEGY = 4
const PROJECT_MODE_NOTES = 3

class Chat extends Component {
  render() {
    var {isOpened} = this.props;


    return <div className="chat-container">
      Chat
    </div>
  }
}

export class ProjectPage extends Component {
  state = {
    audiences: [],
    monetizationPlans: [],
    channels: [],
    risks: [],
    links: [],
    loaded: false,
    mode: PROJECT_MODE_VISION
  }

  copyState = () => {
    this.setState({
      loaded: true,

      audiences: storage.getAudiences(),
      monetizationPlans: storage.getMonetizationPlans(),
      channels: storage.getChannels(),
      risks: storage.getRisks(),
      name: storage.getProjectName(),
      appType: storage.getProjectType(),
      links: storage.getUsefulLinks(),

      project: storage.getProject()
    })
    document.title = storage.getProject().name
  }

  getProjectId = () => {
    // var {projectId} = useParams()
    var arr = window.location.href.split('/')
    var projectId = arr[arr.length - 1]

    // console.log({projectId, arr})

    return projectId
  }

  setMode = mode => {
    this.setState({mode})
    window.scrollTo(0, 0);
  }

  componentWillMount() {
    storage.addChangeListener(() => {
      // console.log('store listener')
      this.copyState()
    })

    // this.copyState()

    actions.loadProject(this.getProjectId())
  }

  render() {
    if (!this.state.loaded)
      return <div>Loading the project...</div>


    var {audiences, monetizationPlans, risks, channels, name, appType, links} = this.state;
    var projectId = this.getProjectId()



    var isGame = appType === APP_TYPE_GAME;
    var isProject = !isGame;

    var wordedType = isGame ? 'game' : 'service'
    var audiencePhrase = isGame ? 'Who will play your game?' : 'Who will use your service?'

    var project = this.state?.project

    const isFilledDescription = !!project?.description
    const isFilledEssence = project?.mainFeeling || project?.mainProblem
    const isFilledAudiences = project.audiences.length;

    const isDefaultName = project.name.toLowerCase() === "new game" || project.name.toLowerCase() === "new app"

    const canShowEssence = isFilledDescription;
    const canShowAudiences = canShowEssence && isFilledEssence;
    const canShowMonetization = canShowAudiences && isFilledAudiences
    const canShowNamePicker = canShowMonetization && project.monetizationPlans.filter(mp => mp.price > 0).length
    const canShowSubmitProjectButton = canShowNamePicker && !isDefaultName

    var removeProject = <div>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <a style={{color: 'white'}} href="/profile" onClick={() => actions.removeProject(projectId)}>REMOVE PROJECT</a>
    </div>

    if (!window.location.href.includes("localhost")) {
      removeProject = ''
    }

    // Notes, Vision, Execution
    // Notes - notes, links, sources???, features???
    // Execution - Iterations, Risks, Goals, Growth strategy???

    const NotesPanel = <div>
      <NotesList project={project} />
      <UsefulLinks links={this.state.links}/>
      {/*<FeatureList project={project} />*/}
      {removeProject}
    </div>

    const panels = [
      {
        canShow: canShowEssence, error: 'type what are you doing first',
        c: <ProjectEssence project={project} projectId={projectId} appType={appType} />
      },
      {
        canShow: canShowAudiences, error: 'main problem is super important. Type it first',
        c: <AudiencesList audiences={audiences} state={this.state} audiencePhrase={audiencePhrase}/>
      },
      {
        canShow: canShowMonetization, error: 'create at least one audience',
        c: <MonetizationPanel plans={monetizationPlans} audiences={audiences}/>
      },
      {
        canShow: canShowNamePicker, error: 'create at least one PAID plan',
        c: <NamePicker project={project} projectId={projectId} wordedType={wordedType} name={name} />
      },
      {
        canShow: canShowSubmitProjectButton, error: 'Change project name',
        c: <div><Button text={"REVIEW"}/></div>
      }
    ]

    var actualPanels = [];

    for (var i = 0; i < panels.length; i++) {
      var p = panels[i];

      if (p.canShow) {
        actualPanels.push(p.c)
      } else {
        actualPanels.push(<div className="error">To continue, {p.error}</div>)
        i = 10000000
      }
    }

    const VisionPanel = <div>
      <ProjectDescription project={project} projectId={projectId} />
      {actualPanels}

      {/*<BusinessPlanner project={this.state.project}/>*/}
    </div>

    const StrategyPanel = <div>
      {/*<button onClick={() => this.setMode(PROJECT_MODE_EXECUTION)}>ITERATIONS</button>*/}
      {/*<br />*/}

      <MessagePlanner project={this.state}/>
      <AudienceSourcesPanel channels={channels} audiences={project.audiences}/>
      {/*<GlobalStrategyPlanner project={this.state.project}/>*/}
      {/*<BusinessPlanner project={this.state.project} />*/}
    </div>

    const ExecutionPanel = <div>
      {/*<RisksPanel risks={risks} />*/}
      <Validator project={project} />

      <br />
      <br />
      <BusinessPlanner project={this.state.project} />

      <IterationPlanner project={this.state.project}/>
    </div>

    const visionLink = '/projects/' + projectId
    const executionLink = '/projects/' + projectId + '/execution'

    // const menus = ["Notes", "Audiences", "Monetization",  "Message", /*"Risks",*/ "GROWTH", "Goals", "ITERATIONS", "Links"]
    // const menus = ["Notes", "Vision", "Execution",  "Profile"]

    var content;

    switch (this.state.mode) {
      case PROJECT_MODE_NOTES: content = NotesPanel; break;
      case PROJECT_MODE_VISION: content = VisionPanel; break;
      case PROJECT_MODE_STRATEGY: content = StrategyPanel; break;
      case PROJECT_MODE_EXECUTION: content = ExecutionPanel; break;

      default: content = VisionPanel
    }

    const menus = []
    const addMenu = (mode, name) => menus.push({name, mode})

    addMenu(PROJECT_MODE_NOTES, "Notes")
    addMenu(PROJECT_MODE_VISION, "Vision")
    if (canShowSubmitProjectButton) {
      // addMenu(PROJECT_MODE_STRATEGY, "Growth")
      addMenu(PROJECT_MODE_EXECUTION, "Execution")
    }

    return (
      <div className="App">
        <div>
          <center>
          <div className="menu">
            {menus.map(m => <button
              className={`item ${this.state.mode === m.mode ? 'chosen' : ''}`}
              onClick={() => this.setMode(m.mode)}
            >{m.name}</button>)}
            <Link className={"item"} to="/profile">Profile</Link>
          </div>
            {/*<FieldAdder placeholder={"type your mind"} onAdd={val => actions.addNote(val)} defaultState={true} autoFocus={false} />*/}
          </center>
        </div>
        <header className="App-header">
          <br />
          <br />
          <div>
            {content}
          </div>
        </header>
        {/*<Chat />*/}
      </div>
    );
  }
}

