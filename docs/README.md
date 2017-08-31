# how to make an express CRUD app

### setting up basic server

- `npm init`
	- this makes a new `package.json`
- `touch server.js`
	- what does server.js do?
- `npm install express --save`
	- install express
- require and instantiate express
```
const express = require('express');
const app = express();
```
- create a server that users can connect to
```
app.listen(3000, function() {
  console.log('listening on 3000')
})
```

### cRud

- in Express, we handle GET requests by calling the `get` method on the express `app` object:
```
app.get(path, callback)
```
- the second arg here, `callback`, takes two arguments, `req` and `res`. This will usually look like this:

```
app.get('/', (req, res) => {
  app.send("hello world!")
})
```

- to return an html file
	- use `res.sendFile`
	- example:
```
app.get('/', (req, res) {
	res.sendFile(__dirname + '/index.html')
})
```
	- note: `__dirname` is the location of `server.js`, i think.

# restart server automatically
- nodedemon
```
npm install nodemon --save-dev
```
### package.json scripts
- we can use this to run nodemon
```
"scripts": {
  "dev": "nodemon server.js"
}
```
- now we run our app with `npm run dev`

# Crud
### handling POST requests
- `post` is a method on the `app` object, just like `get`
- Add a form to `index.html` like
```
<form action="/quotes" method="POST">
  <input type="text" placeholder="name" name="name">
  <input type="text" placeholder="quote" name="quote">
  <button type="submit">Submit</button>
</form>
```
- add a POST route to `server.js` like
```
app.post('/quotes', (req, res) => {
  console.log(req.body)
})
```
- express doesn't have built in form param handling. So we add middleware, which is `bodyParser` with
```
npm install body-parser --save
```
- We add `bodyParser` to `server.js` with
```
const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
```
- `app.use` is how we bring middleware into Express.

### Mongo!
- install mongo
	- `npm install mongodb --save`
- import the client
	- `const MongoClient = require('mongodb').MongoClient`
- setup a mongolab db
	- do that in web browser
	- get the db url from mongolab
- connect to the db with the mongo client in `server.js`
```
var db

MongoClient.connect('your-mongodb-url', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})
```
- make db global so you can access it in any route.
- this also inits the express server from within the clients `connect` method.

### use mongo to C
- `collections` seem to be the mongo equivalent of a SQL table
- make/connect to a collection when user submits the form with `db.collection('quotes')`. Save an entry to it with `db.collection('quotes').save(data, (err, result) => {})
- example:
```
app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})
```

# add static files

- use express middleware `use` method to register static folder
```
app.use(express.static('public'))
```

- make a `static` folder at root of application
- make `static/scripts.js`
- add some js in there
- add it to `index.ejs` with:
```
<script src="scripts.js"></script>
```

# crUd

- use a `PUT` request to update
- register a listener on app with the `put` method like `app.put('/quotes', (req, res) => {`...
- make a btn in `index.ejs` thats clickable
```
<div>
  <h2>Replace last quote written by Master Yoda with a quote written by Darth Vadar</h2>
  <button id="update"> Darth Vadar invades! </button>
</div>
```
- register an event listener on that button inb `scripts.js`
```
var update = document.getElementById('update')

update.addEventListener('click', function () {
  // Send PUT Request here
  fetch('quotes', {
    method: 'put',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      'name': 'Darth Vader',
      'quote': 'I find your lack of faith disturbing.'
    })
  })
  .then(res => {
    if (res.ok) return res.json()
  })
  .then(data => {
    console.log(data)
    window.location.reload(true)
  })
})
```
- update `app.put("/quotes"...` to look like:
```
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
```
- the `collection` object has the `findOneAndUpdate` method that can be called on it, that takes for args: `query, update, options, callback`
- `query` is how you find your object
- `update` has update operators you can use. So far I just know `$set`, which is how you want to update the found record.
- `options` in this case does two things:
  - `sort` is how you want the results sorted. I sort by reverse id's here.
  - `upsert` is what happens if the record isn't found. `true` here means we insert a new record if one isn't found.
- `callback` is what to do when `findOneAndUpdate` is done.


# Questions
- How to use webpack?
	- I can't use `import` without it?