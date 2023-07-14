const {ELASTIC_MAIL_API_KEY} = require("../CD/Configs");
const request = require('superagent').agent()


const sendMail = (to, html, subject) => {
  const FROM = 'info@www.indiemarketingtool.com'
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
        // "Merge": {
        //   "city": "New York",
        //   "age": "34"
        // },
        // "Attachments": [
        //   {
        //     "BinaryContent": "string",
        //     "Name": "string",
        //     "ContentType": "string",
        //     "Size": "100"
        //   }
        // ],
        // "Headers": {
        //   "city": "New York",
        //   "age": "34"
        // },
        "Postback": "string",
        "EnvelopeFrom": "indiemarketingtool",
        "From": FROM,
        "Subject": subject,
      }
    })
    .then(r => {
      console.log({r})
    })
    .catch(err => {
      console.error({err})
    })
    .finally(() => {
      console.log('did something?')
    })
}
const sendVerificationEmail = (email) => {
  sendMail(email, "<h1>Thank you for registration on indiemarketingtool.com</h1><br />Hope, you enjoy it", "Finish registration")
}

sendVerificationEmail("23i03g@mail.ru")

// var ElasticEmail = require('@elasticemail/elasticemail-client');
//
// var defaultClient = ElasticEmail.ApiClient.instance;
// // Configure API key authorization: apikey
// var apikey = defaultClient.authentications['apikey'];
// apikey.apiKey = "536531D72D92781B64F98C8268E37DD44AD85DFFF9DA4C319FB70E27DDD1449D9A8146A1C482A635D23FC03B153760FB"
// // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
// //apikey.apiKeyPrefix['X-ElasticEmail-ApiKey'] = "Token"
//
// var api = new ElasticEmail.EmailSend()
//
// var name = "name_example"; // {String} Name of Campaign to delete
// var callback = function(error, data, response) {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log('API called successfully.');
//   }
// };
//
// // api.campaignsByNameDelete(name, callback);
// api.emailsTransactionalPost(name, callback);