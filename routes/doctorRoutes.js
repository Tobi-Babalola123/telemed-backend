const express = require("express");
const doctorController = require("../controllers/doctorController");

const router = express.Router();

// Admin adds a new doctor
router.post("/", doctorController.addDoctor);

// Get all doctors (admin only)
router.get("/", doctorController.getAllDoctors);

// Update doctor information
router.put("/:id", doctorController.updateDoctor);

// Delete doctor profile
router.delete("/:id", doctorController.deleteDoctor);

module.exports = router;
