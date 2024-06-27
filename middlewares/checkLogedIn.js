
module.exports = (req, res, next) => {
    console.log(req.session.userId);
    if (req.session.userLoggedIn === true) {
        next();
    } else {
        res.redirect('/auth/login')
    }
}