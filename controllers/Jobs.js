const { default: mongoose } = require("mongoose");
const Job = require("../models/Job");
const Student = require("../models/Student");
const User = require("../models/User");
const { imageDestroyer } = require("../utils/imageDelete");

exports.createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      company,
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
      !company ||
      !role ||
      !placementDrive ||
      !session
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill up all the required fields",
      });
    }

    const newJob = await Job.create({
      title,
      description,
      company,
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
      approved: req.user.accountType === "AdminTPO",
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
};

exports.deleteJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    // const job = await Job.findById(jobId);

    // if (!job) {
    //   return res.status(404).json({
    //     success: false,
    //     message: 'Job not found, may have been deleted',
    //   });
    // }

    await Job.findByIdAndUpdate(jobId, {
      deleted: true,
    });

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while deleting job",
    });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ deleted: false })
      .populate("company")
      .populate("branch")
      .populate("postedBy")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      data: jobs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching jobs",
      error: error,
    });
  }
};

exports.getStudentJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("student");
    const jobs = await Job.find({
      deleted: false,
      session: user.student.session,
      branch: { $in: user?.student?.branch },
    })
      .populate("company")
      .populate("branch")
      .populate("postedBy")
      .select("+applicants")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      data: jobs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching jobs",
    });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const {
      jobId,
      title,
      description,
      company,
      package,
      branch,
      placementDrive,
      applyLink,
      session,
      marks10th,
      marks12th,
      currCGPA,
      backlog,
      lastDate,
      role,
    } = req.body;

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        title,
        description,
        company,
        package,
        branch,
        placementDrive,
        applyLink,
        session,
        marks10th,
        marks12th,
        currCGPA,
        backlog,
        lastDate,
        role,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while updating job",
      error: error.message,
    });
  }
};

exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        $push: { applicants: req.user.id },
      },
      { new: true }
    );

    const user = await User.findById(req.user.id);

    const updateStudent = await Student.findByIdAndUpdate(user.student, {
      $push: { applications: jobId },
    });
    if (!updatedJob) {
      return res.status(400).json({
        success: false,
        message: "Job not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Applied in job successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while applying in job",
    });
  }
};

exports.getAllJobApplicant = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId)
      .select("+applicants")
      .populate({
        path: "applicants",
        populate: {
          path: "student",
          populate: "branch",
        },
      })
      .populate("company")
      .populate("branch")
      .populate("postedBy");

    const statistics = await Job.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(jobId) } }, // Ensure jobId is converted to ObjectId
      { $unwind: "$applicants" }, // Unwind applicants array
      {
        $lookup: {
          from: "users", // Join with the users collection
          localField: "applicants",
          foreignField: "_id",
          as: "applicant_details",
        },
      },
      { $unwind: "$applicant_details" }, // Unwind the resulting array from the lookup
      {
        $lookup: {
          from: "students", // Join with the students collection
          localField: "applicant_details.student", // Use the 'student' field in the user schema
          foreignField: "_id",
          as: "student_details",
        },
      },
      { $unwind: "$student_details" }, // Unwind the resulting array from the lookup
      {
        $lookup: {
          from: "departments", // Join with the departments collection
          localField: "student_details.branch", // Use the 'branch' field in the student schema
          foreignField: "_id",
          as: "branch_details",
        },
      },
      { $unwind: "$branch_details" }, // Unwind the resulting array from the lookup
      {
        $group: {
          _id: "$branch_details._id",
          branchName: { $first: "$branch_details.departmentAbbr" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          branchName: 1,
          count: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      data: { job, statistics },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching jobs",
      error: error.message,
    });
  }
};

exports.deleteApplication = async (req, res) => {
  try {

    const {jobId,userId} = req.body;
    const user = await User.findById(userId);

    await Job.findByIdAndUpdate(jobId,{
      $pull : {applicants : user._id},
    });


    await Student.findByIdAndUpdate(user.student,{
      $pull:{applications : jobId}
    });

    return res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while deleting application",
      error : error.message
    });
  }
};
