var nodemailer = require('nodemailer');
const {MAILER_EMAIL, MAILER_PASS, MY_MAIL} = require("../CD/Configs");

// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: MAILER_EMAIL,
//     pass: MAILER_PASS
//   }
// });
var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "",
    pass: ""
  }
});

var mailOptions = {
  from: 'futureWSMail@gmail.com',
  to: MY_MAIL,
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});