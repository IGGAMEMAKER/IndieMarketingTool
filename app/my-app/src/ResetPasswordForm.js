import {useState} from "react";

export function ResetPasswordForm({}) {
  var [email, setEmail] = useState("")

  var resetPassword;
  if (email.length) {
    resetPassword = <div>
      <label>You will receive an email with new password</label>
      <br/>
      <br/>
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