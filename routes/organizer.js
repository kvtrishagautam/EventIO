var express = require('express');
const { getHomePage } = require('../controllers/user');
const { getConductedEvents,checkOrganizerExist,postCreateEvents, getCreateEvents } = require('../controllers/organizer');
const checkOrg = require('../middlewares/checkOrg');
const checkLogedIn = require('../middlewares/checkLogedIn');
var router = express.Router();

router.get('/',getHomePage);

router.get('/conducted-events', getConductedEvents);

router.get('/check-org', checkOrganizerExist);

router.get('/create-events', getCreateEvents);

router.post('/create-events', postCreateEvents);


module.exports = router;