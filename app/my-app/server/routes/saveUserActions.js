const {saveUserAction} = require("../saveUserAction");

const saveUserActionRoute = async (req, res) => {
  // console.log('saveUserActionRoute', req.body)

  res.json({ok: 1})

  var {action} = req.body;

  await saveUserAction(req, action)
}
const saveUserUnderstandingStatsRoute = async (req, res) => {
  res.json({ok: 1})

  var {action} = req.body;

  await saveUserAction(req, action)
  // await UserModel.findByIdAndUpdate(req.userId, {})
}

module.exports = {
  saveUserActionRoute,
  saveUserUnderstandingStatsRoute
}