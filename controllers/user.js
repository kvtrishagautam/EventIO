module.exports={
    getHomePage: (req, res) => {
        // supabase.
        res.render('./user/home', { title: 'Home' });
    },
    getDashboard : (req, res) => {
        res.render('./user/home', { title: "Dashboard" })
    },
    getEvents : (req, res) => {
        res.render('./user/events', { title: 'Events' })
    },
    getProfileAcc : (req, res) => {
        res.render('./user/profile/profile-accinfo.ejs', { title: 'Profile | Account Information' })
    },
    getProfileAttendedEvents: (req, res) => {
        res.render('./user/profile/profile-accinfo.ejs', { title: 'Profile | Account Information' })
      },
    getProfileChangePass : (req,res) => {
        res.render('./user/profile/profile-changePass.ejs',{ title : 'Profile | Account Change Password'})
    },
    getProfileChangeEmail:  (req, res) => {
        res.render('./user/profile/profile-changePass.ejs', { title: 'profile | Change Password' })
    },
    loginUser: (req, res) => {
        res.render('./user/login.ejs', { title: 'Login' })
    },
    signupUser : (req, res) => {
        res.render('./user/signup.ejs', { title: 'Signup' })
    },
}
