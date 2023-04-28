const router = require("express").Router();
const bcrypt = require("bcrypt");
const pool = require("../db/connection");
const { genAuthToken, genRefreshToken } = require("../utils/genAuthToken");

router.post("/", async (req, res) => {
  let { username, email, password } = req.body;

  const user = await pool.query(
    `SELECT * FROM users WHERE email = $1 
  OR username = $2`,
    [email, username]
  );

  if (!user.rows[0])
    return res.status(400).json({
      message: "Invalid email or password",
    });

  const validPassword = await bcrypt.compare(password, user.rows[0].password);

  if (!validPassword)
    return res.status(400).json({
      message: "Invalid password",
    });

  const token = genAuthToken(user.rows[0]);
  const refreshToken = genRefreshToken(user);
  res.status(200).json({
    token,
  });
});

router.post("/refresh", async (req, res) => {
  if (req.cookies?.jwt) {
    const refreshToken = req.cookies?.jwt;

    jwt.verify(refreshToken, process.env.REFRESH_JWT_KEY, (err, decoded) => {
      if (err) {
        return res.status(406).json({ message: "Unauthorized" });
      } else {
        const token = genAuthToken(user);
        return res.status(200).json({ token: token });
      }
    });
  } else {
    return res.status(406).json({ message: "Unauthorized" });
  }
});

module.exports = router;
