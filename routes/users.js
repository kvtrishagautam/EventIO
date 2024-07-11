var express = require('express');
var router = express.Router();
const { getHomePage, getDashboard, getEvents, getAccInfo,postAccInfo, getProfileAttendedEvents, getProfileChangeEmail, getProfileChangePass,getCategory,getEventDetail} = require('../controllers/user');
const checkLogedIn = require('../middlewares/checkLogedIn');
const { supabase } = require('../config/supabse')


/* GET home page. */
router.get('/', getHomePage);

router.get('/dashboard',checkLogedIn, getDashboard);

router.get('/events', checkLogedIn, getEvents)

router.get('/event/:title/:id', getEventDetail );


router.get('/profile-attendevents', getProfileAttendedEvents)

router.get('/profile-Change-Email', getProfileChangeEmail);

router.get('/profile-Change-Password',getProfileChangePass);

router.get('/profile-accinfo',checkLogedIn,getAccInfo);

// POST routes 

router.post('/profile-accinfo', postAccInfo);



router.get('/category',getCategory)

module.exports = router;
