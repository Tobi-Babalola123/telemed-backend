const jwt = require("jsonwebtoken");

// Middleware to authenticate admin
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  // Log the authorization header and token
  console.log("Authorization Header:", authHeader);
  console.log("Extracted Token:", token);

  if (!token) {
    console.log("No token provided, unauthorized");
    return res.sendStatus(401); // No token found, unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Token verification failed:", err.message);
      return res.sendStatus(403); // Invalid token
    }

    // Log the decoded user data
    console.log("Decoded Token Data:", user);

    // Check if the user is an admin
    if (user.role !== "admin") {
      console.log("Access denied: not an admin");
      return res.status(403).json({ message: "Access denied, admin only." });
    }

    req.user = user; // Store the user information for the next middleware or route handler
    next();
  });
};

module.exports = authenticateAdmin;
