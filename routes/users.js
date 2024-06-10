var express = require('express');
var router = express.Router();
const { supabase } = require('../config/supabse')

/* GET home page. */
router.get('/', function (req, res) {
    supabase.
    res.render('./user/home', { title: 'Home' });
});

router.get('/dashboard', (req, res) => {
  res.render('./user/home', { title: "Dashboard" })
});

router.get('/events', (req, res) => {
  res.render('./user/events', { title: 'Events' })
})

router.get('/profile-accinfo', (req, res) => {
  res.render('./user/profile/profile-accinfo.ejs', { title: 'Profile | Account Information' })
})

router.get('/profile-attendevents', (req, res) => {
  res.render('./user/profile/profile-accinfo.ejs', { title: 'Profile | Account Information' })
})

router.get('/profile-Change-Email', (res, req) => {
  res.render('./user/profile/profile-changeEmail.ejs', { title: 'Profile | Change Email Address' })
})

router.get('/profile-Change-Password', (req, res) => {
  res.render('./user/profile/profile-changePass.ejs', { title: 'profile | Change Password' })
})

router.get('/login', (req, res) => {
  res.render('./user/login.ejs', { title: 'Login' })
})

router.get('/signup', (req, res) => {
  res.render('./user/signup.ejs', { title: 'Signup' })
})


module.exports = router;
