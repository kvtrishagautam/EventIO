var express = require('express');
var router = express.Router();
const {getHomePage , getDashboard,getEvents,getProfileAcc,getProfileAttendedEvents,getProfileChangeEmail,getProfileChangePass} = require('../controllers/user');
const checkLogedIn = require('../middlewares/checkLogedIn');


/* GET home page. */
router.get('/',getHomePage );

router.get('/dashboard',checkLogedIn, getDashboard );

router.get('/events',checkLogedIn, getEvents )

router.get('/profile-accinfo',checkLogedIn, getProfileAcc)

router.get('/profile-attendevents',checkLogedIn, getProfileAttendedEvents )

router.get('/profile-Change-Email',checkLogedIn, getProfileChangeEmail)

router.get('/profile-Change-Password',checkLogedIn,getProfileChangePass)

module.exports = router;
