var dayDurationHours = 8;

export const getEstimateDescription = t => {
  if (isNaN(t))
    return <span style={{color: 'red', fontWeight: 'bold'}}>???</span>
  if (t < 60)
    return t + 'min'
  else if (t < dayDurationHours * 60) {
    return t / 60 + 'Hr'
  } else /*if (t < dayDurationHours * 7 * 60)*/ {
    return t / dayDurationHours / 60 + ' Days'
  } /*else {
            descr = t / dayDurationHours / 60 / 7 + ' Weeks'
          }*/
}

