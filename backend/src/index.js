const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('hello world')
})

app.get('/teste', (req, res) => {
  res.send('teste')
})

app.listen(3000)
