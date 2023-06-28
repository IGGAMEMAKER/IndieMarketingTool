// import logo from './logo.svg';
import './App.css';
import {Component, useState} from 'react';
import storage from './Storage'
import actions, {addLink, editLinkType, editNotes, removeLink} from './actions'
import {Audience} from "./Audience";
import {MonetizationPlan} from "./MonetizationPlan";
import {FieldPicker, NumberPicker} from "./FieldPicker";
import {FieldAdder} from "./FieldAdder";
// import { BrowserRouter } from 'react-router-dom';
import {Routes, Route, Link, useParams} from 'react-router-dom';
import {ping} from "./PingBrowser";
import {LINK_TYPE_DOCS, LINK_TYPE_SIMILAR} from "./constants/constants";

const APP_TYPE_GAME = 2;
const APP_TYPE_APP = 1;


function AudienceAdder({}) {
  const [audienceName, onChangeName] = useState("");

  return (
    <div className="Audience-item">
      <textarea
        value={audienceName}
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
  const [monetizationName, onChangeName] = useState("");

  return (
    <div className="Audience-item">
      <textarea
        value={monetizationName}
        onChange={event => {
          var v = event.target.value
          console.log({v})
          onChangeName(v)
        }}
      />
      <br />
      <button onClick={() => {actions.addMonetizationPlan(monetizationName); onChangeName("")}}>ADD</button>
    </div>
  )
}


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

function Channel({channel, index}) {
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
        {/*<a href={link} target={"_blank"}>{l}</a> {users} <button onClick={() => {actions.removeChannel(index)}}>x</button>*/}
        <a href={link} target={"_blank"}>{l}</a>
        <br />
        <FieldPicker
          // normalValueRenderer={onEdit => <label onClick={onEdit}>{channel.channelName || channel.name}</label>}
          value={name}
          placeholder={"Add short name"}
          onAction={val => {actions.editChannelName(index, val)}}
        />
      </td>
      <td><button onMouseLeave={() => setDangerous(false)} onMouseEnter={() => setDangerous(true)} onClick={() => {actions.removeChannel(index)}}>x</button></td>
      {/*{JSON.stringify(channel)}*/}
    </tr>
  )
}

function RiskList({risks}) {
  return (
    <ul>
      {/*<li><RiskAdder /></li>*/}
      {risks.map((r, index) => <RiskView risk={r} index={index} />)}
      <li><RiskAdder /></li>
    </ul>
  )
}
function RiskView({risk, index}) {
  var renderer = onChange => {
    var up = <button onClick={() => actions.changeRiskOrder(index, index - 1)}>Up</button>
    var down = <button onClick={() => actions.changeRiskOrder(index, index + 1)}>Down</button>

    var solutions = risk.solutions || []

    return <div>
      <span onClick={() => onChange(true)}>{risk.name}</span>
      {up} {down}
      <ul>
        {solutions.map((s, solutionIndex) => <li>
          <FieldPicker
            value={s}
            // normalValueRenderer={renderer}
            placeholder={"Solution"}
            onAction={val => {
              if (val.length)
                actions.editRiskSolution(index, solutionIndex, val)
              else
                actions.removeRiskSolution(index, solutionIndex)
            }}
          />
        </li>)}
        <RiskSolutionAdder riskIndex={index} />
      </ul>
    </div>
  }

  return (
    <li className="Risk-item">
      <FieldPicker
        value={risk.name}
        normalValueRenderer={renderer}
        placeholder={"Risk"}
        onAction={val => {
          if (val.length)
            actions.editRiskName(index, val)
          else
            actions.removeRisk(index)
        }}
      />
    </li>
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
    .map((c, i) => Object.assign({}, {c}, {index: i}))
    .sort((c1, c2) => c2.c.users - c1.c.users)
    .map((cc, i) => <Channel channel={cc.c} index={cc.index} />)
  return <table>
    <thead>
      <th>Users</th>
      <th>Name</th>
      <th></th>
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

  return Object.keys(groupedChannels)
    .map(domain => {
      var g = groupedChannels[domain].sort((a1, a2) => a2.c.users - a1.c.users)

      return <div>
        <h2>{domain}</h2>
        {g.map(a => <Channel channel={a.c} index={a.i} link={a.c.link} name={a.c.name} users={a.c.users} />)}
      </div>
    })
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
    <br />
    <br />
    Where will you find your audience?
    <h6>User count will update in future releases</h6>
    {/*<div className="Audience-Container">*/}
    <div className="Container">
      <ChannelList channels={channels} />
    </div>
  </div>
}

function AudiencePicker({onPick, defaultAudience=-1, audiences=[], excluded=[]}) {
  var excludedIDs = {}
  excluded.forEach(i => excludedIDs[i] = 1)

  var allowedOptions = audiences
    // .filter(aa => !excluded.filter(inc => inc === aa.id).length)
    .filter(aa => !excludedIDs[aa.id])

  if (allowedOptions.length) {
    return <select
      value={defaultAudience}
      onChange={event => {onPick(parseInt(event.target.value))}}
    >
      <option disabled selected value={-1}> -- select an audience --</option>
      {allowedOptions.map((aa, i) => <option value={aa.id}>{aa?.name}</option>)}
    </select>
  }

  return ''
}

function CampaignAdder({audiences}) {
  var [chosenAudience, setAudience] = useState(-1)
  var [message, setMessage] = useState("")
  var [channels, setChannels] = useState([])

  return (
    <tr>
      <td>
        <AudiencePicker defaultAudience={chosenAudience} audiences={audiences} onPick={id => {
          setAudience(id)
        }} />
      </td>
      <td>
        <FieldPicker
          value={message}
          onAction={val => setMessage(val)}
          placeholder={"What will u tell them?"}
        />
      </td>
      <td>

      </td>
      <td>
        <button>Save</button>
      </td>
    </tr>
  )
}

function BusinessPlanner({project}) {
  // var [desiredProfit, setDesiredProfit] = useState(project.desiredProfit || 10000)
  // var [monthlyExpenses, setMonthlyExpenses] = useState(project.monthlyExpenses || 500)
  // var [timeTillBurnout, setTimeTillBurnout] = useState(project.timeTillBurnout || 1)
  var {desiredProfit=10000, monthlyExpenses=500, timeTillBurnout=1} = project
  console.log({
    project
  })

  const getGoal = (goal, goalName) => {
    if (!goalName)
      goalName = <span>make <b>{goal}</b> monthly</span>

    return <div>
      To {goalName}, you need one of
      <br/>
      <br/>
      <center>
        <table>
          <tr>
            {project.monetizationPlans.filter(plan => plan.price).map(plan => {
              var rounded = Math.ceil(goal / plan.price)
              return <td>
                <b>{plan.name}'s</b>
                <br/>
                {rounded}
              </td>
            })}
          </tr>
        </table>
      </center>
    </div>
  }

  return <div>
    Let's talk about business
    {/*{desiredProfit}*/}
    {/*{monthlyExpenses}*/}
    {/*{timeTillBurnout}*/}
    <br/>
    <br/>
    <div className={"Audience-Container"}>
      <table>
        <tbody>
        <tr className={"Audience-item"}>
          <td>How much do you want to earn?</td>
          <td><NumberPicker
            value={desiredProfit}
            placeholder={"Type your desired profit"}
            onAction={val => actions.editProjectDesiredProfit(parseInt(val))}
          />
            <div>monthly</div>
          </td>
          <td>{getGoal(desiredProfit)}</td>
        </tr>
        <tr className={"Audience-item"}>
          <td>Your monthly expenses?</td>
          <td><NumberPicker
            value={monthlyExpenses}
            placeholder={"What are ur expenses"}
            onAction={val => actions.editProjectMonthlyExpenses(parseInt(val))}
          />
            {/*<div>monthly</div>*/}
          </td>
          <td>{getGoal(monthlyExpenses, 'become sustainable')}</td>
        </tr>
        <tr className={"Audience-item"}>
          <td>How much time do you have until you run out of cash?</td>
          <td><NumberPicker
            value={timeTillBurnout}
            placeholder={"How much months can you spend on that venture?"}
            onAction={val => actions.editProjectTimeTillBurnout(parseInt(val))}
          />
            <div>months</div>
          </td>
          <td>{getGoal(monthlyExpenses / timeTillBurnout, 'SURVIVE')}</td>
        </tr>
        </tbody>
      </table>
    </div>
    {/*<div className={"Audience-Container"}>*/}


    {/*  <br/>*/}
    {/*  <br/>*/}

    {/*</div>*/}

    {/*<br/>*/}
    {/*<div className={"Audience-Container"}>*/}
    {/*  What are your monthly expenses?*/}
    {/*  <FieldPicker*/}
    {/*    value={monthlyExpenses}*/}
    {/*    placeholder={"What are ur expenses"}*/}
    {/*    onAction={val => setMonthlyExpenses(parseInt(val))}*/}
    {/*  />*/}
    {/*  <br/>*/}
    {/*  <br/>*/}
    {/*  {getGoal(monthlyExpenses)}*/}
    {/*</div>*/}

    {/*<br/>*/}
    {/*<div className={"Audience-Container"}>*/}
    {/*  How much time do you have until you run out of cash?*/}
    {/*  <FieldPicker*/}
    {/*    value={timeTillBurnout}*/}
    {/*    placeholder={"How much months can you spend on that venture?"}*/}
    {/*    onAction={val => setTimeTillBurnout(parseInt(val))}*/}
    {/*  />*/}
    {/*  <br/>*/}
    {/*  <br/>*/}
    {/*  {getGoal(monthlyExpenses / timeTillBurnout, 'become sustainable')}*/}
    {/*</div>*/}

    <br/>
    <br/>
    <h2>{"Can you get these numbers?".toUpperCase()}</h2>
  </div>
}

// var strategyPicker;
// if (!strategy.length || editStrategy)
//   strategyPicker = <StrategyPicker strategy={strategy} index={index} onEditStrategyStatus={onEditStrategyStatus} />
// else
//   strategyPicker = <div onClick={() => onEditStrategyStatus(true)}><i style={{color: 'green'}}>{strategy}</i></div>
function MarketingPlanner({project}) {
  return <div>
    <br/>
    <br/>
    How will you grow?
    <br/>
    <br/>
    <div className="Container">
      <table>
        <thead>
          {/*<th>#</th>*/}
          <th>Audience</th>
          <th>How to reach them</th>
          {/*<th>Message</th>*/}
        </thead>
        <tbody>
          {project.audiences.map((a, audienceIndex) => {
            var {strategy, messages=[]} = a;

            if (!Array.isArray(strategy))
              strategy = [strategy]

            var messagePicker = <ol>
              {messages.map((m, i) =>
                <li>
                  <FieldPicker
                    value={m}
                    placeholder={"What will you tell them?"}
                    onAction={val => actions.editAudienceMessage(val, audienceIndex, i)}
                  />
                </li>
              )}
              <li>
                <FieldAdder
                  onAdd={val => actions.addAudienceMessage(val, audienceIndex)}
                  placeholder={"what will you tell them?"}
                />
              </li>
            </ol>

            var strategyPicker = <ol>
              {strategy.map(
                (s, i) => <li>
                  <FieldPicker
                    value={s}
                    placeholder={"How will you reach them?"}
                    onAction={newStrategy => actions.editAudienceStrategy(newStrategy, audienceIndex, i)}
                    onRemove={() => actions.removeAudienceStrategy(audienceIndex, i)}
                  />
                </li>
              )}
              <li>
                <FieldAdder onAdd={val => actions.addAudienceStrategy(val, audienceIndex)} placeholder={"add more ways"}/>
              </li>
            </ol>

            return <tr style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', textAlign: 'left'}}>
              {/*<td>*/}
              {/*  {a.name}*/}
              {/*</td>*/}
              <td>
                <b>How to reach <span style={{color: 'green'}}>{a.name}</span>?</b>
                <br />
                <label style={{color: 'gray'}}>{a.description}</label>
                <br />
                {strategyPicker}
              </td>
              <td>
                <b>What will you tell them?</b>
                {messagePicker}
              </td>
              <td>SLOW</td>
            </tr>
          })}
        {/*<tr>*/}
        {/*<CampaignAdder audiences={project.audiences} />*/}
        {/*</tr>*/}
        </tbody>
      </table>
    </div>
  </div>
}

function UsefulLinks({links}) {
  return <div>
    <br />
    <br />
    Save useful links here
    <div className="Container">
      <table>
        <thead></thead>
        <tbody>
          {links.map((l, i) => {
            return <tr>
              <td><a target={"_blank"} href={l.link}>Link</a></td>
              <td>
                <FieldPicker
                  value={l.note}
                  onAction={val => actions.editNotes(i, val)}
                />
              </td>
              <td>
                <select value={l.linkType} onChange={ev => {actions.editLinkType(i, parseInt(ev.target.value))}}>
                  <option value={LINK_TYPE_DOCS}>Docs</option>
                  <option value={LINK_TYPE_SIMILAR}>Similar / Competing</option>
                </select>
              </td>
              <td><button onClick={() => actions.removeLink(i)}>x</button></td>
            </tr>
          })}
          <FieldAdder onAdd={val => actions.addLink(val)} placeholder="Add link" defaultState={false} />
        </tbody>
      </table>
    </div>
  </div>
}

function RisksPanel({risks}) {
  return <div>
    <br />
    What are your biggest risks / doubts?
    <br />
    <br />
    <div className="Container">
      <RiskList risks={risks} />
    </div>
  </div>
}

function RiskAdder({}) {
  const [name, onChangeName] = useState("");

  return (
    <div className="Risk-item">
      <textarea
        value={name}
        onChange={event => {
          var v = event.target.value

          onChangeName(v)
        }}
      />
      <br />
      <button onClick={() => {actions.addRisk(name); onChangeName("")}}>ADD</button>
    </div>
  )
}

function RiskSolutionAdder({riskIndex}) {
  return <li className="Risk-item">
    <FieldAdder
      onAdd={v => {actions.addRiskSolution(riskIndex, v)}}
      defaultValue={""}
      placeholder={"Solution"}
    />
  </li>

  // const [name, onChangeName] = useState("");
  //
  // return (
  //   <li className="Risk-item">
  //     <textarea
  //       value={name}
  //       onChange={event => {
  //         var v = event.target.value
  //         console.log({v})
  //         onChangeName(v)
  //       }}
  //     />
  //     <button onClick={() => {actions.addRiskSolution(riskIndex, name); onChangeName("")}}>ADD</button>
  //   </li>
  // )
}

function MonetizationPanel({plans, audiences}) {
  return <div>
    <br />
    {/*How will you make money?*/}
    How will you make money? <MonetizationAdder />
    <br />
    <br />
    <div className="Audience-Container">
      {plans.map((p, i) => <MonetizationPlan plan={p} index={i} audiences={audiences} />)}
    </div>
  </div>
}



function AudiencesList({audiences, state}) {
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
        // if (project)
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
          />
        }
      )}
    </div>
  </div>
}

class ProjectPage extends Component {
  state = {
    audiences: [],
    monetizationPlans: [],
    channels: [],
    risks: [],
    links: [],
  }

  copyState = () => {
    this.setState({
      audiences:          storage.getAudiences(),
      monetizationPlans:  storage.getMonetizationPlans(),
      channels:           storage.getChannels(),
      risks:              storage.getRisks(),
      name:               storage.getProjectName(),
      appType:               storage.getProjectType(),
      links:              storage.getUsefulLinks(),

      project:            storage.getProject()
    })
  }

  getProjectId = () => {
    // var {projectId} = useParams()
    var arr = window.location.href.split('/')
    var projectId = arr[arr.length -1]

    console.log({projectId, arr})

    return projectId
  }
  componentWillMount() {
    storage.addChangeListener(() => {
      console.log('store listener')

      this.copyState()
    })

    this.copyState()

    actions.loadProject(this.getProjectId())
  }

  render() {
    var {audiences, monetizationPlans, risks, channels, name, appType, links} = this.state;
    var projectId = this.getProjectId()

    var audiencePhrase = appType===APP_TYPE_GAME ? 'Who will play your game?' : 'Who will use your app?'

    return (
      <div className="App">
        <header className="App-header">
          <FieldPicker
            value={name}
            placeholder={"name the project"}
            onAction={val => {actions.editName(projectId, val)}}
            normalValueRenderer={onEdit => <h1 onClick={onEdit}>{name}</h1>}
          />
          <a href={"/profile"}>Profile</a>
          <br />
          <br />
          {audiencePhrase}       <AudienceAdder />
          <br />
          <br />
          <AudiencesList audiences={audiences} state={this.state} />
          <MonetizationPanel plans={monetizationPlans} audiences={audiences} />
          <RisksPanel risks={risks} />
          <AudienceSourcesPanel channels={channels} />
          <UsefulLinks links={this.state.links} />
          <MarketingPlanner project={this.state} />
          <br />
          <br />
          <BusinessPlanner project={this.state.project} />

          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <a style={{color: 'white'}} href="/profile" onClick={() => actions.removeProject(projectId)}>REMOVE PROJECT</a>
        </header>
      </div>
    );
  }
}

function ProjectList({projectIDs}) {
  return projectIDs.map(({id, name}) => <div><Link to={"/projects/" + id}>{name}</Link></div>)
}

class Examples extends Component {
  render() {
    var list = [
      {id: '6495f797115f0e146936e5ad', name: 'Indie Marketing Tool'},
      {id: '', name: 'EU4'},
      // {id: '', name: 'Corporations'},
      // {id: '', name: 'David IV'},
    ]

    return <div className="App">
      <header className="App-header" style={{height: '100%', minHeight: '100vh'}}>
        <h1>Stop wasting years on a game/app, that nobody needs</h1>
        <br />
        <h2>
          Bring ur project to market faster
        </h2>
        <h2>
          Innovate without destroying ur mental health
        </h2>
        <ProjectList projectIDs={list} />
        <br />
        <br />
        <Link to={"/"}>Back</Link>
        <Link to={"/pricing"}>Pricing</Link>
      </header>
    </div>
  }
}

class MainPage extends Component {
  render() {
    return <div className="App">
      <header className="App-header" style={{height: '100%', minHeight: '100vh'}}>
        <h1>Stop wasting years on a game/app, that nobody needs</h1>
        <br />
        <h2>
          Bring ur project to market faster
        </h2>
        <h2>
          Innovate without destroying ur mental health
        </h2>
        {/*<Link to={"/examples"}>Examples</Link>*/}
        {/*<Link to={"/pricing"}>Pricing</Link>*/}
        <Link to={"/profile"}>Profile</Link>
      </header>
    </div>
  }
}


function ProjectAdder({appType, defaultState}) {
  const refresh = () => window.location.reload(true)

  var defaultWord;
  if (appType === APP_TYPE_GAME)
    defaultWord = "new Game"
  else
    defaultWord = "new App"

  return <FieldAdder
    onAdd={name => {
      actions.addProject(name, appType)

      // TODO GO TO NEW PROJECT PAGE
      setTimeout(refresh, 2500)
    }}
    placeholder={"add?"}
    defaultWord={defaultWord}
    defaultValue={defaultWord}
    defaultState={defaultState}
  />
}

function NewProjectAdder({}) {
  var [appType, setAppType] = useState(0)
  var isChosen = appType !== 0

  var chooseTypeForm
  if (!isChosen) {
    chooseTypeForm = <div>
      <button onClick={() => setAppType(APP_TYPE_GAME)}>NEW GAME</button><button onClick={() => setAppType(APP_TYPE_APP)}>NEW APP</button>
    </div>
  } else {
    chooseTypeForm = <ProjectAdder appType={appType} defaultState={true}/>
  }

  return <div>
    {chooseTypeForm}
  </div>
}
class ProfilePage extends Component {
  state = {
    projectIDs: [],
  }

  componentWillMount() {
    ping('/api/profile', response => {
      this.setState({
        projectIDs: response.body.projects
      })
    })
      .finally(() => {
        console.log('WENT TO SERVER FOR PROFILE PAGE')
      })
  }

  render() {
    var projectIDs = this.state.projectIDs; // [{id: '6495f797115f0e146936e5ad', name: 'MY APP'}]


    return <div>
      <h1>PROFILE</h1>
      <br />
      {/*<NewProjectAdder />*/}
      {/*<br />*/}
      <br />
      <ProjectList projectIDs={projectIDs} />
      <br />
      <br />
      <NewProjectAdder />
    </div>
  }
}

class App extends Component {
  render() {
    return <div>
      <div className="App">
        <header className="App-header" style={{height: '100%', minHeight: '100vh'}}>
          <Routes>
            <Route path='/' element={<MainPage/>}/>
            <Route path='/examples' element={<Examples/>}/>
            <Route path='/about' element={<div>ABOUT</div>}/>

            <Route path='/profile' element={<ProfilePage/>}/>
            <Route path='/projects/:projectId' element={<ProjectPage/>}/>
          </Routes>
        </header>
      </div>
    </div>
  }
}

export default App;
