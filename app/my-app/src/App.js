// import logo from './logo.svg';
import './App.css';
import {Component, useState} from 'react';
import storage from './Storage'
import actions from './actions'
import {Audience} from "./Audience";
import {MonetizationPlan} from "./MonetizationPlan";
import {FieldPicker} from "./FieldPicker";
import {FieldAdder} from "./FieldAdder";
// import { BrowserRouter } from 'react-router-dom';
import {Routes, Route, Link, useParams} from 'react-router-dom';
import {ping} from "./PingBrowser";

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

function Channel({link, channel, index, name, users}) {
  var [isDangerous, setDangerous] = useState(false)
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
        <a href={link} target={"_blank"}>{l}</a> <span><FieldPicker value={name} placeholder={"Add short name"} onAction={val => {actions.editChannelName(index, val)}} /></span>
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
    </div> // {up} {down}
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

  var mapped = channels.map((c, i) => <Channel channel={c} index={i} link={c.link} name={c.name} users={c.users} />)
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
      alert(val)
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
          console.log({m})
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
    risks: []
  }

  copyState = () => {
    this.setState({
      audiences:          storage.getAudiences(),
      monetizationPlans:  storage.getMonetizationPlans(),
      channels:           storage.getChannels(),
      risks:              storage.getRisks(),
      name:               storage.getProjectName(),
      appType:               storage.getProjectType()
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
    var {audiences, monetizationPlans, risks, channels, name, appType} = this.state;
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

          <a href="/profile" onClick={() => actions.removeProject(projectId)}>REMOVE PROJECT</a>
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
