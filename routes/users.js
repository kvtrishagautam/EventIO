var express = require('express');
var router = express.Router();
const {getHomePage , getDashboard,getEvents,postAccInfo,getProfileAttendedEvents,getAccInfo,getProfileChangeEmail,getProfileChangePass,getEventDetail,getskills,postSkills} = require('../controllers/user');
const checkLogedIn = require('../middlewares/checkLogedIn');
const { supabase } = require('../config/supabse');
const checkAccCreated = require('../middlewares/checkAccCreated');


/* GET home page. */
router.get('/', getHomePage);

router.get('/dashboard',checkLogedIn,checkAccCreated, getDashboard);

router.get('/events', checkLogedIn, getEvents)

router.get('/event/:title/:id', getEventDetail );


router.get('/profile-attendevents',checkAccCreated,  getProfileAttendedEvents)

router.get('/profile-Change-Email',checkAccCreated,  getProfileChangeEmail);

router.get('/profile-Change-Password',checkAccCreated, getProfileChangePass);

router.get('/profile-accinfo',checkLogedIn,getAccInfo);

router.get('/skills',checkLogedIn,checkAccCreated,getskills);


// POST routes 

router.post('/skills',checkLogedIn,checkAccCreated, postSkills);

router.post('/profile-accinfo', postAccInfo);

module.exports = router;
