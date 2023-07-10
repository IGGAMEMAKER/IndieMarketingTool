const {ProjectModel} = require("../Models");

const updateProject = async (req, res) => {
  var objectId = req.params.objectId;
  var p = req.body.project;
  // console.log({objectId}, p)

  var result = await ProjectModel.findByIdAndUpdate(objectId, p)

  // console.log({result})

  res.json({
    result
  })
}

module.exports = {
  updateProject
}