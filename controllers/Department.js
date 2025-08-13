const Department = require("../models/Department");

exports.createDepartment = async (req, res) => {
  try {
    const { departmentName, departmentCode, departmentAbbr,degree } = req.body;
    if (!departmentName || !departmentCode || !departmentAbbr || !degree) {
      // Return 400 Bad Request status code with error message
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }

    const department = await Department.findOne({ departmentCode });

    if (department) {
      // Return 409 Already Present status code with error message
      return res.status(409).json({
        success: false,
        message: `Department with same code is already present`,
      });
    }

    const newDepartment = await Department.create({
      departmentName,
      departmentCode,
      departmentAbbr,
      degree
    });

    return res.status(200).json({
      success: true,
      message: `Department Created successfully`, 
    });
  } catch (error) {
    console.error(error);
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Error while creating Department`,
    });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const { departmentId } = req.body;
    const department = await Department.findById(departmentId);

    if (!department) {
      // Return 401 Unauthorized status code with error message
      return res.status(404).json({
        success: false,
        message: `Department is not found may be deleted`,
      });
    }

    await Department.findByIdAndDelete(departmentId);

    return res.status(200).json({
      success: true,
      message: `Department Deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Error while deleting Department`,
    });
  }
};

exports.getAllDepartment = async (req, res) => {
  try {
    const department = await Department.find();

    return res.status(200).json({
      success: true,
      message: `Department Fetched successfully`,
      data: department,
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

exports.updateDepartment = async (req, res) => {
  try {
    const { departmentId, departmentName, departmentCode, degree, departmentAbbr } =
      req.body;

    const updated = await Department.findByIdAndUpdate(departmentId, {
      departmentName,
      departmentAbbr,
      departmentCode,
      degree
    });

    return res.status(200).json({
      success: true,
      message: `Department Updated successfully`, 
    });
  } catch (err) {
    return res.json.status(500).json({
      success: true,
      message: `Error while updating department`,
    });
  }
};
