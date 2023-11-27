import actions from "./actions";
import {FieldPicker, NumberPicker} from "./FieldPicker";
import {useState} from "react";
import {FieldAdder} from "./FieldAdder";

function BenefitAdder({index}) {
  return <FieldAdder
    onAdd={v => {
      actions.addBenefitToMonetizationPlan(index, v)
    }}
    autoFocus={false}
    defaultState={true}
    placeholder="Problems, features, limits e.t.c."
  />

  var [benefit, onChange] = useState("");
  var [needsToAdd, setNeedsToAdd] = useState(false)

  // if (!needsToAdd) {
  //   return <button onClick={() => setNeedsToAdd(true)}>+</button>
  // }

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
  const indexName = "monetizationIndex"
  var [isDragging, setDragging] = useState(false)
  var [isDraggingTarget, setDraggingTarget] = useState(false)

  var isCorrectTypeDrag = e => {
    try {
      var d = parseInt(e.dataTransfer.getData(indexName))
      var resp = !isNaN(d)
      console.log('d=', d, indexName, resp)

      return true
    } catch (err) {
      console.error('error in drag', indexName)
      return false
    }
  }

  var onStartDragging = (e, dragging) => {
    e.dataTransfer.setData(indexName, index)
    setDragging(dragging)
    setDraggingTarget(false)
  }

  var onDraggedUpon = (e, target) => {
    if (isCorrectTypeDrag(e))
      setDraggingTarget(target)

    e.preventDefault()
  }
  var onDrop = e => {
    var draggedOnMeId = parseInt(e.dataTransfer.getData(indexName))
    // console.log(draggedOnMeId, typeof draggedOnMeId, index - 1)

    var was = draggedOnMeId;
    var next = index;

    setDraggingTarget(false)
    actions.changeMonetizationOrder(was, next)
  }

  const LEFT = <button onClick={() => {actions.changeMonetizationOrder(index, index -1)}}>←</button>
  const RIGHT = <button onClick={() => {actions.changeMonetizationOrder(index, index +1)}}>→</button>
  var planId = plan.id

  var namePicker = <FieldPicker
    value={plan.name}
    placeholder={"Monetization type name"}
    onAction={newValue => actions.editMonetizationName(planId, newValue)}
    onRemove={() => actions.removeMonetizationPlan(planId)}
    // normalValueRenderer={onChangeName => <div>{LEFT}<b onClick={() => onChangeName(true)}>{plan.name}</b>{RIGHT}</div>}
    normalValueRenderer={onChangeName => <div><b onClick={() => onChangeName(true)}>{plan.name}</b></div>}
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

  var maxAudienceHeight = 200

  return <div
    draggable
    onDragStart={e => {onStartDragging(e, true)}}
    onDragEnd={e => {onStartDragging(e, false)}}

    onDragLeave={e => onDraggedUpon(e,false)}
    onDragOver={e => onDraggedUpon(e, true)}

    onDrop={e => {onDrop(e)}}

    className={`Audience-item ${isDragging ? 'dragging' : ''} ${isDraggingTarget ? 'dragging-target' : ''}`}
  >
    {/*<div>{LEFT}{namePicker}{RIGHT}</div>*/}
    <div>{namePicker}</div>
    <div>{moneyPicker}</div>
    {!includedAudiences.length ? <div><label><br/>Who will use this plan?</label></div> : ''}
    <div style={{minHeight: `${maxAudienceHeight}px`}}>
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
    <br />
    {/*<div>{descriptionPicker}</div>*/}
    <div className={"Monetization-plan-benefits"}>
      <div>What will you offer?</div>
      {
      benefitPicker.length ?
        <ul>{benefitPicker}<div style={{textAlign: 'left'}}>{adder}</div></ul>
        :
        <div>{adder}</div>
      }
    </div>
  </div>
}