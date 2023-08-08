import {Link} from "react-router-dom";

export function ProjectList({projectIDs}) {
  var list = projectIDs.filter(p => p.name).map(({id, name}) => <li className={"project-link"}><Link to={"/projects/" + id}>{name}</Link></li>)

  return <ul>{list}</ul>
}