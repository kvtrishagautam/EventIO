var express = require('express');
var router = express.Router();
const {getAdminDash,getManageEvents,getNotification,getSkillPage,setPendingEvents,viewEvent}= require('../controllers/admin')

router.get('/dashboard',getAdminDash);

router.get('/addskills',getSkillPage);

router.get('/notification',getNotification);

router.get('/manageEvents',getManageEvents);

router.post('/notification',setPendingEvents);

router.get('/events/:title/:id', viewEvent );





module.exports = router;
