import {Component, useState} from "react";
import storage from "./Storage";
import actions, {editDescription} from "./actions";
import {APP_TYPE_GAME, LINK_TYPE_DOCS, LINK_TYPE_SIMILAR} from "./constants/constants";
import {FieldPicker, NumberPicker} from "./FieldPicker";
import {IterationPlanner} from "./IterationPlanner";
import {Audience} from "./Audience";
import {MonetizationPlan} from "./MonetizationPlan";
import {FieldAdder} from "./FieldAdder";
import {renderIncomeGoal} from "./RenderIncomeGoal";
import {RiskList} from "./RiskView";
import {Panel} from "./Panel";
import {getByID} from "./utils";

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

  return (
    // <div className="Channel-item">
    <tr style={{textAlign: 'left', backgroundColor: isDangerous ? 'red': 'white'}}>
      <td>{users}</td>
      <td>
        <a href={link} target={"_blank"}>{l}</a>
        <br />
        <FieldPicker
          value={name}
          placeholder={"Add short name"}
          onAction={val => {actions.editChannelName(channel.id, val)}}
        />
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
      <th>Users</th>
      <th>Name</th>
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
      // alert(val)
      actions.addChannel(val)
    }}
  />
}

function AudienceSourcesPanel({channels}) {
  return <div>
    <Panel id="Sources" header="Where will you find your audience?" />
    <h6>User count will update in future releases</h6>
    <div className="Container">
      <ChannelList channels={channels} />
    </div>
  </div>
}

function NotesList({project}) {
  var notes = project.notes || ["blah"]
  const openNotePopup = () => {}

  return <div>
    <Panel id={"Notes"} header={"Notes"} />
    <h3>Save minds quickly here</h3>

    <FieldAdder placeholder={"type your mind"} onAdd={val => actions.addNote(val)} />
    <div>
      {notes.map((n, i) => {
        return <div
          key={"note" + i}
        >{n} <button className={"right"} onClick={openNotePopup}>Convert To..</button></div>
      })}
    </div>
  </div>
}

function BusinessPlanner({project}) {
  // var [desiredProfit, setDesiredProfit] = useState(project.desiredProfit || 10000)
  // var [monthlyExpenses, setMonthlyExpenses] = useState(project.monthlyExpenses || 500)
  // var [timeTillBurnout, setTimeTillBurnout] = useState(project.timeTillBurnout || 1)
  var {desiredProfit=10000, monthlyExpenses=500, timeTillBurnout=1} = project
  // console.log({project})

  return <div>
    <Panel id="Goals" header={"Can you get these numbers?".toUpperCase()} />
    <br/>
    <div className={"Audience-Container"}>
      <table>
        <tbody>
          <tr className={"Audience-item"}>
            <td>
              How much do you want to earn?
              <NumberPicker
                value={desiredProfit}
                placeholder={"Type your desired profit"}
                onAction={val => actions.editProjectDesiredProfit(parseInt(val))}
                defaultState={true}
              />
              <div>monthly</div>
            </td>
            <td>{renderIncomeGoal(project, desiredProfit)}</td>
          </tr>
          <tr className={"Audience-item"}>
            <td>
              Your monthly expenses?
              <NumberPicker
                value={monthlyExpenses}
                placeholder={"What are ur expenses"}
                onAction={val => actions.editProjectMonthlyExpenses(parseInt(val))}
                defaultState={true}
              />
            </td>
            <td>{renderIncomeGoal(project, monthlyExpenses, 'become sustainable')}</td>
          </tr>
          <tr className={"Audience-item"}>
            <td>
              {/*How much time do you have until you run out of cash?*/}
              Time till money burnout
              <NumberPicker
                value={timeTillBurnout}
                placeholder={"How many months can you spend on that venture?"}
                onAction={val => actions.editProjectTimeTillBurnout(parseInt(val))}
                defaultState={true}
              />
              <div>months</div>
            </td>
            <td>{renderIncomeGoal(project, monthlyExpenses / timeTillBurnout, 'SURVIVE')}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <br/>
    <br/>
  </div>
}



function AudienceMessageView({index, messageId, id, m})  {
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

  return <li
    draggable
    onDragStart={e => {onStartDragging(e, true)}}
    onDragEnd={e => {onStartDragging(e, false)}}

    onDragLeave={e => onDraggedUpon(e,false)}
    onDragOver={e => onDraggedUpon(e, true)}

    onDrop={e => {onDrop(e)}}

    className={`${isDragging ? 'dragging' : ''} ${isDraggingTarget ? 'dragging-target' : ''}`}

    key={"messages-to-audience." + id + "." + messageId}
  >
    <FieldPicker
      value={m.name}
      placeholder={"What will you tell them?"}
      onAction={val => actions.editAudienceMessage(val, id, messageId)}
      onRemove={() => actions.removeAudienceMessage(id, messageId)}
    />
  </li>
}
function MarketingPlanner({project}) {
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

  const renderAudience = ({description, id, name, strategy, messages = []}) => {
    if (!Array.isArray(strategy))
      strategy = [strategy]

    var messagePicker = <ol>
      {messages.map((m, mi) => {
        // TODO not i, but m.id
        var messageId = m.id

        return <AudienceMessageView index={mi} m={m} messageId={messageId} id={id} />
        }
      )}
      <li>
        <FieldAdder
          onAdd={val => actions.addAudienceMessage(val, id)}
          placeholder={"what will you tell them?"}
        />
      </li>
    </ol>

    var strategyPicker = <ol>
      {strategy.map(s => {
        var strategyId = s.id
        // console.log(s.id, 'strategyPicker', {strategyId})

        return <li key={"strategy." + id + "." + strategyId}>
          <FieldPicker
            value={s.name}
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

    return <tr key={"marketing-planner." + id} style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', textAlign: 'left'}}>
      {/*<td>*/}
      {/*  {a.name}*/}
      {/*</td>*/}
      {/*<td>*/}
      {/*  <b>How to reach <span style={{color: 'green'}}>{name}</span>?</b>*/}
      {/*  <br />*/}
      {/*  <label style={{color: 'gray'}}>{description}</label>*/}
      {/*  <br />*/}
      {/*  {strategyPicker}*/}
      {/*</td>*/}
      <td>
        <b>What will you tell <span style={{color: 'green'}}>{name}</span>?</b>
        <br />
        <label style={{color: 'gray'}}>{description}</label>
        {messagePicker}
      </td>
    </tr>
  }

  return <div>
    <Panel id="Growth" header="Your message" />
    <h3>Most important part of the project</h3>
    {audiencePicker}
    <br />

    <div className="Container">
      <table>
        {/*<thead>*/}
        {/*  <tr>*/}
        {/*    /!*<th>#</th>*!/*/}
        {/*    <th>How to reach them</th>*/}
        {/*    <th>Your message</th>*/}
        {/*  </tr>*/}
        {/*</thead>*/}
        <tbody>
        {audience ? renderAudience(audience) : ''}
        </tbody>
      </table>
    </div>
  </div>
}

function UsefulLinks({links}) {
  var list = []
  links.forEach(l => {
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

  list.push(      <div>
    <div>
      <FieldAdder onAdd={val => actions.addLink(val)} placeholder="Add link" defaultState={false}/>
    </div>
  </div>)

  return <div>
    <Panel id="Links" header="Save useful links here" />
    <div className="Container links">
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
    <br />
    <br />
    <div className="Audience-Container">
      {plans.map((p, i) => <MonetizationPlan key={'monetizationPlanX.' + p.id + ' ' + i} plan={p} index={i} audiences={audiences} />)}
    </div>
  </div>
}


function AudiencesList({audiences, state, audiencePhrase}) {
  const [isFullAudienceInfo, setIsFullInfo] = useState(false);
  const {monetizationPlans, risks, channels, name, appType} = state;

  return <div>
    <div className="Audience-Container">
      {audiences.map((a, i) => {
        var usages = [];
        var isUsedInMonetizationPlans = false
        monetizationPlans.forEach((m, i) => {
          // console.log({m})
          if (m.audiences.includes(a.id))
            isUsedInMonetizationPlans = true
        })

        if (isUsedInMonetizationPlans)
          usages.push('monetization plans')

        if (a?.messages?.length)
          usages.push('unique messaging')

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

export class ProjectPage extends Component {
  state = {
    audiences: [],
    monetizationPlans: [],
    channels: [],
    risks: [],
    links: [],
    loaded: false,
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
  }

  getProjectId = () => {
    // var {projectId} = useParams()
    var arr = window.location.href.split('/')
    var projectId = arr[arr.length - 1]

    // console.log({projectId, arr})

    return projectId
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

    var audiencePhrase = appType === APP_TYPE_GAME ? 'Who will play your game?' : 'Who will use your service?'

    var project = this.state?.project

    const menus = ["Notes", "Audiences", "Monetization", "Goals", "Growth", "Risks", "ITERATIONS", "Sources", "Links"]
    return (
      <div className="App">
        <div>
          <div className="menu">
            {menus.map(Name => <span key={"menu" + Name}><a href={"#" + Name}>{Name}</a></span>)}
            {/*{menus.map(Name => <span><Link to={"./#" + Name}>{Name}</Link></span>)}*/}
          </div>
        </div>
        <header className="App-header">
          {/*<div><textarea autoFocus /></div>*/}
          <br />
          <br />
          <FieldPicker
            value={project?.name}
            placeholder={"name the project"}
            onAction={val => {actions.editName(projectId, val)}}
            normalValueRenderer={onEdit => <h1 onClick={onEdit}>{name}</h1>}
          />
          {/*<a id="Audiences" href={"/profile"} className="Panel">Profile</a>*/}
          <a href={"/profile"}>Profile</a>
          <Panel id="Description" header={"What are you doing?"} />
          <FieldPicker
            value={this.state.project?.description || ""}
            placeholder={"What will you create?"}
            onAction={val => {actions.editDescription(projectId, val)}}
            // normalValueRenderer={onEdit => <h1 onClick={onEdit}>{name}</h1>}
          />
          <Panel id="Audiences" header={audiencePhrase} />
          <AudiencesList audiences={audiences} state={this.state} audiencePhrase={audiencePhrase}/>
          <NotesList project={project} />
          <MonetizationPanel plans={monetizationPlans} audiences={audiences}/>
          <br/>
          <br/>
          <BusinessPlanner project={this.state.project}/>
          <MarketingPlanner project={this.state}/>
          <RisksPanel risks={risks}/>
          <IterationPlanner project={this.state.project}/>

          <AudienceSourcesPanel channels={channels}/>
          <UsefulLinks links={this.state.links}/>

          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          {/*<a style={{color: 'white'}} href="/profile" onClick={() => actions.removeProject(projectId)}>REMOVE PROJECT</a>*/}
        </header>
      </div>
    );
  }
}