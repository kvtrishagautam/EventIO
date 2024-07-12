var express = require('express');
const { getHomePage } = require('../controllers/user');
const { getConductedEvents,checkOrganizerExist,postCreateEvents, getCreateEvents,toStudentMode,postOrganizer} = require('../controllers/organizer');
const checkOrg = require('../middlewares/checkOrg');
const checkLogedIn = require('../middlewares/checkLogedIn');
var router = express.Router();
const checkAccCreated = require('../middlewares/checkAccCreated');
const {getOrganizerDash} = require('../controllers/organizer')

router.get('/dashboard',getOrganizerDash)

router.get('/',getHomePage);

router.get('/conducted-events', getConductedEvents);

router.get('/check-org', checkOrganizerExist);

router.post('/check-org', postOrganizer);

router.get('/check-stud', toStudentMode);

router.get('/create-events', getCreateEvents);

router.post('/create-events', postCreateEvents);






module.exports = router;