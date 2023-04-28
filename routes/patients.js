const router = require("express").Router();
const pool = require("../db/connection");
const { auth } = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  const {
    first_name,
    last_name,
    sex,
    birth_date,
    room_id,
    doctor_id,
    disease_id,
  } = req.body;

  await pool.query(
    `INSERT INTO patients (first_name, last_name, sex, birth_date, room_id, doctor_id)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [first_name, last_name, sex, birth_date, room_id, doctor_id],
    async (err, result) => {
      if (!err) {
        res.status(200).json(result.rows);
        if (disease_id) {
          await pool.query(
            `INSERT INTO diseases_patients (disease_id, patient_id) VALUES ($1, $2)`,
            [disease_id, result.rows[0].id]
          );
        }
      } else {
        console.log(err);
        res.status(500).json("Could not add patient.");
      }
    }
  );
  pool.end;
});

router.get("/:id", async (req, res) => {
  try {
    const patient = await pool.query(
      `SELECT p.first_name, p.last_name, sex, 
      TO_CHAR(birth_date, 'Mon dd, yyyy') birth_date,
      EXTRACT(year FROM AGE(birth_date)) age,
      doc.first_name || ' ' || doc.last_name doctor,
      d.name disease,
      r.name room
      FROM patients p INNER JOIN doctors doc
      ON doc.id = p.doctor_id
      FULL JOIN diseases_patients dp
      ON dp.patient_id = p.id
      FULL JOIN diseases d
      ON dp.disease_id = d.id
      FULL JOIN rooms r
      ON r.id = p.room_id
      WHERE p.id = $1`,
      [req.params.id]
    );
    res.status(200).json(patient.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
  pool.end;
});

router.put("/:id", auth, async (req, res) => {
  const {
    first_name,
    last_name,
    sex,
    birth_date,
    room_id,
    doctor_id,
    disease_id,
  } = req.body;

  try {
    const updatedPatient = await pool.query(
      `UPDATE patients SET first_name = $1, last_name = $2, sex = $3,
      birth_date = $4, room_id = $5, doctor_id = $6 WHERE id = $7 RETURNING *`,
      [
        first_name,
        last_name,
        sex,
        birth_date,
        room_id,
        doctor_id,
        req.params.id,
      ]
    );
    res.status(200).json(updatedPatient.rows[0]);
    if (disease_id) {
      await pool.query(
        `UPDATE diseases_patients SET disease_id = $1 WHERE patient_id = $2`,
        [disease_id, updatedPatient.rows[0].id]
      );
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Could not update patient!",
    });
  }
  pool.end;
});

router.delete("/:id", auth, async (req, res) => {
  try {
    await pool
      .query("DELETE FROM diseases_patients WHERE patient_id = $1", [
        req.params.id,
      ])
      .then(async () => {
        await pool.query("DELETE FROM patients WHERE id = $1", [req.params.id]);
      });
    res.status(200).json({
      message: "Successfully deleted patient",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
  pool.end;
});

router.get("/", async (req, res) => {
  try {
    const patients = await pool.query(
      `SELECT id, first_name, last_name, sex,
      TO_CHAR(birth_date, 'Mon dd, yyyy') birth_date, 
      EXTRACT(year FROM AGE(birth_date)) age FROM patients`
    );
    res.status(200).json(patients.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
  pool.end;
});

module.exports = router;
