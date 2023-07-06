export function AudiencePicker({onPick, defaultAudience = -1, audiences = [], excluded = []}) {
  var excludedIDs = {}
  excluded.forEach(i => excludedIDs[i] = 1)

  var allowedOptions = audiences
    // .filter(aa => !excluded.filter(inc => inc === aa.id).length)
    .filter(aa => !excludedIDs[aa.id])

  if (allowedOptions.length) {
    return <select
      value={defaultAudience}
      onChange={event => {
        onPick(parseInt(event.target.value))
      }}
    >
      <option disabled selected value={-1}> -- select an audience --</option>
      {allowedOptions.map((aa, i) => <option value={aa.id}>{aa?.name}</option>)}
    </select>
  }

  return ''
}