require("dotenv").config(); // Load environment variables

const sequelize = require("./config/database");
const express = require("express");
const session = require("express-session");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const adminRoutes = require("./routes/adminRoutes");
const PORT = process.env.PORT || 5000;

// Middleware for sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // true in production for HTTPS
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

// Other middleware and routes
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session.patientId) {
    return next(); // Proceed to the next middleware or route handler
  }
  return res.status(401).json({ message: "Unauthorized" });
};

app.get("/protected-route", isAuthenticated, (req, res) => {
  res.status(200).json({ message: "This is a protected route." });
});

// Patient Profile Route
app.get("/patients/profile", isAuthenticated, async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.session.patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout Route
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Could not log out" });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
});

sequelize
  .sync() // Remove the force: true option
  .then(() => {
    console.log("Database & tables created!");
  })
  .catch((error) => {
    console.error("Error creating tables:", error);
  });

app.use("/patients", require("./routes/patientRoutes"));
app.use("/doctors", require("./routes/doctorRoutes"));
app.use("/appointments", require("./routes/appointmentRoutes"));
app.use("/admin", adminRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(500).json({ message: "Internal server error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
