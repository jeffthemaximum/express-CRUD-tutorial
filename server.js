const express = require('express');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient
const app = express();

const Secrets = require("./secrets.js")

// middlewares
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')

// Mongo
var db

MongoClient.connect(Secrets.dbUrl, (err, database) => {
  if (err) return console.log(err)
  db = database
  // init server
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})

app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    console.log(result)
    res.render('index.ejs', {quotes: result})
  })
})

app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})
