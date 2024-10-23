const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../backend/config/db/db");
const router = express.Router();

// Get patient profile
router.get("/profile", isAuthenticated, async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id);
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving profile" });
  }
});

// Update patient profile
router.put("/profile", isAuthenticated, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.user.id,
      { name, phone },
      { new: true }
    );
    res.status(200).json(updatedPatient);
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

// Patient Registration
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = "INSERT INTO patients (name, email, password) VALUES (?, ?, ?)";
  db.execute(query, [name, email, hashedPassword])
    .then((result) => {
      res
        .status(201)
        .json({ message: "User registered", userId: result[0].insertId });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// Patient Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM patients WHERE email = ?";
  const [rows] = await db.execute(query, [email]);

  if (rows.length === 0) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const user = rows[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    req.session.user = user; // Store user session
    return res.json({ token });
  }

  res.status(401).json({ message: "Invalid credentials" });
});

module.exports = router;
