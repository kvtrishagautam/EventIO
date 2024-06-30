const express = require('express');
const { supabase } = require('../config/supabse');
const router = require('../routes/organizer');

module.exports = {
    getConductedEvents: async (req, res) => {
        try {
            // Fetch the all c-event id from the table userinfo
            let { data: cEvents, error } = await supabase
                .from('user_info')
                .select('c_events')
                .eq('user_id', '1fd3c2b2-86d9-4baa-8aa4-748432d209db');

            if (error) {
                console.error('Supabase error:', error.message);
                console.error('Supabase details:', error.details);
                console.error('Supabase hint:', error.hint);
                res.status(500).send('Error fetching data');
                return;
            }

            // Array to store the results
            let cResults = [];

            // Loop through all c_events data and find matching values in event table
            for (let item of cEvents) {
                let { c_events: arrayofCE } = item;
                for (let value of arrayofCE) {

                    let { data: c_data, error } = await supabase
                        .from('event')
                        .select('event_id,title,desc,start_day,expired')

                        .eq('event_id', value);

                    if (error) {
                        console.error('Supabase search error:', error.message);
                        console.error('Supabase search details:', error.details);
                        console.error('Supabase search hint:', error.hint);
                    } else {
                        cResults.push(c_data);
                    }
                }
            }
            console.log(cResults)
            res.render('./organizer/conductedEvents', { title: 'Conducted Events', c_events: cResults });
        } catch (err) {
            console.error('Error fetching specific column:', err.message);
            res.status(500).send('Internal Server Error');
        }
    },

    getAttendedEvents: async (req, res) => {
        try {

            // Fetch the all c-event id from the table userinfo
            let { data: aEvents, error } = await supabase
                .from('user_info')
                .select('a_events')
                .eq('user_id', '1fd3c2b2-86d9-4baa-8aa4-748432d209db');
            console.log('hello')
            console.log(aEvents)
            if (error) {
                console.error('Supabase error:', error.message);
                console.error('Supabase details:', error.details);
                console.error('Supabase hint:', error.hint);
                res.status(500).send('Error fetching data');
                return;
            }

            // Array to store the results
            let aResults = [];

            // Loop through all c_events data and find matching values in event table
            for (let item of aEvents) {
                console.log(aEvents)
                let { a_events: arrayofAE } = item;
                console.log(arrayofAE)
                for (let value of arrayofAE) {
                    console.log(value)

                    let { data: a_data, error } = await supabase
                        .from('event')
                        .select('event_id,title,desc,start_day,expired')
                        .eq('event_id', value);

                    console.log(a_data)
                    if (error) {
                        console.error('Supabase search error:', error.message);
                        console.error('Supabase search details:', error.details);
                        console.error('Supabase search hint:', error.hint);
                    } else {
                        aResults.push(a_data);
                    }
                }
            }
            // console.log(aResults)
            res.render('./organizer/attendedEvents', { title: 'Attended Events', a_events: aResults });
        } catch (err) {
            console.error('Error fetching specific column:', err.message);
            res.status(500).send('Internal Server Error');
        }
    },

    getCreateEvents: async (req, res) => {
        res.render('./organizer/create-events', { title: 'Create Events' });

    },

    postCreateEvents: async (req, res) => {

        let { data, error } = await supabase
            .from('event')
            .insert([
                { title: req.body.title, desc: req.body.desc, venue: req.body.venue, start_time: req.body.start_time, end_time: req.body.end_time, start_day: req.body.start_day, end_day: req.body.end_day, org_id: 'f11ae58a-3e12-47d7-92aa-77bed087e5bb' }
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
            .eq('org_id', 'f11ae58a-3e12-47d7-92aa-77bed087e5bb');
        // console.log(user_info[0].c_events)


        const updatedEvents = [...user_info[0].c_events || [], event[0].event_id];
        console.log(updatedEvents)

        let { data: updatedC_events, error4 } = await supabase
            .from('user_info')
            .update({ c_events: updatedEvents })
            .eq('org_id', 'f11ae58a-3e12-47d7-92aa-77bed087e5bb')

        if (error4) {
            console.error('Supabase error:', error.message);
            console.error('Supabase details:', error.details);
            console.error('Supabase hint:', error.hint);
            res.status(500).send('Error inserting data');
        }
        if (error) {
            console.error('Supabase error:', error.message);
            console.error('Supabase details:', error.details);
            console.error('Supabase hint:', error.hint);
            res.status(500).send('Error inserting data');
        } else {
            res.send('Data inserted successfully');
        }
    },

}