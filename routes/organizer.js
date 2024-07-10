var express = require('express');
var router = express.Router();
const {getOrganizerDash} = require('../controllers/organizer')

router.get('/dashboard',getOrganizerDash)


module.exports = router;