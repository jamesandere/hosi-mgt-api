const router = require("express").Router();
const pool = require("../db/connection");

router.post("/", async (req, res) => {
  const { name } = req.body;

  try {
    const disease = await pool.query(
      `INSERT INTO diseases (name) VALUES ($1) RETURNING *`,
      [name]
    );
    res.status(201).json(disease.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Could not add disease!",
    });
  }
});

router.put("/:id", async (req, res) => {
  const { name } = req.body;

  try {
    const updatedDisease = await pool.query(
      `UPDATE diseases SET name = $1 WHERE id = $2 RETURNING *`,
      [name, req.params.id]
    );
    res.status(201).json(updatedDisease.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Could not update disease!",
    });
  }
});

router.get("/:id/patients", async (req, res) => {
  try {
    const diseasePatients = await pool.query(
      `SELECT d.name disease, p.first_name || ' ' || p.last_name patient FROM diseases d
        INNER JOIN diseases_patients dp
        ON dp.disease_id = d.id
        INNER JOIN patients p
        ON p.id = dp.patient_id WHERE d.id = $1`,
      [req.params.id]
    );
    res.status(200).json(diseasePatients.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const disease = await pool.query(
      `SELECT name FROM diseases WHERE id = $1`,
      [req.params.id]
    );
    res.status(200).json(disease.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: " Could not fetch disease!",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const diseases = await pool.query(`SELECT id, name FROM diseases`);
    res.status(200).json(diseases.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: " Could not fetch diseases!",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await pool.query(`DELETE FROM diseases WHERE id = $1`, [req.params.id]);
    res.status(200).json({
      message: "Successfully deleted patient",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: " Could not delete disease",
    });
  }
});

module.exports = router;
