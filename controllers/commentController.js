const { Comment } = require("../models/commentModel");

const createComment = async (req, res) => {
  try {
    const { postId, userId, comment } = req.body;
    if (userId !== req.user.id) {
      return res.status(403).send({
        error: "You are not allowed to create a comment",
      });
    }
    const newComment = await Comment.create({
      postId,
      userId,
      comment,
    });
    res.status(200).send({
      message: "Comment Created Success",
      newComment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
};

const getComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
    res.status(200).send({
      comments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
};

const likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById({ commentId });
    if (!comment) {
      return res.status(404).send({
        error: "Comment Not Found",
      });
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).send({ comment });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
};

module.exports = { createComment, getComment, likeComment };
