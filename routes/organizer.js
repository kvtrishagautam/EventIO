var express = require('express');
const { getHomePage } = require('../controllers/user');
const { getConductedEvents } = require('../controllers/organizer');
var router = express.Router();

router.get('/',getHomePage);

router.get('/conducted-events', getConductedEvents);

module.exports = router;