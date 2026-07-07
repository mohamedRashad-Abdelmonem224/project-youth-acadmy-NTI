const authorizeMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Disable identity verification first." });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "no authorize for you" });
    }

    next(); 
  };
};

module.exports = authorizeMiddleware;
