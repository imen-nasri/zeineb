const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization; // "Bearer token"

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1]; // ["Bearer", "token"]

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    
    // Attach the entire UserInfo object to req.user
    req.user = decoded.UserInfo; // This should contain user details including roles
    
    next();  
  });
};
module.exports = verifyJWT;
