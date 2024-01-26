const users = [
  { id: 1, username: 'test', password: 'test', walletBalance: 100 },
];
const authenticate = (req, res, next) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username && u.password === password);
  
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(401).json({ message: 'Authentication failed' });
    }
  };

  module.exports = {
    authenticate,
    users
  }