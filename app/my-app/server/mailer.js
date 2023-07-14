const {ELASTIC_MAIL_API_KEY, MY_MAIL} = require("../CD/Configs");
const request = require('superagent').agent()

var domain = 'http://www.indiemarketingtool.com'
var siteName = "indiemarketingtool.com"
const FROM = 'info@www.indiemarketingtool.com'

const sendMail = (to, subject, html) => {
  request.post('https://api.elasticemail.com/v4/emails/transactional')
    .set('X-ElasticEmail-ApiKey', ELASTIC_MAIL_API_KEY)
    .send({
      "Recipients": {
        "To": [to],
      },
      "Content": {
        "Body": [
          {
            "ContentType": "HTML",
            "Content": html,
            "Charset": "string"
          }
        ],
        "Postback": "string",
        "EnvelopeFrom": FROM,
        "From": FROM,
        "Subject": subject,
      }
    })
    .then(r => {
      // console.log({r})
    })
    .catch(err => {
      console.error({err})
    })
    .finally(() => {
      console.log('sent?')
    })
}

const sendVerificationEmail = (email, verificationLink) => {
  sendMail(
    email,
    "Verify your account",
    `To start creating new games & apps, verify your account
      <br />
      <br />
      <a href="${domain}/api/users/verify?user=${email}&link=${verificationLink}">Finish verification</a>
    `
  )
}

const sendVerificationSuccess = (email) => {
  sendMail(email, "Congratulations! Let's innovate together!",
    `<h1>Thank you for registration on ${siteName}</h1>
        <br />
        Hope, you enjoy it
    `)
}

const sendResetPasswordEmail = (email, newPassword) => {
  sendMail(
    email,
    "Reset password",
    `<h2>Your password on ${siteName} was reset</h2>
        <br />
        <br />
        Your new password is: <b>${newPassword}</b>
    `
  )
}

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendVerificationSuccess
}