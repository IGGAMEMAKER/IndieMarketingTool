import {Component} from "react";
import {ping} from "./PingBrowser";
import {Link} from "react-router-dom";
import {col1, col2, SimpleLink, TryItButton} from "./UI";

export class MainPage extends Component {
  state = {
    authenticated: false,
    loaded: false,
  }

  componentDidMount() {
    ping('/authenticated', r => {
      var authenticated = r.body.authenticated
      console.log({r}, authenticated)

      this.setState({
        authenticated,
        loaded: true
      })
    })
  }

  render() {
    var {authenticated} = this.state
    // var hasCookies = document.cookie.length
    // var isNewUser = !authenticated && !hasCookies

    const profileLink = <Link to={"/profile"}>Profile</Link>
    const loginLink = <div>
      <Link to={"/register"}>Register</Link>
      <br/>
      <Link to={"/login"}>Login</Link>
    </div>

    var loginForm = authenticated ? profileLink : loginLink

    return <div className="App">
      <header className="App-header" style={{height: '100%', minHeight: '100vh'}}>
        <h1>
          {col1("RELEASE")} {col2("FASTER")}
        </h1>
        <h2>
          Plan your {col1("new projects")} here, be it {col1("services")} or {col2("games")}
          {/*<br />*/}
        </h2>
        {/*<h3>Get help if you are stuck, scared, exhausted, or just need someone to talk if family and friends are sick of your "ventures"</h3>*/}
        {/*<h3>Get help if you are stuck, scared, got exhausted in development journey, or just need someone to talk if family and friends are sick of your "ventures"</h3>*/}

        {/*<h2>{col1("Project management tool")} {col2("for indie hackers")} and {col1("your Co-Pilot")}</h2>*/}

        {/*<h2>I made this site to prevent you from {col1("wasting years making a game/app")}, {col2("that nobody needs")}</h2>*/}
        {/*<h3>Cause I know how it hurts</h3>*/}
        {/*<h3>Bring ur project to market faster</h3>*/}
        {/*<h3>Innovate without destroying yourself</h3>*/}
        {/*{document.cookie}*/}

        {/*<div><b>{col2("Co-Pilot")}</b></div>*/}
        {/*<ul className="left">*/}
        {/*  /!*<li>Get help if you are stuck, scared, got exhausted in that long journey, or just need someone to talk if family and friends are sick of your "ventures"</li>*!/*/}
        {/*  <li>{col1("Don't want to do market research")}, cause you only want to build? {col2("I'll research for you")}</li>*/}
        {/*  <li>{col1("Scared")} to show your project to the crowd? {col2("Show to me first!")}</li>*/}
        {/*  <li>Don't know, {col1("how to get your first clients")}? {col2("Let's find them together")}</li>*/}
        {/*  <li>Don't know, exactly, {col1("what are you doing")}? {col2("Let's find that out!")}</li>*/}
        {/*  <li>Don't know, {col1("which features to focus on")}? {col2("I'll help prioritising")}</li>*/}
        {/*</ul>*/}

        <div><b>{col1("Project management tool")}</b></div>
        <ul className="left">
          <li>Workflow {col1("designed specifically")} to avoid <SimpleLink url={"/mistakes"}
                                                                            text={"common mistakes indie hackers make"}/> {/*<Link style={{color: 'white'}} to={"/mistakes"}>common mistakes</Link> <b>{col2("indie hackers make")}</b>*/}
          </li>
          <li>Answer main questions about your new idea and get help if you can't give clear answers</li>
          <li>Find out if your project has chances {col1("BEFORE WASTING YEARS")} on it</li>
        </ul>


        <TryItButton/>
      </header>
    </div>
  }
}