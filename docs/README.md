# how to make an express, mongo, react CRUD app

### setting up basic server

- `npm init`
	- this makes a new `package.json`
- `touch server.js`
	- placeholder file which will run our app
- `npm install express --save`
	- install express
- require and instantiate express in `server.js`
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
- run with `node server.js`

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

# cruD

- very similar to everything we've done so far.
- `app` has a `delete` method you can call.
- the `collection` object on `db` has a `findOneAndUpdate` method you can call like `db.collection('quotes').findOneAndDelete(` ...
- example `server.js`
```
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
```
- example `scripts.js`
```
var del = document.getElementById('delete')

del.addEventListener('click', function () {
  fetch('quotes', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'name': 'Darth Vader'
    })
  })
  .then(res => {
    if (res.ok) return res.json()
  }).
  then(data => {
    console.log(data)
    window.location.reload()
  })
})
```
- and a DOM element in `index.ejs` that looks like this:
```
<div>
  <h2>Delete Darth Vadar's first quote</h2>
  <button id="delete"> Delete first Darth Vadar quote </button>
</div>
```

# Adding webpack and react

- This was the hardest thing yet
- used this guide here: https://blog.hellojs.org/setting-up-your-react-es6-development-environment-with-webpack-express-and-babel-e2a53994ade
- that guide also comes with a gist: https://gist.github.com/dengjonathan/79eb3d5fc55b5b6dd2fbc434dce352da
- this took several steps
	- install react, babel, webpack dependencies
		- react is our library for react duh
		- babel transpiles jsx
		- webpack is a module bundler which takes all our js and combines it into bundle.js
	- split `server.js` into `app.js` + `server.js`
	- configure webpack
	- make a react component!

### install react, babel, webpack dependencies
```
npm install --save react
npm install --save react-dom

npm install --save-dev babel-core
npm install --save-dev babel-cli
npm install --save-dev babel-loader
npm install --save-dev babel-preset-es2015
npm install --save-dev babel-preset-react
npm install --save-dev react-hot-loader
npm install --save-dev webpack
npm install --save-dev webpack-dev-middleware
npm install --save-dev webpack-hot-middleware
```
### split `server.js` into `app.js` + `server.js`
- previously, `server.js` contained all our logic for
	- initing the express app
	- connecting to mongo
	- listening to port
	- initing middleware
	- route listeners + controller funcs
- And, importantly, to run our app, we ran `server.js`
- Now, we change it so `server.js` still does all those above things.
- However, we wrap the whole thing in a module, like:
```
module.exports = {
  app: function () {
  ...
  return app;
 }
}
```
- Then we require that func module in a new file, `app.js`, and `app.js` is the file we actually run.
- `app.js` does two things:
	- runs webpack
	- runs the `app` factory func in `server.js`
- it looks like this:
```
const express = require('express')
const Server = require('./server.js')

const app = Server.app()

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const config = require('../webpack.deployment.config.js')
  const compiler = webpack(config)


  app.use(webpackHotMiddleware(compiler))
  app.use(webpackDevMiddleware(compiler, {
    noInfo: false,
    publicPath: config.output.publicPath
  }))
}
```
- also, previously, `server.js` was just in the root on the repo. Importantly, now, `server.js` and `app.js` are both in `./dist/` directory

### configure webpack
- Several steps and not much interesting logic here, mainly just setting up config files.
- make `webpack.config.js` in root of project like this:
```
var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './app/index.js',
  output: {
    path: __dirname,
    filename: 'bundle.js',
    publicPath: '/app/assets/'
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        include: path.join(__dirname, 'app'),
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
};
```
- make `webpack.deployment.config.js` like:
```
const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',

  entry: [
    './app/index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  // plugins: [
  //   new webpack.optimize.UglifyJsPlugin({
  //     minimize: false,
  //     compress: {
  //       warnings: false
  //     }
  //   })
  // ],
  module: {
    loaders: [{
      test: /.jsx?$/,
      loader: 'babel-loader',
      include: path.join(__dirname, 'app'),
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'react']
      }
    }]
  },
};
```
- Note, I commented out the plugins because I don't want to minimize in development right now. In future interations, I'll make a `development` and `production` version which will handle this.

# make a react component!
- Now that everything is configured above, this is standard react stuff.
- In `index.ejs`, make a `root` element
```
<div id="root">
  <h1>hello world!</h1>
</div>
```
- make `./app/index.js`, and make a react component to target `root`
```
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
    render(){
        debugger;
        return(
            <div>
                <h1>Howdy from React!</h1>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
```
- include `index.js` as a script tag in `.index.ejs`
```
<script src="/dist/bundle.js"></script>
```
- Note here that we include `bundle.js` because that's what's made by webpack!

### run the app
- now that we've made these changes, we run it as
```
npm start
```

# still to do
- convert darth vader buttons to react
- add react router
- add redux


# Questions
- How to use webpack?
	- I can't use `import` without it?
	- **answer** see *Adding webpack and react* option above
- why do i include `dist/bundle.js` ... can't this just be `bundje.js` in the script tag, if everything is configured properly?
- Seems like `webpack.deployment.config.js` is only supposed to run in prod? Mine is also running in dev. How do I change this to have dev and prod configs?