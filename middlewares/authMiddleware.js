const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('Token verification failed:', err);
        return res.status(401).json({ message: 'Unauthorized' });
      }
      req.user = decoded; // Attach decoded user info to the request
      next();
    });
  } catch (error) {
    console.error('Error in auth middleware:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
