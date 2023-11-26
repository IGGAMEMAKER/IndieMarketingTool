import {useState} from "react";
import {GoogleLogin, useGoogleOneTapLogin} from "@react-oauth/google";
import actions from "./actions";
import {jwtDecode} from "jwt-decode";
import {Link} from "react-router-dom";

// function onSignIn(googleUser) {
//   console.log('onSignIn')
//   console.log(googleUser)
//
//   var profile = googleUser.getBasicProfile();
//   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
//   console.log('Name: ' + profile.getName());
//   console.log('Image URL: ' + profile.getImageUrl());
//   console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
// }

export function LoginAsGuestButton({}) {
  return <button onClick={() => {actions.loginAsGuest()}}>Continue as guest</button>
}

export function LoginViaGoogleButton({restoreGuest=false}) {
  const responseMessage = (response) => {
    if (restoreGuest)
      actions.attachGoogleAccountToGuest(response)
    else
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

  return <GoogleLogin onSuccess={responseMessage} onError={errorMessage}/>
}

export function LoginViaEmailButton({}) {
  var [email, setEmail] = useState("")
  var [password, setPassword] = useState("")

  var passwordWasReset = window.location.href.includes("resetPassword")
  var passwordWasResetText;
  if (passwordWasReset) {
    passwordWasResetText = <div>
      <label>
        <span style={{color: 'orange', fontWeight: '800'}}>New password was sent to your email.</span>
        <br/>If there is no message, CHECK SPAM folder too</label>
    </div>
  }

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
            <input type="submit" value={"Login"} onClick={() => {
              actions.logIn(email, password)
            }}/>
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

  return regularEmailForm
}

export function LoginForm({}) {
  const oneTap = useGoogleOneTapLogin({
    onSuccess: credentialResponse => {
      console.log(credentialResponse);
    },
    onError: () => {
      console.error('Login Failed');
    },
  });


  return <div>
    {/*{oneTap}*/}
    {/*<div className="g-signin2" data-onsuccess={"onSignIn"}></div>*/}
    <h2>Log in via socials</h2>
    <LoginViaGoogleButton />
    <br />
    <br />
    <LoginAsGuestButton />
    {/*<br />*/}
    {/*<br />*/}
    {/*{regularEmailForm}*/}
  </div>
}

export function SaveGuestProgressForm({}) {
  return <div>
    <h2>Log in via socials</h2>
    <LoginViaGoogleButton />
  </div>
}