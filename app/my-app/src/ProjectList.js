import {Link} from "react-router-dom";

export function ProjectList({projectIDs}) {
  return projectIDs.map(({id, name}) => <div><Link to={"/projects/" + id}>{name}</Link></div>)
}