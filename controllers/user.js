const { supabase } = require('../config/supabse')



module.exports = {
    getHomePage: (req, res) => {
        console.log(req.session);
        res.render('./user/home', { title: 'Home', loginStatus: req.session.userLoggedIn });
    },
    getDashboard: (req, res) => {
        res.render('./user/home', { title: "Dashboard",loginStatus: req.session.userLoggedIn })
    },
    getEvents: (req, res) => {
        res.render('./user/events', { title: 'Events',loginStatus: req.session.userLoggedIn })
    },
    getProfileAcc: (req, res) => {
        res.render('./user/profile/profile-accinfo.ejs', { title: 'Profile | Account Information',loginStatus: req.session.userLoggedIn })
    },
    getProfileAttendedEvents: (req, res) => {
        res.render('./user/profile/profile-accinfo.ejs', { title: 'Profile | Account Information',loginStatus: req.session.userLoggedIn })
    },
    getProfileChangePass: (req, res) => {
        res.render('./user/profile/profile-changePass.ejs', { title: 'Profile | Account Change Password',loginStatus: req.session.userLoggedIn })
    },
    getProfileChangeEmail: (req, res) => {
        res.render('./user/profile/profile-changePass.ejs', { title: 'profile | Change Password',loginStatus: req.session.userLoggedIn })
    },
    

}
