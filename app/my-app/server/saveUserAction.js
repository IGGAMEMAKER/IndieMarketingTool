const {UserModel, UserActionsModel} = require("./Models");

const saveUserAction = async (req, action) => {
  var lastAction = {
    userId: req.userId,
    action,
    date: new Date()
  }
  var a = new UserActionsModel(lastAction)

  var r = await a.save()

  var v = await UserModel.findByIdAndUpdate(req.userId, {lastAction})

  console.log('saveUserAction', {r})
}

module.exports = {
  saveUserAction
}