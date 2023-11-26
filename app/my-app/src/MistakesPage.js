import {Component} from "react";
import {col2, SimpleLink} from "./UI";

export class MistakesPage extends Component {
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
        <li>{/*(Also cause avoided market research) */}Trying to make as much features as they can, cause "people won't
          like
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
            <SimpleLink url={"/"} text={"back"}/>
          </td>
        </tr>
      </table>
    </div>
  }
}