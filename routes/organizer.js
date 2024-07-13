var express = require('express');
const { getHomePage } = require('../controllers/user');
const { getConductedEvents,checkOrganizerExist,postCreateEvents, getCreateEvents,toStudentMode,postOrganizer} = require('../controllers/organizer');
const checkOrg = require('../middlewares/checkOrg');
const checkLogedIn = require('../middlewares/checkLogedIn');
var router = express.Router();
const checkAccCreated = require('../middlewares/checkAccCreated');
const {getOrganizerDash} = require('../controllers/organizer');

router.get('/dashboard',checkLogedIn,getOrganizerDash)

router.get('/',getHomePage);

router.get('/conducted-events',checkLogedIn, getConductedEvents);

router.get('/check-org',checkLogedIn, checkOrganizerExist);

router.post('/check-org', postOrganizer);

router.get('/check-stud',checkLogedIn, toStudentMode);

router.get('/create-events',checkAccCreated, getCreateEvents);

router.post('/create-events',postCreateEvents);






module.exports = router;