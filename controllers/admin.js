const { closeDelimiter } = require('ejs');
const { supabase } = require('../config/supabse')

module.exports = {
    getAdminDash: (req, res) => {
        res.render('./admin/dashboard', { title: 'Admin | Dashboard', loginStatus: req.session.userLoggedIn });
    }, 
    getSkillPage: async(req,res) =>{
        const { data: skills, error } = await supabase
        .from('skills')
        .select('*');

    if (error) {
        console.error('Error fetching skills:', error);
        return res.status(500).json({ error: 'Failed to fetch skills' });
    }
        res.render('./admin/addskill',{title: 'Admin | Add Skills',loginStatus: req.session.userLoggedIn,skills});
    },
    getNotification: async (req, res) => {
        const { data, error } = await supabase
            .from('event')
            .select('*')
            .eq('status', 'Pending');
    
        if (error) {
            return res.status(500).json({ error: error.message });
        }
    
        res.render('./admin/notifications', { events: data,title:'Admin | Notifications',loginStatus: req.session.userLoggedIn });
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
    postNotification: (req,res) =>{
        res.render('./admin/notification',{title: 'Admin | Notification',loginStatus: req.session.userLoggedIn});
    },
    createSkill: async (req, res) => {
        const { skillName } = req.body;
    
        // Check if the skill already exists
        const { data: existingSkills, error: fetchError } = await supabase
            .from('skills')
            .select('skill')
            .eq('skill', skillName);
    
        if (fetchError) {
            console.error('Error checking existing skills:', fetchError);
            return res.status(500).json({ error: 'Failed to check existing skills' });
        }
    
        if (existingSkills.length > 0) {
            return res.status(400).json({ error: 'Skill already exists' });
        }
    
        const { data, error } = await supabase
            .from('skills')
            .insert([{ skill: skillName }]);
    
        if (error) {
            console.error('Error adding skill:', error);
            return res.status(500).json({ error: 'Failed to add skill' });
        }
    
        res.redirect('/admin/addskills');
    },
    deleteSkill:async (req, res) => {
        const { id } = req.params;
    
        try {
            const { error } = await supabase
                .from('skills')
                .delete()
                .eq('skill_id', id);
    
            if (error) {
                console.error('Error deleting skill:', error);
                return res.status(500).json({ success: false, message: 'Failed to delete skill' });
            }
    
            res.json({ success: true });
        } catch (error) {
            console.error('Unexpected error deleting skill:', error);
            res.status(500).json({ success: false, message: 'An unexpected error occurred' });
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