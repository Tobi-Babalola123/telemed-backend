// generateSecret.js
const crypto = require("crypto");
const secret = crypto.randomBytes(32).toString("hex");
console.log(secret); // This will print a random 64-character hex string
