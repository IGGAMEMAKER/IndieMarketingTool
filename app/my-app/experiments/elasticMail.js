// const {ELASTIC_MAIL_API_KEY, MY_MAIL} = require("../CD/Configs");
// const request = require('superagent').agent()
//
//
// const sendMail = (to, html, subject) => {
//   const FROM = 'info@www.indiemarketingtool.com'
//   request.post('https://api.elasticemail.com/v4/emails/transactional')
//     .set('X-ElasticEmail-ApiKey', ELASTIC_MAIL_API_KEY)
//     .send({
//       "Recipients": {
//         "To": [to],
//       },
//       "Content": {
//         "Body": [
//           {
//             "ContentType": "HTML",
//             "Content": html,
//             "Charset": "string"
//           }
//         ],
//         // "Merge": {
//         //   "city": "New York",
//         //   "age": "34"
//         // },
//         // "Attachments": [
//         //   {
//         //     "BinaryContent": "string",
//         //     "Name": "string",
//         //     "ContentType": "string",
//         //     "Size": "100"
//         //   }
//         // ],
//         // "Headers": {
//         //   "city": "New York",
//         //   "age": "34"
//         // },
//         "Postback": "string",
//         "EnvelopeFrom": "indiemarketingtool",
//         "From": FROM,
//         "Subject": subject,
//       }
//     })
//     .then(r => {
//       console.log({r})
//     })
//     .catch(err => {
//       console.error({err})
//     })
//     .finally(() => {
//       console.log('did something?')
//     })
// }
// const sendVerificationEmail = (email) => {
//   sendMail(email, "<h1>Thank you for registration on indiemarketingtool.com</h1><br />Hope, you enjoy it", "Finish registration")
// }
//
// sendVerificationEmail(MY_MAIL)

const {MY_MAIL} = require("../CD/Configs");
const {sendVerificationSuccess} = require("../server/mailer");

sendVerificationSuccess(MY_MAIL)