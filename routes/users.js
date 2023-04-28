const router = require("express").Router();
const pool = require("../db/connection");
const { isUser } = require("../middleware/auth");

router.get("/profile", isUser, async (req, res) => {
  try {
    const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      req.user.id,
    ]);
    res.status(200).json(user.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Couldn't fetch user!",
    });
  }
});

router.put("/:id", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const updatedUser = await pool.query(
      `UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *`,
      [username, email, password, req.params.id]
    );
    res.status(200).json(updatedUser.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Could not add user",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      req.params.id,
    ]);
    res.status(200).json(user.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Couldn't fetch user!",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await pool.query(`DELETE FROM users WHERE id = $1`, [req.params.id]);
    res.status(200).json({
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Could not delete user!",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await pool.query(`SELECT * FROM users`);
    res.status(200).json(users.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
});

module.exports = router;
