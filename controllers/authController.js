const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.registerUser = async (
  req,
  res,
  next
) => {

  try {

    const {
      name,
      email,
      password
    } = req.body;

    const userExists =
      await User.findOne({ email });

    if (userExists) {

      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const user =
      await User.create({
        name,
        email,
        password
      });

    const token =
      generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        token
      }
    });

  } catch (err) {

    next(err);
  }
};

exports.loginUser = async (
  req,
  res,
  next
) => {

  try {

    const {
      email,
      password
    } = req.body;

    const user =
      await User.findOne({
        email
      }).select('+password');

    if (
      !user ||
      !(await user.matchPassword(password))
    ) {

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token =
      generateToken(user._id);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        token
      }
    });

  } catch (err) {

    next(err);
  }
};

exports.getMe = async (
  req,
  res,
  next
) => {

  res.json({
    success: true,
    data: req.user
  });
};