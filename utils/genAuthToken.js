const jwt = require("jsonwebtoken");

const genAuthToken = (user) => {
  const secretKey = process.env.JWT_KEY;

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    secretKey,
    { expiresIn: "1d" }
  );

  return token;
};

const genRefreshToken = (user) => {
  const secretKey = process.env.REFRESH_JWT_KEY;

  const refreshToken = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    secretKey,
    { expiresIn: "2d" }
  );

  return refreshToken;
};

module.exports = { genAuthToken, genRefreshToken };
