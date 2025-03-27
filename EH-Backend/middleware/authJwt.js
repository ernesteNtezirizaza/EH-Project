const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;

// Middleware to protect routes
exports.protect = async (req, res, next) => {
  let token;
  
  // Check for Authorization header
  if (
    req.headers.authorization && 
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by decoded ID
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res.status(401).json({ 
          message: "User not found. Invalid token." 
        });
      }

      // Attach user to request object
      req.user = user;
      next();

    } catch (error) {
      console.error('Authentication Error:', error);
      
      // Specific error handling
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          message: "Invalid token format" 
        });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: "Token has expired" 
        });
      }

      return res.status(401).json({ 
        message: "Not authorized to access this route",
        error: error.message 
      });
    }
  } else {
    return res.status(401).json({ 
      message: "No authorization token provided" 
    });
  }
};