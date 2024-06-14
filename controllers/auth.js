const { supabase } = require('../config/supabse');
const express = require('express');
const session = require('express-session');
const app = express();

let errMsg = ''

// let otp = ''





app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

module.exports = {
    getLogin: (req, res) => {
        res.render('./authentication/login.ejs', { title: 'Login', errMsg })
        errMsg = ''
    },
    getSignup: (req, res) => {
        res.render('./authentication/signup.ejs', { title: 'Signup' })
    },

    signedUpUser: async (req, res) => {
        const { data, error } = await supabase
            .from('user')
            .insert([
                { email: req.body.email, password: req.body.password },
            ])
            .select()

        console.log(data, error);
        // console.log(req.body);
    },
    logedinUser: async (req, res) => {
        let { data: user, error } = await supabase
            .from('user')
            .select("*").eq("email", req.body.username).eq("password", req.body.password)
        if (!user[0]) {
            errMsg = 'user not found'
            res.redirect('/auth/login')
        } else {
            req.session.userLogedin = user.id;
            res.redirect('/')
        }
    }
}

