const { supabase } = require('../config/supabse')
const express = require('express');




module.exports = {
  getHomePage: (req, res) => {
    // supabase.
    res.render("./user/home", { title: "Home" });
  },
  getDashboard: (req, res) => {
    res.render("./user/home", { title: "Dashboard" });
  },
  getEvents: (req, res) => {
    res.render("./user/events", { title: "Events" });
  },

  getProfileAttendedEvents: (req, res) => {
    res.render("./user/profile/profile-accinfo.ejs", {
      title: "Profile | Account Information",
    });
  },
  getProfileChangePass: (req, res) => {
    res.render("./user/profile/profile-changePass.ejs", {
      title: "Profile | Account Change Password",
    });
  },
  getProfileChangeEmail: (req, res) => {
    res.render("./user/profile/profile-changePass.ejs", {
      title: "profile | Change Password",
    });
  },

  getAccInfo: (req, res) => {
    res.render("./user/profile/profile-accinfo.ejs", {
      title: "Profile | Account Information",
    });
  },

  postAccInfo: async (req, res) => {
    
const { data, error } = await supabase
.from('user_info')
.insert([
  { f_name: req.body.fname,
    l_name: req.body.lname,
    phno: req.body.phno,
    address: req.body.address,
    course: req.body.course,
    sem: req.body.sem, 
    user_id: req.session.userId,
},
])
.select()
        
    console.log(req.body);
    console.log(data,error);
    // if(!data[0]){
    //     res.redirect
    // }
  },
};
