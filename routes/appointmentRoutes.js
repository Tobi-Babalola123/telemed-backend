const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const authenticateToken = require("../middleware/authenticateToken");

// Patient books a new appointment
router.post("/", authenticateToken, appointmentController.bookAppointment);

// Get all appointments for a specific patient
router.get(
  "/patient/:id",
  authenticateToken,
  appointmentController.getAppointmentsByPatientId
);

// Get all appointments (admin route, requires authentication)
router.get(
  "/admin",
  authenticateToken,
  appointmentController.getAllAppointments
);

// Update an existing appointment (reschedule)
router.put("/:id", authenticateToken, appointmentController.updateAppointment);

// Cancel an appointment
router.delete(
  "/:id",
  authenticateToken,
  appointmentController.cancelAppointment
);

module.exports = router;
