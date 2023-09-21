const {UserActionsModel} = require("./Models");

const saveUserAction = async (req, action) => {
  var a = new UserActionsModel({
    userId: req.userId,
    action,
    date: new Date()
  })

  var r = await a.save()

  console.log('saveUserAction', {r})
}

module.exports = {
  saveUserAction
}