const { supabase } = require('../config/supabse')
const express = require('express');




module.exports = {
    getHomePage: async (req, res) => {
        console.log(req.session);


        let { data: skills, error } = await supabase
            .from('skills')
            .select('skill');


        res.render('./user/home', { title: 'Home', loginStatus: req.session.userLoggedIn, skills });
    },


    getDashboard: async (req, res) => {
        try {
            const { data: userDash, error } = await supabase
                .from('user_info')
                .select('f_name, l_name, phno, address, course, sem, skills')
                .eq('user_id', req.session.userId);
            const { data: userDashuser, error: errorDash } = await supabase
                .from('user')
                .select('email')
                .eq('user_id', req.session.userId);
            console.log(userDashuser)

            let { data: aEvents, error: aEventsErr } = await supabase
                .from('user_info')
                .select('a_events')
                .eq('user_id', req.session.userId);

            let aResults = [];

            if (aEvents[0].a_events != null) {
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
                    a_events: aResults, loginStatus: req.session.userLoggedIn
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
                // .neq('user_id', 'f11ae58a-3e12-47d7-92aa-77bed087e5bb')
                .order('created_at', { ascending: false })
                .limit(6);

            console.log(event);

            if (error) {
                console.error('Supabase search error:', error.message);
                console.error('Supabase search details:', error.details);
                console.error('Supabase search hint:', error.hint);
                return res.status(500).send('Internal Server Error');
            }

            res.render('user/events', { title: 'Events', event, loginStatus: req.session.userLoggedIn, loginStatus: req.session.userLoggedIn });
        } catch (err) {
            console.error('Unexpected error:', err.message);
            return res.status(500).send('Internal Server Error');
        }
    },
    
    getEventDetail: async (req, res) => {
        try {
            console.log(req.params.id);

            // Fetch event details and user info concurrently
            const [eventResult, userInfoResult] = await Promise.all([
                supabase
                    .from('event')
                    .select('*')
                    .eq('event_id', req.params.id),
                supabase
                    .from('user_info')
                    .select('a_events')
            ]);

            // Destructure results
            const { data: event, error: eventError } = eventResult;
            const { data: user_info, error: userInfoError } = userInfoResult;

            // Handle errors
            if (eventError) {
                console.error('Supabase event fetch error:', eventError.message);
                return res.status(500).send('Internal Server Error');
            }
            if (userInfoError) {
                console.error('Supabase user_info fetch error:', userInfoError.message);
                return res.status(500).send('Internal Server Error');
            }

            // Log fetched data
            // console.log(user_info && user_info.length > 0 ? user_info[0].a_events : 'No user info found');

            // Check if user already registered for this event
            let attended = false;
            if (user_info && user_info.length > 0 && user_info[0].a_events != null) {
                attended = user_info[0].a_events.includes(req.params.id);
            }

            console.log(attended);

            // Render the event details page
            res.render('./user/event-details.ejs', { title: 'Event | ' + req.params.title, selectedEvent: event[0], attended, loginStatus: req.session.userLoggedIn, });
        } catch (err) {
            // Handle unexpected errors
            console.error('Unexpected error:', err.message);
            res.status(500).send('Internal Server Error');
        }
    },


    postEventDetail: async (req, res) => {
        const { eventId } = req.body;

        try {
            // Fetch user info
            const { data: user_info, error: fetchError } = await supabase
                .from('user_info')
                .select('a_events')
                .eq('user_id', '1fd3c2b2-86d9-4baa-8aa4-748432d209db')
                .single(); // Use .single() to get a single record directly

            if (fetchError) {
                console.error('Supabase fetch error:', fetchError.message);
                return res.status(500).json({ error: 'Failed to fetch user info' });
            }
            // Ensure user_info is not null
            const currentEvents = user_info.a_events ? user_info.a_events : [];
            const updatedEvents = [...currentEvents, eventId];

            // Update user info
            const { data: updatedData, error: updateError } = await supabase
                .from('user_info')
                .update({ a_events: updatedEvents })
                .eq('user_id', '1fd3c2b2-86d9-4baa-8aa4-748432d209db');

            if (updateError) {
                console.error('Supabase update error:', updateError.message);
                return res.status(500).json({ error: 'Failed to update user info' });
            }

            // Send success response
            res.json({ success: true });
        } catch (error) {
            // Handle unexpected errors
            console.error('Unexpected error confirming booking:', error.message);
            res.status(500).json({ error: 'Booking confirmation failed' });
        }
    },


    getProfileAttendedEvents: (req, res) => {
        res.render('./user/profile/profile-accinfo.ejs', { title: 'Profile | Account Information', loginStatus: req.session.userLoggedIn })
    },

    getProfileChangePass: (req, res) => {
        res.render('./user/profile/profile-changePass.ejs', { title: 'Profile | Account Change Password', loginStatus: req.session.userLoggedIn })
    },

    getProfileChangeEmail: (req, res) => {
        res.render('./user/profile/profile-changePass.ejs', { title: 'profile | Change Password', loginStatus: req.session.userLoggedIn })
    },

    getskills: async(req, res) => {
        try{
            let { data: skills, error } = await supabase
      .from('skills')
      .select('skill');
        
        if (error) {throw error};
        console.log('skills:' ,skills)
        res.render('./user/profile/skills.ejs', { title: 'profile | Skills',loginStatus: req.session.userLoggedIn ,skills: skills.map(skill => ({ name: skill.skill }))});
    }
    catch (error) {
        console.error('Error fetching skills:', error.message);
        res.status(500).send('Error fetching skills');
      }
    },


    postSkills: async (req, res) => {
        try {
            console.log(typeof req.body)
            console.log(req.body)
            console.log('hi')
            const { selectedSkills } = req.body;
            console.log('Selected Skills:', selectedSkills);

            // Fetch current user's skills from the database    
            let { data: user_info, error: fetchError } = await supabase
                .from('user_info')
                .select('skills')
                .eq('user_id', req.session.userId);
            // console.log(user_info[0].skills)

            if (fetchError) { throw fetchError; }

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
            // res.status(200).send('Skills updated successfully');
            res.redirect('dashboard')

        }
        catch (err) {
            console.error('Error fetching specific column:', err.message);
            res.status(500).send('Internal Server Error');
        }
    },


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
                    cur_userData: cur_userData,loginStatus: req.session.userLoggedIn
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
                        phno: num,
                        address: req.body.address,
                        course: req.body.course,
                        sem: (req.body.sem),
                        user_id: req.session.userId,
                    },
                ])
                .select();
                console.log('postuser:',postuser);
                
              
            if (error) {
                console.error('Error inserting user info:', error.message);
                res.status(500).send('Error inserting user info');
            } else {
                console.log('Inserted user info:', postuser);
                req.session.userAccCreated = true;
                console.log(req.session);
                res.redirect('/dashboard'); 
            }
        } catch (err) {
            console.error('Unexpected error:', err.message);
            res.status(500).send('Unexpected error');
        }
    },

    
    getProfileAttendedEvents: async (req, res) => {
        try {

            // Fetch the all a-event id from the table userinfo
            let { data: aEvents, error } = await supabase
                .from('user_info')
                .select('a_events,f_name')
                .eq('user_id', req.session.userId);

            if (error) {
                console.error('Supabase error:', error.message);
                console.error('Supabase details:', error.details);
                console.error('Supabase hint:', error.hint);
                res.status(500).send('Error fetching data');
                return;
            }

            // Array to store the results
            let aResults = [];
            let no_event;
            if (aEvents[0].a_events != null) {
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
            } else {
                no_event = true;
            }
            console.log(aResults);
            res.render('./user/profile/profile-attendedEvents', { title: 'Attended Events', a_events: aResults, no_event,loginStatus: req.session.userLoggedIn });
        } catch (err) {
            console.error('Error fetching specific column:', err.message);
            res.status(500).send('Internal Server Error');
        }

    },
    getCategory: async (req, res) => {
        

        console.log(req.query);
        console.log(re.query);                                                                      
        let { data: user_info, error } = await supabase
            .from('user_info')
            .select("*")
            .contains('skills', [req.query.tag])
        console.log(user_info);


        res.render('./user/category.ejs', { title: 'Category', loginStatus: req.session.userLoggedIn, skill: req.query.tag, user_info })
    },


};



















