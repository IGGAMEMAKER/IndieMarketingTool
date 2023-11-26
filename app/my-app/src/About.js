import {col1, col2, ReleaseFaster} from "./UI";
import {Link} from "react-router-dom";

export function About({}) {
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