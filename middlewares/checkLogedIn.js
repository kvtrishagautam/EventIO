module.exports = (req,res,next)=>{
    if(req.session.userLog){
        next()
    }
    else{
        res.redirect('/auth/login');
    }
}