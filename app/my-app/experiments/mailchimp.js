const mailchimp = require("@mailchimp/mailchimp_marketing");
const {MAILCHIMP_API_SERVER_PREFIX} = require("../CD/Configs");
const {MAILCHIMP_API_KEY} = require("../CD/Configs");

mailchimp.setConfig({
  apiKey: MAILCHIMP_API_KEY,
  server: MAILCHIMP_API_SERVER_PREFIX,
});

async function run() {
  const response = await mailchimp.ping.get();
  console.log(response);
}

run();