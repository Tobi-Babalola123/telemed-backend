const express = require("express");
const patientController = require("../controllers/patientController");
const authenticateToken = require("../middleware/authenticateToken");

const router = express.Router();

// Patient registration
router.post("/register", patientController.registerPatient);

// Fetch all patients
router.get("/", patientController.getPatients);

// For Viewing Profile
router.get("/profile", authenticateToken, patientController.getProfile);

// Patient login
router.post("/login", patientController.loginPatient);

// Create a patient
router.post("/", patientController.createPatient);

// Update patient profile
router.put("/profile/:id", patientController.updateProfile);

// for updating profile
router.put(
  "/profile/update",
  authenticateToken,
  patientController.updateProfile
);

// Delete patient account
router.delete("/account/:id", patientController.deleteAccount);

module.exports = router;
