import {EventEmitter} from 'events';
import Dispatcher from './Dispatcher';
import {
  AUDIENCE_ADD,
  AUDIENCE_DESCRIPTION_EDIT,
  AUDIENCE_MESSAGE_ADD,
  AUDIENCE_MESSAGE_EDIT,
  AUDIENCE_MESSAGE_ORDER_CHANGE,
  AUDIENCE_MESSAGE_REMOVE,
  AUDIENCE_NAME_EDIT,
  AUDIENCE_ORDER_CHANGE,
  AUDIENCE_REMOVE,
  AUDIENCE_STRATEGY_ADD,
  AUDIENCE_STRATEGY_EDIT,
  AUDIENCE_STRATEGY_REMOVE,
  CHANNELS_ADD,
  CHANNELS_NAME_EDIT,
  CHANNELS_REMOVE,
  FEATURES_ADD,
  FEATURES_EDIT, FEATURES_EDIT_BENEFIT,
  FEATURES_EDIT_TIME_COST,
  FEATURES_ORDER_CHANGE,
  FEATURES_REMOVE,
  ITERATIONS_ADD,
  ITERATIONS_DESCRIPTION_EDIT,
  ITERATIONS_GOAL_ADD,
  ITERATIONS_GOAL_REMOVE,
  ITERATIONS_GOAL_SOLVE, ITERATIONS_GROWTH_DESCRIPTION_EDIT,
  ITERATIONS_ORDER_CHANGE,
  ITERATIONS_REMOVE, ITERATIONS_SOLVE,
  LINKS_ADD,
  LINKS_NOTES_EDIT,
  LINKS_REMOVE,
  LINKS_TYPE_EDIT,
  MONETIZATION_ADD,
  MONETIZATION_AUDIENCE_ADD,
  MONETIZATION_AUDIENCE_REMOVE,
  MONETIZATION_BENEFIT_ADD,
  MONETIZATION_BENEFIT_REMOVE,
  MONETIZATION_EDIT_BENEFIT,
  MONETIZATION_EDIT_DESCRIPTION,
  MONETIZATION_EDIT_NAME,
  MONETIZATION_EDIT_PRICE,
  MONETIZATION_ORDER_CHANGE,
  MONETIZATION_REMOVE,
  NOTES_ADD,
  NOTES_EDIT,
  NOTES_ORDER_CHANGE,
  NOTES_REMOVE,
  PROFILE_LOGIN,
  PROJECT_ADD,
  PROJECT_EDIT_BURNOUT_TIME,
  PROJECT_EDIT_DESCRIPTION,
  PROJECT_EDIT_DESIRED_PROFIT,
  PROJECT_EDIT_EXPENSES, PROJECT_EDIT_ESSENCE,
  PROJECT_LOAD,
  PROJECT_REMOVE,
  PROJECT_RENAME,
  RISK_ADD,
  RISK_EDIT_NAME,
  RISK_ORDER_CHANGE,
  RISK_REMOVE,
  RISK_SOLUTION_ADD,
  RISK_SOLUTION_EDIT,
  RISK_SOLUTION_ORDER_CHANGE,
  RISK_SOLUTION_REMOVE, STRATEGY_EDIT
} from "./constants/actionConstants";
import {ping, post, remove, update} from "./PingBrowser";
import {APP_TYPE_GAME, GOAL_TYPE_FEATURES, LINK_TYPE_DOCS} from "./constants/constants";
import {getIndexByID, getNextID} from "./utils";
import actions from "./actions";
import {Iteration} from "./Iteration";
import {isGame} from "./utils/projectUtils";

const CE = 'CHANGE_EVENT';
const domain = 'https://releasefaster.com'

var projectId = ''

var projectMock = {
  name: 'NOT LOADED',
  type: 1, // 1 - app, 2 - game

  audiences: [],
  monetizationPlans: [],
  channels: [],
  risks: [],
  notes: [],
  features: [],
}

var project; // = projectMock

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

  isDefaultName = project => {
    const projectName = project.name.toLowerCase()

    return projectName === "new game" || projectName === "new app"
  }

  getProjectFillingStats = (project) => {
    const isFilledDescription = !!project?.description
    const isFilledEssence     = project?.mainFeeling || project?.mainProblem
    const isFilledAudiences   = project.audiences.length;
    const hasPaidPlans        = project.monetizationPlans.filter(mp => mp.price > 0).length
    // TODO rework same name
    const isDefaultName       = this.isDefaultName(project)

    // TODO decide if I can show specific panels in View files, not in storage
    const canShowEssence = isFilledDescription;
    const canShowAudiences = canShowEssence && isFilledEssence;
    const canShowMonetization = canShowAudiences && isFilledAudiences
    const canShowNamePicker = canShowMonetization && hasPaidPlans
    const canShowSubmitProjectButton = canShowNamePicker && !isDefaultName

    return {
      isFilledDescription,
      isFilledEssence,
      isFilledAudiences,
      isDefaultName,

      canShowEssence,
      canShowAudiences,
      canShowMonetization,
      canShowNamePicker,
      canShowSubmitProjectButton,
    }
  }

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


const swapTo = (from, destination, array) => {
  // if (from !== to) {
  // }
  var movable = array[from];

  if (from < destination) {
    // moving right/down

    array.splice(destination, 0, movable)
    array.splice(from, 1)
  }

  if (from > destination) {
    // moving left/up

    array.splice(from, 1)
    array.splice(destination, 0, movable)
  }

  // if (i1 < i2) {
  //   for (var i = i1; i < i2; i++) {
  //     array = swap(i, i + 1, array)
  //   }
  // }
  //
  // if (i1 > i2) {
  //   console.log('BACKWARDS', i2, i1)
  //   for (i = i1; i > i2; i--) {
  //     console.log('will swap', i, i-1)
  //     array = swap(i, i - 1, array)
  //   }
  // }

  return array
}

const patchWithIDs = (list, tagName = '', printOnly = true) => {
  var undefinedCount = 0;

  for (var i = 0; i < list.length; i++) {
    if (list[i].id === undefined) {
      undefinedCount++
      if (!printOnly)
        list[i].id = getNextID(list)
    }
  }

  if (undefinedCount > 0) {
    // console.log('pushed to ', {tagName}, undefinedCount)
  }

  return undefinedCount
}

const push = (list, item, tagName = '') => {
  list.push(item);
  patchWithIDs(list, tagName, false)
}

const removeById = (list, id) => {
  list.splice(getIndexByID(list, id), 1)
}



const refresh = (time = 800) => {
  setTimeout(() => window.location.reload(true), time)
}

const openNewProject = newId => {
  // var newUrl = 'http://www.indiemarketingtool.com/projects/' + newId
  navigate('/projects/' + newId)
}

const navigate = url => {
  window.location.href = domain + url
}

const fixProject = () => {
  var changeData = true
  var printOnly = !changeData

  var patches = 0;

  const namify = s => {
    if (s.name)
      return s;

    return {name: s}
  }

  try {
    patches += patchWithIDs(project.audiences, 'audiences', printOnly)
    project.audiences.forEach(a => {
      // if (!a.messages)
      //   a.messages = []

      a.messages = a.messages.map(namify)
      patches += patchWithIDs(a.messages, 'audiences.' + a.id + '.messages', printOnly)

      console.log({
        strategy: a.strategy
      })

      if (!Array.isArray(a.strategy)) {
        a.strategy = [a.strategy]
      }

      a.strategy = a.strategy.map(namify)
      patches += patchWithIDs(a.strategy, 'audiences.' + a.id + '.strategy', printOnly)
    })

    patches += patchWithIDs(project.monetizationPlans, 'plans', printOnly)
    project.monetizationPlans.forEach(m => {
      m.benefits = m.benefits.map(namify)
      patches += patchWithIDs(m.benefits, 'risks.' + m.id + '.solutions', printOnly)
    })
    patches += patchWithIDs(project.channels, 'channels', printOnly)
    patches += patchWithIDs(project.links, 'links', printOnly)

    patches += patchWithIDs(project.risks, 'risks', printOnly)
    project.risks.forEach(r => {
      // if (!r.solutions)
      //   r.solutions = []

      r.solutions = r.solutions.map(namify)
      patches += patchWithIDs(r.solutions, 'risks.' + r.id + '.solutions', printOnly)
    })
    patches += patchWithIDs(project.iterations, 'iterations', printOnly)

    console.log('FEATURES', project.iterations);
    var resetFeatures = false

    const flushFeatures = () => {
      project.features = [];
      project.iterations.forEach(it => {
        it.goals.forEach(gg => {
          if (gg.goalType === GOAL_TYPE_FEATURES)
            delete gg.featureId
        })
      })
    }

    if (resetFeatures) {
      flushFeatures()
    }

    // project.iterations.forEach((it, iterationIndex) => {
    //   it.goals.forEach((gg, goalIndex) => {
    //     if (gg.goalType === GOAL_TYPE_FEATURES) {
    //       console.log('FEATURE!!!!', gg)
    //
    //       if (!gg.featureId) {
    //         var featureId = getNextID(project.features);
    //         console.log('will get id ', featureId)
    //
    //         actions.addFeature(gg.text)
    //         push(project.features, {name: gg.text}, 'feature')
    //         project.iterations[iterationIndex].goals[goalIndex].featureId = featureId
    //
    //         patches += 1
    //       } else {
    //         console.log('already got featureId', gg.featureId)
    //       }
    //     }
    //   })
    // })
  } catch (e) {
    console.error('CANNOT FIX PROJECT', e)
    console.error('CANNOT FIX PROJECT', e)
    console.error('CANNOT FIX PROJECT', e)
  }

  return patches
}

Dispatcher.register((p) => {
  const saveProjectChanges = () => {
    // console.log('will update projectId', {projectId})
    update('/api/projects/' + projectId, {project})
      .finally(() => {
        store.emitChange()
      })
  }

  const saveUserAction = (p) => {
    post('/stats/actions', {
      action: p
    })
      .then(r => {
        console.log(r);
      })
      .catch(err => {
        console.error('saveUserAction', err)
      })
  }
  saveUserAction(p)

  const fixStrategy = (p) => {
    // TODO PATCH FOR OLDER PROJECTS
    console.log('fixStrategy', {p})
    var ind = getIndexByID(project.audiences, p.audienceIndex)
    console.log('fixStrategy', {ind}, p)

    if (!Array.isArray(project.audiences[ind].strategy))
      project.audiences[ind].strategy = [p.strategy]

    if (!project.audiences[ind].messages)
      project.audiences[ind].messages = []
  }

  const refreshToFixIndexBug = (time = 800) => {
    refresh(time)
  }

  var ind;

  switch (p.actionType) {
    case PROFILE_LOGIN:
      post('/api/login', p)
        .then(r => {
          if (r.ok) {
            // redirect to profile
            navigate('/profile')
          } else {
            navigate('/login')
          }
        })
      break
    case PROJECT_LOAD:
      console.log('loading project', p.projectId)
      projectId = p.projectId

      ping('/api/projects/' + p.projectId, data => {
        console.log({body: data.body})
        var proj = data.body.project;

        project = proj
      })
        .finally(() => {
          var changesNeeded = fixProject()

          if (changesNeeded) {
            alert('CHANGES NEEDED: ' + changesNeeded)
            saveProjectChanges()
            refresh()
          } else
            store.emitChange()
        })
      break

    case PROJECT_ADD:
      console.log(PROJECT_ADD, {p})
      post('/api/projects/', {name: p.name, appType: p.appType})
        .then(data => {
          console.log({data})

          var newId = data.newId
          console.log({newId})

          // TODO force refresh
          openNewProject(newId)
        })
        .finally(() => {
          store.emitChange()
        })
      break

    case PROJECT_RENAME:
      project.name = p.name;
      saveProjectChanges()
      break

    case PROJECT_EDIT_DESCRIPTION:
      project.description = p.description;
      saveProjectChanges()
      break

    case PROJECT_EDIT_ESSENCE:
      // console.log('apptype', APP_TYPE_GAME, project.appType, project)
      if (isGame(project))
        project.mainFeeling = p.problem;
      else
        project.mainProblem = p.problem;
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


    case NOTES_ADD:
      if (!project.notes)
        project.notes = []

      push(project.notes, {name: p.name}, 'note')
      saveProjectChanges()
      break;

    case NOTES_EDIT:
      var ind = getIndexByID(project.notes, p.id)

      project.notes[ind].name = p.name;
      saveProjectChanges()
      break;

    case NOTES_REMOVE:
      removeById(project.notes, p.id)

      saveProjectChanges()
      break;

    case NOTES_ORDER_CHANGE:
      project.notes = swapTo(p.index1, p.index2, project.notes)

      saveProjectChanges()
      break;


    case FEATURES_ADD:
      if (!project.features)
        project.features = []

      push(project.features, {name: p.name}, 'feature')
      saveProjectChanges()
      break;

    case FEATURES_EDIT:
      var ind = getIndexByID(project.features, p.id)

      project.features[ind].name = p.name;
      saveProjectChanges()
      break;

    case FEATURES_REMOVE:
      removeById(project.features, p.id)

      saveProjectChanges()
      break;

    case FEATURES_ORDER_CHANGE:
      project.features = swapTo(p.index1, p.index2, project.features)

      saveProjectChanges()
      break;
    case FEATURES_EDIT_TIME_COST:
      var ind = getIndexByID(project.features, p.id)

      project.features[ind].timeCost = p.timeCost
      saveProjectChanges()
      break;
    case FEATURES_EDIT_BENEFIT:
      var ind = getIndexByID(project.features, p.id)

      project.features[ind].benefit = p.benefit
      saveProjectChanges()
      break;



    case AUDIENCE_ADD:
      var obj = {
        name: p.name,
        description: "",
        strategy: [],
        messages: [],
        price: 0
      }

      push(project.audiences, obj, 'audience')
      saveProjectChanges()
      break;


    case AUDIENCE_REMOVE:
      // TODO REMOVE THIS IF THIS AUDIENCE IS USED ANYWHERE
      // TODO F.E. IN MONETIZATION PLANS
      // TODO REMOVE ATTACHMENTS BY ID!!!!!

      // audienceIndex is .id now
      removeById(project.audiences, p.audienceIndex)
      saveProjectChanges()
      break;

    case AUDIENCE_DESCRIPTION_EDIT:
      ind = getIndexByID(project.audiences, p.audienceIndex)

      project.audiences[ind].description = p.description
      saveProjectChanges();
      break;

    case AUDIENCE_NAME_EDIT:
      ind = getIndexByID(project.audiences, p.audienceIndex)

      project.audiences[ind].name = p.name
      saveProjectChanges();
      break;

    case AUDIENCE_MESSAGE_ADD:
      fixStrategy(p)

      ind = getIndexByID(project.audiences, p.audienceIndex)
      push(project.audiences[ind].messages, {name: p.message})

      saveProjectChanges();
      break;

    case AUDIENCE_MESSAGE_EDIT:
      fixStrategy(p)

      ind = getIndexByID(project.audiences, p.audienceIndex)
      var ind2 = getIndexByID(project.audiences[ind].messages, p.messageIndex);
      project.audiences[ind].messages[ind2].name = p.message

      saveProjectChanges();
      break;

    case AUDIENCE_MESSAGE_ORDER_CHANGE:
      ind = getIndexByID(project.audiences, p.audienceId)

      console.log({ind})

      var messages = project.audiences[ind].messages;
      messages = swapTo(p.index1, p.index2, messages);

      saveProjectChanges()
      break;

    case AUDIENCE_MESSAGE_REMOVE:
      ind = getIndexByID(project.audiences, p.audienceIndex)

      removeById(project.audiences[ind].messages, p.messageIndex)
      // project.audiences[ind].messages.splice(p.messageIndex, 1)

      saveProjectChanges()
      break;

    case AUDIENCE_STRATEGY_ADD:
      fixStrategy(p)
      ind = getIndexByID(project.audiences, p.audienceIndex)

      push(project.audiences[ind].strategy, {name: p.strategy})
      // project.audiences[ind].strategy.push(p.strategy)

      saveProjectChanges();
      break;

    case AUDIENCE_STRATEGY_EDIT:
      fixStrategy(p)

      ind = getIndexByID(project.audiences, p.audienceIndex)
      var ind2 = getIndexByID(project.audiences[ind].strategy, p.textIndex)

      console.log('EDIT STRATEGY', {p})
      project.audiences[ind].strategy[ind2].name = p.strategy

      saveProjectChanges();
      break;

    case AUDIENCE_STRATEGY_REMOVE:
      fixStrategy(p)
      ind = getIndexByID(project.audiences, p.audienceIndex)

      removeById(project.audiences[ind].strategy, p.textIndex)

      saveProjectChanges();
      // refreshToFixIndexBug()
      break;


    case AUDIENCE_ORDER_CHANGE:
      project.audiences = swapTo(p.audienceIndex1, p.audienceIndex2, project.audiences)

      saveProjectChanges();
      // refreshToFixIndexBug()
      break;



    case MONETIZATION_ADD:
      var obj = {name: p.name, benefits: [], audiences: [], price: 0, regularity: 0}
      push(project.monetizationPlans, obj)
      // project.monetizationPlans.push(obj)
      // 0 - fixed
      // 1 - day
      // 2 - week
      // 3 - month
      // 4 - year
      saveProjectChanges()
      break

    case MONETIZATION_ORDER_CHANGE:
      project.monetizationPlans = swapTo(p.monetizationIndex1, p.monetizationIndex2, project.monetizationPlans)

      saveProjectChanges()
      // refreshToFixIndexBug()
      break;

    case MONETIZATION_REMOVE:
      removeById(project.monetizationPlans, p.monetizationIndex);
      // project.monetizationPlans.splice(p.monetizationIndex, 1)

      saveProjectChanges()
      // refreshToFixIndexBug()
      break


    case MONETIZATION_EDIT_DESCRIPTION:
      ind = getIndexByID(project.monetizationPlans, p.monetizationIndex)
      project.monetizationPlans[ind].description = p.description

      saveProjectChanges()
      break

    case MONETIZATION_EDIT_BENEFIT:
      ind = getIndexByID(project.monetizationPlans, p.monetizationIndex)
      var ind2 = getIndexByID(project.monetizationPlans[ind].benefits, p.benefitIndex)
      project.monetizationPlans[ind].benefits[ind2].name = p.benefit

      saveProjectChanges()
      break

    case MONETIZATION_BENEFIT_ADD:
      ind = getIndexByID(project.monetizationPlans, p.monetizationIndex)
      push(project.monetizationPlans[ind].benefits, {name: p.benefit})
      // project.monetizationPlans[p.monetizationIndex].benefits.push(p.benefit)

      saveProjectChanges()
      break

    case MONETIZATION_BENEFIT_REMOVE:
      ind = getIndexByID(project.monetizationPlans, p.monetizationIndex)
      removeById(project.monetizationPlans[ind].benefits, p.benefitIndex)

      saveProjectChanges()
      break

    case MONETIZATION_EDIT_NAME:
      ind = getIndexByID(project.monetizationPlans, p.monetizationIndex)
      project.monetizationPlans[ind].name = p.name

      saveProjectChanges()
      break

    case MONETIZATION_EDIT_PRICE:
      ind = getIndexByID(project.monetizationPlans, p.monetizationIndex)
      project.monetizationPlans[ind].price = p.price

      saveProjectChanges()
      break

    case MONETIZATION_AUDIENCE_ADD:
      ind = getIndexByID(project.monetizationPlans, p.monetizationIndex)
      project.monetizationPlans[ind].audiences.push(p.audienceIndex)

      saveProjectChanges()
      break

    case MONETIZATION_AUDIENCE_REMOVE:
      ind = getIndexByID(project.monetizationPlans, p.monetizationIndex)
      project.monetizationPlans[ind].audiences = project.monetizationPlans[ind].audiences.filter(inc => inc !== p.audienceID)

      saveProjectChanges()
      // refreshToFixIndexBug()
      break


    case RISK_ADD:
      var obj = {name: p.name, solutions: []}
      push(project.risks, obj)

      saveProjectChanges()
      break;

    case RISK_REMOVE:
      removeById(project.risks, p.riskIndex)
      // project.risks.splice(p.riskIndex, 1)

      saveProjectChanges()
      // refreshToFixIndexBug()
      break;

    case RISK_EDIT_NAME:
      ind = getIndexByID(project.risks, p.riskIndex);

      project.risks[ind].name = p.name;

      saveProjectChanges()
      break;

    case RISK_SOLUTION_ADD:
      ind = getIndexByID(project.risks, p.riskIndex)
      var r = project.risks[ind]

      push(r.solutions, {name: p.solution})

      saveProjectChanges()
      break;

    case RISK_SOLUTION_EDIT:
      ind = getIndexByID(project.risks, p.riskIndex)
      var r = project.risks[ind]

      var ind2 = getIndexByID(r.solutions, p.solutionIndex)
      r.solutions[ind2].name = p.solution

      saveProjectChanges()
      break;


    case RISK_SOLUTION_REMOVE:
      ind = getIndexByID(project.risks, p.riskIndex)
      var r = project.risks[ind]

      removeById(r.solutions, p.solutionIndex)

      saveProjectChanges()
      // refreshToFixIndexBug()
      break;



    case RISK_SOLUTION_ORDER_CHANGE:
      ind = getIndexByID(project.risks, p.riskIndex)
      var r = project.risks[ind]

      r.solutions = swapTo(p.index1, p.index2, r.solutions)
      saveProjectChanges()
      break;
    case RISK_ORDER_CHANGE:
      var i1 = p.index1;
      var i2 = p.index2;

      project.risks = swapTo(i1, i2, project.risks)

      saveProjectChanges()
      // refreshToFixIndexBug()
      break;

    case CHANNELS_ADD:
      post('/links/name', {link: p.url})
        .then(response => {
          console.log({response})

          var name = response.name;
          var obj = Object.assign({
            name,
            users: 0,
            link: p.url,
          }, response)

          push(project.channels, obj, 'CHANNELS')
          saveProjectChanges()
        })
      break;
    case CHANNELS_NAME_EDIT:
      ind = getIndexByID(project.channels, p.channelIndex)

      project.channels[ind].name = p.name;
      saveProjectChanges()
      break
    case CHANNELS_REMOVE:
      removeById(project.channels, p.channelIndex);
      // project.channels.splice(p.channelIndex, 1)

      saveProjectChanges()
      // refreshToFixIndexBug()
      break;

    case LINKS_ADD:
      var obj = {link: p.link, note: '', linkType: LINK_TYPE_DOCS}

      try {
        push(project.links, obj, 'links')
        // project.links.push(obj)
      } catch (e) {
        // project.links = []
        // push(project.links, obj, 'links')
        // project.links.push(obj)
        console.error('CANNOT SAVE LINK', e)
      }

      saveProjectChanges()
      break;

    case LINKS_REMOVE:
      removeById(project.links, p.linkIndex)
      // project.links.splice(p.linkIndex, 1)

      saveProjectChanges()
      // refreshToFixIndexBug()
      break;

    case LINKS_NOTES_EDIT:
      ind = getIndexByID(project.links, p.linkIndex)

      project.links[ind].note = p.note

      saveProjectChanges()
      break
    case LINKS_TYPE_EDIT:
      ind = getIndexByID(project.links, p.linkIndex)

      project.links[ind].linkType = p.linkType

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

    case ITERATIONS_ORDER_CHANGE:
      project.iterations = swapTo(p.index1, p.index2, project.iterations)
      saveProjectChanges()
      break;

    case ITERATIONS_ADD:
      if (!project.iterations)
        project.iterations = []

      var obj = Object.assign({}, p.iteration, {id: getNextID(project.iterations)})

      if (p.pasteAfter !== -1) {
        var index = getIndexByID(project.iterations, p.pasteAfter)
        project.iterations.splice(index + 1, 0, obj)
      } else if (p.pasteBefore !== -1) {
        index = getIndexByID(project.iterations, p.pasteBefore)
        project.iterations.splice(index, 0, obj)
      } else {
        project.iterations.push(obj)
      }

      saveProjectChanges()
      break;

    case ITERATIONS_DESCRIPTION_EDIT:
      ind = getIndexByID(project.iterations, p.id) // project.iterations.findIndex(it => it.id === p.id)
      project.iterations[ind].description = p.description

      saveProjectChanges()
      break

    case ITERATIONS_REMOVE:
      // ind = project.iterations.findIndex(it => it.id === p.id)
      removeById(project.iterations, p.id)
      // project.iterations.splice(ind, 1)

      saveProjectChanges()
      break;

    case ITERATIONS_GOAL_ADD:
      ind = getIndexByID(project.iterations, p.id) // project.iterations.findIndex(it => it.id === p.id)
      console.log('goals.add', {p})

      push(project.iterations[ind].goals, p.goal, 'iteration.goals')
      // project.iterations[ind].goals.push(p.goal)

      saveProjectChanges()
      break;

    case ITERATIONS_GROWTH_DESCRIPTION_EDIT:
      ind = getIndexByID(project.iterations, p.id)

      project.iterations[ind].growthStrategy = p.description
      saveProjectChanges()
      break;
    case ITERATIONS_GOAL_REMOVE:
      ind = getIndexByID(project.iterations, p.id) // project.iterations.findIndex(it => it.id === p.id)

      console.log('goals.remove', {p})
      // project.iterations[ind].goals.splice(p.goalIndex, 1)
      removeById(project.iterations[ind].goals, p.goalIndex)

      saveProjectChanges()
      break;

    case ITERATIONS_SOLVE:
      ind      = getIndexByID(project.iterations,            p.id)

      project.iterations[ind].solved = p.solved
      saveProjectChanges()
      break;
    case ITERATIONS_GOAL_SOLVE:
      ind      = getIndexByID(project.iterations,            p.id)
      var ind2 = getIndexByID(project.iterations[ind].goals, p.goalIndex)

      var g = project.iterations[ind].goals[ind2]

      if (g.goalType === GOAL_TYPE_FEATURES) {
        var featureIndex = getIndexByID(project.features, g.featureId)
        project.features[featureIndex].solved = p.solved
      }

      project.iterations[ind].goals[ind2].solved = p.solved

      console.log(ITERATIONS_GOAL_SOLVE, {p})

      saveProjectChanges()
      break;
    case STRATEGY_EDIT:
      project.strategy = p.description;
      saveProjectChanges()
      break;

    default:
      console.warn(`TYPE IS FUCKED. Got unexpected type ${p.type}`);
      break;
  }
});

export default store;