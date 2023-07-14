// import logo from './logo.svg';
import './App.css';

import {Component, useEffect, useState} from 'react';
// import { BrowserRouter } from 'react-router-dom';
import {Link, Route, Routes} from 'react-router-dom';
import {ProjectList} from "./ProjectList";
import {ProfilePage} from "./ProfilePage";
import {ProjectPage} from "./ProjectPage";
import {ping} from "./PingBrowser";
import { useCalendlyEventListener, InlineWidget } from "react-calendly";
import {generatePassword} from "./secret";
// import {generatePassword} from "./secret";

class Examples extends Component {
  render() {
    var list = [
      {id: '6495f797115f0e146936e5ad', name: 'Indie Marketing Tool'},
      {id: '', name: 'EU4'}
    ]

    return <div className="App">
      <header className="App-header" style={{height: '100%', minHeight: '100vh'}}>
        <h1>Stop wasting years on a game/app, that nobody needs</h1>
        <br />
        <h2>
          Bring ur project to market faster
        </h2>
        <h2>
          Innovate without destroying ur mental health
        </h2>
        <ProjectList projectIDs={list} />
        <br />
        <br />
        <Link to={"/"}>Back</Link>
        <Link to={"/pricing"}>Pricing</Link>
      </header>
    </div>
  }
}

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
            <input type="submit" value={"Register"} />
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
    <form action="/api/login" method="post">
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
            <input type="submit" value={"Login"} />
          </td>
          <td></td>
        </tr>
        {/*<tr><td style={{float: 'left'}}>Forgot password?</td></tr>*/}
      </table>
      {/*<input type="submit" value="Submit"/>*/}
    </form>

    <br/>
    <br/>
    <Link to={"/register"}>Don't have an account?</Link>
  </div>
}

function ResetPasswordForm({}) {
  var [email, setEmail] = useState("")

  var resetPassword;
  if (email.length) {
    resetPassword = <div>
      <label>You will receive an email with new password</label>
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

function CalendlyTest({}) {
  useCalendlyEventListener({
    onProfilePageViewed: () => console.log("onProfilePageViewed"),
    onDateAndTimeSelected: () => console.log("onDateAndTimeSelected"),
    onEventTypeViewed: () => console.log("onEventTypeViewed"),
    onEventScheduled: (e) => console.log(e.data.payload),
  });

  return <InlineWidget url={"https://calendly.com/konstantin-gevorkov/strategic-session"} />
}

class MainPage extends Component {
  state = {
    authenticated: false
  }

  componentDidMount() {
    ping('/authenticated', r => {
      var authenticated = r.body.authenticated
      console.log({r}, authenticated)

      this.setState({
        authenticated
      })
    })
  }

  render() {
    var {authenticated} = this.state
    var hasCookies = document.cookie.length
    var isNewUser = !authenticated && !hasCookies

    return <div className="App">
      <header className="App-header" style={{height: '100%', minHeight: '100vh'}}>
        <h1>Stop wasting years on a game/app, that nobody needs</h1>
        <br />
        <h2>Bring ur project to market faster</h2>
        <h2>Innovate without destroying ur mental health</h2>
        {/*<Link to={"/examples"}>Examples</Link>*/}
        {/*<Link to={"/pricing"}>Pricing</Link>*/}


        {/*{document.cookie}*/}

        {authenticated ?
          <Link to={"/profile"}>Profile</Link>
          :
          <div>
            <Link to={"/register"}>Register</Link>
            <br />
            <Link to={"/login"}>Login</Link>
          </div>
        }
        {/*<CalendlyTest />*/}
      </header>
    </div>
  }
}




class App extends Component {
  render() {
    return <div>
      <div className="App">
        <header className="App-header" style={{height: '100%', minHeight: '100vh'}}>
          <Routes>
            <Route path='/'                     element={<MainPage/>}/>
            <Route path='/register'             element={<RegisterForm/>}/>
            <Route path='/login'                element={<LoginForm/>}/>
            <Route path='/logout'                element={<LoginForm/>}/>
            <Route path='/reset'                element={<ResetPasswordForm />}/>

            <Route path='/examples'             element={<Examples/>}/>
            <Route path='/about'                element={<div>ABOUT</div>}/>

            <Route path='/profile'              element={<ProfilePage/>}/>
            <Route path='/projects/:projectId'  element={<ProjectPage/>}/>
          </Routes>
        </header>
      </div>
    </div>
  }
}

export default App;
