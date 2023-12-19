import {useState} from "react";
import actions from "./actions";

export function AudienceAdder({placeholder}) {
  const [audienceName, onChangeName] = useState("");

  return (
    <div className="Audience-item">
      <textarea
        value={audienceName}
        placeholder={placeholder}
        onChange={event => {
          var v = event.target.value
          console.log({v})
          onChangeName(v)
        }}
      />
      <br/>
      <button onClick={() => {
        actions.addAudience(audienceName);
        onChangeName("")
      }}>ADD
      </button>
    </div>
  )
}