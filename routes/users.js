var express = require('express');
var router = express.Router();
const {getHomePage , getDashboard,getEvents,getProfileAcc,getProfileAttendedEvents,getProfileChangeEmail,getProfileChangePass} = require('../controllers/user');
const checkLogedIn = require('../middlewares/checkLogedIn');


/* GET home page. */
router.get('/', getHomePage );

router.get('/dashboard', getDashboard );

router.get('/events', checkLogedIn, getEvents )

router.get('/profile-accinfo', getProfileAcc)

router.get('/profile-attendevents', getProfileAttendedEvents )

router.get('/profile-Change-Email', getProfileChangeEmail)

router.get('/profile-Change-Password',getProfileChangePass)

module.exports = router;
