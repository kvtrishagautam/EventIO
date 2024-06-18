var express = require('express');
var router = express.Router();
const {getHomePage , getDashboard,getEvents,postAccInfo,getProfileAttendedEvents,getAccInfo,getProfileChangeEmail,getProfileChangePass,} = require('../controllers/user');
const checkLogedIn = require('../middlewares/checkLogedIn');
const { supabase } = require('../config/supabse')


/* GET home page. */
router.get('/', getHomePage );

router.get('/dashboard', getDashboard );

router.get('/events', checkLogedIn, getEvents )



router.get('/profile-attendevents', getProfileAttendedEvents )

router.get('/profile-Change-Email', getProfileChangeEmail)

router.get('/profile-Change-Password',getProfileChangePass)



router.get('/profile-accinfo', checkLogedIn,getAccInfo)

router.post('/profile-accinfo', postAccInfo)

module.exports = router;
