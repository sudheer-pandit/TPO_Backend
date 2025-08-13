const { populate } = require("../models/Placement");
const User = require("../models/User");

exports.getAllApprovedStudent = async (req, res) => {
  try {
    const student = await User.find({
      $and: [{ approved: true }, { accountType: "Student" }],
    }).populate({
      path: "student",
      populate: {
        path: "branch",
      },
    });

    return res.status(200).json({
      success: true,
      message: `Approved Student Fetched successfully`,
      data: student,
    });
  } catch (error) {
    console.error(error);
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Error while fetching Department`,
    });
  }
};

exports.getAllPendingStudent = async (req, res) => {
  try {
    const student = await User.find({
      $and: [{ approved: false }, { accountType: "Student" }],
    }).populate({
      path: "student",
      populate: {
        path: "branch",
      },
    });

    return res.status(200).json({
      success: true,
      message: `Pending Student Fetched successfully`,
      data: student,
    });
  } catch (error) {
    console.error(error);
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Error while fetching Department`,
    });
  }
};

exports.getMyApplication = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "student",
      populate: {
        path: "applications",
        populate: [{ path: "company" }, { path: "branch" ,model: "department"}],
      },
    });

    return res.status(200).json({
      success: true,
      message: "Job Application fetched successfully",
      data: user?.student?.applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching application",
      error: error.message,
    });
  }
};


exports.getStudentBySession = async(req,res) => {
  try {
    const session = req.query.session;
    const users = await User.aggregate([
      {
        $lookup: {
          from: "students", // The name of the student collection
          localField: "student",
          foreignField: "_id",
          as: "student"
        }
      },
      {
        $unwind: "$student"
      },
      {
        $match: {
          "student.session": session
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          contactNo: 1,
          accountType: 1,
          approved: 1,
          student: {
            _id: 1,
            session: 1,
            regNo : 1,
            branch :1
          }
        }
      }
    ]);
    return res.status(200).json({
      success: true, 
      message: "Student fetched successfully",
      data: users
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error in fetching student", 
    });
  }
}

exports.getMyProfile = async(req,res) => {
  try{
    const user = req.user; 
    const profile = await User.findById(user?.id).select("+placements").populate({
      path : "student",
      populate : [
        {
          path : "branch"
        },
        {
          path : "placements",
          select: "-name -email -image -regNo -contactNo -session -branch -_id",
          populate : {
            path : "placementDetails",
            populate : {
              path : "company",
              select : "-hr -approved -_id -createdAt -updatedAt"
            }
          }
        }
      ]
    });
    return res.status(200).json({
      success: true, 
      message: "Student profile fetched successfully",
      data: profile
    });

  }
  catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error in fetching profile",
      error : err.message
    });
  }
}


exports.getBranchWisePendingStudent = async (req, res) => {
  try {
    const departmentId = req.user.tpoDetails.department

    const student = await User.find({
      $and: [{ approved: false }, { accountType: "Student" }],
    }).populate({
      path: "student",
      match: { branch: departmentId }, 
      populate: {
        path: "branch",
      },
    });

    return res.status(200).json({
      success: true,
      message: `Pending Student Fetched successfully`,
      data: student,
    });
  } catch (error) {
    console.error(error);
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Error while fetching Department`,
    });
  }
};

exports.getBranchWiseApprovedStudent = async (req, res) => {
  try {
    const departmentId = req.user.tpoDetails.department

    const student = await User.find({
      $and: [{ approved: true }, { accountType: "Student" }],
    }).populate({
      path: "student",
      match: { branch: departmentId }, 
      populate: {
        path: "branch",
      },
    });

    return res.status(200).json({
      success: true,
      message: `Approved Student Fetched successfully`,
      data: student,
    });
  } catch (error) {
    console.error(error);
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Error while fetching Approved Student`,
    });
  }
};