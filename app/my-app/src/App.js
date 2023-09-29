// import logo from './logo.svg';
import './App.css';

import {Component, useEffect, useState} from 'react';
// import { BrowserRouter } from 'react-router-dom';
import {Link, Route, Routes} from 'react-router-dom';
import {ProfilePage} from "./ProfilePage";
import {ProjectPage} from "./ProjectPage";
import {ping} from "./PingBrowser";
// import { useCalendlyEventListener, InlineWidget } from "react-calendly";
import {generatePassword} from "./secret";
import actions from "./actions";
import {APP_TYPE_APP} from "./constants/constants";

const col1 = t => <span className="color1">{t}</span>
const col2 = t => <span className="color2">{t}</span>
function ReleaseFaster({}) {return <span>{col1("Release")} {col2("Faster")}</span>}

function RegisterForm({}) {
  var [email, setEmail] = useState("")
  var [password, setPassword] = useState("")
  // useEffect(() => {
  //   // declare the async data fetching function
  //   const fetchData = async () => {
  //     // get the data from the api
  //     const data = await ping('/api/passwords');
  //     console.log({
  //       data
  //     })
  //     // // convert the data to json
  //     // const json = await response.json();
  //     //
  //     // // set state with the result
  //     // setData(json);
  //   }
  //
  //   // call the function
  //   fetchData()
  //     // make sure to catch any error
  //     .catch(console.error);;
  // }, [])

  var passButton = <button
    onClick={() => {
      var p = generatePassword(35)
      setPassword(p)
      navigator.clipboard.writeText(p)
    }}>Generate & Copy
  </button>

  // ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
  const isDataValid = email.length && email.includes("@") && password.length >=8

  return <div>
    <h2>Register</h2>
    <form method="POST" action="/api/user">
      <table>
        <tbody>
        <tr>
          <td>
            <input
              name="email"
              autoComplete="email"
              type="email"
              placeholder="Input email"
              minLength="4" maxLength="40"
              required

              value={email}
              onChange={ev => setEmail(ev.target.value)}
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td>
            <input
              name="password"
              autoComplete="new-password"
              type="password"
              placeholder="Input password"
              minLength="8" maxLength="40"
              required

              value={password}
              onChange={ev => setPassword(ev.target.value)}
            />
          </td>
          <td>
            {passButton}
          </td>
        </tr>
        <tr></tr>
        <tr>
          <td style={{float: 'left'}}>
            <input disabled={!isDataValid} type="submit" value={"Register"} />
          </td>
        </tr>
        </tbody>
      </table>
    </form>
    <br/>
    <br/>
    <Link to={"/login"}>Have an account?</Link>
  </div>
}

function VerifyForm ({}) {
  return <div>
    <h1>Check your email to verify your account</h1>
    <h2>If a message didn't arrive, check SPAM FOLDER</h2>
  </div>
}

function LoginForm({}) {
  var [email, setEmail] = useState("")
  var [password, setPassword] = useState("")

  var passwordWasReset = window.location.href.includes("resetPassword")
  var passwordWasResetText;
  if (passwordWasReset) {
    passwordWasResetText = <div>
      <label>
        <span style={{color: 'orange', fontWeight: '800'}}>New password was sent to your email.</span>
        <br />If there is no message, CHECK SPAM folder too</label>
    </div>
  }

  return <div>
    <h2>Log in</h2>
    {passwordWasResetText}
    {/*<form action="/api/login" method="post" onSubmit={() => {*/}
    <div>
      <table>
        <tr>
          <td>
            <input
              name="email"
              autoComplete="email"
              type="email"
              placeholder="Input email"
              value={email}
              onChange={ev => setEmail(ev.target.value)}
            />
          </td>
          <td></td>
        </tr>
        <tr>
          <td>
            <input
              name="password"
              autoComplete="current-password"
              type="password"
              placeholder="Input password"
              value={password}
              onChange={ev => setPassword(ev.target.value)}
            />
          </td>
          <td>
            <Link to={"/reset"}>Forgot it?</Link>
          </td>
        </tr>
        <tr>
          <td style={{float: 'left'}}>
            <input type="submit" value={"Login"} onClick={() => {actions.logIn(email, password)}}/>
          </td>
          <td></td>
        </tr>
        {/*<tr><td style={{float: 'left'}}>Forgot password?</td></tr>*/}
      </table>
      {/*<input type="submit" value="Submit"/>*/}
    </div>

    <br/>
    <br/>
    <Link to={"/register"}>Don't have an account?</Link>
  </div>
}


function About({}) {
  return <div>
    <h1>
      What is <ReleaseFaster/>?
    </h1>
    <h2>
      {/*<ReleaseFaster />*/}It is
      a {col1("project management tool")} {col2("for indie hackers")} and {col1("your Co-Pilot")}
    </h2>
    <h3>
      {/*It's main purpose is to make you {col1("avoid infinite feature creep")} and {col2("focus on real users")}*/}
      {/*you {col1("wasting years making a game/app, that nobody needs")} and {col2("focus on real users")}*/}
      Its main purpose is to {col1("help you make apps and games")} {col2("that people will care about")}
    </h3>
    <h1>Why is it necessary?</h1>
    <div style={{textAlign: 'left', marginLeft: '15px'}}>
      <div>Whenever most indie hackers start new projects, they build, build, build and see no end</div>
      <div>After some time (years for game developers and months for startups) they finally get some courage to release
        their stuff
      </div>
      <div>And nobody responds to that</div>
      <div>Silence</div>
      <div>Or even worse, they never go public, cause they are too scared to show what they did</div>
      <div>And this is sad</div>
      <div>No, this is REALLY SAD</div>
      <div>Time, that these talents wasted to dust, could been spent by enjoying life and/or building better products!
      </div>
      <div>That's why it's important to have a proper balance between development and marketing, when you are creating
        something new
      </div>
      <center>
        <h2>But why does it happen?</h2>
        <ol>
          <li>They think that a "good product will sell itself"</li>
          <li>They think that a product is just a bunch of features</li>
          <li>They are too shy to show off</li>
          <li>They are too lazy to do marketing</li>
        </ol>
      </center>
    </div>
    <p>
      Follow step by step instructions to make a product, that people will care about
      {/*Answer questions about the game/app*/}
    </p>
    <br/>
    <Link to={"/login"}>Try it</Link>
  </div>
}

function ResetPasswordForm({}) {
  var [email, setEmail] = useState("")

  var resetPassword;
  if (email.length) {
    resetPassword = <div>
      <label>You will receive an email with new password</label>
      <br />
      <br />
      <input type={"submit"} value={"Reset"}/>
    </div>
  }

  return <div>
    <h2>Reset password</h2>
    <form method="POST" action={"/api/reset-password"}>
      <table>
        <tr>
          <td>
            <input
              name="email"
              autoComplete={"email"}
              type={"email"}
              placeholder={"Input email"}
              onChange={ev => setEmail(ev.target.value)}
            />
          </td>
        </tr>
        <tr>
          <td>
            {resetPassword}
            {/*{email.length ? <Link to={"/login"}>Restore</Link> : ''}*/}
          </td>
        </tr>
      </table>
    </form>
  </div>
}


class MainPage extends Component {
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
    var hasCookies = document.cookie.length
    var isNewUser = !authenticated && !hasCookies

    const profileLink = <Link to={"/profile"}>Profile</Link>
    const loginLink = <div>
      <Link to={"/register"}>Register</Link>
      <br />
      <Link to={"/login"}>Login</Link>
    </div>

    var loginForm;
    loginForm = authenticated ? profileLink : loginLink

    return <div className="App">
      <header className="App-header" style={{height: '100%', minHeight: '100vh'}}>
        <h1>
          {col1("RELEASE")} {col2("FASTER")}
        </h1>
        <h2>I made this site to prevent you from {col1("wasting years making a game/app")}, {col2("that nobody needs")}</h2>
        <br />
        <h3>Cause I know how it hurts</h3>
        {/*<h3>Bring ur project to market faster</h3>*/}
        {/*<h3>Innovate without destroying yourself</h3>*/}
        {/*{document.cookie}*/}

        <table>
          <tr>
            {/*<td>{loginForm}</td>*/}
            <td><Link to={"/login"}>Try it!</Link></td>
            <td><Link to={"/about"}>More info</Link></td>
          </tr>
        </table>
      </header>
    </div>
  }
}


class AdminPage extends Component {
  state = {
    result: [],
    loaded: false,
  }

  componentDidMount() {
    ping('/api/projects', r => {
      this.setState({
        result: r.body.result,
        grouped: r.body.grouped,
        loaded: true
      })
    })
  }

  render() {
    if (!this.state.loaded)
      return 'wait'
    var users = this.state.grouped;

    var projectsCount = users.map(u => u.count).reduce((p, c) => p + c, 0)

    return <div>
      <h1>Admin</h1>
      <h2>Users: {users.length}, Projects: {projectsCount}</h2>
      {/*{JSON.stringify(this.state.result, null, 2)}*/}
      <table>
        {users.sort((u1, u2) => u2.count - u1.count).map(u => <tr>
          <td style={{textAlign: 'right'}}>
            {/*<b>{u._id} {JSON.stringify(u?.user, null, 2)} /!*{JSON.stringify(u, null, 2)}*!/</b>*/}
            <b>{u?.user?.email.split('@')[0]}{/*{JSON.stringify(u, null, 2)}*/}</b>
          </td>
          <td>
            [{u.count}]
          </td>
          <td>
            {u.projects.map(p => {
              var color = p.type === APP_TYPE_APP ? 'orange' : 'violet'

              return <a target="_blank" href={`/projects/${p._id}`} style={{color, marginRight: '10px'}}>{p.name}</a>
            })}
          </td>
        </tr>)}
      </table>
      <br />
      <br />
      {/*{JSON.stringify(this.state.grouped, null, 2)}*/}
    </div>
  }
}

class App extends Component {
  render() {
    return <div>
      <div className="App">
        <header className="App-header" style={{height: '100%', minHeight: '100vh'}}>
          <Routes>
            <Route path='/'                               element={<MainPage/>}/>
            <Route path='/register'                       element={<RegisterForm/>}/>
            <Route path='/verify'                         element={<VerifyForm />}/>
            <Route path='/login'                          element={<LoginForm/>}/>
            <Route path='/logout'                         element={<LoginForm/>}/>
            <Route path='/reset'                          element={<ResetPasswordForm />}/>

            <Route path='/about'                          element={<About />}/>

            <Route path='/profile'                        element={<ProfilePage/>}/>
            <Route path='/projects/:projectId'            element={<ProjectPage/>}/>
            <Route path='/projects/:projectId/execution'  element={<ProjectPage/>}/>
            <Route path='/admin/panel'                    element={<AdminPage/>}/>
          </Routes>
        </header>
      </div>
    </div>
  }
}

export default App;
