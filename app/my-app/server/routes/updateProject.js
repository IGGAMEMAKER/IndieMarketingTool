const {ProjectModel} = require("../Models");

const updateProject = async (req, res) => {
  var objectId = req.params.objectId;
  var canEdit = await ProjectModel.findOne({ownerId: req.userId, _id: objectId})
  console.log({canEdit})

  var p = req.body.project;
  // console.log({objectId}, p)

  var result;

  if (!!canEdit)
    await ProjectModel.findByIdAndUpdate(objectId, p)

  // console.log({result})

  res.json({
    result
  })
}

module.exports = {
  updateProject
}