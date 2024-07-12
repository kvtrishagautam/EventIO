const { supabase } = require('../config/supabse')



module.exports = {
    getHomePage: async (req, res) => {
        console.log(req.session);

        let { data: skills, error } = await supabase
            .from('skills')
            .select('skill');


        res.render('./user/home', { title: 'Home', loginStatus: req.session.userLoggedIn, skills });
    },
    getDashboard: (req, res) => {
        res.render('./user/home', { title: "Dashboard", loginStatus: req.session.userLoggedIn })
    },
    getEvents: (req, res) => {
        res.render('./user/events', { title: 'Events', loginStatus: req.session.userLoggedIn })
    },
    getProfileAcc: (req, res) => {
        res.render('./user/profile/profile-accinfo.ejs', { title: 'Profile | Account Information', loginStatus: req.session.userLoggedIn })
    },
    getProfileAttendedEvents: (req, res) => {
        res.render('./user/profile/profile-accinfo.ejs', { title: 'Profile | Account Information', loginStatus: req.session.userLoggedIn })
    },
    getProfileChangePass: (req, res) => {
        res.render('./user/profile/profile-changePass.ejs', { title: 'Profile | Account Change Password', loginStatus: req.session.userLoggedIn })
    },
    getProfileChangeEmail: (req, res) => {
        res.render('./user/profile/profile-changePass.ejs', { title: 'profile | Change Password', loginStatus: req.session.userLoggedIn })
    },
    getCategory: async (req, res) => {
        console.log(req.query);

        let { data: user_info, error } = await supabase
            .from('user_info')
            .select("*")
            .contains('skills', [req.query.tag])
        console.log(user_info);
        

        res.render('./user/category.ejs', { title: 'Category', loginStatus: req.session.userLoggedIn ,skill: req.query.tag, user_info})
    },

}
