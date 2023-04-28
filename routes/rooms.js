const router = require("express").Router();
const pool = require("../db/connection");

router.get("/:id/patients", async (req, res) => {
  try {
    const roomPatients = await pool.query(
      `SELECT first_name, last_name FROM patients WHERE room_id = $1`,
      [req.params.id]
    );
    res.status(200).json(roomPatients.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.put("/:id", async (req, res) => {
  const { name, availability } = req.body;

  try {
    const updatedRoom = await pool.query(
      `UPDATE rooms SET name = $1, availability = $2 WHERE id = $3 RETURNING *`,
      [name, availability, req.params.id]
    );
    res.status(200).json(updatedRoom.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Could not update room!",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const room = await pool.query(`SELECT id, name FROM rooms WHERE id = $1`, [
      req.params.id,
    ]);
    res.status(200).json(room.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/", async (req, res) => {
  const { name } = req.body;

  try {
    const room = await pool.query(
      `INSERT INTO rooms (name) VALUES ($1) RETURNING *`,
      [name]
    );
    res.status(201).json(room.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Could not add room!",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await pool.query(`DELETE FROM rooms WHERE id = $1`, [req.params.id]);
    res.status(200).json({
      message: "Room deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Could not delete room!",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const rooms = await pool.query(`SELECT id, name FROM rooms`);
    res.status(200).json(rooms.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

module.exports = router;
