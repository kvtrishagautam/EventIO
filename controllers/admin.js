const { closeDelimiter } = require('ejs');
const { supabase } = require('../config/supabse')

module.exports = {
    getAdminDash: (req, res) => {
        res.render('./admin/dashboard', { title: 'Admin | Dashboard', loginStatus: req.session.userLoggedIn });
    },
    getSkillPage: (req, res) => {
        res.render('./admin/addskill', { title: 'Admin | Add Skills', loginStatus: req.session.userLoggedIn });
    },
    getNotification: async (req, res) => {

        let { data: event_status, error } = await supabase
            .from('event')
            .select('event_id')
            .eq('status', 'pending')


        if (error) {
            console.error('Supabase error:', error.message);
            console.error('Supabase details:', error.details);
            console.error('Supabase hint:', error.hint);
            res.status(500).send('Error fetching data');
            return;
        }
        // Array to store the results
        let sResults = [];
        let no_event;

        if (event_status != null) {
            event_status.reverse();

            for (let value of event_status) {

                let { data: s_data, error } = await supabase
                    .from('event')
                    .select('event_id,title,desc,start_day,expired,status')
                    .eq('event_id', value.event_id)


                if (error) {
                    console.error('Supabase search error:', error.message);
                    console.error('Supabase search details:', error.details);
                    console.error('Supabase search hint:', error.hint);
                } else {
                    sResults.push(s_data);
                    no_event=false;
                }
            }
        } else {
            no_event = true;
        }
        console.log(sResults);

        res.render('./admin/notification', { title: 'Admin | Notification', loginStatus: req.session.userLoggedIn, s_events: sResults ,no_event});
    },
    setPendingEvents: async (req, res) => {
        const { value,action } = req.body;
        
        console.log(value);
        console.log(action);
    
        try {
           
            const { data: approved_event, error } = await supabase
            .from('event')
            .update({ status: action })
            .eq('event_id', value)
            .select();

        if (error) {
            console.error('Error approving event:', error);
            return res.status(500).json({ success: false, message: 'Error approving event', error });
           }
            return res.status(200).json({ success: true, message: 'Event approved successfully' });
        } catch (err) {
            console.error('Unexpected error:', err);
            return res.status(500).json({ success: false, message: 'Unexpected error', error: err.message });
        }
    },

    getManageEvents: (req, res) => {
        res.render('./admin/manageevents', { title: 'Admin | Notification', loginStatus: req.session.userLoggedIn });
    },

    viewEvent: async(req,res)=>{

        try {
            const { data: event, error } = await supabase
                .from('event')
                .select('*')
                .eq('event_id', req.params.id)
                .single();
                console.log(event);
    
            if (error) {
                return res.status(404).json({ error: 'Event not found' });
            }
            res.render('./admin/eventdetails.ejs', { title: 'Event | ' + req.params.title, loginStatus: req.session.userLoggedIn,selectedEvent: event });

        } catch (err) {
            res.status(500).json({ error: 'Internal server error' });
        }
        
    }
    
}