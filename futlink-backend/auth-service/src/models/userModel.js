const bcrypt = require('bcrypt');

  const users = [{
      id: 1,
      email: 'test@example.com',
      password: bcrypt.hashSync('password', 10)
      }];

  const findUserByEmail = async (email) => {
      return users.find(user => user.email === email);
  }


  module.exports = {
      findUserByEmail
  }