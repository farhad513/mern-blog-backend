const mongoose = require("mongoose");

const postModel = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default:
        "https://images.pexels.com/photos/733856/pexels-photo-733856.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    slug: {
      type: String,
      required: true,
      //   unique: true,
    },
    category: {
      type: String,
      default: "uncategory",
    },
  },
  { timestamps: true }
);

module.exports.Post = mongoose.model("Post", postModel);
