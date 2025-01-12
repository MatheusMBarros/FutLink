const authService = require('../services/authService');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
      const token = await authService.authenticateUser(email, password);
      res.status(200).json({ token });
    } catch(error){
      res.status(400).json({ message: error.message})
    }
  };

module.exports = {
  login
};