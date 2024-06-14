var express = require('express');
var router = express.Router();
const { supabase } = require('../config/supabse')
const { getLogin,getSignup,logedinUser,signedUpUser } = require('../controllers/auth')

router.get('/signup', getSignup )

router.get('/login',getLogin)

router.post('/signup', signedUpUser)

router.post('/login', logedinUser)

module.exports = router;


