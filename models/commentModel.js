const mongoose = require("mongoose");

const commentModel = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    likes: {
      type: Array,
      default: [],
    },
    numOfLikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports.Comment = mongoose.model("Comment", commentModel);
