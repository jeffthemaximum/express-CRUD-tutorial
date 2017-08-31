# req

- setup bodyParser
```
const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended: true}))
```

- `req.body`
  - form params

# res

- `res.send`
- `res.sendFile`

- setup ejs
```
app.set('view engine', 'ejs')
```

- `res.render(file, locals)`
  - file -> `index.ejs`
  - locals -> `{quotes: [Array]}`

# app

### config
- `app.use`
- `app.set`
- `app.listen`

### verbs
- `app.get`
- `app.post`