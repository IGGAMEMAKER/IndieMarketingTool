//batchSend.js
var SibApiV3Sdk = require('sib-api-v3-sdk');
const {MY_MAIL} = require("../CD/Configs");
const {BREVO_KEY} = require("../CD/Configs");
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = BREVO_KEY;

new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({
  "sender":{ "email":"sendinblue@sendinblue.com", "name":"Sendinblue"},
  "subject":"This is my default subject line",
  "htmlContent":"<!DOCTYPE html><html><body><h1>My First Heading</h1><p>My first paragraph.</p></body></html>",
  "params":{
    "greeting":"This is the default greeting",
    "headline":"This is the default headline"
  },
  "messageVersions":[
    //Definition for Message Version 1
    {
      "to":[
        {
          "email":MY_MAIL,
          "name":"Bob Anderson"
        }
      ],
      "htmlContent":"<!DOCTYPE html><html><body><h1>Modified header!</h1><p>This is still a paragraph</p></body></html>",
      "subject":"We are happy to be working with you"
    }
  ]

}).then(function(data) {
  console.log({data});
}, function(error) {
  console.error(error);
});