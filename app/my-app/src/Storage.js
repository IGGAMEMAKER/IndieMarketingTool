import { EventEmitter } from 'events';
import Dispatcher from './Dispatcher';
import {
  AUDIENCE_ADD,
  AUDIENCE_NAME_EDIT,
  AUDIENCE_STRATEGY_EDIT,
  AUDIENCE_DESCRIPTION_EDIT,
  AUDIENCE_REMOVE,
  MONETIZATION_AUDIENCE_ADD,
  MONETIZATION_ADD,
  MONETIZATION_EDIT_BENEFIT,
  MONETIZATION_EDIT_NAME,
  MONETIZATION_AUDIENCE_REMOVE,
  MONETIZATION_EDIT_PRICE,
  RISK_EDIT_NAME,
  RISK_ADD,
  RISK_ORDER_CHANGE,
  MONETIZATION_BENEFIT_ADD,
  MONETIZATION_BENEFIT_REMOVE,
  PROJECT_LOAD,
  PROJECT_SAVE,
  RISK_SOLUTION_EDIT,
  RISK_SOLUTION_ADD,
  RISK_SOLUTION_REMOVE,
  RISK_REMOVE,
  MONETIZATION_EDIT_DESCRIPTION,
  MONETIZATION_REMOVE,
  PROJECT_ADD,
  PROJECT_RENAME,
  PROJECT_REMOVE,
  CHANNELS_ADD,
  CHANNELS_REMOVE,
  CHANNELS_NAME_EDIT,
  LINKS_ADD,
  LINKS_REMOVE,
  LINKS_NOTES_EDIT,
  LINKS_TYPE_EDIT,
  MONETIZATION_ORDER_CHANGE,
  AUDIENCE_STRATEGY_ADD,
  AUDIENCE_STRATEGY_REMOVE,
  AUDIENCE_ORDER_CHANGE,
  AUDIENCE_MESSAGE_ADD,
  AUDIENCE_MESSAGE_EDIT,
  PROJECT_EDIT_BURNOUT_TIME,
  PROJECT_EDIT_DESIRED_PROFIT, PROJECT_EDIT_EXPENSES
} from "./constants/actionConstants";
import {ping, post, remove, update} from "./PingBrowser";
import {LINK_TYPE_DOCS} from "./constants/constants";

const CE = 'CHANGE_EVENT';

var userId = '6495f2aad151580c1f4b516a';
var projectId = '' // 6495f797115f0e146936e5ad

var projectMock = {
  name: 'NOT LOADED',
  type: 1, // 1 - app, 2 - game

  audiences: [],
  monetizationPlans: [],
  channels: [],
  risks: []
}

var project = projectMock

class Storage extends EventEmitter {
  addChangeListener(c) {
    this.addListener(CE, c);
  }

  emitChange() {
    this.emit(CE);
  }

  getProject = () => project;
  getData = () => this.getProject()

  getAudiences          = () => this.getData().audiences
  getMonetizationPlans  = () => this.getData().monetizationPlans
  getChannels           = () => this.getData().channels
  getRisks              = () => this.getData().risks
  getProjectName              = () => this.getData().name
  getProjectType              = () => this.getData().type
  getUsefulLinks              = () => this.getData().links || []

  // isApp = () => this.getProject().type === 1
  // isGame = () => this.getProject().type === 2
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

const getNextAudienceID = proj => {
  var ids = proj.audiences.map(a => a.id || 0)
  console.log({ids})

  if (!ids.length)
    ids.push(0)

  return 1 + Math.max(...ids)
}

const refresh = (time = 800) => {
  setTimeout(() => window.location.reload(true), time)
}

const getRealAudienceIndexFromAudienceID = audienceID => project.audiences.findIndex(a => a.id === audienceID);

Dispatcher.register((p) => {
  const saveProjectChanges = () => {
    console.log('will update projectId', {projectId})
    update('/api/projects/' + projectId, {project})
      .finally(() => {
        store.emitChange()
      })
  }

  const fixStrategy = (p) => {
    // TODO PATCH FOR OLDER PROJECTS
    if (!Array.isArray(project.audiences[p.audienceIndex].strategy))
      project.audiences[p.audienceIndex].strategy = [p.strategy]

    if (!project.audiences[p.audienceIndex].messages)
      project.audiences[p.audienceIndex].messages = []
  }

  switch (p.actionType) {
    case PROJECT_LOAD:
      console.log('loading project', p.projectId)
      projectId = p.projectId

      ping('/api/projects/' + p.projectId, data => {
        console.log({body: data.body})
        var proj = data.body.project;

        project = proj
      })
        .finally(() => {
          var changesNeeded = 0

          // reset IDs
          // project.audiences.forEach((a, i) => {
          //   project.audiences[i].id = -1;
          // })
          // project.audiences.forEach((a, i) => {
          //   if (project.audiences[i].id) {
          //     project.audiences[i].id = i
          //     changesNeeded++
          //   }
          // })

          if (changesNeeded) {
            alert('CHANGES NEEDED: ' + changesNeeded)
            saveProjectChanges()
          }
          else
            store.emitChange()
        })
      break

    case PROJECT_ADD:
      post('/api/projects/',
          {name: p.name, appType: p.appType},
          data => {
            console.log({body: data.body})

            // TODO force refresh
          })
          .finally(() => {
            store.emitChange()
          })
      break

    case PROJECT_RENAME:
      project.name = p.name;
      saveProjectChanges()
      break

    case PROJECT_REMOVE:
      remove('/api/projects/' + p.projectId, {})
        .then(r => {
          console.log({r})
        })
        .catch(err => {
          console.error('failed to remove', {err})
        })
      saveProjectChanges()
      break;


    case AUDIENCE_ADD:
      project.audiences.push({
        name: p.name,
        description: "",
        strategy: [],
        messages: [],
        price: 0,

        id: getNextAudienceID(project)
      })

      saveProjectChanges()
      break;


    case AUDIENCE_REMOVE:
      // TODO REMOVE THIS IF THIS AUDIENCE IS USED ANYWHERE
      // TODO F.E. IN MONETIZATION PLANS
      // TODO REMOVE ATTACHMENTS BY ID!!!!!
      project.audiences.splice(p.audienceIndex, 1)
      saveProjectChanges()
      refresh()
      break;

    case AUDIENCE_DESCRIPTION_EDIT:
      project.audiences[p.audienceIndex].description = p.description
      saveProjectChanges();
      break;

    case AUDIENCE_NAME_EDIT:
      project.audiences[p.audienceIndex].name = p.name
      saveProjectChanges();
      break;

    case AUDIENCE_STRATEGY_EDIT:
      console.log('EDIT STRATEGY', project.audiences[p.audienceIndex].strategy)
      console.log(p.strategy)

      fixStrategy(p)

      console.log('made an array?')
      project.audiences[p.audienceIndex].strategy[p.textIndex] = p.strategy
      saveProjectChanges();
      break;

    case AUDIENCE_MESSAGE_ADD:
      fixStrategy(p)

      project.audiences[p.audienceIndex].messages.push(p.message)
      saveProjectChanges();
      break;

    case AUDIENCE_MESSAGE_EDIT:
      fixStrategy(p)

      project.audiences[p.audienceIndex].messages[p.messageIndex] = p.message
      saveProjectChanges();
      break;


    case AUDIENCE_STRATEGY_ADD:
      fixStrategy(p)

      project.audiences[p.audienceIndex].strategy.push(p.strategy)
      saveProjectChanges();
      break;

    case AUDIENCE_STRATEGY_REMOVE:
      fixStrategy(p)

      project.audiences[p.audienceIndex].strategy.splice(p.textIndex, 1)
      saveProjectChanges();
      refresh()
      break;

    case AUDIENCE_ORDER_CHANGE:
      project.audiences = swap(p.audienceIndex1, p.audienceIndex2, project.audiences)
      saveProjectChanges();
      refresh()
      break;


    case MONETIZATION_ADD:
      project.monetizationPlans.push({name: p.name, benefits: [], audiences: [], price: 0, regularity: 0})
      // 0 - fixed
      // 1 - day
      // 2 - week
      // 3 - month
      // 4 - year
      saveProjectChanges()
      break

    case MONETIZATION_ORDER_CHANGE:
      project.monetizationPlans = swap(p.monetizationIndex1, p.monetizationIndex2, project.monetizationPlans)
      saveProjectChanges()
      refresh()
      break;

    case MONETIZATION_REMOVE:
      project.monetizationPlans.splice(p.monetizationIndex, 1)
      saveProjectChanges()
      refresh()
      break

    case MONETIZATION_EDIT_BENEFIT:
      project.monetizationPlans[p.monetizationIndex].benefits[p.benefitIndex] = p.benefit
      saveProjectChanges()
      break

    case MONETIZATION_EDIT_DESCRIPTION:
      project.monetizationPlans[p.monetizationIndex].description = p.description
      saveProjectChanges()
      break


    case MONETIZATION_BENEFIT_ADD:
      project.monetizationPlans[p.monetizationIndex].benefits.push(p.benefit)
      saveProjectChanges()
      break

    case MONETIZATION_BENEFIT_REMOVE:
      project.monetizationPlans[p.monetizationIndex].benefits.splice(p.benefitIndex, 1)
      saveProjectChanges()
      break

    case MONETIZATION_EDIT_NAME:
      project.monetizationPlans[p.monetizationIndex].name = p.name
      saveProjectChanges()
      break

    case MONETIZATION_EDIT_PRICE:
      project.monetizationPlans[p.monetizationIndex].price = p.price
      saveProjectChanges()
      break

    case MONETIZATION_AUDIENCE_ADD:
      project.monetizationPlans[p.monetizationIndex].audiences.push(p.audienceIndex)
      saveProjectChanges()
      break

    case MONETIZATION_AUDIENCE_REMOVE:
      project.monetizationPlans[p.monetizationIndex].audiences = project.monetizationPlans[p.monetizationIndex].audiences.filter(inc => inc!== p.audienceID)
      saveProjectChanges()
      refresh()
      break

    case RISK_ADD:
      project.risks.push({name: p.name, solutions: []})
      saveProjectChanges()
      break;

    case RISK_REMOVE:
      project.risks.splice(p.riskIndex, 1)
      saveProjectChanges()
      refresh()
      break;

    case RISK_SOLUTION_ADD:
      var r = project.risks[p.riskIndex]
      if (!r.solutions)
        r.solutions = []

      r.solutions.push(p.solution)
      saveProjectChanges()
      break;

    case RISK_SOLUTION_EDIT:
      var r = project.risks[p.riskIndex]
      if (!r.solutions)
        r.solutions = []

      r.solutions[p.solutionIndex] = p.solution
      saveProjectChanges()
      break;


    case RISK_SOLUTION_REMOVE:
      var r = project.risks[p.riskIndex]
      if (r.solutions)
        r.solutions.splice(p.solutionIndex, 1)
      else
        r.solutions = []

      saveProjectChanges()
      refresh()
      break;



    case RISK_EDIT_NAME:
      project.risks[p.riskIndex].name = p.name;
      saveProjectChanges()
      break;

    case RISK_ORDER_CHANGE:
      var i1 = p.index1;
      var i2 = p.index2;

      project.risks = swap(i1, i2, project.risks)
      saveProjectChanges()
      refresh()
      break;

    case CHANNELS_ADD:
      post('/links/name', {link: p.url})
        .then(response => {
          console.log({response})
          var name = response.name;
          project.channels.push(Object.assign({
            name,
            users: 0,
            link: p.url,
          }, response))
          // project.channels = project.channels.filter(c => c?.link?.length)
          saveProjectChanges()
        })
      break;
    case CHANNELS_NAME_EDIT:
      project.channels[p.channelIndex].name = p.name;
      saveProjectChanges()
      break
    case CHANNELS_REMOVE:
      project.channels.splice(p.channelIndex, 1)
      saveProjectChanges()
      refresh()
      break;

    case LINKS_ADD:
      // if (project.links)
      //   project.links = []
      try {
        project.links.push({link: p.link, note: '', linkType: LINK_TYPE_DOCS})
      } catch (e) {
        project.links = []
        project.links.push({link: p.link, note: '', linkType: LINK_TYPE_DOCS})
      }
      saveProjectChanges()
      break;

    case LINKS_REMOVE:
      project.links.splice(p.linkIndex, 1)
      saveProjectChanges()
      refresh()
      break;

    case LINKS_NOTES_EDIT:
      project.links[p.linkIndex].note = p.note
      saveProjectChanges()
      break
    case LINKS_TYPE_EDIT:
      project.links[p.linkIndex].linkType = p.linkType
      saveProjectChanges()
      break;

    case PROJECT_EDIT_DESIRED_PROFIT:
      project.desiredProfit = parseInt(p.value)
      saveProjectChanges()
      break;
    case PROJECT_EDIT_EXPENSES:
      project.monthlyExpenses = parseInt(p.value)
      saveProjectChanges()
      break;
    case PROJECT_EDIT_BURNOUT_TIME:
      project.timeTillBurnout = parseInt(p.value)
      saveProjectChanges()
      break;

    default:
      console.warn(`TYPE IS FUCKED. Got unexpected type ${p.type}`);
      break;
  }
});

export default store;