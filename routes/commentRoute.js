const {
  createComment,
  getComment,
  likeComment,
} = require("../controllers/commentController");
const { isAuth } = require("../middleware/authMiddleware");

const router = require("express").Router();

router.post("/create", isAuth, createComment);
router.get("/get/:postId", getComment);

router.put("/likecomment/:commentId", isAuth, likeComment);

module.exports = router;
