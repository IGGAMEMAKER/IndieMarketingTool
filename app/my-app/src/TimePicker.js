import {getEstimateDescription} from "./utils/getEstimateDescription";
import {useState} from "react";

const dayDurationHours = 8

export function TimePicker({f, onClick}) {
  var [isEditing, setEditing] = useState(false)

  const timeButton = t => <button
    className={`toggle ${f.timeCost === t ? 'chosen' : ''}`}
    onClick={()=>{
      onClick(t)
      setEditing(false)
    }}>{getEstimateDescription(t)}
  </button>

  const hour = 60
  const day = dayDurationHours * hour
  var times = [15, hour, 4 * hour, day, 3 * day, 7 * day]

  if (isEditing) {
    return <div>
      {times.map(timeButton)}
      {/*{timeButton(15)} {timeButton(60)} {timeButton(4 * 60)} {timeButton(dayDurationHours * 60)} {timeButton(dayDurationHours * 3 * 60)} {timeButton(dayDurationHours * 7 * 60)}*/}
      <br/>
    </div>
  }

  if (isNaN(f.timeCost)) {
    return <button onClick={() => setEditing(true)}>Set Estimates</button>
  }

  return <span className={"editable"} onClick={()=> setEditing(true)}>{getEstimateDescription(f.timeCost)}</span>
}