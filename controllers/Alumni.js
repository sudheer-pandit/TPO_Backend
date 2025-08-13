const bcrypt = require("bcrypt");
const User = require("../models/User");
// const OTP = require("../models/OTP")
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const mailSender = require("../utils/mailSender");
const verifyEmailTemplate = require("../mail/templates/emailVerificationTemplate");
const UnverifiedUser = require("../models/UnverifiedUser");
// const otpGenerator = require("otp-generator")
// const mailSender = require("../utils/mailSender")
// const { passwordUpdated } = require("../mail/templates/passwordUpdate")
// const Profile = require("../models/Profile")
require("dotenv").config();
const Company = require("../models/Company");
const HRDetails = require("../models/HRDetails");
const Alumni = require("../models/Alumni");
const { default: mongoose } = require("mongoose");

exports.AlumniSignup = async (req, res) => {
  try {
    const {
      name,
      email,
      contactNo,
      password,
      accountType,
      branch,
      regNo,
      session,
      organisation,
      designation,
      organisationType,
      working = false,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !accountType ||
      !regNo ||
      !branch ||
      !session ||
      !contactNo
    ) {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      });
    }

    const existingUnverifiedUser = await User.findOne({
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
    if (accountType === "Alumni") {
      const existingStudent = await Student.findOne({ regNo });
      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: "User already exists with same registration number",
        });
      }

      token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const user = await UnverifiedUser.create({
        name,
        email,
        password: hashedPassword,
        contactNo,
        accountType,
        token,
        branch,
        regNo,
        session,
        organisation,
        designation,
        organisationType,
        working,
      });
    }

    const link = `${process.env.BASE_URL}/verifyemail/${token}`;
    const mail = await mailSender(
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

exports.alumniverifyemail = async (req, res) => {
  const clientSession = await mongoose.startSession();
  clientSession.startTransaction();
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
    }).session(clientSession);
    const {
      name,
      email,
      password,
      accountType,
      branch,
      regNo,
      contactNo,
      session,
      organisation,
      designation,
      organisationType,
      working,
    } = user;

    const newStudent = new Student({
      branch,
      regNo,
      session,
    });
    const student = await newStudent.save({ session: clientSession });
    const newAlumni = new Alumni({
      organisation,
      organisationType,
      designation,
      working,
    });
    const alumni = await newAlumni.save({ session: clientSession });
    const newUser = new User({
      name,
      email,
      accountType,
      password,
      contactNo,
      student: student?._id,
      alumni: alumni?._id,
    });
    await newUser.save({ session: clientSession });
    await UnverifiedUser.findByIdAndDelete(user._id).session(clientSession);

    newUser.password = undefined;

    await clientSession.commitTransaction();
    clientSession.endSession();
    return res.status(200).json({
      success: true,
      message: "User verified successfully",
      data: newUser,
    });
  } catch (error) {
    await clientSession.abortTransaction();
    clientSession.endSession();
    return res.status(500).json({
      success: false,
      message: `Error in verifying email`,
    });
  }
};

exports.getAllApprovedAlumni = async (req, res) => {
  try {
    const alumni = await User.find({
      $and: [{ approved: true, accountType: "Alumni" }],
    })
      .populate({
        path: "student",
        populate: {
          path: "branch",
        },
      })
      .populate({
        path: "alumni",
        populate: [
          {
            path: "hr",
          },
          {
            path: "company",
            select: "+noOfEmployees",
          },
        ],
      });

    return res.status(200).json({
      success: true,
      message: `Approved Student Fetched successfully`,
      data: alumni,
    });
  } catch (error) {
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      error: error.message,
      message: `Error while fetching Department`,
    });
  }
};

exports.getAllPendingAlumni = async (req, res) => {
  try {
    const alumni = await User.find({
      $and: [{ approved: false, accountType: "Alumni" }],
    })
      .populate({
        path: "student",
        populate: {
          path: "branch",
        },
      })
      .populate({
        path: "alumni",
        populate: [
          {
            path: "hr",
          },
          {
            path: "company",
            select: "+noOfEmployees",
          },
        ],
      });

    return res.status(200).json({
      success: true,
      message: `Approved Student Fetched successfully`,
      data: alumni,
    });
  } catch (error) {
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      error: error.message,
      message: `Error while fetching Department`,
    });
  }
};

exports.approveAlumni = async (req, res) => {
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

exports.deleteAlumni = async (req, res) => {
  const clientSession = await mongoose.startSession();
  clientSession.startTransaction();
  try {
    const { userId } = req.body;

    const user = await User.findByIdAndDelete(userId).session(clientSession);
    const student = await User.findByIdAndDelete(user.student).session(clientSession);
    const alumni = await User.findByIdAndDelete(user.alumni).session(clientSession);

    //commit transaction
    await clientSession.commitTransaction();
    clientSession.endSession();

    return res.status(200).json({
      success: true,
      message: "User Delete successfully",
    });
  } catch (error) {
    await clientSession.abortTransaction();
    clientSession.endSession();
    return res.status(500).json({
      success: false,
      message: `Error in deleting Alumni`,
    });
  }
};
