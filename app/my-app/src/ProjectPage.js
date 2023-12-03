import {Component, useState} from "react";
import storage from "./Storage";
import actions from "./actions";
import {FieldPicker} from "./FieldPicker";
import {IterationPlanner} from "./IterationPlanner";
import {Audience} from "./Audience";
import {MonetizationPlan} from "./MonetizationPlan";
import {FieldAdder} from "./FieldAdder";
import {RiskList} from "./RiskView";
import {Panel} from "./Panel";
import {getByID} from "./utils";
import {getAudienceUsageCount} from "./utils/getEntityUsageCount";
import {TimePicker} from "./TimePicker";
import {Link} from "react-router-dom";
import {isApp, isGame} from "./utils/projectUtils";
import {BusinessPlanner} from "./BusinessPlanner";
import {AudienceMessageView} from "./AudienceMessageView";
import {ProjectDescription} from "./ProjectDescription";
import {ProjectEssence} from "./ProjectEssence";
import {NamePicker} from "./NamePicker";
import {UsefulLinks} from "./UsefulLinks";
import {ping} from "./PingBrowser";
import {isAuthenticatedGoogleUser, isGuest} from "./utils/frontendCookieHelper";

const PROJECT_MODE_VISION = 1
const PROJECT_MODE_DREAM = 5
const PROJECT_MODE_EXECUTION = 2
const PROJECT_MODE_STRATEGY = 4
const PROJECT_MODE_NOTES = 3
const PROJECT_MODE_RISK = 6
const PROJECT_MODE_RESEARCH = 7

const addPanel = (panels, canShow, whyItCannotBeShown, c) => {
  panels.push({
    canShow, error: whyItCannotBeShown, c
  })
  
  return panels
}

const renderCodependentPanels = panels => {
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

function VisionPanel({project, projectId, monetizationPlans, audiences}) {
  const VISION_MODE_ESSENCE = "Essence";
  const VISION_MODE_AUDIENCE = "Audience";
  const VISION_MODE_MONETIZATION = "Monetization";

  var [visionMode, setVisionMode] = useState(VISION_MODE_ESSENCE)

  var {
    canShowSubmitProjectButton, canShowNamePicker,
    canShowMonetization, canShowAudiences, canShowEssence,

    isFilledDescription, isFilledEssence, isFilledAudiences, isDefaultName
  } = storage.getProjectFillingStats(project)

  var subModes = [VISION_MODE_ESSENCE] //, VISION_MODE_AUDIENCE, VISION_MODE_MONETIZATION]

  if (isFilledEssence)
    subModes.push(VISION_MODE_AUDIENCE)

  if (isFilledAudiences)
    subModes.push(VISION_MODE_MONETIZATION)

  if (subModes.length === 1)
    subModes = []

  var content;
  if (visionMode === VISION_MODE_ESSENCE)
    content = <ProjectEssence project={project} projectId={projectId} />

  if (visionMode === VISION_MODE_AUDIENCE)
    content = <AudiencesList audiences={audiences} monetizationPlans={monetizationPlans} project={project} />

  if (visionMode === VISION_MODE_MONETIZATION)
    content = <MonetizationPanel plans={monetizationPlans} audiences={audiences}/>

  return <div>
    {/*<h1>Let's think</h1>*/}
    {subModes.map(m => <button className={`item ${visionMode === m ? 'chosen' : ''}`} onClick={() => {setVisionMode(m)}}>{m}</button>)}
    <br />
    <br />
    {content}
  </div>

  let panels = []
  addPanel(panels, canShowEssence, 'type what are you doing first', <ProjectEssence project={project} projectId={projectId} />)
  addPanel(panels, canShowAudiences, 'main problem is super important. Type it first', <AudiencesList audiences={audiences} monetizationPlans={monetizationPlans} project={project} />)
  addPanel(panels, canShowMonetization, 'create at least one audience', <MonetizationPanel plans={monetizationPlans} audiences={audiences}/>)
  addPanel(panels, canShowNamePicker, 'create at least one PAID plan', '') // <NamePicker project={project} projectId={projectId} name={name} />)
  // addPanel(panels, canShowSubmitProjectButton, 'Change project name', <div><Button text={"REVIEW"}/></div>)

  return <div>
    {/*<h2>No filters and limitations</h2>*/}
    {renderCodependentPanels(panels)}

    {/*<BusinessPlanner project={this.state.project}/>*/}
  </div>
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

  getProjectId = () => {
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
      // console.log('store listener')
      this.copyState()
    })

    actions.loadProject(this.getProjectId())
  }

  componentDidMount() {
    ping('/authenticated', r => {
      var {authenticated, isGuest} = r.body
      // console.log({r}, authenticated)

      this.setState({
        authenticated,
        isGuest
        // loaded: true
      })
    })
  }

  renderNotesPanel = (project, projectId) => {
    var removeProject = <div>
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

    if (!window.location.href.includes("localhost")) {
      removeProject = ''
    }

    const NotesPanel = <div>
      <NotesList project={project} />
      {/*<UsefulLinks links={this.state.links}/>*/}

      {removeProject}
    </div>

    return NotesPanel
  }


  renderDreamPanel = (project, projectId) => {
    let panels = []
    var {
      isDefaultName
    } = storage.getProjectFillingStats(project)

    addPanel(panels, project?.description?.length > 0, 'type your first minds about the project here. Whatever comes to your mind', <NamePicker project={project} projectId={projectId} />)
    addPanel(panels, !isDefaultName, 'create an awesome name!', <BusinessPlanner project={this.state.project} showAudiencesToo={false}/>)

    return <div>
      <ProjectDescription project={project} projectId={projectId}/>
      {renderCodependentPanels(panels)}
      {/*/!*<h1>Let's dream</h1>*!/*/}
      {/*/!*<h2>No filters and limitations</h2>*!/*/}
      {/*<ProjectDescription project={project} projectId={projectId}/>*/}
      {/*<NamePicker project={project} projectId={projectId} />*/}
      {/*/!*<FeatureList noTiming project={project} />*!/*/}

      {/*<BusinessPlanner project={this.state.project} showAudiencesToo={false}/>*/}
    </div>
  }

  renderStrategyMode = (project, channels, links)=> {
    const StrategyPanel = <div>
      <AudienceSourcesPanel channels={channels} audiences={project.audiences}/>
      <MessagePlanner project={this.state}/>
      {/*<GlobalStrategyPlanner project={this.state.project}/>*/}
      {/*<BusinessPlanner project={this.state.project} />*/}
      <UsefulLinks links={links} />
    </div>

    return StrategyPanel;
  }

  renderExecution = (project) => {
    const ExecutionPanel = <div>
      {/*<RisksPanel risks={risks} />*/}
      {/*<br />*/}
      {/*<br />*/}
      {/*<BusinessPlanner project={this.state.project} />*/}

      <IterationPlanner project={this.state.project}/>
    </div>

    return ExecutionPanel
  }

  renderResearchPanel = (project, links) => {
    return <div>
      <UsefulLinks links={links} />
    </div>
  }
  renderRiskPanel = (project, risks) => {
    return <div>
      <Validator project={project} />
      <BusinessPlanner project={project} />
      <RisksPanel risks={risks} />
    </div>
  }

  renderMenus = (project) => {
    var menus = []

    // const menus = ["Notes", "Audiences", "Monetization",  "Message", /*"Risks",*/ "GROWTH", "Goals", "ITERATIONS", "Links"]
    // const menus = ["Notes", "Vision", "Execution",  "Profile"]

    var {
      canShowSubmitProjectButton, justStarted,
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
    const saveProfileLink = <Link className={"item"} to="/save-progress">Save progress</Link>
    const pLink = <Link className={"item"} to="/profile">Profile</Link>

    const isNormalUser = isAuthenticatedGoogleUser()
    const profileLink = isNormalUser ? pLink : saveProfileLink


    var menus = this.renderMenus(project)

    if (!menus.length)
      return []

    var profileLinkResult
    var {filledOutDreamPanel} = storage.getProjectFillingStats(project)

    if (filledOutDreamPanel || isNormalUser)
      profileLinkResult = profileLink

    return <div className="menu">
      {menus}
      {profileLinkResult}
    </div>
  }

  renderMainContent = (project) => {
    var {audiences, monetizationPlans, risks, channels, links} = this.state;
    var projectId = this.getProjectId()

    switch (this.state.mode) {
      case PROJECT_MODE_NOTES:      return this.renderNotesPanel(project, projectId);
      case PROJECT_MODE_DREAM:      return this.renderDreamPanel(project, projectId);
      case PROJECT_MODE_STRATEGY:   return this.renderStrategyMode(project, channels, links);
      case PROJECT_MODE_EXECUTION:  return this.renderExecution(project)
      case PROJECT_MODE_RISK:       return this.renderRiskPanel(project, risks)
      case PROJECT_MODE_RESEARCH:   return this.renderResearchPanel(project, links)

      case PROJECT_MODE_VISION:
      default: return <VisionPanel project={project} projectId={projectId} monetizationPlans={monetizationPlans} audiences={audiences} />
      // default: return this.renderVisionPanel(project, projectId, monetizationPlans, audiences, name);
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
        {/*<Chat />*/}
      </div>
    );
  }
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


function AudienceAdder({placeholder}) {
  const [audienceName, onChangeName] = useState("");

  return (
    <div className="Audience-item">
      <textarea
        value={audienceName}
        placeholder={placeholder}
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
  const [planName, onChangeName] = useState("");

  return (
    <div className="Audience-item">
      <textarea
        className={"monetisation"}
        value={planName}
        placeholder={"monetization name f.e: starter, demo, pro"}
        onChange={event => {
          onChangeName(event.target.value)
        }}
      />
      <br />
      <button onClick={() => {actions.addMonetizationPlan(planName); onChangeName("")}}>ADD</button>
    </div>
  )

  return <FieldAdder
    onAdd={val => {actions.addMonetizationPlan(val)}}
    defaultValue={""}
    placeholder={"Monetization plan"}
  />
}


function Channel({channel}) {
  var [isDangerous, setDangerous] = useState(false)
  var {link, name, users} = channel
  var l = name || getUrlWithoutPrefixes(link)


  // SOURCE TYPE
  // human
  // publisher (games)
  // press (journals)
  // video channel
  // text channels

  const namePicker = <FieldPicker
    value={name}
    placeholder={"Add short name"}
    onAction={val => {actions.editChannelName(channel.id, val)}}
  />
  const LLLLLL = <a href={link} target={"_blank"}>{l}</a>

  return (
    // <div className="Channel-item">
    <tr style={{textAlign: 'left', backgroundColor: isDangerous ? 'red': 'white'}}>
      {/*<td>{users}</td>*/}
      <td style={{width: '250px'}}>
        {LLLLLL}
        {/*<br />*/}
        {/*{namePicker}*/}
      </td>
      <td style={{width: '250px'}}>
        {/*{LLLLLL}*/}
        {namePicker}
      </td>
      <td>
        <button
          onMouseLeave={() => setDangerous(false)}
          onMouseEnter={() => setDangerous(true)}
          onClick={() => {actions.removeChannel(channel.id)}}
        >x</button>
      </td>
    </tr>
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

  var mapped = channels
    .sort((c1, c2) => c2.users - c1.users)
    .map(cc => <Channel key={"channel." + cc.id} channel={cc} />)

  return <table>
    <thead>
    <tr>
      <th>Name</th>
      <th>Link</th>
      <th></th>
    </tr>
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
}

function ChannelAdder({}) {
  return <FieldAdder
    placeholder={"audience source link"}
    onAdd={val => {
      actions.addChannel(val)
    }}
  />
}

function AudienceSourcesPanel({channels, audiences}) {
  const renderAudienceStrats = ({description, id, name, strategy, messages = []}) => {
    if (!Array.isArray(strategy))
      strategy = [strategy]

    var strategyPicker = <ol>
      {strategy.map(s => {
        var strategyId = s.id
        // console.log(s.id, 'strategyPicker', {strategyId})

        var isTooBig = s.name.split(' ').find(word => word.length > 15);
        var style = {}
        if (isTooBig) {
          style = {overflow: 'hidden', width: '250px', textOverflow: 'elipsis'}
        }
        var isUrl = isTooBig && s.name.startsWith('http') || s.name.startsWith('www')

        return <li key={"strategy." + id + "." + strategyId}>
          <FieldPicker
            value={s.name}
            normalValueRenderer={onEdit => {
              if (isUrl) {
                return <div>
                  <div className="editable" style={style} onClick={() => onEdit(true)}>
                    edit
                  </div>
                  <Link to={s.name}>link</Link>
                </div>
              }

              return <div className="editable" onClick={() => onEdit(true)}>{s.name}</div>
            }}
            placeholder={"How will you reach them?"}
            onAction={newStrategy => actions.editAudienceStrategy(newStrategy, id, strategyId)}
            onRemove={() => actions.removeAudienceStrategy(id, strategyId)}
          />
        </li>
      })}
      <li>
        <FieldAdder onAdd={val => actions.addAudienceStrategy(val, id)} placeholder={"add more ways"}/>
      </li>
    </ol>

    return <tr className="Audience-item" key={"marketing-planner." + id} style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', textAlign: 'left'}}>
      <td>
        <b>How to reach <span style={{color: 'green'}}>{name}</span>?</b>
        <br />
        <label className="audience-description">{description}</label>
        <br />
        {strategyPicker}
      </td>
    </tr>
  }

  return <div>
    <Panel id="GROWTH" header="Growth strategy" />
    <div className="Audience-Container">
      {audiences.map(a => renderAudienceStrats(a))}
    </div>
    <AudienceChannelsList channels={channels} />
  </div>
}

function AudienceChannelsList({channels}) {
  return <div>
    <h3>Where will you find your audience?</h3>
    <div className="Container">
      <ChannelList channels={channels} />
    </div>
  </div>
}

function NotesList({project}) {
  var notes = project.notes || []

  return <div>
    {/*<Panel id={"Notes"} header={"Notes"} noHelp />*/}
    {/*<h3>Save notes here</h3>*/}

    <FieldAdder placeholder={"type your mind"} onAdd={val => actions.addNote(val)} defaultState={true} autoFocus={false} />
    <br />
    <br />
    <ul className="list">
      {notes.map((n, i) => {
        return <li
          key={"note" + n.id}
          className="left paddings"
        >
          <FieldPicker
            autoFocus
            value={n.name}
            placeholder={"type your mind"}
            onAction={val => actions.editNote(n.id, val)}
            onRemove={() => {actions.removeNote(n.id)}}
          />
          {/*<button className={"right"} onClick={openNotePopup}>Convert To..</button>*/}
        </li>
      })}
    </ul>
  </div>
}

function TimeTest({}) {
  var [value, setValue] = useState({})

  return <div>
    <div>
      TimePicker Test
    </div>
    <div>
      <TimePicker f={value} onClick={v => {setValue({timeCost: v})}} />
    </div>
  </div>
}



function GlobalStrategyPlanner({project}) {
  return <div>
    <Panel id="Strategy" header="Your strategy" />
    <FieldPicker
      value={project?.strategy || ''}
      placeholder={"who you will test first, who will you get second, e.t.c. which features will you add before/after"}
      onAction={val => actions.editStrategy(val)}
      autoFocus={false}
    />
  </div>
}

function MessagePlanner({project}) {
  var defaultId = project.audiences.length ? project.audiences[0].id : -1

  var [chosenAudience, setChosenAudience] = useState(defaultId)
  var audience = chosenAudience === -1 ? null : getByID(project.audiences, chosenAudience)

  const audiencePicker = project.audiences.map(a => {
    return <button
      className={`toggle ${chosenAudience === a?.id ? 'chosen' : ''}`}
      onClick={() => {
        try {
          setChosenAudience(a?.id)
        } catch (e) {

        }
      }}
    >{a.name} ({a.messages.length})</button>;
  })

  const renderAudience = ({description, id, name, messages = []}) => {
    return <tr key={"marketing-planner." + id} style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', textAlign: 'left'}}>
      <td>
        <b>What will you tell <span style={{color: 'green'}}>{name}</span>?</b>
        <br />
        <label style={{color: 'gray'}}>{description}</label>
        <ol>
          {messages.map((m, mi) => <AudienceMessageView index={mi} m={m} id={id}/>)}
          <li>
            <FieldAdder
              onAdd={val => actions.addAudienceMessage(val, id)}
              placeholder={"what will you tell them?"}
            />
          </li>
        </ol>
      </td>
    </tr>
  }

  return <div>
    <Panel id="Message" header="Your message" />
    {audiencePicker}
    <br />

    <div className="Container">
      <table>
        <tbody>
        {audience ? renderAudience(audience) : ''}
        </tbody>
      </table>
    </div>
  </div>
}

function RisksPanel({risks}) {
  return <div>
    <Panel id="Risks" header="What are your biggest risks / doubts / problems?" />
    <div className="Container">
      <RiskList risks={risks} />
    </div>
  </div>
}


function MonetizationPanel({plans, audiences}) {
  // var content = <div>How will you make money? <MonetizationAdder /></div>
  // var content = <div>How will you make money?</div>
  var content = <div>Who will pay and for what?</div>
  return <div>
    <Panel id="Monetization" header={content} />
    {/*<h6>WHO WILL PAY & FOR WHAT?</h6>*/}
    {/*<br />*/}
    {/*<br />*/}
    <div className="Audience-Container">
      {plans.map((p, i) => <MonetizationPlan key={'monetizationPlanX.' + p.id + ' ' + i} plan={p} index={i} audiences={audiences} />)}
      <MonetizationAdder />
    </div>
  </div>
}

function AudiencesList({audiences, monetizationPlans, project}) {
  const [isFullAudienceInfo, setIsFullInfo] = useState(false);

  var audiencePhrase

  if (isGame(project)) {
    audiencePhrase = 'Who will play your game?'
  } else {
    audiencePhrase = 'Who will use your service?'
  }

  return <div>
    <Panel id="Audiences" header={audiencePhrase} />
    <div className="Audience-Container">
      {audiences.map((a, i) => {
        var usages = getAudienceUsageCount(monetizationPlans, a)

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
          key={`audiencessss${a.id}`}
        />}
      )}
      <AudienceAdder placeholder={audiencePhrase} />
    </div>
  </div>
}

function Validator({project}) {
  var essenceCheck;

  const saasThing = <div>
    <center>
      <table>
        <tr><td className="left">hours</td><td></td><td></td><td>1) Who has that problem? Google forms + Search (SEO + Gum)</td></tr>
        <tr><td className="left">days</td><td></td><td></td><td>2) Who has that problem? Landing page</td></tr>
        <tr><td className="left">week?</td><td></td><td></td><td>If enough people subbed, split em (half for free testing / half for paid)</td></tr>
        {/*<tr><td className="left">days</td><td></td><td></td><td>Screenshots</td></tr>*/}
        {/*<tr><td className="left">week</td><td></td><td></td><td>Fake Gameplay Trailer</td></tr>*/}
        {/*<tr><td className="left">day/week</td><td></td><td></td><td>Prototype</td></tr>*/}
      </table>
    </center>
  </div>

  const gameplayThing = <div>
    <center>
      <table>
        <tr><td className="left">hour</td><td></td><td></td><td>1 sentence</td></tr>
        <tr><td className="left">hours</td><td></td><td></td><td>Intro post (I want to make game like X, but Y; genre & main features)</td></tr>
        <tr><td className="left">hours</td><td></td><td></td><td>Intro WITH screenshot</td></tr>
        <tr><td className="left">days</td><td></td><td></td><td>Screenshots</td></tr>
        <tr><td className="left">week</td><td></td><td></td><td>Fake Gameplay Trailer</td></tr>
        <tr><td className="left">day/week</td><td></td><td></td><td>Prototype</td></tr>
      </table>
    </center>
  </div>

  if (isGame(project)) {
    essenceCheck = <div>
      <div>
        Do people want to play that?
      </div>

      <br />
      {gameplayThing}
    </div>
  }

  if (isApp(project)) {
    essenceCheck = <p>
      <h2>Does the problem exist?</h2>
      {saasThing}
      {/*<br />*/}
      {/*{gameplayThing}*/}
    </p>
  }

  return <div>
    <div>{essenceCheck}</div>
  </div>
}



class Chat extends Component {
  render() {
    var {isOpened} = this.props;


    return <div className="chat-container">
      Chat
    </div>
  }
}


