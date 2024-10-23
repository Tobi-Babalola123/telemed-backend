const Appointment = require("../models/Appointment");

// Book a new appointment
exports.bookAppointment = async (req, res) => {
  try {
    console.log(req.body);
    const {
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      notes,
      status = "scheduled",
    } = req.body;
    const newAppointment = await Appointment.create({
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      notes,
      status,
    });
    res.status(201).json({
      message: "Appointment booked successfully",
      appointmentId: newAppointment.id,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get appointments for a specific patient
exports.getAppointmentsByPatientId = async (req, res) => {
  try {
    const patient_id = req.params.id;
    const appointments = await Appointment.findAll({ where: { patient_id } });
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll();
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(400).json({ error: error.message });
  }
};

// Update an appointment
exports.updateAppointment = async (req, res) => {
  const { appointmentDate, appointmentTime } = req.body;
  const appointmentId = req.params.id;

  try {
    console.log(
      "Updating appointment ID:",
      appointmentId,
      "with data:",
      req.body
    );
    const updatedAppointment = await Appointment.update(
      { appointment_date: appointmentDate, appointment_time: appointmentTime },
      { where: { id: appointmentId } }
    );

    if (updatedAppointment[0] === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment updated successfully" });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: error.message });
  }
};
// Cancel an appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    await Appointment.destroy({ where: { id: appointmentId } });
    res.status(200).json({ message: "Appointment canceled successfully" });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(400).json({ error: error.message });
  }
};
