import {Component, useState} from "react";
import {ping} from "./PingBrowser";
import {ProjectList} from "./ProjectList";
import {APP_TYPE_APP, APP_TYPE_GAME} from "./constants/constants";
import {FieldAdder} from "./FieldAdder";
import actions from "./actions";

function ProjectAdder({appType, defaultState}) {
  const refresh = () => window.location.reload(true)

  var defaultWord;
  if (appType === APP_TYPE_GAME)
    defaultWord = "new Game"
  else
    defaultWord = "new App"

  return <FieldAdder
    onAdd={name => {
      actions.addProject(name, appType)

      // TODO GO TO NEW PROJECT PAGE
      // setTimeout(refresh, 2500)
    }}
    placeholder={"add?"}
    defaultWord={defaultWord}
    defaultValue={defaultWord}
    defaultState={defaultState}
  />
}


function NewProjectAdder({}) {
  var [appType, setAppType] = useState(0)
  var isChosen = appType !== 0

  var chooseTypeForm
  if (!isChosen) {
    var newGameButton = <button onClick={() => setAppType(APP_TYPE_GAME)}>NEW GAME</button>
    var newAppButton = <button onClick={() => setAppType(APP_TYPE_APP)}>NEW APP</button>

    chooseTypeForm = <div>{newGameButton}{newAppButton}</div>
  } else {
    chooseTypeForm = <ProjectAdder appType={appType} defaultState={true}/>
  }

  return <div>
    {chooseTypeForm}
  </div>
}


export class ProfilePage extends Component {
  state = {
    projectIDs: [],
  }

  componentWillMount() {
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
      <ProjectList projectIDs={projectIDs}/>
      <br/>
      <br/>
      <NewProjectAdder/>
    </div>
  }
}