const path = require('path')
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const Secrets = require("../secrets.js")
const port = (process.env.PORT || 8080)
const bodyParser= require('body-parser');
let db;

module.exports = {
  app: function () {
    const app = express();
    const publicPath = express.static(path.join(__dirname, '../dist'));

    MongoClient.connect(Secrets.dbUrl, (err, database) => {
      if (err) return console.log(err)
      db = database
      // init server
      app.listen(port, () => {
        console.log('listening on ' + port)
      })
    });

    app.use(bodyParser.urlencoded({extended: true}))
    app.use(express.static('public'))
    app.use(bodyParser.json())

    app.set('view engine', 'ejs')

    app.use('/dist', publicPath);
    
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

    app.put('/quotes', (req, res) => {
      const query = {
        name: 'emily'
      }

      const update = {
        $set : {
          name: req.body.name,
          quote: req.body.quote
        }
      }

      const options = {
        sort: {_id: -1},
        upsert: true
      }

      const callback = (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      }

      // Handle put request
      db.collection('quotes').findOneAndUpdate(
        query,
        update,
        options,
        callback
      )
    })

    app.delete('/quotes', (req, res) => {

      const query = {
        name: req.body.name
      }
      
      const callback = (err, result) => {
        if (err) return res.send(500, err)
        res.send({message: 'A darth vadar quote got deleted'})
      }

      db.collection('quotes').findOneAndDelete(
        query,
        callback
      )
    })

    return app;
  }
}