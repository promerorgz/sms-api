const express = require('express')
const twilio = require('twilio');
const cron = require('node-cron');
const router = express.Router();



router.get('/', (_req, res) => {
  const people = process.env.NODE_ENV === 'development' ? [
    {
      name: 'Pablo',
      amount: 30,
      msg: 'TEST',
      number: '+13147240839'
    }
  ] : [
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
  const schedule = '0 30 9 23 * *'

  res.render('layouts/main', {
    currentMonth: month,
    schedule,
    content: 'Cron job running',
    people: people.map(person => person.name),
    nextJob: month + 1,
    helpers: {
      date(num){
      return months.reduce((acc, item,index) => {
        return {...acc, [index+ 1]: item}
      }, {})[num]
      },
      cronTranslate(string){
        const [sec, min, hr, day, _month, _dow] = string.split(' ');
        return `Running at ${hr}:${min}${sec !== '*' ? `:${sec}` : ', every second'}, on day ${day} of the month`
      
      }
    }
  })
  
  const client = twilio(accountSid, authToken);

  cron.schedule(schedule, function() {
    console.log('Sending messages')
    people.forEach(({name, amount, msg, number}) => {
      return client.messages.create({
        body: !number ? `No number for ${name}` : `📱 ${months[month].toUpperCase()} \n ${msg}: ${name} - $${amount}. \n ${venmoLink} `,
        from:twilioNumber,
        to:  number || '+13147240839',
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
})

module.exports = router