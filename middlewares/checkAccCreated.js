module.exports = (req, res, next) => {
    console.log(req.session.userId);
    if (req.session.userAccCreated  === true) {
        next();
    } else {
        res.redirect('/profile-accinfo')
    }
}