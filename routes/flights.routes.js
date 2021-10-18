const Router = require('express')
const router = new Router
const flightsController = require('../controller/flights.controller')

router.get('/find_flights', flightsController.getRoute)

module.exports = router