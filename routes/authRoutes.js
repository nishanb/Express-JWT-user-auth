var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');

/*
 * REGISTER
 */
router.post('/register',(req,res) => {
    userController.register(req,res);
});

/*
 * LOGIN
 */
router.post('/login',userController.login);

/*
 * LOGOUT
 */
router.post('/logout',userController.logout);

module.exports = router;