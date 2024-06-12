var express = require('express');
var router = express.Router();
const { supabase } = require('../config/supabse')

router.get('./signup',(req,res)=>{
    res.render('./authentication/signup.ejs',{title: 'SignUp page'})
})

router.get('./login',(req,res)=>{
    res.render('./authentication/login.ejs',{title: 'Login page'})
})

