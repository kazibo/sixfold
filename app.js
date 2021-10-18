var express = require('express');
const flightsRouter = require('./routes/flights.routes')
const config = require('config')
const PORT = config.get('port')

var app = express()
app.use('/api', flightsRouter)

app.listen(PORT, console.log(`Server started on port ${PORT}`))