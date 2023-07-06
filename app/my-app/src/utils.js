const getIndexByID = (list, id) => list.findIndex(item => item.id === id)
const getByID = (list, id) => list.find(item => item.id === id)

module.exports = {
  getIndexByID,
  getByID
}