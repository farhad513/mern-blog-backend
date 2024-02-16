const { User } = require("../models/authModel");
const bcrypt = require("bcryptjs");
// const get all User
const getAllUsers = async (req, res) => {
  try {
    // console.log(req);

    if (req.user.role !== "admin") {
      return res.status(403).send({
        error: "User not authorized",
      });
    }
    const users = await User.find();

    // user.password = undefined;
    // console.log(user);
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).send({
      users,
      totalUser: users.length,
      lastMonthUsers,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error: "Internal Sever Error",
    });
  }
};

// update Image Controller
const updateImageController = async (req, res) => {
  try {
    console.log(req.user);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error: "Internal Sever Error",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    const { name, email, password } = req.body;
    if (req.user.id !== userId) {
      return res.status(403).send({
        error: "Your are not allowed to access this user",
      });
    }
    if (password) {
      if (password.length < 5) {
        return res.status(400).send({
          error: "Password must be at least 5 characters",
        });
      }
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    if (name) {
      if (name < 5) {
        return res.status(400).send({
          error: "Name must be at least 5 characters",
        });
      }
      if (name > 15) {
        return res.status(400).send({
          error: "Name must be between 5 and 20 characters",
        });
      }
    }

    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        name: name || user.name,
        password: req.body.password || user.password,
      },
      { new: true }
    );
    updateUser.password = undefined;
    res.status(200).send({
      message: "User updated successfully",
      updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error: "Internal Sever Error",
    });
  }
};

// delete User
const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send({
        error: "Your are not allowed to access this user",
      });
    }
    const { userId } = req.params;
    const deleteUser = await User.findByIdAndDelete(userId);
    res.status(200).send({
      deleteUser,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error: "Internal Sever Error",
    });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("userToken", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(201).send({
      message: "Logout Success",
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error: "Internal Sever Error",
    });
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    user.password = undefined;
    if (!user) {
      return res.status(404).send({
        error: "User Not Found",
      });
    }
    res.status(200).send({
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error: "Internal Sever Error",
    });
  }
};
module.exports = {
  getAllUsers,
  updateImageController,
  updateUser,
  deleteUser,
  logout,
  getUser,
};
