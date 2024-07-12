const { supabase } = require('../config/supabse');
const express = require('express');
const app = express();
const nodemailer = require('nodemailer')
// var router = express.Router();

let errMsg = ''


// let otp = ''



module.exports = {
  getLogin: (req, res) => {
    errMsg = ''
    res.render('./authentication/login.ejs', { title: 'Login', errMsg })
  },
  getSignup: (req, res) => {
    res.render('./authentication/signup.ejs', { title: 'Signup' })
  },

  signedUpUser: async (req, res) => {
    const { data, error } = await supabase
      .from('user')
      .insert([
        { email: req.body.email, password: req.body.password, username: req.body.username, role: "student" },
      ])
      .select()


    // console.log(req.body);
    // console.log(data);


    return res.redirect('/auth/login')

  },
  logedinUser: async (req, res) => {
    try {
      // Fetch user details from Supabase based on email
      let { data: users, error } = await supabase
        .from('user')
        .select('*')
        .eq('email', req.body.email)
        .single();

      if (error) {
        throw error;
      }

      // Check if user exists and verify password
      if (!users || users.password !== req.body.password) {
        // User not found or password doesn't match
        errMsg = 'user not found'
        return res.redirect('/auth/login');
      }

      // Set session variables for logged in user
      req.session.userId = users.user_id; // Assuming user_id is the primary key or unique identifier
      req.session.userLoggedIn = true;

      // Redirect based on user role
      if (users.role == 'admin') {
        res.redirect('/admin/dashboard');
      } else if (users.role == 'org') {
        // Retrieve user_info from Supabase
        console.log(req.session.userId);
        let { data: user_info, error } = await supabase
          .from('user_info')
          .select('org_id')
          .eq('user_id', req.session.userId)
          .single();
        console.log(user_info);
        console.log(user_info.org_id);

        req.session.orgId = user_info.org_id;
        console.log(req.session.orgId);

        res.redirect('/organizer/conducted-events')
        // Check for errors in the query
        if (error) {
          console.error('Error retrieving user info:', error);
          res.status(500).send('Error retrieving user info');
          return;
        }
      } else {
        res.redirect('/')
      }
    } catch (error) {
      console.error('Error logging in:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  logoutUser: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return console.log(err);
      }
      res.redirect('/auth/login');
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

    res.redirect('/auth/login');
  },
}