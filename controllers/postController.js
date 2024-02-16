const { User } = require("../models/authModel");
const { Post } = require("../models/postModel");
const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const createPost = async (req, res) => {
  try {
    const { id, role } = req.user;
    if (role !== "admin") {
      return res.status(403).send({
        error: "Admin is  allowed",
      });
    }
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
      const { title, description, category } = fields;
      cloudinary.config({
        cloud_name: process.env.cloud_name,
        api_key: process.env.api_key,
        api_secret: process.env.api_secret_key,
        secure: true,
      });
      const { image } = files;
      const result = await cloudinary.uploader.upload(image.filepath, {
        folder: "post",
      });
      if (!title || !description || !category) {
        return res.status(400).send({
          error: "Please enter all fields",
        });
      }
      const slug = title.split(" ").join("-").toLowerCase();
      const user = await User.findById(id);
      const post = await Post.create({
        userId: user._id,
        slug,
        title,
        description,
        category,
        image: result.url,
      });
      res.status(200).send({
        message: "Successfully created",
        post,
      });
    });
  } catch (error) {
    console.log(error);
    res.send(500).send({
      error: "Internal Server Error",
    });
  }
};

// get all posts
const getAllPosts = async (req, res) => {
  try {
    let {
      userId,
      title,
      slug,
      category,
      postId,
      search,
      start,
      limit,
      sortBy,
    } = req.query;
    const startIndex = parseInt(start) || 0;
    const limitData = parseInt(limit) || 10;
    const sortby = sortBy === "asc" ? 1 : -1;
    const post = await Post.find({
      ...(userId && { userId: userId }),
      ...(title && { userId: title }),
      ...(slug && { userId: slug }),
      ...(category && { userId: category }),
      ...(postId && { _id: postId }),
      ...(search && {
        $or: [
          {
            title: { $regex: search, $options: "i" },
          },
          {
            description: { $regex: search, $options: "i" },
          },
        ],
      }),
    })
      .sort({ updatedAt: sortby })
      .skip(startIndex)
      .limit(limitData);
    const totalPosts = await Post.countDocuments();
    // month and year
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthPost = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).send({ totalPosts, lastMonthPost, post });
  } catch (error) {
    console.log(error);
    res.send(500).send({
      error: "Internal Server Error",
    });
  }
};

// delete post
const deletePost = async (req, res) => {
  try {
    if (!req.user.role === "admin" || req.user.id !== req.params.userId) {
      return res.status(403).send({
        error: "You are not allowed to delete this post",
      });
    }
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).send({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.send(500).send({
      error: "Internal Server Error",
    });
  }
};

// get single Post
const getSinglePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    res.status(200).send({
      post,
    });
  } catch (error) {
    console.log(error);
    res.send(500).send({
      error: "Internal Server Error",
    });
  }
};

const updatePost = async (req, res) => {
  try {
    console.log(req.body);
    if (!req.user.role === "admin" || req.user.id !== req.params.userId) {
      return res.status(403).send({
        error: "You are not allowed to delete this post",
      });
    }
    const updatePost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).send({
      message: "Post Updated successfully",
      updatePost,
    });
  } catch (error) {
    console.log(error);
    res.send(500).send({
      error: "Internal Server Error",
    });
  }
};

const getPostSlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ slug });
    res.status(200).send({
      post,
    });
  } catch (error) {
    console.log(error);
    res.send(500).send({
      error: "Internal Server Error",
    });
  }
};

const getPost = async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).send({
      posts,
    });
  } catch (error) {
    console.log(error);
    res.send(500).send({
      error: "Internal Server Error",
    });
  }
};
module.exports = {
  createPost,
  getAllPosts,
  deletePost,
  getSinglePost,
  updatePost,
  getPostSlug,
  getPost,
};
