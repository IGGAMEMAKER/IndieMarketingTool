import {Link} from "react-router-dom";

export function ProjectList({projectIDs}) {
  var list = projectIDs.filter(p => p.name).map(({id, name}) => <li><Link className={"project-link"} to={"/projects/" + id}>{name}</Link></li>)

  return <ul>{list}</ul>
}