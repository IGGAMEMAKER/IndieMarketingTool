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
  const LEFT = <button onClick={() => {actions.changeMonetizationOrder(index, index -1)}}>←</button>
  const RIGHT = <button onClick={() => {actions.changeMonetizationOrder(index, index +1)}}>→</button>
  var planId = plan.id

  var namePicker = <FieldPicker
    value={plan.name}
    placeholder={"Monetization type name"}
    onAction={newValue => actions.editMonetizationName(planId, newValue)}
    onRemove={() => actions.removeMonetizationPlan(planId)}
    normalValueRenderer={onChangeName => <div>{LEFT}<b onClick={() => onChangeName(true)}>{plan.name}</b>{RIGHT}</div>}
  />

  var descriptionPicker = <FieldPicker
    value={plan.description || ""}
    placeholder={"Monetization type description"}
    onAction={newValue => {actions.editMonetizationDescription(planId, newValue)}}
    normalValueRenderer={onChangeName => <div className={"Monetization-plan-description"} onClick={() => onChangeName(true)}>{plan.description || ""}</div>}
  />

  var benefitPicker = plan.benefits.map(b => <FieldPicker
    value={b.name}
    placeholder={"Describe monetization: which features / limits will you offer?"}
    onAction={newValue => actions.editMonetizationBenefit(planId, b.id, newValue)}
    onRemove={() => actions.removeBenefitFromMonetizationPlan(planId, b.id)}
    normalValueRenderer={onChangeName => <li style={{textAlign: 'left'}} onClick={() => onChangeName(true)}>{b.name}</li>}
    key={'benefit.' + plan.id + '.' + b.id}
  />)

  var moneyPicker = <NumberPicker
    value={plan.price}
    placeholder={"Describe monetization: which features / limits will you offer?"}
    onAction={newValue => actions.editMonetizationPrice(planId, newValue)}
    normalValueRenderer={onChangeName =>
      <div style={{color: "red"}} onClick={() => onChangeName(true)}>
        <b>{plan.price ? plan.price + '$' : 'FREE'}</b>
      </div>}
  />

  var includedAudiences = plan?.audiences || []
  var allowedOptions = audiences
    // .map((a, i) => Object.assign({}, a, {index: i}))
    // .filter(aa => !includedAudiences.filter(inc => inc === aa.index).length)
    .filter(aa => !includedAudiences.filter(inc => inc === aa.id).length)

  var audienceSelect;
  if (allowedOptions.length) {
    // TODO AUDIENCE PICKER??
    audienceSelect = <li>
      <select value={-1} onChange={event => {
        var val = event.target.value
        // console.log(val)

        actions.attachAudienceToMonetizationPlan(parseInt(val), planId)
      }}>
        <option disabled value={-1}> -- select an audience --</option>
        {/*{allowedOptions.map((aa, i) => <option value={aa.index}>{aa.name}</option>)}*/}
        {allowedOptions.map(aa => <option key={"custom-audience-picker-in-monetization-plan." + aa.id} value={aa.id}>{aa?.name}</option>)}
      </select>
    </li>
  }

  var adder = <BenefitAdder index={planId} />

  return <div className="Audience-item">
    {/*<div>{LEFT}{namePicker}{RIGHT}</div>*/}
    <div>{namePicker}</div>
    <div>{moneyPicker}</div>
    <br />
    <div>{descriptionPicker}</div>
    <div className={"Monetization-plan-benefits"}>{benefitPicker.length ? <ul>{benefitPicker}<li style={{textAlign: 'left'}}>{adder}</li></ul> : adder}</div>

    {!includedAudiences.length ? <div><label><br/>Who will use this plan?</label></div> : ''}
    <div>
      <ul>
        {includedAudiences
          .map(audienceId => <li key={"incl"+audienceId} style={{color: 'green', textAlign: 'left'}}>
            <i
              onClick={event => {
                // on double click => remove audience
                if (event.detail === 2)
                  actions.detachAudienceFromMonetizationPlan(audienceId, planId)
              }}
            >{audiences.find(a => a.id === audienceId)?.name || 'ERRORED AUDIENCE, DOUBLE CLICK TO REMOVE'}</i>
          </li>)}
        {audienceSelect}
      </ul>
    </div>
  </div>
}