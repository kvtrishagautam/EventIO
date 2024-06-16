const { supabase } = require('../config/supabse')

module.exports = {
    getConductedEvents: (req,res)=>{
        
        res.render('./organizer/conductedEvents',{title: 'Conducted Events', })
    }
}