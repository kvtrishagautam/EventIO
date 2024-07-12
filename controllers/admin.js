const { supabase } = require('../config/supabse')

module.exports={
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
    getManageEvents: (req,res) =>{
        res.render('./admin/manageevents',{title: 'Admin | Notification',loginStatus: req.session.userLoggedIn});
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
}