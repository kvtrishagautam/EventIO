const { supabase } = require('../config/supabse')
const express = require('express');




module.exports = {
    getHomePage: (req, res) => {
        console.log(req.session);
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
    getEvents: async (req, res) => {
        try {
            let { data: event, error } = await supabase
                .from('event')
                .select('event_id,title,desc,start_day,expired')
                // .neq('org_id', 'f11ae58a-3e12-47d7-92aa-77bed087e5bb')
                .order('created_at', { ascending: false })
                .limit(6);

            console.log(event);

            if (error) {
                console.error('Supabase search error:', error.message);
                console.error('Supabase search details:', error.details);
                console.error('Supabase search hint:', error.hint);
                return res.status(500).send('Internal Server Error');
            }

            res.render('user/events', { title: 'Events', event,loginStatus: req.session.userLoggedIn  });
        } catch (err) {
            console.error('Unexpected error:', err.message);
            return res.status(500).send('Internal Server Error');
        }
    },




    getEventDetail: async(req, res) => {
        // console.log(req.params);
        console.log(req.params.id);
        let { data: event, error } = await supabase
            .from('event')
            .select('*')
            .eq('event_id', req.params.id)
        console.log(event);
        res.render('./user/event-details.ejs', { title: 'Event | ' + req.params.title, selectedEvent : event[0]})
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
  
    




  
  


 

