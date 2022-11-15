
require('dotenv').config() 
const express = require('express');
const { engine } = require('express-handlebars');
const app = express();
const port = 3000;
const schedule = require('./routes/schedule');
process.env.NODE_ENV = 'development'


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use('/', schedule);

app.listen(port , () => {
  console.log('Listening on port', port)
  console.log('env', process.env.NODE_ENV)
})