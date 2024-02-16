const {
  createPost,
  getAllPosts,
  deletePost,
  getSinglePost,
  updatePost,
  getPostSlug
} = require("../controllers/postController");
const { isAuth } = require("../middleware/authMiddleware");
const router = require("express").Router();
router.post("/post/create", isAuth, createPost);

router.get("/post/get-post", getAllPosts);

router.get("/post/get/post/:slug", getPostSlug);

router.get("/post/get/:postId", getSinglePost);

router.put("/update-post/:postId/:userId", isAuth, updatePost);
router.delete("/post/delete/:postId/:userId", isAuth, deletePost);

module.exports = router;
