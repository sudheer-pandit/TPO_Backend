
const Company = require("../models/Company");

exports.createCompany = async (req, res) => {
  try {
    const { companyName, companyDesc, contactNo,email,website,noOfEmployees } = req.body;
    if (!companyName || !companyDesc) {
      // Return 400 Bad Request status code with error message
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }

    const recruiter = await Company.create({
        companyName,
        companyDesc,
        email,
        contactNo,
        website,
        noOfEmployees,
        approved:true
    });

    return res.status(200).json({
      success: true,
      message: `Company Added successfully`,
      data: recruiter,
    });
  } catch (error) {
    console.error(error);
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Error while creating Recruiter`,
    });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const { companyId } = req.body;
    const recruiter = await Company.findById(companyId);

    if (!recruiter) {
      // Return 401 Unauthorized status code with error message
      return res.status(404).json({
        success: false,
        message: `Recruiter is not found may be deleted`,
      });
    }

    await Company.findByIdAndDelete(companyId);

    return res.status(200).json({
      success: true,
      message: `Company Deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Error while deleting Company`,
    });
  }
};

exports.getAllCompany = async (req, res) => {
  try {
    const recruiter = await Company.find({approved:true}).select("+companyDesc +contactNo +email +website +noOfEmployees +addedBy +managedBy").populate("managedBy");

    return res.status(200).json({
      success: true,
      message: `Recruiter Fetched successfully`,
      data: recruiter,
    });
  } catch (error) {
    console.error(error); 
    return res.status(500).json({
      success: false,
      message: `Error while fetching Recruiter`,
    });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const { companyId, companyName, companyDesc, contactNo,email ,website,noOfEmployees} =
      req.body;

    const updated = await Company.findByIdAndUpdate(companyId, {
        companyName,
        companyDesc,
        contactNo,
        email,
        website,
        noOfEmployees
    });

    return res.status(200).json({
      success: true,
      message: `Company Updated successfully`,
      data: updated,
    });
  } catch (err) {
    return res.json.status(500).json({
      success: true,
      message: `Error while updating company`,
    });
  }
};
