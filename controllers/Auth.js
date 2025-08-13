const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const mailSender = require("../utils/mailSender");
const verifyEmailTemplate = require("../mail/templates/emailVerificationTemplate");
const UnverifiedUser = require("../models/UnverifiedUser");

require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    const {
      name,
      email,
      contactNo,
      password,
      accountType,
      branch,
      regNo,
      marks10th,
      marks12th,
      currCGPA,
      resumeLink,
      session,
      degree,
      backlog,
    } = req.body;

    if (
      !name ||
      !email ||
      !contactNo ||
      !password ||
      !accountType ||
      !regNo ||
      !branch ||
      !marks10th ||
      !marks12th ||
      !currCGPA ||
      !session ||
      !degree ||
      !backlog
    ) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      });
    }

    const existingUnverifiedUser = await UnverifiedUser.findOne({
      $or: [{ regNo: regNo }, { email: email }],
    });
    if (existingUnverifiedUser) {
      return res.status(400).json({
        success: false,
        message: "Already registered, Check your mail and verify your account",
      });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    let token;
    if (accountType === "Student") {
      const existingStudent = await Student.findOne({ regNo });
      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: "Student already exists with same registration number",
        });
      }

      token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const user = await UnverifiedUser.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        contactNo,
        accountType,
        token,
        branch,
        regNo,
        marks10th,
        marks12th,
        currCGPA,
        resumeLink,
        session,
        degree,
        backlog,
      });
    }

    const link = `${process.env.BASE_URL}/verifyemail/${token}`;
    await mailSender(
      email,
      "Verify Your Email",
      verifyEmailTemplate(name, link)
    );

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email || !password) {
      // Return 400 Bad Request status code with error message
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }

    // Find user with provided email
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    // If user not found with provided email
    if (!user) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`,
      });
    }

    // Generate JWT token and Compare Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = jwt.sign(
        { email: user.email, id: user._id, accountType: user.accountType },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );
      user.password = undefined;
      res.status(200).json({
        success: true,
        data: {
          user: user,
          token: token,
        },
        message: `User Login Success`,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    });
  }
};

exports.approveUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findByIdAndUpdate(userId, {
      approved: true,
    });

    return res.status(200).json({
      success: true,
      message: "User approved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error in approving Student`,
    });
  }
};

exports.verifytoken = async (req, res) => {
  try {
    const token = req.params.token;
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UnverifiedUser.findOne({
      email: decode.email,
      token: token,
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Token is invalid, user not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Token is valid",
      data: {
        name: user.name,
        email: user.email,
        accountType: user.accountType,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in verifying token",
    });
  }
};

exports.verifyemail = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({
        success: true,
        message: "Token is required",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UnverifiedUser.findOne({
      email: decode.email,
      token: token,
    });
    const {
      name,
      email,
      password,
      accountType,
      branch,
      regNo,
      contactNo,
      marks10th,
      marks12th,
      currCGPA,
      resumeLink,
      session,
      degree,
      backlog,
    } = user;
    let student;
    if (accountType === "Student") {
      student = await Student.create({
        branch,
        regNo,
        marks10th,
        marks12th,
        currCGPA,
        resumeLink,
        session,
        degree,
        backlog,
      });
    }

    const newUser = await User.create({
      name,
      email,
      accountType,
      password,
      contactNo,
      student: student._id,
    });

    await UnverifiedUser.findByIdAndDelete(user._id);

    newUser.password = undefined;
    return res.status(200).json({
      success: true,
      message: "User verified successfully",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Error in verifying email`,
    });
  }
};

exports.editProfile = async (req, res) => {
  try {
    const { marks10th, marks12th, currCGPA, resumeLink } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);

    const student = await Student.findByIdAndUpdate(user.student, {
      marks10th,
      marks12th,
      currCGPA,
      resumeLink,
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: student,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error in updating profile`,
    });
  }
};

exports.validateToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    return res.status(200).json({
      success: true,
      message: "validate token successfully",
      data: user,
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: "Error in validation token",
    });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findByIdAndDelete(userId);
    await Student.findByIdAndDelete(user.student);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error in approving Student`,
    });
  }
};
