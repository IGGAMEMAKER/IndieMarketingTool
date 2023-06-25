// import logo from './logo.svg';
import './App.css';
import {Component, useState} from 'react';
import storage from './Storage'
import actions, {loadProject} from './actions'
import {Audience} from "./Audience";
import {MonetizationPlan} from "./MonetizationPlan";
import {FieldPicker} from "./FieldPicker";
import {FieldAdder} from "./FieldAdder";
// import { BrowserRouter } from 'react-router-dom';
import {Routes, Route, Link} from 'react-router-dom';
import {ping} from "./PingBrowser";

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


const getUrlWithoutPrefixes = link => link.replace('https://', '').replace('www.', '')
const getDomain = link => {
  var w = getUrlWithoutPrefixes(link)
  var index = w.indexOf('.') // w.findIndex('.')

  return w.substr(0, index)
}

function Channel({link, name, users}) {
  var l = name ?? getUrlWithoutPrefixes(link)

  return (
    <div className="Channel-item"><a href={link} target={"_blank"}>{l}</a> {users}</div>
  )
}

function RiskList({risks}) {
  return (
    <ul>
      <li><RiskAdder /></li>
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

    groupedChannels[domain].push(c)
  })

  return Object.keys(groupedChannels)
    .map(domain => {
      var g = groupedChannels[domain].sort((a1, a2) => a2.users - a1.users)

      return <div>
        <h2>{domain}</h2>
        {g.map((a, i) => <Channel link={a.link} name={a.name} users={a.users} />)}
      </div>
    })
}

function AudienceSourcesPanel({channels}) {
  return <div>
    <br />
    Where will you find your audience?
    <br />
    <br />
    <div className="Audience-Container">
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



function AudiencesList({audiences}) {
  const [isFullAudienceInfo, setIsFullInfo] = useState(false);

  return <div>
    Who will use your app / play your game?       <AudienceAdder />
    <br />
    <br />
    <div className="Audience-Container">
      {audiences.map((a, i) =>
        <Audience
          onToggleFullInfo={() => {setIsFullInfo(!isFullAudienceInfo)}}
          isFull={!isFullAudienceInfo}

          name={a.name}
          description={a.description}
          strategy={a.strategy}
          index={i}
        />
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
      risks:              storage.getRisks()
    })
  }
  componentWillMount() {
    storage.addChangeListener(() => {
      console.log('store listener')

      this.copyState()
    })

    this.copyState()
    actions.loadProject()
  }

  render() {
    var {audiences, monetizationPlans, risks, channels} = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1>Stop wasting years on a game/app, that nobody needs</h1>
          <a href={"/about"}>ABOUT</a>
          <AudiencesList audiences={audiences} />
          <MonetizationPanel plans={monetizationPlans} audiences={audiences} />
          <RisksPanel risks={risks} />
          <AudienceSourcesPanel channels={channels} />
        </header>
      </div>
    );
  }
}

// function Link({href, text}) {
//   return <a href={href}>{text}</a>
// }

function ProjectList({projectIDs}) {
  return projectIDs.map(({id, name}) => <Link to={"/projects/" + id}>{name}</Link>)
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
        <Link to={"/examples"}>Examples</Link>
        <Link to={"/pricing"}>Pricing</Link>
        <Link to={"/profile"}>Profile</Link>
      </header>
    </div>
  }
}


// class ProjectAdder extends Component {
//
// }
class ProfilePage extends Component {
  state = {
    projectIDs: [],
  }

  componentWillMount() {
    storage.addChangeListener(() => {
      console.log('store listener')

      // this.copyState()
    })

    ping('/api/profile', response => {
      this.setState({
        projectIDs: response.body.projects
      })
    })
      .finally(() => {
        console.log('WENT TO SERVER FOR PROFILE PAGE')
      })

    // this.copyState()
    // actions.loadProject()
  }
  render() {
    var projectIDs = this.state.projectIDs; // [{id: '6495f797115f0e146936e5ad', name: 'MY APP'}]
    return <div>
      {JSON.stringify(projectIDs)}
      <ProjectList projectIDs={projectIDs} />
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
            <Route path='/projects/*' element={<ProjectPage/>}/>
          </Routes>
        </header>
      </div>
    </div>
  }
}

export default App;
