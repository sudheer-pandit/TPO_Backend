const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Department = require("../models/Department");
const User = require("../models/User");
const TPODetails = require("../models/TPODetails");

const tnpOfficerTemplate = require("../mail/templates/tnpOfficerTemplate");
const mailSender = require("../utils/mailSender");
const AccountType = require("../enum/accountType");
exports.createTnPOfficerCredential = async (req, res) => {
  try {
    const { departmentId, email } = req.body;
    const token = jwt.sign(
      { departmentId: departmentId, email },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    const link = `${process.env.BASE_URL}/tnp-officer/${token}`;

    await mailSender(
      email,
      "Create Your Account",
      tnpOfficerTemplate("TnP Officer", link)
    );
    return res.status(200).json({
      success: true,
      message: "Mail sent successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error in Mail sending",
      error: err.message,
    });
  }
};

exports.tnpSignup = async (req, res) => {
  const clientSession = await mongoose.startSession();
  clientSession.startTransaction();
  try {
    const { name, contactNo, password, token } = req.body;
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(403).json({
        success: false,
        message: "Look like token is invalid or expired",
      });
    }

    const alreadyExist = await User.findOne({
      $or: [{ email: decode?.email.toLowerCase() }, { contactNo: contactNo }],
    });

    if (alreadyExist) {
      return res.status(401).json({
        success: false,
        message:
          "User is already exists with the same email address or contact number",
      });
    }

    const newtnp = new TPODetails({
      department: decode?.departmentId,
    });
    const tpodetails = await newtnp.save({ session: clientSession });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email: decode?.email,
      accountType: "DepartmentTPO",
      password : hashedPassword,
      contactNo,
      approved: true,
      tpoDetails: tpodetails?._id,
    });
    await newUser.save({ session: clientSession });

    await clientSession.commitTransaction();
    clientSession.endSession();

    return res.status(200).json({
      success: true,
      message: "User register successfully",
      data: newUser,
    });
  } catch (error) {
    await clientSession.abortTransaction();
    clientSession.endSession();
    return res.status(500).json({
      success: false,
      error: error,
      message: `Error in registering`,
    });
  }
};

exports.validateInviteToken = async (req, res) => {
  try {
    const token = req.query.token;
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res.status(403).json({
        success: false,
        message: "Look like token is invalid or expired",
      });
    }

    const alreadyExist = await User.findOne({
      email: decode?.email.toLowerCase(),
    });

    if (alreadyExist) {
      return res.status(401).json({
        success: false,
        message: "User is already exists with the same email address",
      });
    }
    const department = await Department.findById(decode?.departmentId);

    return res.status(200).json({
      success: true,
      message: "Invite token validate successfully",
      data: { email: decode?.email, department: department.departmentName },
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: "Error in validating token",
      error: error,
    });
  }
};

exports.getAllTnPOfficers = async (req, res) => {
  try {
    const officers = await User.find({
      $and: [{ approved: true, accountType: AccountType.DepartmentTPO }],
    }).populate({
      path: "tpoDetails",
      populate: "department",
    });

    return res.status(200).json({
      success: true,
      message: `TnP Officer Fetched successfully`,
      data: officers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error while fetching TnP officer`,
    });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate({
      path: "tpoDetails",
      populate:"department"
    })

    return res.status(200).json({
      success: true,
      message: `TnP Officer Profile Fetched successfully`,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error while fetching TnP officer Profile`,
    });
  }
};




