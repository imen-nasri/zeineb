const verifyRoles = (requiredRole) => {
  return (req, res, next) => {
    const userRoles = req.user?.roles; // Now, req.user should contain roles
    
    console.log('User Roles:', userRoles);  // For debugging

    if (!userRoles || !userRoles.includes(requiredRole)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient Role' });
    }
    next();
  };
};
module.exports = verifyRoles;