const { response } = require('express');
const { supabase } = require('../config/supabse')
 
module.exports = async (req, res, next) => {
  const userId = req.session.userId;

  try {
    if (req.session.userLoggedIn) {
      const { data, error } = await supabase
        .from('user_info')
        .select('org_id')
        .eq('user_id', userId)
        .single();

      console.log(data);

      if (data == null) {
        res.status(200).json({ success: true, is_org : false , login : true })
      } else {
        res.status(200).json({ success: true, login : true, is_org : true })
      }
    }else{
      res.json({success: false, login : false })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, error: 'Unexpected error' });
  }
};
