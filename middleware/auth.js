const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

// auth
exports.auth = async (req, res, next) => {
  try {
    //extract token
    const token =
      req.cookies.token || req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "token is invalid",
      });
    }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType != "Student") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Studnet only",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, Please try Again",
    });
  }
};

exports.isDepartmentTPO = async (req, res, next) => {
  try {
    if (req.user.accountType == "DepartmentTPO") {
      const user = await User.findById(req.user.id).populate({
        path: "tpoDetails",
      });
      req.user = user;
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for TPO only",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, Please try Again",
    });
  }
};
exports.isAdminTPO = async (req, res, next) => {
  try {
    if (req.user.accountType != "AdminTPO") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Admin TPO only",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, Please try Again",
    });
  }
};

exports.isTPO = async (req, res, next) => {
  try {
    if (req.user.accountType == "DepartmentTPO" || req.user.accountType == "AdminTPO") {

      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for TPO only",
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified, Please try Again",
    });
  }
};
