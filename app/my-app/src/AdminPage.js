import {Component} from "react";
import {ping} from "./PingBrowser";
import {isApp} from "./utils/projectUtils";

export class AdminPage extends Component {
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
      <br/>
      <br/>
      {/*{JSON.stringify(this.state.grouped, null, 2)}*/}
    </div>
  }
}