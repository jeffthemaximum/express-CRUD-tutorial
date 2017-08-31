# connect

```
const MongoClient = require('mongodb').MongoClient

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
```

# db methods

- `db.collection`

### collection methods

- `db.collection('quotes').find()`
- `db.collection('quotes').save(req.body, (err, result) => { (res stuff) } )`

### find methods

- `db.collection('quotes').find().toArray((err, result) => { (stuff with res and result ) } )`