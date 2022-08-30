
require('dotenv').config() 
const twilio = require('twilio');
const cron = require('node-cron');

const people = [
  {
    name: 'Ivan',
    amount: 41,
    msg: 'T-mobile',
    number: '+13147240837'
  },
  {
    name: 'Victor',
    amount: 55,
    msg: 'T-mobile',
    number: '+13145701256'
  }

];

const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER
const venmoLink = process.env.VENMO_DEEP_LINK;
const month = new Date().getUTCMonth()


const client = twilio(accountSid, authToken);



cron.schedule('* * 10 23 *', function() {
  people.forEach(({name, amount, msg, number}) => {
    return client.messages.create({
      body: !number ? `No number for ${name}` : `📱 ${months[month].toUpperCase()} \n ${msg}: ${name} - $${amount}. \n ${venmoLink} `,
      from:twilioNumber,
      to:  '+13147240839',
    }).then((message) => {
      console.log({message})
      client.messages.create({
        body: `${msg} reminder sent to: ${name}  - ${message.dateUpdated.toUTCString()}`,
        from: twilioNumber,
        to:  '+13147240839',
      })
    }).catch(err => console.error(err))
  })
});