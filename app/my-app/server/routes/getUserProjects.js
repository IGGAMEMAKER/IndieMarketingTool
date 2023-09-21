const {ProjectModel} = require("../Models");

const getUserProjects = async (req, res) => {
  var result = await ProjectModel.find({});
  var grouped = await ProjectModel.aggregate([
    {
      $match: {
        name: {$exists: true}
      }
    },
    {
      $group: {
        _id: '$ownerId',
        count: { $sum: 1 },
        // projects: {$push: {item: "$name"}}
        projects: {$push: "$$ROOT"}
        // itemsSold: { $push: { item: "$item" } }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        'user.password': 0,
        'user.sessionToken': 0,
      }
    }
  ])

  res.json({
    result,
    grouped
  })
}

module.exports = {
  getUserProjects
}