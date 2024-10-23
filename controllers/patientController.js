const Patient = require("../models/Patient");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createPatient = async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (error) {
    console.error("Validation error details:", error.errors);
    res.status(400).json({ error: error.message });
  }
};

exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll({
      attributes: ["first_name", "last_name", "email", "phone"],
    });
    res.status(200).json(patients);
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.user.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.registerPatient = async (req, res) => {
  console.log("Received registration data:", req.body);
  const { first_name, last_name, email, phone, password } = req.body;

  // Check for missing fields
  if (!first_name || !last_name || !email || !phone || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newPatient = await Patient.create({
      first_name,
      last_name,
      email,
      phone,
      password_hash: hashedPassword,
    });
    req.session.patientId = newPatient.id;
    res.status(201).json({
      message: "Patient registered successfully",
      patient_id: newPatient.id,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(400).json({ error: error.message });
  }
};

// Login a patient
exports.loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;
    const patient = await Patient.findOne({ where: { email } });

    // Check if patient exists and compare the hashed password
    if (!patient || !(await bcrypt.compare(password, patient.password_hash))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: patient.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    req.session.patientId = patient.id;
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update patient profile
exports.updateProfile = async (req, res) => {
  try {
    const patient_id = req.params.id;
    const { first_name, last_name, email, phone } = req.body;

    await Patient.update(
      { first_name, last_name, email, phone },
      { where: { id: patient_id } }
    );

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete patient account
exports.deleteAccount = async (req, res) => {
  try {
    const patient_id = req.params.id;
    await Patient.destroy({ where: { id: patient_id } });
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
