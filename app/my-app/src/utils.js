export const getIndexByID = (list, id) => list.findIndex(item => item.id === id)
export const getByID = (list, id) => list.find(item => item.id === id)
export const getNextID = list => {
  var ids = list.map(a => a.id || 0)
  // console.log({ids})

  if (!ids.length)
    ids.push(0)

  return 1 + Math.max(...ids)
}

// module.exports = {
//   getIndexByID,
//   getByID,
//   getNextID
// }