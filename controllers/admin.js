const { supabase } = require('../config/supabse')

module.exports={
    getAdminDash: (req, res) => {
        res.render('./admin/dashboard', { title: 'Admin | Dashboard', loginStatus: req.session.userLoggedIn });
    }, 
    getSkillPage: (req,res) =>{
        res.render('./admin/addskill',{title: 'Admin | Add Skills',loginStatus: req.session.userLoggedIn});
    },
    getNotification: (req,res) =>{
        res.render('./admin/notification',{title: 'Admin | Notification',loginStatus: req.session.userLoggedIn});
    },
    getManageEvents: (req,res) =>{
        res.render('./admin/manageevents',{title: 'Admin | Notification',loginStatus: req.session.userLoggedIn});
    },

}