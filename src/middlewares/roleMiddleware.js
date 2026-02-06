// this is a higher order function
// it returns the actual middleware function
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // check if user exits
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: "Access Denied: no role found" });
    }

    // check if the user's role is in the allowed list
    // allowedRoles might be ['admin', 'superadmin']
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access Denied: you are a '${req.user.role}',
            but this requires '${allowedRoles.join(" or ")}'`,
      });
    }

    next();
  };
};

module.exports = authorizeRoles;