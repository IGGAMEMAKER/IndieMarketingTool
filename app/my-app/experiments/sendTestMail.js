const {MY_MAIL, MAILCHIMP_API_KEY} = require("../CD/Configs");

const mailchimp = require("@mailchimp/mailchimp_transactional")(
  MAILCHIMP_API_KEY
);

const message = {
  from_email: "hello@example.com",
  subject: "Hello world",
  text: "Welcome to Mailchimp Transactional!",
  to: [
    {
      email: MY_MAIL,
      type: "to"
    }
  ]
};

async function run() {
  const response = await mailchimp.messages.send({
    message
  });
  console.log(response);
}
run();