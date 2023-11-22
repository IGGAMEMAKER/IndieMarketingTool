import {useState} from "react";
import actions from "./actions";
import {FieldPicker} from "./FieldPicker";

export function AudienceMessageView({index, id, m}) {
  const indexName = "audienceMessageIndex"
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
    e.preventDefault()

    if (isCorrectTypeDrag(e))
      setDraggingTarget(target)
  }
  var onDrop = e => {
    var draggedOnMeId = parseInt(e.dataTransfer.getData(indexName))

    var was = draggedOnMeId;
    var next = index;

    setDraggingTarget(false)
    actions.changeAudienceMessageOrder(id, was, next)
  }

  const messageId = m.id

  return <li
    draggable
    onDragStart={e => {
      onStartDragging(e, true)
    }}
    onDragEnd={e => {
      onStartDragging(e, false)
    }}

    onDragLeave={e => onDraggedUpon(e, false)}
    onDragOver={e => onDraggedUpon(e, true)}

    onDrop={e => {
      onDrop(e)
    }}

    className={`${isDragging ? 'dragging' : ''} ${isDraggingTarget ? 'dragging-target' : ''}`}

    key={`audience-message-${id}-${messageId}`}
  >
    <FieldPicker
      value={m.name}
      placeholder={"What will you tell them?"}
      onAction={val => actions.editAudienceMessage(val, id, messageId)}
      onRemove={() => actions.removeAudienceMessage(id, messageId)}
    />
  </li>
}