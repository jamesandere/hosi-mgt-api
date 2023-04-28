const router = require("express").Router();

router.get("/", async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out successfully!",
  });
});

module.exports = router;
