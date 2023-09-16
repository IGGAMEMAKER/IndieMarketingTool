import actions from "../actions";
import {getEstimateDescription} from "./getEstimateDescription";

export const renderTimeButton = (t, f, onClick) =>
  <button className={`toggle ${f.timeCost === t ? 'chosen' : ''}`} onClick={() => {
    actions.changeFeatureTimeCost(f.id, t)
    onClick() // setTimerId(-1)
  }}>{getEstimateDescription(t)}</button>

