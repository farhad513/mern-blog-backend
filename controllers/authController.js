const { User } = require("../models/authModel");
const { createToken } = require("../utils/createToken");
const regiterController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return res.status(404).send({
        success: false,
        error: "Please Enter All Fields",
      });
    }
    const findUser = await User.findOne({ email });
    if (findUser) {
      return res.status(400).send({
        success: false,
        error: "Email Already Exists",
      });
    }
    const findUserName = await User.findOne({ name });
    if (findUserName) {
      return res.status(400).send({
        success: false,
        error: "User Name Already Exists",
      });
    }
    const user = await User.create({
      name,
      email,
      password,
    });
    const token = await createToken({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
    });
    res.cookie("userToken", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "User Created Success",
      user,
      token,
    });
  } catch (error) {
    // next(error);
    console.log(error);
    res.status(400).send({
      success: false,
      error: "Internal Sever Error",
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        error: "User not found",
      });
    }
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        error: "Please enter all fields",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        error: "Email and Password is not correct",
      });
    }
    user.password = undefined;
    const token = await createToken({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
    });

    res.cookie("userToken", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    res.status(200).send({
      success: true,
      message: "Login Success",
      token,
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
  regiterController,
  loginController,
};
