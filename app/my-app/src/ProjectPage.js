import {Component} from "react";
import {Link} from "react-router-dom";

import storage from "./Storage";
import actions from "./actions";
import {IterationPlanner} from "./IterationPlanner";
import {BusinessPlanner} from "./BusinessPlanner";
import {ProjectDescription} from "./ProjectDescription";
import {NamePicker} from "./NamePicker";
import {UsefulLinks} from "./UsefulLinks";
import {ping} from "./PingBrowser";
import {isAuthenticatedGoogleUser} from "./utils/frontendCookieHelper";
import {TieredRisks} from "./TieredRisks";
import {RisksPanel} from "./RisksPanel";
import {MessagePlanner} from "./MessagePlanner";
import {AudienceSourcesPanel} from "./AudienceSourcesPanel";
import {VisionPanel} from "./VisionPanel";
import {NotesList} from "./NotesList";

const PROJECT_MODE_VISION = 1
const PROJECT_MODE_DREAM = 5
const PROJECT_MODE_EXECUTION = 2
const PROJECT_MODE_STRATEGY = 4
const PROJECT_MODE_NOTES = 3
const PROJECT_MODE_RISK = 6
const PROJECT_MODE_RESEARCH = 7

const addPanel = (panels, canShow, whyItCannotBeShown, c) => {
  panels.push({canShow, c, error: whyItCannotBeShown})
  
  return panels
}

const renderQueuedPanels = panels => {
  const actualPanels = []

  for (var i = 0; i < panels.length; i++) {
    var p = panels[i];

    if (p.canShow) {
      actualPanels.push(p.c)
    } else {
      actualPanels.push(<div className="error">To continue, {p.error}</div>)
      i = 10000000
    }
  }

  return actualPanels
}


export class ProjectPage extends Component {
  state = {
    audiences: [],
    monetizationPlans: [],
    channels: [],
    risks: [],
    links: [],
    loaded: false,
    mode: PROJECT_MODE_VISION
  }

  copyState = () => {
    const project = storage.getProject();

    this.setState({
      loaded: true,

      audiences:          storage.getAudiences(),
      monetizationPlans:  storage.getMonetizationPlans(),
      channels:           storage.getChannels(),
      risks:              storage.getRisks(),
      name:               storage.getProjectName(),
      appType:            storage.getProjectType(),
      links:              storage.getUsefulLinks(),

      project,
    })

    var {
      justStarted
    } = storage.getProjectFillingStats(project)

    if (justStarted) {
      this.setState({mode: PROJECT_MODE_DREAM})
    }

    document.title = project.name
  }

  getProjectIdFromPageUrl = () => {
    // var {projectId} = useParams()
    var arr = window.location.href.split('/')
    var projectId = arr[arr.length - 1]

    // console.log({projectId, arr})

    return projectId
  }

  setMode = mode => {
    this.setState({mode})

    window.scrollTo(0, 0);
  }

  componentWillMount() {
    storage.addChangeListener(() => {
      this.copyState()
    })

    actions.loadProject(this.getProjectIdFromPageUrl())
  }

  componentDidMount() {
    ping('/authenticated', r => {
      var {authenticated, isGuest} = r.body
      // console.log({r}, authenticated)

      this.setState({
        authenticated,
        isGuest
      })
    })
  }

  renderNotesPanel = (project, projectId) => {
    var removeProject

    if (window.location.href.includes("localhost")) {
      removeProject = <div>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <a style={{color: 'white'}} href="/profile" onClick={() => actions.removeProject(projectId)}>REMOVE PROJECT</a>
      </div>
    }

    return <div>
      <NotesList project={project}/>
      {/*<UsefulLinks links={this.state.links}/>*/}

      {removeProject}
    </div>
  }


  renderDreamPanel = (project, projectId) => {
    let panels = []
    var {isDefaultName} = storage.getProjectFillingStats(project)

    const canShowNamePicker = project?.description?.length > 0
    const canShowMoneyGoalPlanner = !isDefaultName
    const needsToSetDesiredIncome = project?.desiredProfit <= 0;

    let moneyError;
    if (canShowMoneyGoalPlanner && needsToSetDesiredIncome)
      moneyError = <div className={"error"}>Set your desired income to continue</div>

    addPanel(panels, canShowNamePicker, 'type your first minds about the project here. Whatever comes to your mind', <NamePicker project={project} projectId={projectId} />)
    addPanel(panels, canShowMoneyGoalPlanner, 'create an awesome name!', <BusinessPlanner project={this.state.project} showAudiencesToo={false}/>)

    return <div>
      <ProjectDescription project={project} projectId={projectId}/>
      {renderQueuedPanels(panels)}
      {moneyError}
    </div>
  }

  renderStrategyMode = (project, channels, links)=> {
    return <div>
      <AudienceSourcesPanel channels={channels} audiences={project.audiences}/>
      <MessagePlanner project={this.state}/>
      {/*<GlobalStrategyPlanner project={this.state.project}/>*/}
      {/*<BusinessPlanner project={this.state.project} />*/}
      <UsefulLinks links={links}/>
    </div>;
  }

  renderExecution = (project) => {
    return <div>
      <IterationPlanner project={this.state.project}/>
    </div>
  }

  renderResearchPanel = (project, links) => {
    return <div>
      <UsefulLinks links={links} />
    </div>
  }

  renderVisionPanel = (project, projectId, monetizationPlans, audiences) => {
    return <div>
      <VisionPanel project={project} projectId={projectId} monetizationPlans={monetizationPlans} audiences={audiences} />
    </div>
  }

  renderRiskPanel = (project, risks) => {
    return <div>
      <TieredRisks project={project} />
      <BusinessPlanner project={project} />
      <RisksPanel risks={risks} project={project} />
    </div>
  }

  renderMenus = (project) => {
    var menus = []

    var {
      justStarted,
      filledOutDreamPanel, filledOutVisionPanel, filledOutResearchPanel, filledOutRiskPanel
    } = storage.getProjectFillingStats(project)

    if (justStarted)
      return []

    const addMenu = (mode, name) => menus.push({name, mode})

    if (filledOutResearchPanel) {
      // addMenu(PROJECT_MODE_STRATEGY, "Growth")
      addMenu(PROJECT_MODE_EXECUTION, "DO")
    }

    if (filledOutRiskPanel && filledOutVisionPanel && filledOutDreamPanel) {
      // addMenu(PROJECT_MODE_RESEARCH, "Research")
      addMenu(PROJECT_MODE_STRATEGY, "Research")
      addMenu(PROJECT_MODE_NOTES, "Notes")
    }

    if (filledOutVisionPanel)
      addMenu(PROJECT_MODE_RISK, "Risks")

    if (filledOutDreamPanel)
      addMenu(PROJECT_MODE_VISION, "Vision")

    addMenu(PROJECT_MODE_DREAM, "Dream")

    return menus.map(m => <button
      className={`item ${this.state.mode === m.mode ? 'chosen' : ''}`}
      onClick={() => this.setMode(m.mode)}
    >{m.name}</button>)
  }

  renderMenuBar = project => {
    var menus = this.renderMenus(project)

    if (!menus.length)
      return []

    const saveProfileLink = <Link className={"item"} to="/save-progress">Save progress</Link>
    const pLink = <Link className={"item"} to="/profile">Profile</Link>

    const isNormalUser = isAuthenticatedGoogleUser()
    const profileLink = isNormalUser ? pLink : saveProfileLink


    var profileLinkResult
    var {filledOutDreamPanel} = storage.getProjectFillingStats(project)

    if (filledOutDreamPanel || isNormalUser)
      profileLinkResult = profileLink

    return <div className="menu">
      {/*<div className="menu-grid">*/}
        {menus}
        {profileLinkResult}
      {/*</div>*/}
    </div>
  }

  renderMainContent = (project) => {
    var {audiences, monetizationPlans, risks, channels, links} = this.state;
    var projectId = this.getProjectIdFromPageUrl()

    switch (this.state.mode) {
      case PROJECT_MODE_NOTES:      return this.renderNotesPanel(project, projectId);
      case PROJECT_MODE_DREAM:      return this.renderDreamPanel(project, projectId);
      case PROJECT_MODE_STRATEGY:   return this.renderStrategyMode(project, channels, links);
      case PROJECT_MODE_EXECUTION:  return this.renderExecution(project)
      case PROJECT_MODE_RISK:       return this.renderRiskPanel(project, risks)
      case PROJECT_MODE_RESEARCH:   return this.renderResearchPanel(project, links)
      case PROJECT_MODE_VISION:     return this.renderVisionPanel(project, projectId, monetizationPlans, audiences)

      default:                      return <div>Unknown MODE ${this.state.mode}</div>
    }
  }

  render() {
    if (!this.state.loaded)
      return <div>Loading the project...</div>

    var project = this.state?.project

    return (
      <div className="App">
        <div>
          <center>
            {this.renderMenuBar(project)}
            {/*<div className={"menu-input"}>*/}
            {/*  <FieldAdder placeholder={"type your mind"} onAdd={val => actions.addNote(val)} defaultState={true} autoFocus={false} />*/}
            {/*</div>*/}
          </center>
        </div>
        <header className="App-header">
          <br />
          <br />
          <div>
            {this.renderMainContent(project)}
          </div>
        </header>
      </div>
    );
  }
}

