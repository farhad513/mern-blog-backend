const {
  updateUser,
  getAllUsers,
  deleteUser,
  logout,
  getUser,
} = require("../controllers/userController");
const { isAdmin, isAuth } = require("../middleware/authMiddleware");

const router = require("express").Router();

router.post("/user/logout", isAuth, logout);
router.get("/user/get-all", isAuth, getAllUsers);

router.get("/user/:userId", isAuth, getUser);
// router.post("/auth/user-image-update", updateImageController);
router.put("/user/update/:userId", isAuth, updateUser);
router.delete("/user/delete/:userId", isAuth, deleteUser);
module.exports = router;
