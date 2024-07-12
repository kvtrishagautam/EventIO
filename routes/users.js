var express = require('express');
var router = express.Router();
const {getHomePage , getDashboard,getProfileAcc,getEvents,getEventDetail,postEventDetail,postAccInfo,getCategory,getProfileAttendedEvents,getAccInfo,getProfileChangeEmail,getProfileChangePass,getskills,postSkills} = require('../controllers/user');
const checkLogedIn = require('../middlewares/checkLogedIn');
const { supabase } = require('../config/supabse');
const checkOrg = require('../middlewares/checkOrg');
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

router.get('/category',checkLogedIn,getCategory)

// POST routes 

router.post('/skills',checkLogedIn,checkAccCreated, postSkills);

router.post('/profile-accinfo', postAccInfo);

router.post('/event/:title/:id', postEventDetail );




module.exports = router;
