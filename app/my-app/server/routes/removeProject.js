const {ProjectModel} = require("../Models");

const removeProject = async (req, res) => {
  var projectId = req.params.objectId;
  console.log('WILL TRY TO REMOVE', {projectId})

  ProjectModel.deleteOne({_id: projectId}).then(r => {
    console.log('REMOVED', {r})
    res.json({ok: 1})
  })
    .catch(err => {
      console.error('FAILED TO REMOVE', {err})
      res.json({fail: true})
    })
}

module.exports = {
  removeProject
}