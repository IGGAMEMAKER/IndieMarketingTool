const {ProjectModel} = require("../Models");

const canUpdateProjectMiddleware = async (req, res, next) => {
  var objectId = req.params.objectId;
  var canEdit = await ProjectModel.findOne({ownerId: req.userId, _id: objectId})

  req.canEdit = !!canEdit

  next()
}

const updateProject = async (req, res) => {
  var result;

  if (req.canEdit)
    result = await ProjectModel.findByIdAndUpdate(req.params.objectId, req.body.project)

  res.json({
    result
  })
}

module.exports = {
  updateProject,
  canUpdateProjectMiddleware
}