const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/User');
const password = require('../controllers/password');
const email = require('../controllers/email');

router.post('/signup', email, password, userCtrl.signup);
router.post('/login/', email, password, userCtrl.login);


module.exports = router;