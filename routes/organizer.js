var express = require('express');
var router = express.Router();


router.get("/create-event",(req,res)=>{
    res.render('organizer/create-event',{title : 'Create Event' ,sub : 'subdfgd'})
})






module.exports = router;