const Doctor = require("../models/Doctor");

// Add a new doctor
exports.addDoctor = async (req, res) => {
  try {
    const { first_name, last_name, specialization } = req.body;

    // Log the request body to debug
    console.log("Adding doctor with data:", req.body);

    if (!first_name || !last_name || !specialization) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newDoctor = await Doctor.create({
      first_name,
      last_name,
      specialization,
    });

    return res.status(201).json(newDoctor);
  } catch (error) {
    console.error("Error adding doctor:", error);
    return res.status(500).json({ error: error.message });
  }
};
// Get a list of doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update doctor information
exports.updateDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const { first_name, last_name, specialization } = req.body;

    // Log incoming data
    console.log(`Updating doctor ID: ${doctorId} with data:`, req.body);

    // Perform the update and log affected rows
    const [affectedRows] = await Doctor.update(
      { first_name, last_name, specialization },
      { where: { id: doctorId } }
    );
    console.log(`Affected Rows: ${affectedRows}`);

    // Check if any rows were affected
    if (affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Doctor not found or no changes made." });
    }

    res
      .status(200)
      .json({ message: "Doctor information updated successfully" });
  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(400).json({ error: error.message });
  }
};

// Delete a doctor profile
exports.deleteDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    await Doctor.destroy({ where: { id: doctorId } });
    res.status(200).json({ message: "Doctor profile deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
