
require('dotenv').config() 
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER
console.log({twilioNumber})
const client = twilio(accountSid, authToken);
console.log({accountSid, authToken, process: process.env})

client.messages.create({
  body: 'Hello THERE. https://venmo.com/promerorgz',
  from:twilioNumber,
  to: '+13147240839',
}).then((message) => {
  console.log('MESSAGE SENT')
  console.log(message)
}).catch(err => console.error(err))