const {
  regiterController,
  loginController,
} = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = require("express").Router();

router.post("/auth/register", regiterController);

router.post("/auth/login", loginController);

module.exports = router;
