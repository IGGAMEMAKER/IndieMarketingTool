import {useState} from "react";
import {getFeatureIterationId} from "./utils/getFeatureIterationId";
import {GOAL_TYPE_FEATURES} from "./constants/constants";
import {Panel} from "./Panel";
import {getEstimateDescription} from "./utils/getEstimateDescription";
import {FieldAdder} from "./FieldAdder";
import actions from "./actions";
import {sortFeatures} from "./utils/sortFeatures";
import {renderTimeButton} from "./utils/renderTimeButton";
import {FieldPicker} from "./FieldPicker";
import {getFeatureUsageCount} from "./utils/getEntityUsageCount";

export function FeatureList({project, noTiming = false}) {
  var [chosenTimerId, setTimerId] = useState(-1)

  var features = project.features || []

  var sum = list => list.map(f => f.timeCost || 0).reduce((p, c) => p + c, 0)
  var countableFeatures = features.filter(f => !f.solved)
  var totalHours = sum(countableFeatures)
  var scheduledHours = sum(countableFeatures.filter(f => !!getFeatureIterationId(project, f.id)))

  var firstIterationWithFeatures = project.iterations.find(it => {
    if (it.goals.find(g => g.goalType === GOAL_TYPE_FEATURES))
      return true
    return false
  })

  return <div>
    <Panel id={"Features"} header={"Features"}/>
    {/*<p>*/}
    {/*  <b>Remaining: {getEstimateDescription(scheduledHours)}/!*, +Not assigned: {getEstimateDescription(totalHours)}*!/</b>*/}
    {/*</p>*/}
    {/*<p>*/}
    {/*  if you work 8 Hours / day*/}
    {/*</p>*/}
    <FieldAdder placeholder={"add new feature"} defaultState={true} autoFocus={false}
                onAdd={val => actions.addFeature(val)}/>
    <br/>
    <br/>
    <center>
      <table className="list limited">
        {features
          .sort(sortFeatures)
          .filter(f => {
            var isPartOfFirstIteration = getFeatureIterationId(project, f.id) === firstIterationWithFeatures?.id;
            if (f.solved)
              return false

            if (f.solved && !isPartOfFirstIteration) {
              return false
            }

            return true;
          })
          .map(f => {
            var dayDurationHours = 8;
            var timeButton = t => renderTimeButton(t, f, () => {
              setTimerId(-1)
            })


            var onPick = () => {
              setTimerId(f.id)
            }

            var timePicker = isNaN(f.timeCost) ?
              <button onClick={onPick}>Set Estimates</button>
              :
              <span className={"editable"} onClick={onPick}>{getEstimateDescription(f.timeCost)}</span>

            if (noTiming)
              timePicker = ''

            if (chosenTimerId === f.id) {
              timePicker = <div>
                {timeButton(15)} {timeButton(60)} {timeButton(4 * 60)} {timeButton(dayDurationHours * 60)} {timeButton(dayDurationHours * 3 * 60)} {timeButton(dayDurationHours * 7 * 60)}
                <br/>
              </div>
            }

            return <tr
              key={"feature" + f.id}
            >
              {/*<td>*/}
              {/*  <b>{f.id}</b>*/}
              {/*</td>*/}
              <td className={"left feature-tab"}>
                <FieldPicker
                  autoFocus
                  value={f.name}
                  placeholder={"type your mind"}
                  onAction={val => actions.editFeatureName(f.id, val)}
                  onRemove={() => {
                    var usages = getFeatureUsageCount(project, f.id)

                    if (usages.length) {
                      alert(`Can't remove this feature, cause it's used in\n\n${usages.join('\n')}`)
                    } else {
                      actions.removeFeature(f.id)
                    }
                  }}
                  normalValueRenderer={onEdit => {
                    var isPartOfFirstIteration = getFeatureIterationId(project, f.id) === firstIterationWithFeatures?.id;

                    var solved = f.solved ? 'solved' : ''
                    var used = getFeatureIterationId(project, f.id) ? 'used' : ''
                    var isNearestFeature = isPartOfFirstIteration && !f.solved ? 'nearest' : ''

                    return <div
                      onClick={onEdit}
                      className={`feature ${solved} ${used} ${isNearestFeature}`}
                    >{f.name}</div>
                  }}
                />
              </td>
              <td>
                {timePicker}
              </td>
            </tr>
          })}
      </table>
    </center>
  </div>
}