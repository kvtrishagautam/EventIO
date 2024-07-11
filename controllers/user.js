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

            res.render('user/events', { title: 'Events', event, loginStatus: req.session.userLoggedIn });
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


    getProfileAcc: (req, res) => {
        res.render('./user/profile/profile-accinfo.ejs', { title: 'Profile | Account Information', loginStatus: req.session.userLoggedIn })
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
                {
                    f_name: req.body.fname,
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
        console.log(data, error);

    },
    postOrganizer: async (req, res) => {
        const { value } = req.body;
        try {

            const { data, error } = await supabase
                .from('organizer')
                .insert([
                    { org_name: value, user_id: req.session.userId },
                ])
                .select()

            const { data: role, error1 } = await supabase
                .from('user')
                .update([
                    { role: 'org' },
                ])
                .eq('user_id', req.session.userId)
                .select()

            req.session.orgId = data[0].org_id;


            console.log(value, data[0].org_id, error);
            if (error) {
                return res.status(500).json({ success: false, error: 'Error inserting data' });
            }

            return res.status(200).json({ success: true, message: 'Data successfully inserted', data });

        } catch (error) {
            return res.status(500).json({ success: false, error: 'Unexpected error' });
        }
    },
    getAttendedEvents: async (req, res) => {
        try {

            // Fetch the all a-event id from the table userinfo
            let { data: aEvents, error } = await supabase
                .from('user_info')
                .select('a_events,f_name')
                .eq('user_id', req.session.userId);
            
            console.log(aEvents[0].a_events)
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
            if (aEvents[0].a_events!= null) {
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
            }else{
                no_event = true;
            }
            console.log(aResults);
            res.render('./profile/profile-attendedEvents', { title: 'Attended Events', a_events: aResults,no_event });
        } catch (err) {
            console.error('Error fetching specific column:', err.message);
            res.status(500).send('Internal Server Error');
        }

    },


};













