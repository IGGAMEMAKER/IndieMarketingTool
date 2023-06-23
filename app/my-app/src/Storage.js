import { EventEmitter } from 'events';
import Dispatcher from './Dispatcher';
import {
  AUDIENCE_ADD,
  AUDIENCE_EDIT_NAME,
  AUDIENCE_EDIT_STRATEGY,
  AUDIENCE_EDIT_DESCRIPTION,
  AUDIENCE_REMOVE,
  MONETIZATION_AUDIENCE_ADD,
  MONETIZATION_ADD,
  MONETIZATION_EDIT_DESCRIPTION,
  MONETIZATION_EDIT_NAME,
  MONETIZATION_AUDIENCE_REMOVE,
  MONETIZATION_EDIT_PRICE,
  RISK_EDIT_NAME,
  RISK_ADD,
  RISK_ORDER_CHANGE,
  MONETIZATION_BENEFIT_ADD, MONETIZATION_BENEFIT_REMOVE
} from "./constants/actionConstants";
import {ping} from "./PingBrowser";
// import {ping} from "./PingBrowser";
// import actions from "./actions";

const CE = 'CHANGE_EVENT';

var project = {
  name: 'Indie Marketing Tool',
  type: 1, // 1 - app, 2 - game

  audiences: [
    {
      name: "Veteran gamedevs",
      description: "Already wasted years and dont want repetition",
      strategy: "DM low review game devs on Steam \nPostmortems",
    },
    // {
    //   name: "Veteran devs",
    //   description: "Already wasted years and dont want repetition",
    //   strategy: ["Search by Postmortem posts"],
    //   price: 25
    // },
    {
      name: "Newbie gamedevs",
      description: "Think their game will be an exception",
      strategy: "through influencers via marketing 101 tutorials",
    },
    // {
    //   name: 'Newbie devs',
    //   description: 'Think their game will be an exception',
    //   strategy: ['through influencers via marketing 101 tutorials'],
    //   price: 10
    // },
    {
      name: 'Devs',
      description: 'Sublime. Play with ideas and quit fast',
      strategy: "through blogs",
    },
  ],

  monetizationPlans: [
    {name: 'Demo',  benefits: ['1 Full project?', "10 Free projects (basic functions)"], audiences: [2], price: 0},
    {name: 'Basic', benefits: ['10 Projects', 'additional features?'], audiences: [1], price: 10},
    {name: 'Pro',   benefits: ['∞ Projects', 'even more features?'], audiences: [0], price: 25},
    // {name: 'Enterprise',   description: '100 Projects + even more features?', audiences: []},
  ],

  channels: [
    {name: 'SoloMyth', users: 2000,  link: 'https://www.youtube.com/watch?v=YaUdstkv1RE'},
    {name: 'Songs',    users: 100,   link: 'https://www.youtube.com/watch?v=qErChNhYAN8'},
    {name: 'gamedev',  users: 10000, link: 'https://www.reddit.com/r/gamedev/comments/n4nvfa/project_management_tool/'},
    {name: 'Similar product',  users: 400, link: 'https://www.reddit.com/user/bohlenlabs/'}
  ],

  risks: [
    {
      name: "Won't be interested enough",
    },
    {
      name: "Won't understand",
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
  ],
}

class Storage extends EventEmitter {
  addChangeListener(c) {
    this.addListener(CE, c);
  }

  emitChange() {
    this.emit(CE);
  }

  getProject = () => project;
  getAudiences = () => this.getProject().audiences
  getMonetizationPlans = () => this.getProject().monetizationPlans
  getChannels = () => this.getProject().channels
  getRisks = () => this.getProject().risks

  isApp = () => this.getProject().type === 1
  isGame = () => this.getProject().type === 2
}

const store = new Storage();

const swap = (i1, i2, array) => {
  if (i1 < array.length && i2 < array.length && i1 >= 0 && i2 >= 0) {
    var r1 = array[i1];
    var r2 = array[i2];

    array[i2] = r1
    array[i1] = r2
  }
  return array
}


Dispatcher.register((p) => {
  const sendToServer = () => {
    store.emitChange()
    ping('/test', r => {
      console.log({r})
    })
      .finally(() => console.log('FINALLY'))
  }
  switch (p.actionType) {
    case AUDIENCE_ADD:
      project.audiences.push({
        name: p.name,
        description: "",
        strategy: [],
        price: 0
      })
      // store.emitChange()
      sendToServer()
      break;

    case AUDIENCE_EDIT_DESCRIPTION:
      project.audiences[p.audienceIndex].description = p.description
      store.emitChange();
      break;

    case AUDIENCE_EDIT_NAME:
      project.audiences[p.audienceIndex].name = p.name
      store.emitChange();
      break;

    case AUDIENCE_EDIT_STRATEGY:
      project.audiences[p.audienceIndex].strategy = p.strategy
      store.emitChange();
      break;

    case MONETIZATION_ADD:
      project.monetizationPlans.push({name: p.name, benefits: [], audiences: [], price: 0, regularity: 0})
      // 0 - fixed
      // 1 - day
      // 2 - week
      // 3 - month
      // 4 - year
      store.emitChange()
      break

    case MONETIZATION_EDIT_DESCRIPTION:
      project.monetizationPlans[p.monetizationIndex].benefits[p.benefitIndex] = p.benefit
      store.emitChange()
      break


    case MONETIZATION_BENEFIT_ADD:
      project.monetizationPlans[p.monetizationIndex].benefits.push(p.benefit)
      store.emitChange()
      break

    case MONETIZATION_BENEFIT_REMOVE:
      project.monetizationPlans[p.monetizationIndex].benefits.splice(p.benefitIndex, 1)
      store.emitChange()
      break

    case MONETIZATION_EDIT_NAME:
      project.monetizationPlans[p.monetizationIndex].name = p.name
      store.emitChange()
      break

    case MONETIZATION_EDIT_PRICE:
      project.monetizationPlans[p.monetizationIndex].price = p.price
      store.emitChange()
      break

    case MONETIZATION_AUDIENCE_ADD:
      project.monetizationPlans[p.monetizationIndex].audiences.push(p.audienceIndex)
      store.emitChange()
      break

    case MONETIZATION_AUDIENCE_REMOVE:
      project.monetizationPlans[p.monetizationIndex].audiences = project.monetizationPlans[p.monetizationIndex].audiences.filter(inc => inc!== p.audienceIndex)
      store.emitChange()
      break

    case RISK_ADD:
      project.risks.push({name: p.name})
      store.emitChange()
      break;

    case RISK_EDIT_NAME:
      project.risks[p.riskIndex].name = p.name;
      store.emitChange()
      break;

    case RISK_ORDER_CHANGE:
      var i1 = p.index1;
      var i2 = p.index2;

      project.risks = swap(i1, i2, project.risks)
      store.emitChange()
      break;

    default:
      console.warn(`TYPE IS FUCKED. Got unexpected type ${p.type}`);
      break;
  }
});

export default store;