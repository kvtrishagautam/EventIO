var express = require('express');
const { getHomePage } = require('../controllers/user');
const { getConductedEvents,getAttendedEvents } = require('../controllers/organizer');
var router = express.Router();

router.get('/',getHomePage);

router.get('/conducted-events', getConductedEvents);

router.get('/attended-events', getAttendedEvents);


module.exports = router;