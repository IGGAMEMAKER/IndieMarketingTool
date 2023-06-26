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
  ownerId: mongoose.ObjectId,

  // data: mongoose.Mixed, // risks, audiences, monetizationPlans, e.t.c
  audiences: Array,
  audienceCounter: Number,
  monetizationPlans: Array,
  risks: Array,
  channels: Array,
  links: Array
})


const ProjectModel = mongoose.model("projects", ProjectSchema)

const ScrappedGameSchema = new Schema({
  name: String,
  appId: Number,
  store: Number, // 1 - Steam, 2 - AppStore, 3 - GooglePlay e.t.c. Gog
  link: String, // gameLink

  devContact: mongoose.Mixed,
    // {
    // email: String,
    // steamId: String,
    // twitter: String,
    // discord: String,
  // },
  pubContact: mongoose.Mixed,
  release_date: mongoose.Mixed, // steam
  releaseDate: Date,
  // {
  //   coming_soon: Boolean,
  //     date: String,
  // }

  downloads: Number, // Mobiles
  reviews: Number
})
const ScrappedGameModel = mongoose.model("scrappedgames", ScrappedGameSchema)

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
  UserModel,
  ProjectModel,
  ScrappedGameModel,

  getServerConfigs,
  getCf
}