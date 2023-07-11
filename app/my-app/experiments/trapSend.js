const {MY_MAIL, MAILTRAP_KEY} = require("../CD/Configs");
const { MailtrapClient } = require("mailtrap");

const TOKEN = MAILTRAP_KEY;
const ENDPOINT = "https://send.api.mailtrap.io/";

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

const sender = {
  email: "mailtrap@www.indiemarketingtool.com",
  name: "Mailtrap Test",
};

const recipients = [
  {
    email: MY_MAIL,
  }
];

client
  .send({
    from: sender,
    to: recipients,
    subject: "You are awesome!",
    text: "Congrats for sending test email with Mailtrap!",
    category: "Integration Test",
  })
  .then(console.log, console.error);