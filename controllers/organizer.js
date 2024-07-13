const express = require('express');
const { supabase } = require('../config/supabse');
const router = require('../routes/organizer');
module.exports = {
    getConductedEvents: async (req, res) => {
        try {
            console.log(req.session.orgId);
            // Fetch the all a-event id from the table userinfo
            let { data: cEvents, error } = await supabase
                .from('user_info')
                .select('c_events')
                .eq('org_id', req.session.orgId);


            if (error) {
                console.error('Supabase error:', error.message);
                console.error('Supabase details:', error.details);
                console.error('Supabase hint:', error.hint);
                res.status(500).send('Error fetching data');
                return;
            }

            // Array to store the results
            let cResults = [];
            let no_event;

            if (cEvents[0].c_events != null) {
                cEvents[0].c_events.reverse();

                for (let value of cEvents[0].c_events) {

                    let { data: c_data, error } = await supabase
                        .from('event')
                        .select('event_id,title,desc,start_day,expired,status')
                        .eq('event_id', value)


                    if (error) {
                        console.error('Supabase search error:', error.message);
                        console.error('Supabase search details:', error.details);
                        console.error('Supabase search hint:', error.hint);
                    } else {
                        cResults.push(c_data);
                    }
                }
            } else {
                no_event = true;
            }
            console.log(cResults);
            res.render('./organizer/conductedEvents', { title: 'Conducted Events', c_events: cResults, no_event, loginStatus: req.session.userLoggedIn });
        } catch (err) {
            console.error('Error fetching specific column:', err.message);
            res.status(500).send('Internal Server Error');
        }

    },
    toStudentMode: async (req, res) => {
        const { data: role, error1 } = await supabase
            .from('user')
            .update([
                { role: 'student' },
            ])
            .eq('user_id', req.session.userId)
            .select()

        if (role == null) {
            res.status(200).json({ success: false, error1 })
        } else {
            res.json({ success: true })
        }
    },
    checkOrganizerExist: async (req, res) => {
        const userId = req.session.userId;

        if (req.session.userLoggedIn) {
            const { data, error } = await supabase
                .from('organizer')
                .select('org_id')
                .eq('user_id', userId)
                .single();
            console.log(data);

            if (data != null) {
                req.session.orgId = data.org_id;
                const { data: role, error1 } = await supabase
                .from('user')
                .update([
                    { role: 'org' },
                ])
                .eq('user_id', req.session.userId)
                .select()
            }

            if (data == null) {
                res.status(200).json({ success: true, is_org: false, login: true })
            } else {
                res.status(200).json({ success: true, login: true, is_org: true })
            }
        } else {
            res.json({ success: false, login: false })
        }
    },

    getCreateEvents: (req, res) => {
        res.render('./organizer/create-events', { title: "Create Event", loginStatus: req.session.userLoggedIn })
    },

    postCreateEvents: async (req, res) => {

        let { data, error } = await supabase
            .from('event')
            .insert([
                {
                    title: req.body.title, desc: req.body.desc,
                    venue: req.body.venue, start_time: req.body.start_time,
                    end_time: req.body.end_time,
                    start_day: req.body.start_day, end_day: req.body.end_day,
                    org_id: req.session.orgId, status: 'pending',user_id: req.session.userId
                }
            ]);


        let { data: event, error1 } = await supabase
            .from('event')
            .select('created_at,event_id')
            .order('created_at', { ascending: false })
            .limit(1);
        console.log(event[0].event_id)


        let { data: user_info, error3 } = await supabase
            .from('user_info')
            .select('c_events')
            .eq('org_id', req.session.orgId);
        // console.log(user_info[0].c_events)
        console.log(user_info[0]);

       if(user_info[0] !=null) {
        const updatedEvents = [...(user_info[0].c_events || []), event[0].event_id];
        console.log(updatedEvents)

        let { data: updatedC_events, error4 } = await supabase
            .from('user_info')
            .update({ c_events: updatedEvents })
            .eq('org_id', req.session.orgId);


        if (error4) {
            console.error('Supabase error:', error.message);
            console.error('Supabase details:', error.details);
            console.error('Supabase hint:', error.hint);
            res.status(500).send('Error inserting data');
        }}else {
            // Insert new event list for the user
            let eventId=event[0].event_id;
            const newEvents = [eventId];

            const { data: newevent, error: insertError } = await supabase
                .from('user_info')
                .insert([
                    { org_id: req.session.orgId, c_events: newEvents }
                ])
                .eq('user_id', req.session.userId)
                .select();

            if (insertError) {
                console.error('Supabase insert error:', insertError.message);
                return res.status(500).json({ error: 'Failed to insert new events' });
            }

            console.log(newevent);
        }
        if (error) {
            console.error('Supabase error:', error.message);
            console.error('Supabase details:', error.details);
            console.error('Supabase hint:', error.hint);
            res.status(500).send('Error inserting data');
        } else {
            res.redirect('/organizer/conducted-events');

        }
    },
    getOrganizerDash: (req, res) => {
        res.render('./organizer/dashboard', { title: 'Dashboard', loginStatus: req.session.userLoggedIn });
    },

    postOrganizer: async (req, res) => {
        const { value } = req.body;
        try {

            const { data, error } = await supabase
                .from('organizer')
                .insert([
                    { org_name: value, user_id: req.session.userId },
                ])
                .select();

                console.log('33333333333');
                console.log(data);
                console.log(data[0].org_id);

                const { data: org, error1 } = await supabase
                .from('user_info')
                .update([
                  { org_id: data[0].org_id }
                ])
                .eq('user_id', req.session.userId);

            const { data: role, error2 } = await supabase
                .from('user')
                .update([
                    { role: 'org' },
                ])
                .eq('user_id', req.session.userId)
                .select()

            req.session.orgId = data[0].org_id;


            console.log(value, data[0].org_id, error1);
            if (error) {
                return res.status(500).json({ success: false, error: 'Error inserting data' });
            }

            return res.status(200).json({ success: true, message: 'Data successfully inserted', data });

        } catch (error) {
            return res.status(500).json({ success: false, error: 'Unexpected error' });
        }
    }

};

