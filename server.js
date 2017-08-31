const express = require('express');
const bodyParser= require('body-parser');
const MongoClient = require('mongodb').MongoClient
const app = express();

const Secrets = require("./secrets.js")

// middlewares
app.use(bodyParser.urlencoded({extended: true}))

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
  res.sendFile(__dirname + '/index.html')
})


app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})
