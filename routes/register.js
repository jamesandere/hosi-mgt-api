const router = require("express").Router();
const bcrypt = require("bcrypt");
const pool = require("../db/connection");
const { genAuthToken, genRefreshToken } = require("../utils/genAuthToken");

router.post("/", async (req, res) => {
  let { username, email, password } = req.body;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
  }

  try {
    const user = await pool.query(
      `INSERT INTO users (username, email, password) 
        VALUES ($1, $2, $3) RETURNING *`,
      [username, email, password]
    );

    const token = genAuthToken(user.rows[0]);
    const refreshToken = genRefreshToken(user);
    res.status(200).json({
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Could not add user",
    });
  }
});

module.exports = router;
