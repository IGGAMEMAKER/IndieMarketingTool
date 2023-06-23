// import logo from './logo.svg';
import './App.css';
import {Component, useState} from 'react';
import storage from './Storage'
import actions from './actions'
import {Audience} from "./Audience";
import {MonetizationPlan} from "./MonetizationPlan";
import {FieldPicker} from "./FieldPicker";

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
    <ul>{risks.map((r, index) => <RiskView risk={r} index={index} />)}</ul>
  )
}
function RiskView({risk, index}) {
  var renderer = onChange => {
    var up = <button onClick={() => actions.changeRiskOrder(index, index -1)}>Up</button>
    var down = <button onClick={() => actions.changeRiskOrder(index, index + 1)}>Down</button>
    return <div><span onClick={() => onChange(true)}>{risk.name}</span>****</div> // {up} {down}
  }

  return (
    <li className="Risk-item">
      <FieldPicker
        value={risk.name}
        normalValueRenderer={renderer}
        placeholder={"Risk"}
        onAction={val => actions.editRiskName(index, val)}
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
    What are your biggest risks? <RiskAdder />
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
          console.log({v})
          onChangeName(v)
        }}
      />
      <br />
      <button onClick={() => {actions.addRisk(name); onChangeName("")}}>ADD</button>
    </div>
  )
}

function MonetizationPanel({plans, audiences}) {
  return <div>
    <br />
    How will you make money?       <MonetizationAdder />
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

class App extends Component {
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
  }

  render() {
    var {audiences, monetizationPlans, risks, channels} = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1>Stop wasting years on a game/app, that nobody needs</h1>
          <AudiencesList audiences={audiences} />
          <MonetizationPanel plans={monetizationPlans} audiences={audiences} />
          <RisksPanel risks={risks} />
          <AudienceSourcesPanel channels={channels} />
        </header>
      </div>
    );
  }
}

export default App;
