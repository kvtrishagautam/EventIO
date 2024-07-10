const { supabase } = require('../config/supabse');
const express = require('express');
const app = express();
const nodemailer = require('nodemailer')
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

},
  logedinUser: async (req, res) => {
    let { data: user, error } = await supabase
      .from('user')
      .select("*").eq("email", req.body.email).eq("password", req.body.password)
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
  getforpass: (req, res) => {
    res.render('./authentication/forgot-password.ejs');
  },

  postforpass: async (req, res) => {
    const { email } = req.body;

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in Supabase
    const { user, error } = await supabase
      .from('user')
      .update({ otp: otp })
      .eq('email', email);
    console.log(user);

    if (error) {
      return res.status(500).send('Error storing OTP');
    }

    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.body.email,
      subject: 'Password Reset OTP',
      text: `Your OTP is ${otp}`
    };

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Email sent: ' + info.response);
      res.redirect(`/auth/enter-otp?email=${email}`);
    });
  },

  getOtp: (req, res) => {
    const { email } = req.query;
    res.render('./authentication/enter-otp', { email });
  },

  postVerifyOtp: async (req, res) => {
    const { otp, email } = req.body;
    console.log(req.body);


    // Verify OTP
    const { data: user, error } = await supabase
      .from('user')
      .select('otp')
      .eq('email', email)
      .single();

    if (error) {
      return res.status(500).send('Error retrieving OTP');
    }

    if (user.otp == parseInt(otp)) {
      res.redirect(`/auth/reset-password?email=${email}`);
    } else {
      res.send('Invalid OTP.');
    }
  },

  getResetpass: (req, res) => {
    const { email } = req.query;
    res.render('./authentication/reset-pass', { email });
  },

  postResetPass: async (req, res) => {
    const { newPassword, confirmPassword, email } = req.body;

    // Update password in Supabase
    const { error } = await supabase
      .from('user')
      .update({ password: newPassword, otp: null })
      .eq('email', email);

    if (error) {
      return res.status(500).send('Error resetting password');
    }

    res.send('Password reset successfully.');
  },
}

