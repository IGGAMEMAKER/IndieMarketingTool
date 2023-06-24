import actions from "./actions";
import {FieldPicker, NumberPicker} from "./FieldPicker";
import {useState} from "react";

function BenefitAdder({index}) {
  var [benefit, onChange] = useState("");
  var [needsToAdd, setNeedsToAdd] = useState(false)

  if (!needsToAdd) {
    return <button onClick={() => setNeedsToAdd(true)}>+</button>
  }

  return <div>
    <input value={benefit} placeholder={"What will you offer?"} onChange={ev => onChange(ev.target.value) }/>
    <button onClick={() => {
      actions.addBenefitToMonetizationPlan(index, benefit)
      onChange("")
      setNeedsToAdd(false)
    }}>Add</button>
  </div>
}

export function MonetizationPlan({plan, index, audiences}) {
  var namePicker = <FieldPicker
    value={plan.name}
    placeholder={"Monetization type name"}
    onAction={newValue => {actions.editMonetizationName(index, newValue)}}
    normalValueRenderer={onChangeName => <b onClick={() => onChangeName(true)}>{plan.name}</b>}
  />

  var benefitPicker = plan.benefits.map((b, bIndex) => <FieldPicker
    value={b}
    placeholder={"Describe monetization: which features / limits will you offer?"}
    onAction={newValue => {
      if (newValue.length)
        actions.editMonetizationDescription(index, bIndex, newValue)
      else
        actions.removeBenefitFromMonetizationPlan(index, bIndex)
    }}
    normalValueRenderer={onChangeName => <li style={{textAlign: 'left'}} onClick={() => onChangeName(true)}>{b}</li>}
  />)

  var moneyPicker = <NumberPicker
    value={plan.price}
    placeholder={"Describe monetization: which features / limits will you offer?"}
    onAction={newValue => {actions.editMonetizationPrice(index, newValue)}}
    normalValueRenderer={onChangeName => <div style={{color: "red"}} onClick={() => onChangeName(true)}><b>{plan.price ? plan.price + '$' : 'FREE'}</b></div>}
  />

  var includedAudiences = (plan?.audiences || [])
  var allowedOptions = audiences.map((a, i) => Object.assign({}, a, {index: i})).filter(aa => !includedAudiences.filter(inc => inc === aa.index).length)

  var audienceSelect;
  if (allowedOptions.length) {
    audienceSelect = <div>
      <select value={-1} onChange={event => {
        var val = event.target.value
        // console.log(val)

        actions.attachAudienceToMonetizationPlan(parseInt(val), index)
      }}>
        <option disabled selected value={-1}> -- select an audience --</option>
        {allowedOptions.map((aa, i) => <option value={aa.index}>{aa.name}</option>)}
      </select>
    </div>
  }

  var adder = <BenefitAdder index={index} />
  return <div className="Audience-item">
    <div>{namePicker}</div>
    <div>{benefitPicker.length ? <ul>{benefitPicker}<li style={{textAlign: 'left'}}>{adder}</li></ul> : adder}</div>

    {!includedAudiences.length ? <div><label><br/>Who will use this plan?</label></div> : ''}
    <div><ul>{includedAudiences.map(i => <li><i style={{color: 'green'}} onClick={event => event.detail === 2 && actions.detachAudienceFromMonetizationPlan(i, index)}>{audiences[i].name}</i></li>)}</ul></div>
    {audienceSelect}

    <br />
    <div>{moneyPicker}</div>
  </div>
}