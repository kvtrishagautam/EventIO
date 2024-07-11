var express = require('express');
const { getHomePage } = require('../controllers/user');
const { getConductedEvents,getAttendedEvents,getCreateEvents,postCreateEvents } = require('../controllers/organizer');
var router = express.Router();
const checkAccCreated = require('../middlewares/checkAccCreated');

router.get('/',getHomePage);

router.get('/conducted-events', getConductedEvents);

router.get('/attended-events', getAttendedEvents);

router.get('/create-events',checkAccCreated, getCreateEvents);

router.post('/create-events', postCreateEvents);

module.exports = router;