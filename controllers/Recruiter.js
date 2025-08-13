const recruiterTemplate = require("../mail/templates/recruiterTemplate");
const mailSender = require("../utils/mailSender");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Company = require("../models/Company");
const User = require("../models/User");
const Job = require("../models/Job");

exports.createRecruiterCredential = async (req, res) => {
  try {
    const { companyId, email } = req.body;
    const token = jwt.sign(
      { companyId: companyId, email },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    const link = `${process.env.BASE_URL}/createcredential/${token}`;

    await mailSender(
      email,
      "Create Your Account",
      recruiterTemplate("Recruiter", link)
    );
    return res.status(200).json({
      success: true,
      message: "Mail sent successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error in Mail sending",
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
    const company = await Company.findById(decode.companyId);

    const alreadyExist = await User.findOne({
      email: decode?.email.toLowerCase(),
    });

    if (alreadyExist) {
      return res.status(401).json({
        success: false,
        message: "User is already exists with the same email address",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Invite token validate successfully",
      data: { email: decode?.email, company: company.companyName },
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: "Error in validating token ",
    });
  }
};

exports.registerUsingCredential = async (req, res) => {
  try {
    const { name, email, contactNo, password, token } = req.body;

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return res.status(403).json({
        success: false,
        message: "Look like token is invalid or expired",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      contactNo,
      company: decode.companyId,
      accountType: "Recruiter",
      approved: true,
    });

    await Company.findByIdAndUpdate(decode.companyId, {
      $push: {
        managedBy: user._id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Account created successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error in creating account",
      error: err.message,
    });
  }
};

exports.getRecruiterJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    const jobs = await Job.find({ company: user.company, deleted: false }).select("-company").populate("branch").sort({createdAt:-1});

    return res.status(200).json({
      success: true,
      message: "Job Fetched successfully",
      data: jobs,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: "Error in Fetching job",
    });
  }
};

exports.createJobByRecruiter = async(req,res) =>{
  try {
    const {
      title,
      description,
      package,
      role,
      branch,
      placementDrive,
      applyLink,
      session,
      marks10th,
      marks12th,
      currCGPA,
      backlog,
      lastDate,
    } = req.body;
    if (
      !title ||
      !description || 
      !role ||
      !placementDrive ||
      !session
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill up all the required fields",
      });
    }
    const user = await User.findById(req.user.id);
    const newJob = await Job.create({
      title,
      description,
      company : user.company,
      package,
      role,
      branch,
      placementDrive,
      applyLink,
      session,
      marks10th,
      marks12th,
      currCGPA,
      backlog,
      lastDate,
      postedBy: req.user.id,
      approved: false,
    });

    return res.status(200).json({
      success: true,
      message: "Job created successfully",
      data: newJob,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while creating job",
      error: error.message,
    });
  }
}
