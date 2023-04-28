const router = require("express").Router();
const pool = require("../db/connection");
const { auth } = require("../middleware/auth");

router.get("/:id/patients", async (req, res) => {
  try {
    const doctorPatients = await pool.query(
      `SELECT first_name, last_name FROM patients WHERE doctor_id = $1`,
      [req.params.id]
    );
    res.status(200).json(doctorPatients.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.put("/:id", auth, async (req, res) => {
  const { first_name, last_name } = req.body;

  try {
    const updatedDoctor = await pool.query(
      `UPDATE doctors SET first_name = $1, last_name = $2 WHERE id = $3 RETURNING *`,
      [first_name, last_name, req.params.id]
    );
    res.status(200).json(updatedDoctor.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Could not update doctor!",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const doctor = await pool.query(
      `SELECT first_name, last_name FROM doctors WHERE id = $1`,
      [req.params.id]
    );
    res.status(200).json(doctor.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/", auth, async (req, res) => {
  const { first_name, last_name } = req.body;

  try {
    const doctor = await pool.query(
      `INSERT INTO doctors (first_name, last_name) VALUES ($1, $2) RETURNING *`,
      [first_name, last_name]
    );
    res.status(201).json(doctor.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Could not add doctor!",
    });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    await pool.query(`DELETE FROM doctors WHERE id = $1`, [req.params.id]);
    res.status(200).json({
      message: "Doctor deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Could not delete doctor!",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const doctors = await pool.query(
      `SELECT id, first_name, last_name FROM doctors`
    );
    res.status(200).json(doctors.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
