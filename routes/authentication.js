var express = require('express');
var router = express.Router();
const { supabase } = require('../config/supabse')
const { getLogin,getSignup,logedinUser,signedUpUser,logoutUser } = require('../controllers/auth');
const checkLogedIn = require('../middlewares/checkLogedIn');

router.get('/signup', getSignup )

router.get('/login',getLogin)

router.post('/signup', signedUpUser)

router.post('/login', logedinUser)

router.get('/logout', logoutUser)

module.exports = router;


