// import logo from './logo.svg';
import './App.css';

import {Component, useState} from 'react';
import {Link, Route, Routes} from 'react-router-dom';
import {ProfilePage} from "./ProfilePage";
import {ProjectPage} from "./ProjectPage";
import {ping, post} from "./PingBrowser";
import {generatePassword} from "./secret";
import actions, {loginViaGoogleOAuth} from "./actions";
import {ButtonLink, col1, col2, TryItButton, ReleaseFaster, SimpleLink} from "./UI";
import {isApp} from "./utils/projectUtils";

import { useGoogleOneTapLogin, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import {autoRedirect, navigate} from "./Navigate";


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

  function onSignIn(googleUser) {
    console.log('onSignIn')
    console.log(googleUser)

    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }

  const oneTap = useGoogleOneTapLogin({
    onSuccess: credentialResponse => {
      console.log(credentialResponse);
    },
    onError: () => {
      console.error('Login Failed');
    },
  });


  const responseMessage = (response) => {
    actions.loginViaGoogleOAuth(response)
    // post('/api/user/google', {response})
    //   .then(autoRedirect)

    console.log('responseMessage', response);
    var profile = jwtDecode(response.credential);

    console.log(profile)
  };

  const errorMessage = (error) => {
    console.error('google errorMessage', error);
  };

  const regularEmailForm = <div>
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

  return <div>
    {/*{oneTap}*/}
    {/*<div className="g-signin2" data-onsuccess={"onSignIn"}></div>*/}
    <h2>Log in via socials</h2>
    <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
    <button onClick={() => {actions.loginAsGuest()}}>Continue as guest</button>
    {/*<br />*/}
    {/*<br />*/}
    {/*{regularEmailForm}*/}
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
    <h2>Stages</h2>
    <ul>
      <li>Formulate the problem / main game idea</li>
      <li>Test if anyone has that problem / wants to play that</li>
      <li>Build your MVP (1 week)</li>
      <li>Get Feedback</li>
    </ul>
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


class MistakesPage extends Component {
  render() {
    return <div>
      <div><b>{col2("Common mistakes")}</b></div>
      <ol className="left">
        <li>Building, before researching</li>
        <li>Treating product like a set of features and only focusing on development</li>
        <li>
          Not knowing precisely, what they are creating:
          {/*Cannot formulate their product/problem in one sentence, which leads to:*/}
          <ul>
            <li>They cannot explain their idea to others</li>
            <li>But think, that EVERYONE WILL LOVE IT WHEN THEY SEE IT (they won't)</li>
            <li>Maybe add this feature or that one, or even third one?</li>
            <li>Shit, I have to redo EVERYTHING, then it will be OKAY</li>
            {/*<li>Hard to market ur stuff, cause they don't understand, what you are making</li>*/}
            {/*<li>Hard to market ur stuff, cause you can't explain ur idea fast</li>*/}
          </ul>
        </li>
        <li>
          Not showing their work to people early on
          <ul>
            <li>Cause they are scared or</li>
            <li>Cause they think that product IS GOOD, I just need to finish it</li>
          </ul>
        </li>
        <li>
          Thinking, that they know everything
          <ul>
            <li>I know, which features are necessary</li>
          </ul>
        </li>
        <li>{/*(Also cause avoided market research) */}Trying to make as much features as they can, cause "people won't like
          it otherwise".
          <ul>
            <li>Fear of rejection/Perfectionism</li>
            <li>Polishing before people shown interest</li>
            <li>Not sure if people want it or not</li>
          </ul>
        </li>
        <li>Starting projects just to prove something to yourself</li>
      </ol>
      <table>
        <tr>
          {/*<td>*/}
          {/*  <ButtonLink url={"/login"} text={"Try it!"} />*/}
          {/*</td>*/}
          <td>
            <SimpleLink url={"/"} text={"back"} />
          </td>
        </tr>
      </table>
    </div>
  }
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
      <br/>
      <Link to={"/login"}>Login</Link>
    </div>

    var loginForm;
    loginForm = authenticated ? profileLink : loginLink

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
          <li>Workflow {col1("designed specifically")} to avoid <SimpleLink url={"/mistakes"} text={"common mistakes indie hackers make"} /> {/*<Link style={{color: 'white'}} to={"/mistakes"}>common mistakes</Link> <b>{col2("indie hackers make")}</b>*/}</li>
          <li>Answer main questions about your new idea and get help if you can't give clear answers</li>
          <li>Find out if your project has chances {col1("BEFORE WASTING YEARS")} on it</li>
        </ul>


        <TryItButton />
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
              var color = isApp(p) ? 'orange' : 'violet'

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
            <Route path='/mistakes'                       element={<MistakesPage />}/>
            <Route path='/register'                       element={<RegisterForm/>}/>
            <Route path='/verify'                         element={<VerifyForm />}/>
            <Route path='/login'                          element={<LoginForm/>}/>
            <Route path='/logout'                         element={<LoginForm/>}/>
            <Route path='/reset'                          element={<ResetPasswordForm />}/>

            <Route path='/about'                          element={<About />}/>

            <Route path='/profile'                        element={<ProfilePage/>}/>
            <Route path='/projects/:projectId'            element={<ProjectPage/>}/>
            <Route path='/admin/panel'                    element={<AdminPage/>}/>
          </Routes>
        </header>
      </div>
    </div>
  }
}

export default App;
