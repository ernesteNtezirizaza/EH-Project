const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;

// Middleware to protect routes
exports.protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: "No Token Provided!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id);

    if (!req.user) {
      return res.status(404).json({ message: "User not found with this token" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized to access this route" });
  }
};

// Middleware to check if user is admin
exports.isAdmin = async (req, res, next) => {
  try {
    // Ensure req.user is populated by the protect middleware
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = req.user;

    // Check if user is admin (assuming roleId 2 is admin)
    if (user.roleId !== 2) {
      return res.status(403).json({ message: "Not authorized as admin" });
    }

    next();
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
