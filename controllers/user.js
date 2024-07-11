const { supabase } = require('../config/supabse')
const express = require('express');




module.exports = {
    getHomePage: (req, res) => {
        res.render('./user/home', { title: 'Home', loginStatus: req.session.userLoggedIn });
    },
    
    
    getDashboard: async (req, res) => {
        try {
            const { data: userDash, error } = await supabase
                .from('user_info')
                .select('f_name, l_name, phno, address, course, sem, skills')
                .eq('user_id', req.session.userId);
            const { data: userDashuser, error:errorDash } = await supabase
                .from('user')
                .select('email')
                .eq('user_id', req.session.userId);
            console.log(userDashuser)
             
            let { data: aEvents, error:aEventsErr } = await supabase
                .from('user_info')
                .select('a_events')
                .eq('user_id', req.session.userId);
            console.log( aEvents)

            let aResults = [];

            if(aEvents[0].a_events!=null){
                for (let value of aEvents[0].a_events) {
                    // console.log(value)
    
                    let { data: a_data, error } = await supabase
                        .from('event')
                        .select('event_id,title,desc,start_day,expired')
                        .eq('event_id', value);
    
                    // console.log(a_data)
                    if (error) {
                        console.error('Supabase search error:', error.message);
                        console.error('Supabase search details:', error.details);
                        console.error('Supabase search hint:', error.hint);
                    } else {
                        aResults.push(a_data);
                    }
            }
            
            }
            
            if (error) {
                throw error;
            }
            if (userDash && userDash.length > 0) {
                const userDashData = userDash[0];
                res.render('./user/profile/dashboard', {
                    title: 'Profile | Dashboard',
                    loginStatus: req.session.userLoggedIn,
                    userDashData: userDashData,
                    userDashuser: userDashuser[0],
                    a_events: aResults
                });
            }
           
            else {
                throw new Error('User data not found');
            }
            console.log(aResults)
        } 
        
        catch (error) {
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

    getskills: (req, res) => {
        res.render('./user/profile/skills.ejs', { title: 'profile | Skills',loginStatus: req.session.userLoggedIn })
    },
    
    
    postSkills:async(req, res) => {
        try {
            console.log(typeof req.body)
            console.log(req.body)
            console.log('hi')
            const { selectedSkills }= req.body;
            console.log('Selected Skills:', selectedSkills);

        // Fetch current user's skills from the database    
        let { data: user_info, error: fetchError } = await supabase
        .from('user_info')
        .select('skills')
        .eq('user_id', req.session.userId);
    // console.log(user_info[0].skills)

    if (fetchError) 
        {throw fetchError;}

    // Extract current skills or initialize as an empty array
    let currentSkills = user_info[0]?.skills || [];

        // Filter out duplicate skills from selectedSkills
        let uniqueSelectedSkills = selectedSkills.filter(skill => !currentSkills.includes(skill));

        // Add unique selected skills to the current skills array
        currentSkills.push(...uniqueSelectedSkills);
    console.log(currentSkills);


   // Update the skills field in the user_info table
   let { data: updatedUser, error: updateError } = await supabase
   .from('user_info')
   .update({ skills: currentSkills })
   .eq('user_id', req.session.userId);

if (updateError) {
   throw updateError;
}

console.log('Updated Skills:', currentSkills);
res.status(200).send('Skills updated successfully');


}
catch (err) {
    console.error('Error fetching specific column:', err.message);
    res.status(500).send('Internal Server Error');
}},


    getAccInfo: async (req, res) => {
        console.log(req.body);
        try {
            if (!req.session.userId) {
                return res.status(401).send('User not logged in');
            }
            const { data: cur_user, error } = await supabase
                .from('user')
                .select('username')
                .eq('user_id', req.session.userId);
            if (error) {
                throw error;     
            }
            if (cur_user && cur_user.length > 0) {
                let cur_userData = cur_user[0].username;
                console.log(cur_userData)
    
             
                res.render("./user/profile/profile-accinfo.ejs", {
                    title: "Profile | Account Information",
                    loginStatus: req.session.userLoggedIn,
                    cur_userData: cur_userData
                });
            } else {
                throw new Error('User data not found');
            
            }
        } catch (error) {
            console.error('Error fetching user data:', error.message);
            res.status(500).send('Error fetching user data');
        }
    },
    
      
      postAccInfo: async (req, res) => {
        try {
            const num = parseInt(req.body.phno);
            console.log(typeof num)
            console.log('Form data:', req.body); 
            const { data: postuser, error } = await supabase
                .from('user_info')
                .insert([
                    {
                        f_name: req.body.fname,
                        l_name: req.body.lname,
                        phno:num,
                        address: req.body.address,
                        course: req.body.course,
                        sem: (req.body.sem),
                        user_id: req.session.userId,
                    },
                ])
                .select();
                console.log(postuser);
              
            if (error) {
                console.error('Error inserting user info:', error.message);
                res.status(500).send('Error inserting user info');
            } else {
                console.log('Inserted user info:', postuser);
                res.redirect('/dashboard'); 
            }
        } catch (err) {
            console.error('Unexpected error:', err.message);
            res.status(500).send('Unexpected error');
        }
    },
    
};
    




  
  


 
  
  


 

