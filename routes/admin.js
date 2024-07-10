var express = require('express');
var router = express.Router();
const {getAdminDash,getManageEvents,getNotification,getSkillPage}= require('../controllers/admin')

router.get('/dashboard',getAdminDash);
router.get('/addskills',getSkillPage);
router.get('/notification',getNotification);
router.get('/manageEvents',getManageEvents);




module.exports = router;
