const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

const authenticateUser = async (email, password) => {
const user = await userModel.findUserByEmail(email);

   if (!user || !(await bcrypt.compare(password, user.password))) {
       throw new Error('Invalid credentials');
   }

   const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
       expiresIn: '1h',
     });
     return token;
};

module.exports = {
   authenticateUser,
};