const {ProjectModel} = require("../Models");
const getProject = async (req, res) => {
  var objectId = req.params.objectId;

  var p = await ProjectModel.findById(objectId)
  res.json({
    project: p,
  })
}

module.exports = {
  getProject
}