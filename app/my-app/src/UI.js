import {Link} from "react-router-dom";

export const col1 = t => <span className="color1">{t}</span>
export const col2 = t => <span className="color2">{t}</span>
export const col3 = t => <span className="">{t}</span>

export function Button ({text}) {
  return <button className="primary">{text}</button>
}

export function ReleaseFaster({}) {
  return <span>{col1("Release")} {col2("Faster")}</span>
}

export function SimpleLink({url, text}) {
  return <Link to={url}>{col2(text)}</Link>
}



export function ButtonLink ({url, text}) {
  var b = <Button text={text} />

  if (url) {
    return <Link to={url}>{b}</Link>;
  }

  return b
}

export function CTAButtons() {
  return <div>
    <table>
      <tr>
        {/*<td>{loginForm}</td>*/}
        <td>
          <ButtonLink url={"/login"} text={"Try it!"} />
        </td>
        {/*<td></td>*/}
        {/*<td></td>*/}
        {/*<td>*/}
        {/*  <Link target="_blank" to={"/about"}>*/}
        {/*    {col2("More info")}*/}
        {/*  </Link>*/}
        {/*</td>*/}
      </tr>
    </table>
  </div>
}

// module.exports = {
//   Button,
//   ButtonLink,
//   SimpleLink,
//   CTAButtons,
//   ReleaseFaster,
//   col1,
//   col2, col3
// }