const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const doctorController = require("../controllers/doctorController");
const authenticateAdmin = require("../middleware/authenticateAdmin");

// Admin Dashboard
router.get("/dashboard", adminController.getDashboard);

// router.post("/register-admin", adminController.registerAdmin);
router.post("/register", adminController.registerAdmin);
console.log("Register route hit");

router.post("/login", adminController.loginAdmin);

// Route to manage all users (only accessible by admins)
router.get("/users", adminController.getAllUsers);

router.get("/doctors", doctorController.getAllDoctors);

router.get("/admin/users", authenticateAdmin, adminController.getAllUsers);

// Add new user (Admin creates user accounts)
router.post("/create-user", adminController.createUser);

router.post("/doctor", authenticateAdmin, doctorController.addDoctor);

// Update user information
router.put("/users/:id", adminController.updateUser);

// Delete a user
router.delete("/users/:id", adminController.deleteUser);

// Manage doctors (e.g., view, add, delete, update doctor profiles)
router.get("/doctors", adminController.getAllDoctors);
router.post("/doctors", adminController.addDoctor);
router.put("/doctors/:id", authenticateAdmin, doctorController.updateDoctor);

router.delete("/doctors/:id", adminController.deleteDoctor);

// Manage patients (e.g., view, add, delete, update patient profiles)
router.get("/patients", adminController.getAllPatients);
router.post("/patients", adminController.addPatient);
router.put("/patients/:id", adminController.updatePatient);
router.delete("/patients/:id", adminController.deletePatient);

// Manage appointments
router.get("/appointments", adminController.getAllAppointments);
router.put("/appointments/:id", adminController.updateAppointmentStatus);
router.delete("/appointments/:id", adminController.deleteAppointment);

// System configuration (for any platform-wide settings)
router.get("/config", adminController.getSystemConfig);
router.put("/config", adminController.updateSystemConfig);

module.exports = router;
