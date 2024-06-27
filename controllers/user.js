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
