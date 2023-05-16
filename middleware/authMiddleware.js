const User = require('../models/userModel')
const bcrypt = require('bcrypt')

const checkCredentials = async (username, password)  => {
    // Check the credentials against the database
    const user = await User.findOne({ username });
    if (!user) {
      return false;
    }
    const isValid = await bcrypt.compare(password, user.password);
    return isValid;
  }

 module.exports =  checkCredentials