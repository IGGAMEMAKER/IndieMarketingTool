const mongoose = require("mongoose");
const { Schema } = mongoose;

var UserSchema = new Schema({
  email: String
  // payments, chosen plan (when)
  // shown interest in (plan...)
})

UserSchema.index({email: 1}, {unique: true})

const UserModel = mongoose.model("users", UserSchema)

var ProjectSchema = new Schema({
  name: String,
  type: Number, // 1 - app, 2 - game
  ownerId: String,

  data: mongoose.Mixed // risks, audiences, monetizationPlans, e.t.c
})

const ProjectModel = mongoose.mode("projects", ProjectSchema)

// var CollectionSchema = new Schema({
//   collectionId: String, // contractId
//   contract_min: String, // contractId.toLowerCase()
//
//   copiedTrades: Number,
//
//   name: String,
//   slug: String,
//
//   // drawnWTB: Number,
//   // drawnDeal: Number,
//
//   flags: {
//     following: Boolean,
//
//     buying: Boolean,
//     selling: Boolean,
//   },
//
//
//   assetsToTrack: Array, // of strings
//   assets: Array,
//   floorPrices: Array,
//   floorUpdateTime: Number,
//
//   suspiciousItems: mongoose.Mixed,
//
//   blurAssets: Array,
//   blurFloorPrices: Array,
//   blurFloorUpdateTime: Number,
//
//   blurBids: Array, // TODO am I saving data to that field?
//
//   events: Array, // TODO not using this one too
//
//   // TODO not using this one?
//   lastTrades: Array, // from, to, tx, date, price, txType (SELL, WETH, ERROR), ITEMS
//
//   // TODO Using, but not saving these fields. All these are calculated in runtime
//   myWTB: Number,
//   minWTB: Number,
//   calculatedDiscount: Number,
//   liquidityBasis: Number,
//
//   maxDiscount: Number,
//   dailyTrades: Number,
//   dailyTradesUpdateTime: Date,
//   structuredDeals: Object,
//
//   volumeTraded: Number,
//   volumeAccumulated: Number,
//   errorVolume: Number,
//   errorVolumeStatus: String,
//
//   uniqueOwners: Number,
//   totalSupply: Number,
//   itemCount: Number,
//   numOwners: Number,
//   totalSales: Number,
//
//   collectionFee: Number,
//   pointsOK: {
//     type: Number,
//     default: -1,
//   }, // -1 unknown, 0 - no blur rewards, 1 - will get rewards
//   mandatoryFees: {
//     type: Number,
//     default: -1,
//   }, // -1 unknown, 0 - optional fees, 1 - fees are forced
//   freeCollectionCounter: Number, // needs to be equal to 3
//
//   isOwnedCollection: Boolean,
//   isWhaleCollection: Boolean, // TODO not used now
// })

// CollectionSchema.index({ collectionId: 1 }, { unique: true });
// CollectionSchema.index({ slug: 1 }, { unique: true });

// const CollectionModel = mongoose.model("collections", CollectionSchema)

const defaultConfig = {
  WEB3: 0, // 1 - TRUE, 0 - FALSE // Allow or restrict WEB3 operations
  WEB3_DELAY: 5000, // MS
  OFFER_DURATION: 4 * 60, // MIN
  TRACK_OPENSEA_EVENTS: 1,
  BLUR_BIDDING: 0,

  SPAMMING_CHECK_PERIOD: 30, // check every 30 MIN
  SPAMMING_ALERT_RATE: 40, // if success rate < 40% => push!
  SPAMMING_RPH_REQUIREMENTS: 1000 // need to make 1000+ requests, otherwise it's REKT
}

const getCf = async (parameter) => {
  var configs = await getServerConfigs();

  if (Object.keys(configs).includes(parameter)) {
    return configs[parameter]
  } else {
    // fallback to default
    console.error('Will fallback to default value for parameter', parameter, defaultConfig[parameter])
    return defaultConfig[parameter]
  }
}

const getServerConfigs = async () => {
  try {
    var config = await ServerConfigs.findOne({});

    if (!config) {
      console.log('will try saving asset history', config)
      config = new ServerConfigs({configs: defaultConfig});
      await config.save()
    }

    if (config?.configs) {
      return config.configs;
    } else {
      console.log("WILL UPDATE")
      await config.updateOne({ configs: defaultConfig });
    }
  } catch (err) {
    console.error("NO CONFIG", err);
  }

  console.log("default value");
  return defaultConfig
}

async function main() {
  console.log("main");
  await mongoose.connect('mongodb://localhost:27017/marketingtool');

  var config = await getServerConfigs();
  console.log("main");
  console.log("get configs", config);
}
main().catch(err => console.log(err));

module.exports = {
  // CollectionModel,
  UserModel,
  ProjectModel,

  getServerConfigs,
  getCf
}