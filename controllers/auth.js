const express = require('express');
const { supabase } = require('../config/supabse');
const app = express();
// var router = express.Router();

let errMsg = ''


// let otp = ''


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
                { email: req.body.email, password: req.body.password, username: req.body.username },
            ])
            .select()
        // console.log(req.body);
        // console.log(data);

        return res.redirect('/auth/login')

        console.log(data, error);
    },
    logedinUser: async (req, res) => {
        let { data: user, error } = await supabase
            .from('user')
            .select("*").eq("username", req.body.username).eq("password", req.body.password)
        if (!user[0]) {
            errMsg = 'user not found'
            res.redirect('/auth/login')
        } else {
            req.session.userId = user[0].user_id;
            req.session.userLoggedIn = true;
            console.log(req.session);
            res.redirect('/');
            console.log(user);
        }
    },
    logoutUser: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                return console.log(err);
            }
            res.redirect('/');
        })
    },
}

