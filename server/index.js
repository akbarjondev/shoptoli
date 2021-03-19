const express = require('express')
const config = require('./src/config/config')
const server = require('./src/server')

const app = server.run(express)

app.listen(config.PORT, () => console.log(`server ready at http://localhost:${config.PORT} 🚀`))
