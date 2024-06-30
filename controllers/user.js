const { supabase } = require('../config/supabse')



module.exports = {
    getHomePage: (req, res) => {
        // supabase.
        res.render('./user/home', { title: 'Home' });
    },

    getDashboard: (req, res) => {
        res.render('./user/home', { title: "Dashboard" })
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

            res.render('user/events', { title: 'Events', event });
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
            res.render('./user/event-details.ejs', { title: 'Event | ' + req.params.title, selectedEvent: event[0], attended });
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
            res.json({ success: true, updatedData });
        } catch (error) {
            // Handle unexpected errors
            console.error('Unexpected error confirming booking:', error.message);
            res.status(500).json({ error: 'Booking confirmation failed' });
        }
    },
    

    getProfileAcc: (req, res) => {
        res.render('./user/profile/profile-accinfo.ejs', { title: 'Profile | Account Information' })
    },

    getProfileAttendedEvents: (req, res) => {
        res.render('./user/profile/profile-accinfo.ejs', { title: 'Profile | Account Information' })
    },

    getProfileChangePass: (req, res) => {
        res.render('./user/profile/profile-changePass.ejs', { title: 'Profile | Account Change Password' })
    },

    getProfileChangeEmail: (req, res) => {
        res.render('./user/profile/profile-changePass.ejs', { title: 'profile | Change Password' })
    },


}
