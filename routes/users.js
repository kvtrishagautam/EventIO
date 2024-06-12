var express = require('express');
var router = express.Router();
const { supabase } = require('../config/supabse')
const {getHomePage , getDashboard,getEvents,getProfileAcc,getProfileAttendedEvents,getProfileChangeEmail,getProfileChangePass,loginUser,signupUser} = require('../controllers/user')


/* GET home page. */
router.get('/',getHomePage );

router.get('/dashboard',getDashboard );

router.get('/events', getEvents )

router.get('/profile-accinfo', getProfileAcc)

router.get('/profile-attendevents', getProfileAttendedEvents )

router.get('/profile-Change-Email', getProfileChangeEmail)

router.get('/profile-Change-Password',getProfileChangePass)

router.get('/login', loginUser)

router.get('/signup', signupUser)


module.exports = router;
