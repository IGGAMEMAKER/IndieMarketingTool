import { EventEmitter } from 'events';
import Dispatcher from './Dispatcher';
import {
  AUDIENCE_ADD,
  AUDIENCE_EDIT_NAME,
  AUDIENCE_EDIT_STRATEGY,
  AUDIENCE_EDIT_DESCRIPTION,
  AUDIENCE_REMOVE,
  MONETIZATION_AUDIENCE_ADD, MONETIZATION_ADD, MONETIZATION_EDIT_DESCRIPTION, MONETIZATION_EDIT_NAME
} from "./constants/actionConstants";
// import {ping} from "./PingBrowser";
// import actions from "./actions";

const CE = 'CHANGE_EVENT';

var audiences = [
  {
    name: "Veteran gamedevs",
    description: "Already wasted years and dont want repetition",
    strategy: "DM low review game devs on Steam \nPostmortems",
    pricing: [
      // '25$ / m'
    ]
  },
  // {
  //   name: "Veteran devs",
  //   description: "Already wasted years and dont want repetition",
  //   strategy: ["Search by Postmortem posts"],
  //   pricing: [
  //     // '25$ / m'
  //   ]
  // },
  {
    name: "Newbie gamedevs",
    description: "Think their game will be an exception",
    strategy: "through influencers via marketing 101 tutorials",
    pricing: [
      // '10$ / m'
    ]
  },
  // {
  //   name: 'Newbie devs',
  //   description: 'Think their game will be an exception',
  //   strategy: ['through influencers via marketing 101 tutorials'],
  //   pricing: [
  //     // '10$ / m'
  //   ]
  // },
  {
    name: 'Devs',
    description: 'Sublime. Play with ideas and quit fast',
    strategy: "through blogs",
    pricing: ['FREE? Limit projects count']
  },
];

var monetizationPlans = [
  {name: 'Demo',  description: '3 Free projects just for test', audiences: [2]},
  {name: 'Basic', description: '10 Projects + additional features?', audiences: [1]},
  {name: 'Pro',   description: '100 Projects + even more features?', audiences: [0]},
  // {name: 'Enterprise',   description: '100 Projects + even more features?', audiences: []},
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

class Storage extends EventEmitter {
  addChangeListener(c) {
    this.addListener(CE, c);
  }

  emitChange() {
    this.emit(CE);
  }


  getAudiences = () => audiences
  getMonetizationPlans = () => monetizationPlans
  getChannels = () => channels
  getRisks = () => risks
}

const store = new Storage();

Dispatcher.register((p) => {
  switch (p.actionType) {
    case AUDIENCE_ADD:
      console.log({audiences, p})
      audiences.push({
        name: p.name,
        description: "",
        strategy: []
      })
      store.emitChange()
      break;

    case AUDIENCE_EDIT_DESCRIPTION:
      audiences[p.audienceIndex].description = p.description
      store.emitChange();
      break;

    case AUDIENCE_EDIT_NAME:
      audiences[p.audienceIndex].name = p.name
      store.emitChange();
      break;

    case AUDIENCE_EDIT_STRATEGY:
      audiences[p.audienceIndex].strategy = p.strategy
      store.emitChange();
      break;

    case MONETIZATION_ADD:
      monetizationPlans.push({name: p.name, description: "", audiences: []})
      store.emitChange()
      break

    case MONETIZATION_EDIT_DESCRIPTION:
      monetizationPlans[p.monetizationIndex].description = p.description
      store.emitChange()
      break

    case MONETIZATION_EDIT_NAME:
      monetizationPlans[p.monetizationIndex].name = p.name
      store.emitChange()
      break

    case MONETIZATION_AUDIENCE_ADD:
      monetizationPlans[p.monetizationIndex].audiences.push(p.audienceIndex)
      store.emitChange()
      break

    default:
      console.warn(`TYPE IS FUCKED. Got unexpected type ${p.type}`);
      break;
  }
});

export default store;