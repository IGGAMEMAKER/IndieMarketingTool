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
  RISK_SOLUTION_ADD, RISK_SOLUTION_REMOVE, RISK_REMOVE, MONETIZATION_EDIT_DESCRIPTION, MONETIZATION_REMOVE
} from "./constants/actionConstants";
import {ping, update} from "./PingBrowser";

const CE = 'CHANGE_EVENT';

var userId = '6495f2aad151580c1f4b516a';
var projectId = '6495f797115f0e146936e5ad'

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
  const saveProjectChanges = () => {
    update('/api/projects/' + projectId, {project})
      .finally(() => {
        store.emitChange()
      })
  }

  switch (p.actionType) {
    case PROJECT_LOAD:
      ping('/api/projects/' + projectId, data => {
        console.log({body: data.body})
        var p = data.body.project;

        project = p
      })
        .finally(() => {
          store.emitChange()
        })
      break




    case AUDIENCE_ADD:
      project.audiences.push({
        name: p.name,
        description: "",
        strategy: [],
        price: 0
      })
      // store.emitChange()
      // sendToServer()
      saveProjectChanges()
      break;

    case AUDIENCE_EDIT_DESCRIPTION:
      project.audiences[p.audienceIndex].description = p.description
      saveProjectChanges();
      break;

    case AUDIENCE_EDIT_NAME:
      project.audiences[p.audienceIndex].name = p.name
      saveProjectChanges();
      break;

    case AUDIENCE_EDIT_STRATEGY:
      project.audiences[p.audienceIndex].strategy = p.strategy
      saveProjectChanges();
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

    case MONETIZATION_REMOVE:
      project.monetizationPlans.splice(p.monetizationIndex, 1)
      saveProjectChanges()
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
      project.monetizationPlans[p.monetizationIndex].audiences = project.monetizationPlans[p.monetizationIndex].audiences.filter(inc => inc!== p.audienceIndex)
      saveProjectChanges()
      break

    case RISK_ADD:
      project.risks.push({name: p.name, solutions: []})
      saveProjectChanges()
      break;

    case RISK_REMOVE:
      project.risks.splice(p.riskIndex, 1)
      saveProjectChanges()
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
      break;

    default:
      console.warn(`TYPE IS FUCKED. Got unexpected type ${p.type}`);
      break;
  }
});

export default store;