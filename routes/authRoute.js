const express = require('express');
const authRouter = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController')

authRouter.post('/signup',authController.signup_post );

authRouter.post('/login',passport.authenticate('local', { session: false }),authController.login_post );
  
authRouter.get('/logout', authController.logout_get );

module.exports = authRouter