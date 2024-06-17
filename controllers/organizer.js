const express = require('express');
const { supabase } = require('../config/supabse');
const router = require('../routes/organizer');

module.exports = {
    getConductedEvents: async (req, res) => {
        try {
            // Fetch the all c-event id from the table userinfo
            let { data: cEvents, error } = await supabase
                .from('user_info') 
                .select('c_events');

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

                        cResults.push( c_data );
                    }
                }
            }
            console.log(cResults)
            res.render('./organizer/conductedEvents', { title: 'Conducted Events', c_events : cResults  });
        } catch (err) {
            console.error('Error fetching specific column:', err.message);
            res.status(500).send('Internal Server Error');
        }
    },

    getAttendedEvents: async(req, res) => {
        try {
            // Fetch the all c-event id from the table userinfo
            let { data: aEvents, error } = await supabase
                .from('user_info') 
                .select('a_events');

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
                let { a_events: arrayofAE } = item;
                for (let value of arrayofAE) {

                    let { data: a_data, error } = await supabase
                        .from('event')
                        .select('event_id,title,desc,start_day,expired')

                        .eq('event_id', value);

                    if (error) {
                        console.error('Supabase search error:', error.message);
                        console.error('Supabase search details:', error.details);
                        console.error('Supabase search hint:', error.hint);
                    } else {

                        aResults.push( a_data );
                    }
                }
            }
            console.log(aResults)
            res.render('./organizer/attendedEvents', { title: 'Attended Events', a_events : aResults  });
        } catch (err) {
            console.error('Error fetching specific column:', err.message);
            res.status(500).send('Internal Server Error');
        }
        },
}