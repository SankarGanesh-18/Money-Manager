const User = require('../models/User');
const generateToken = require('../utils/generateToken');


// =====================================
// Register User
// =====================================

exports.registerUser = async (req, res) => {

  try {

    const {

      firstName,
      lastName,
      phone,
      email,
      password

    } = req.body;


    // Check if email already exists

    const existingUser =
    await User.findOne({

      email

    });

    if (existingUser) {

      return res.status(400).json({

        message: 'Email already registered'

      });

    }


    // Create User

    const user =
    await User.create({

      firstName,
      lastName,
      phone,
      email,
      password

    });


    // Generate Token

    const token =
    generateToken(user._id);


    res.status(201).json({

      message: 'Registration Successful',

      token,

      user: {

        _id: user._id,

        firstName: user.firstName,

        lastName: user.lastName,

        phone: user.phone,

        email: user.email

      }

    });

  }

  catch (error) {
    console.error("REGISTER ERROR:", error);
  
    res.status(500).json({
      message: error.message,
      error
    });
  }

};



// =====================================
// Login User
// =====================================

exports.loginUser = async (req, res) => {

  try {

    const {

      email,
      password

    } = req.body;


    const user =
    await User.findOne({

      email

    });


    if (!user) {

      return res.status(400).json({

        message: 'Invalid Email or Password'

      });

    }


    const isMatch =
    await user.matchPassword(password);


    if (!isMatch) {

      return res.status(400).json({

        message: 'Invalid Email or Password'

      });

    }


    const token =
    generateToken(user._id);


    res.json({

      message: 'Login Successful',

      token,

      user: {

        _id: user._id,

        firstName: user.firstName,

        lastName: user.lastName,

        phone: user.phone,

        email: user.email

      }

    });

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

};




// =====================================
// Get Logged In User
// =====================================

exports.getProfile = async (req, res) => {

  res.json({

    _id: req.user._id,

    firstName: req.user.firstName,

    lastName: req.user.lastName,

    phone: req.user.phone,

    email: req.user.email

  });

};