const jwt = require('jsonwebtoken');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
const User = require('../models/userModel')
const checkCredentials = require('../middleware/authMiddleware')

dotenv.config();

const signup_post = async (req, res) => {
    try {
      const { username, password } = req.body;
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user = new User({ username, password: hashedPassword });
      await user.save();
      const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' })
      res.cookie('token', token, { httpOnly: true });
      res.json(token);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }

  const login_post =  async (req, res) => {
    try {
      const token = jwt.sign({ username: req.user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true });
      res.json(token)
      // res.send('Logged in successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }

  const logout_get = (req, res) => {
    // Clear the token cookie
    res.clearCookie('token');
    res.send('Logged out successfully');
  }

  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      // Check if the username and password are correct
      const isValid = await checkCredentials(username, password);
      if (!isValid) {
        return done(null, false, { message: 'Invalid credentials' });
      }
      // Return the user object if the credentials are valid
      return done(null, { username });
    } catch (error) {
      return done(error);
    }
  }));
  
  passport.use(new JwtStrategy({
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: (req) => req.cookies.token,
  }, async (jwtPayload, done) => {
    try {
      // Check if the username in the JWT token exists in the database
      const user = await User.findOne({ username: jwtPayload.username });
      if (!user) {
        return done(null, false, { message: 'Unauthorized' });
      }
      // Return the user object if the token is valid
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  module.exports = { 
    signup_post,
    login_post,
    logout_get
  }