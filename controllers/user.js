const { supabase } = require('../config/supabse')
const express = require('express');




module.exports = {
    getHomePage: (req, res) => {
        res.render('./user/home', { title: 'Home', loginStatus: req.session.userLoggedIn });
    },
    getDashboard: async (req, res) => {
      try {
          const { data, error } = await supabase
              .from('user_info')
              .select('f_name, l_name, phno, address, course, skills')
              .eq('user_id', '1fd3c2b2-86d9-4baa-8aa4-748432d209db'); 
  
          if (error) {
              throw error;
          }
  
          if (data && data.length > 0) {
            const userData = data[0]; 
  
       res.render('./user/profile/dashboard', {
                      title: 'Profile | Dashboard',
                      loginStatus: req.session.userLoggedIn,
                      userData: userData,
                  });
              } else {
                  throw new Error('User data not found');
              }
          } catch (error) {
              console.error('Error fetching user data:', error.message);
              res.status(500).send('Error fetching user data');
          }
      },
    getEvents: (req, res) => {
        res.render('./user/events', { title: 'Events',loginStatus: req.session.userLoggedIn })
    },
    getProfileAcc: (req, res) => {
        res.render('./user/profile/profile-accinfo.ejs', { title: 'Profile | Account Information',loginStatus: req.session.userLoggedIn })
    },
    getProfileAttendedEvents: (req, res) => {
        res.render('./user/profile/profile-accinfo.ejs', { title: 'Profile | Account Information',loginStatus: req.session.userLoggedIn })
    },
    getProfileChangePass: (req, res) => {
        res.render('./user/profile/profile-changePass.ejs', { title: 'Profile | Account Change Password',loginStatus: req.session.userLoggedIn })
    },
    getProfileChangeEmail: (req, res) => {
        res.render('./user/profile/profile-changePass.ejs', { title: 'profile | Change Password',loginStatus: req.session.userLoggedIn })
    },
    getAccInfo: (req, res) => {
      res.render("./user/profile/profile-accinfo.ejs", {
        title: "Profile | Account Information",
        loginStatus: req.session.userLoggedIn,
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
         
        },
      };
  
    



  
  


 

