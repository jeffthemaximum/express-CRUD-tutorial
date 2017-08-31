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