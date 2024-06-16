
module.exports = (req, res, next) => {
    if(req.session.userLoggedIn === true){
        next()
    }else{
        res.redirect('/auth/login')
    }
}