// import logo from './logo.svg';
import './App.css';
import { useState } from 'react';


function Audience({name, description, strategy, index, isFull = false, onToggleFullInfo = () => {}}) {
  var f = ''

  if (isFull) {
    f = <div>
      <br/>
      {description}
      <br/>
      {strategy.map(s => <div><i style={{color: 'green'}}>{s}</i></div>)}
      <br/>
      {/*{pricing.map(p => <div><i style={{color: 'orange'}}>{p}</i></div>)}*/}
      <input/>
    </div>
  }

  return (
    <div className="Audience-item">
      <b onClick={onToggleFullInfo}>{name}</b>
      {f}
    </div>
  );
}

function AudienceAdder({}) {
  return (
    <div className="Audience-item">
      <button>ADD</button>
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
    <ul>{risks.map(r => <RiskView risk={r} />)}</ul>
  )
}
function RiskView({risk}) {
  var subrisks = risk.subrisks || []
  return (
    <li className="Risk-item">{risk.name}{subrisks ? <RiskList risks={subrisks} /> : ''}</li>
  )
}

function MonetizationPlan({plan, audiences}) {
  return <div className="Risk-item">
    <div>{plan.name}</div>
    <div>{plan.description}</div>
    <div>{plan?.audiences?.join()}</div>
  </div>
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
    What are your biggest risks?
    <br />
    <br />
    <div className="Container">
      <RiskList risks={risks} />
    </div>
  </div>
}

function MonetizationPanel({plans, audiences}) {
  return <div>
    <br />
    How will you make money?
    <br />
    <br />
    <div className="Container">
      {plans.map(p => <MonetizationPlan plan={p} audiences={audiences} />)}
    </div>
  </div>
}



function AudiencesList({audiences}) {
  const [isFullAudienceInfo, setIsFullInfo] = useState(false);

  return <div>
    Who will use your app / play your game?
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
      {/*<AudienceAdder />*/}
    </div>
  </div>
}

function App() {
  var audiences = [
    {
      name: "Veteran gamedevs",
      description: "Already wasted years and dont want repetition",
      strategy: ["DM low review game devs on Steam", "Postmortems"],
      pricing: [
        // '25$ / m'
      ]
    },
    {
      name: "Veteran devs",
      description: "Already wasted years and dont want repetition",
      strategy: ["Search by Postmortem posts"],
      pricing: [
        // '25$ / m'
      ]
    },
    {
      name: "Newbie gamedevs",
      description: "Think their game will be an exception",
      strategy: ["through influencers via marketing 101 tutorials"],
      pricing: [
        // '10$ / m'
      ]
    },
    {
      name: 'Newbie devs',
      description: 'Think their game will be an exception',
      strategy: ['through influencers via marketing 101 tutorials'],
      pricing: [
        // '10$ / m'
      ]
    },
    {
      name: 'Devs',
      description: 'Sublime. Play with ideas and quit fast',
      strategy: ['through blogs'],
      pricing: ['FREE? Limit projects count']
    },
  ];

  var monetizationPlans = [
    {name: 'Demo',  description: '3 Free projects just for test', audiences: [4]},
    {name: 'Basic', description: '10 Projects + additional features?', audiences: [2, 3]},
    {name: 'Pro',   description: '100 Projects + even more features?', audiences: [0, 1]},
    {name: 'Enterprise',   description: '100 Projects + even more features?'},
  ]

  var channels = [
    {name: 'SoloMyth', users: 2000,  link: 'https://www.youtube.com/watch?v=YaUdstkv1RE'},
    {name: 'Songs',    users: 100,   link: 'https://www.youtube.com/watch?v=qErChNhYAN8'},
    {name: 'gamedev',  users: 10000, link: 'https://www.reddit.com/r/gamedev/comments/n4nvfa/project_management_tool/'},
    {name: 'Similar product',  users: 400, link: 'https://www.reddit.com/user/bohlenlabs/'}
  ]

  var risks = [
    {
      name: "Won't be interested enough",
      subrisks: [{
        name: "Won't understand",
      }]
    },
    {
      name: "Won't buy it"
    },
    {
      name: "Won't like it"
    },
    {
      name: "Won't recommend it"
    },
  ]

  return (
    <div className="App">
      <header className="App-header">
        <h1>Stop wasting years on a game/app, that nobody needs</h1>
        <AudiencesList audiences={audiences}/>
        <MonetizationPanel plans={monetizationPlans} audiences={audiences}/>
        <RisksPanel risks={risks} />
        <AudienceSourcesPanel channels={channels} />
      </header>
    </div>
  );
}

export default App;
