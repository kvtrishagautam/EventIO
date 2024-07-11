var express = require('express');
var router = express.Router();
const { supabase } = require('../config/supabse')
const { getLogin,getSignup,logedinUser,signedUpUser,logoutUser,getforpass,postforpass,postResetPass,postVerifyOtp,getOtp,getResetpass} = require('../controllers/auth');
const checkLogedIn = require('../middlewares/checkLogedIn');

router.get('/signup', getSignup )

router.get('/login',getLogin)

router.post('/signup', signedUpUser)

router.post('/login', logedinUser)

router.get('/logout', logoutUser)

router.get('/forgot-password',getforpass)

router.post('/forgot-password',postforpass)

router.post('/verify-otp', postVerifyOtp)

router.get('/reset-password',getResetpass)
router.post('/reset-password',postResetPass)

router.get('/enter-otp',getOtp)

module.exports = router;


