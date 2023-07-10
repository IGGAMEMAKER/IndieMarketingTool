// import logo from './logo.svg';
import './App.css';

import {Component, useState} from 'react';
// import { BrowserRouter } from 'react-router-dom';
import {Link, Route, Routes} from 'react-router-dom';
import {ProjectList} from "./ProjectList";
import {ProfilePage} from "./ProfilePage";
import {ProjectPage} from "./ProjectPage";
import {generatePassword} from "./secret";


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

  var passButton = <button
    onClick={() => {
      var p = generatePassword(35)
      setPassword(p)
      navigator.clipboard.writeText(p)
    }}>Generate & Copy to Clipboard
  </button>

  return <div>
    <h2>Register</h2>
    <table>
      <tbody>
      <tr>
        <td>
          <input
            autoComplete="email"
            type="email"
            placeholder="Input email"
          />
        </td>
        <td></td>
      </tr>
      <tr>
        <td>
          <input
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
          <button>Register</button>
        </td>
      </tr>
      </tbody>
    </table>
    <br />
    <br />
    <Link to={"/login"}>Have an account?</Link>
  </div>
}

function LoginForm({}) {
  var [email, setEmail] = useState("")
  var [password, setPassword] = useState("")

  return <div>
    <h2>Log in</h2>
    <form action="/api/login" method="">
      <table>
        <tr>
          <td>
            <input
              autoComplete={"email"}
              type={"email"}
              placeholder={"Input email"}/>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>
            <input
              autoComplete="current-password"
              type={"password"}
              placeholder={"Input password"}
              value={password}
              onChange={ev => setPassword(ev.target.value)}
            />
          </td>
          <td>
            <Link to={"/reset"}>Forgot password?</Link>
          </td>
        </tr>
        {/*<tr><td style={{float: 'left'}}>Forgot password?</td></tr>*/}
      </table>
      <input type="submit" value="Submit"/>
    </form>

    <br/>
    <br/>
    <Link to={"/register"}>Don't have an account?</Link>
  </div>
}

function ResetPasswordForm({}) {
  var [email, setEmail] = useState("")
  var [isSent, sendEmail] = useState(false)

  return <div>
    <h2>Reset password</h2>
    <table>
      <tr>
        <td>
          <input
            autoComplete={"email"}
            type={"email"}
            placeholder={"Input email"}
            onChange={ev => setEmail(ev.target.value)}
          />
        </td>
      </tr>
      <tr>
        <td>
          {email.length ? <Link to={"/login"}>Restore</Link>: ''}
        </td>
      </tr>
    </table>
  </div>
}

class MainPage extends Component {
  state = {}

  render() {
    var isAuthenticated = false
    var isNewUser = true


    return <div className="App">
      <header className="App-header" style={{height: '100%', minHeight: '100vh'}}>
        <h1>Stop wasting years on a game/app, that nobody needs</h1>
        <br />
        <h2>Bring ur project to market faster</h2>
        <h2>Innovate without destroying ur mental health</h2>
        {/*<Link to={"/examples"}>Examples</Link>*/}
        {/*<Link to={"/pricing"}>Pricing</Link>*/}

        {/*<RegisterForm />*/}
        {/*<LoginForm />*/}
        <Link to={"/register"}>Register</Link>
        <Link to={"/login"}>Login</Link>

        {isAuthenticated ? <Link to={"/profile"}>Profile</Link> : ''}
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
            <Route path='/' element={<MainPage/>}/>
            <Route path='/register' element={<RegisterForm/>}/>
            <Route path='/login' element={<LoginForm/>}/>
            <Route path='/reset' element={<ResetPasswordForm />}/>

            <Route path='/examples' element={<Examples/>}/>
            <Route path='/about' element={<div>ABOUT</div>}/>

            <Route path='/profile' element={<ProfilePage/>}/>
            <Route path='/projects/:projectId' element={<ProjectPage/>}/>
          </Routes>
        </header>
      </div>
    </div>
  }
}

export default App;
