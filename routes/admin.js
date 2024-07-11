var express = require('express');
var router = express.Router();
const {getAdminDash,getManageEvents,getNotification,getSkillPage,postNotification,createSkill,deleteSkill}= require('../controllers/admin')

router.get('/dashboard',getAdminDash);
router.get('/addskills',getSkillPage);
router.get('/notification',getNotification);
router.get('/manageEvents',getManageEvents);


router.post('/events/:eventId',postNotification);
router.post('/skills',createSkill);

router.delete('/skills/:id',deleteSkill);


module.exports = router;
