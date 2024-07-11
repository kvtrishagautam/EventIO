var express = require('express');
var router = express.Router();
const {getHomePage , getDashboard,getProfileAcc,getEvents,getEventDetail,postEventDetail,postAccInfo,getCategory,getProfileAttendedEvents,getAccInfo,getProfileChangeEmail,getProfileChangePass,getskills,postSkills} = require('../controllers/user');
const checkLogedIn = require('../middlewares/checkLogedIn');
const { supabase } = require('../config/supabse');
const checkOrg = require('../middlewares/checkOrg');


/* GET home page. */
router.get('/', getHomePage);

router.get('/dashboard',checkLogedIn, getDashboard);

router.get('/events', checkLogedIn, getEvents)

router.get('/event/:title/:id', getEventDetail );

router.get('/profile-accinfo', getProfileAcc);

router.get('/profile-Change-Email', getProfileChangeEmail);

router.get('/profile-Change-Password',getProfileChangePass);

router.get('/profile-accinfo',checkLogedIn,getAccInfo);

router.get('/skills',checkLogedIn,getskills);

router.get('/profile-attended-events', getProfileAttendedEvents); 

router.get('/category',checkLogedIn,getCategory)

// POST routes 

router.post('/skills',checkLogedIn,postSkills);

router.post('/profile-accinfo', postAccInfo);

router.post('/event/:title/:id', postEventDetail );




module.exports = router;
