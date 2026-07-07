const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authenticateMiddleware = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]; 
  }

  if (!token) {
    return res.status(401).json({ message: "You are not authorized, you must log in first." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({ message: "user not found in the system" });
    }
    next(); 
  } catch (err) {
    return res.status(401).json({ message: "invalid or expired" });
  }
};

module.exports = authenticateMiddleware;
