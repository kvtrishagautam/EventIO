var express = require('express');
var router = express.Router();
const {getAdminDash,getManageEvents,getNotification,getSkillPage,postNotification,createSkill,deleteSkill,setPendingEvents,viewEvent}= require('../controllers/admin')

router.get('/dashboard',getAdminDash);

router.get('/addskills',getSkillPage);

router.get('/notification',getNotification);

router.get('/manageEvents',getManageEvents);

router.post('/notification',setPendingEvents);

router.get('/events/:title/:id', viewEvent );



router.post('/events/:eventId',postNotification);
router.post('/skills',createSkill);

router.delete('/skills/:id',deleteSkill);


module.exports = router;
