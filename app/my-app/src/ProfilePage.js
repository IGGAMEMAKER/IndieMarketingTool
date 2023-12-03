import {Component, useState} from "react";
import {ping, post} from "./PingBrowser";
import {ProjectList} from "./ProjectList";
import {APP_TYPE_APP, APP_TYPE_GAME, DEFAULT_APP_NAME, DEFAULT_GAME_NAME} from "./constants/constants";
import {Link} from "react-router-dom";
import actions from "./actions";


function NewProjectAdder({}) {
  const btn = (appType, name, btnName) => <button className={"new-project item"} onClick={() => actions.addProject(name, appType)}>{btnName}</button>

  return <div>
    {btn(APP_TYPE_GAME, DEFAULT_GAME_NAME, `🎮 Game`)}  /  {btn(APP_TYPE_APP, DEFAULT_APP_NAME, `💡 Service`)}
  </div>

  // var [appType, setAppType] = useState(0)
  // var isChosen = appType !== 0
  //
  // var chooseTypeForm
  //
  // if (!isChosen) {
  //   var newGameButton = <button onClick={() => setAppType(APP_TYPE_GAME)}>NEW GAME</button>
  //   var newAppButton = <button onClick={() => setAppType(APP_TYPE_APP)}>NEW APP/SERVICE</button>
  //
  //   chooseTypeForm = <div>{newGameButton}{newAppButton}</div>
  // } else {
  //   chooseTypeForm = <ProjectAdder appType={appType} defaultState={true}/>
  // }
  //
  // return <div>
  //   {chooseTypeForm}
  // </div>
}

export class NewProjectPage extends Component {
  componentDidMount() {
    post('/api/guest/auth', {})
      .then(r => {

      })
  }

  render() {
    return <div>
      <h1>Create new project</h1>
      <NewProjectAdder/>
    </div>
  }
}

export class ProfilePage extends Component {
  state = {
    projectIDs: [],
  }

  componentWillMount() {
    this.loadProfiles()
  }

  loadProfiles() {
    ping('/api/profile', response => {
      this.setState({
        projectIDs: response.body.projects
      })
    })
      .finally(() => {
        console.log('WENT TO SERVER FOR PROFILE PAGE')
      })
  }

  render() {
    var projectIDs = this.state.projectIDs; // [{id: '6495f797115f0e146936e5ad', name: 'MY APP'}]


    return <div>
      <h1>PROFILE</h1>
      <br/>
      <br/>
      <Link to={"/create"}>New Project</Link>
      <br/>
      <ProjectList projectIDs={projectIDs}/>
      <br />
      <br />
      <br />
      <br />
      <br />
      {/*<Link to={"/logout"}>Logout</Link>*/}
    </div>
  }
}