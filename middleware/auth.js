const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  let token = req.header("Authorization");

  if (!token)
    return res.status(401).json({
      message: "Access denied. Not authenticated!",
    });

  try {
    const secretKey = process.env.JWT_KEY;
    token = token.split(" ")[1];
    const user = jwt.verify(token, secretKey);
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send("Access denied. Invalid token!");
  }
};

const isAdmin = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role === 1) {
      next();
    } else {
      res.status(403).json({ message: "Access denied. Not authorzed!" });
    }
  });
};

const isUser = async (req, res, next) => {
  try {
    auth(req, res, () => {
      if (req.user) {
        next();
      }
    });
  } catch (error) {
    res.status(401).send("Not authenticated!");
  }
};

module.exports = { auth, isAdmin, isUser };
