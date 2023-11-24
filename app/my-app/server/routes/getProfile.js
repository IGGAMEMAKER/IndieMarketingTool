const {ProjectModel, ObjectId} = require("../Models");

const getProfile = async (req, res) => {
  console.log('getProfile', req.userId)

  ProjectModel.find({ownerId: new ObjectId(req.userId)})
    .then(projects => {
      res.json({
        projects: projects.map(p => ({name: p.name, id: p._id, appType: p.type}))
      })
    })
    .catch(err => {
      console.error({err})
      res.json({
        projects: [],
        fail: true
      })
    })
}

module.exports = {
  getProfile
}