import {useState} from "react";
import {generatePassword} from "./secret";
import {Link} from "react-router-dom";

export function RegisterForm({}) {
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
  const isDataValid = email.length && email.includes("@") && password.length >= 8

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
            <input disabled={!isDataValid} type="submit" value={"Register"}/>
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