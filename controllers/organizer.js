const { supabase } = require('../config/supabse')

module.exports={
    getOrganizerDash: (req, res) => {
        res.render('./organizer/dashboard', { title: 'Dashboard', loginStatus: req.session.userLoggedIn });
    },
}