const jwt = require("jsonwebtoken"); // Importing jsonwebtoken
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const SystemConfig = require("../models/SystemConfig");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");
const { handleErrors } = require("./errorMiddleware");

// Reusable function to handle resource creation
const createResource = async (model, data) => {
  return await model.create(data);
};

// Function to generate JWT token for admin
const generateToken = (admin) => {
  return jwt.sign(
    { id: admin.id, role: admin.role, email: admin.email },
    "wewndjbehwbde982y8",
    {
      expiresIn: "1h",
    }
  );
};

// Function to create a new user
exports.createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    console.log("Creating user:", { username, role });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      username,
      password_hash: hashedPassword,
      role,
    });

    console.log("User created:", newAdmin);
    return res
      .status(201)
      .json({ message: "User created successfully", admin: newAdmin });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Admin Login
exports.loginAdmin = handleErrors(async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({
    where: { username },
    attributes: ["id", "role", "password_hash"],
  });

  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

  if (isPasswordValid) {
    const token = generateToken(admin);
    return res.status(200).json({ message: "Login successful", token });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

// Get all users
exports.getAllUsers = handleErrors(async (req, res) => {
  const users = await User.findAll();
  res.status(200).json(users);
});

// Admin Dashboard
exports.getDashboard = handleErrors(async (req, res) => {
  const usersCount = await User.count();
  const doctorsCount = await Doctor.count();
  const patientsCount = await Patient.count();
  const appointmentsCount = await Appointment.count();

  res.status(200).json({
    message: "Admin Dashboard Data",
    users: usersCount,
    doctors: doctorsCount,
    patients: patientsCount,
    appointments: appointmentsCount,
  });
});

// Register Admin
exports.registerAdmin = handleErrors(async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newAdmin = await createResource(Admin, {
    email,
    password_hash: hashedPassword,
  });
  res
    .status(201)
    .json({ message: "Admin registered successfully.", admin: newAdmin });
});

// Update a user
exports.updateUser = handleErrors(async (req, res) => {
  const userId = req.params.id;
  const { name, email, role } = req.body;
  await User.update({ name, email, role }, { where: { id: userId } });
  res.status(200).json({ message: "User updated successfully" });
});

// Delete a user
exports.deleteUser = handleErrors(async (req, res) => {
  const userId = req.params.id;
  await User.destroy({ where: { id: userId } });
  res.status(200).json({ message: "User deleted successfully" });
});

// Get all doctors
exports.getAllDoctors = handleErrors(async (req, res) => {
  const doctors = await Doctor.findAll();
  res.status(200).json(doctors);
});

// Add a new doctor
exports.addDoctor = handleErrors(async (req, res) => {
  const { name, specialty } = req.body;
  const newDoctor = await createResource(Doctor, { name, specialty });
  res
    .status(201)
    .json({ message: "Doctor added successfully", doctor: newDoctor });
});

// Update a doctor's profile
exports.updateDoctor = handleErrors(async (req, res) => {
  const doctorId = req.params.id;
  const { name, specialty } = req.body;
  await Doctor.update({ name, specialty }, { where: { id: doctorId } });
  res.status(200).json({ message: "Doctor updated successfully" });
});

// Delete a doctor
exports.deleteDoctor = handleErrors(async (req, res) => {
  const doctorId = req.params.id;
  await Doctor.destroy({ where: { id: doctorId } });
  res.status(200).json({ message: "Doctor deleted successfully" });
});

// Get all patients
exports.getAllPatients = handleErrors(async (req, res) => {
  const patients = await Patient.findAll();
  res.status(200).json(patients);
});

// Add a new patient
exports.addPatient = handleErrors(async (req, res) => {
  const { name, age, contact } = req.body;
  const newPatient = await createResource(Patient, { name, age, contact });
  res
    .status(201)
    .json({ message: "Patient added successfully", patient: newPatient });
});

// Update a patient's profile
exports.updatePatient = handleErrors(async (req, res) => {
  const patientId = req.params.id;
  const { name, age, contact } = req.body;
  await Patient.update({ name, age, contact }, { where: { id: patientId } });
  res.status(200).json({ message: "Patient updated successfully" });
});

// Delete a patient
exports.deletePatient = handleErrors(async (req, res) => {
  const patientId = req.params.id;
  await Patient.destroy({ where: { id: patientId } });
  res.status(200).json({ message: "Patient deleted successfully" });
});

// Get all appointments
exports.getAllAppointments = handleErrors(async (req, res) => {
  const appointments = await Appointment.findAll();
  res.status(200).json(appointments);
});

// Update appointment status
exports.updateAppointmentStatus = handleErrors(async (req, res) => {
  const appointmentId = req.params.id;
  const { status } = req.body;
  await Appointment.update({ status }, { where: { id: appointmentId } });
  res.status(200).json({ message: "Appointment status updated successfully" });
});

// Delete an appointment
exports.deleteAppointment = handleErrors(async (req, res) => {
  const appointmentId = req.params.id;
  await Appointment.destroy({ where: { id: appointmentId } });
  res.status(200).json({ message: "Appointment deleted successfully" });
});

// Get system-wide configurations
exports.getSystemConfig = handleErrors(async (req, res) => {
  const config = await SystemConfig.findOne();
  res.status(200).json(config);
});

// Update system-wide configurations
exports.updateSystemConfig = handleErrors(async (req, res) => {
  const { settings } = req.body;
  await SystemConfig.update(settings, { where: {} });
  res
    .status(200)
    .json({ message: "System configuration updated successfully" });
});
