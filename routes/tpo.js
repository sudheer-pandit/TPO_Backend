const express = require("express");
const {
  createDepartment,
  deleteDepartment,
  updateDepartment,
} = require("../controllers/Department");
const {
  createPlacement,
  deletePlacement,
  getAllPlacement,
  updatePlacement,
  deleteImage,
} = require("../controllers/Placement");
const { approveUser, deleteStudent } = require("../controllers/Auth");
const {
  createCompany,
  deleteCompany,
  getAllCompany,
  updateCompany,
} = require("../controllers/Company");
const {
  getAllApprovedStudent,
  getAllPendingStudent,
  getStudentBySession,
} = require("../controllers/Student");
const { auth, isAdminTPO, isTPO } = require("../middleware/auth");
const {
  getAllApprovedAlumni,
  getAllPendingAlumni,
  approveAlumni,
  deleteAlumni,
} = require("../controllers/Alumni");
const { getBranchWiseStudent } = require("../controllers/Statistic");
const { createRecruiterCredential } = require("../controllers/Recruiter");
const { getAllFeedback, deleteFeedback } = require("../controllers/Feedback");
const {
  createTnPOfficerCredential,
  getAllTnPOfficers,
} = require("../controllers/TnPOfficer");
const { getAllBanner, uploadBanner, deleteBanner } = require("../controllers/Banner");
const router = express.Router();

router.post("/createDepartment", auth, isAdminTPO, createDepartment);
router.delete("/deleteDepartment", auth, isAdminTPO, deleteDepartment);
router.put("/updateDepartment", auth, isAdminTPO, updateDepartment);

router.post("/createPlacement", auth, isAdminTPO, createPlacement);
router.delete("/deletePlacement", auth, isAdminTPO, deletePlacement);
router.get("/getAllPlacement", auth, isAdminTPO, getAllPlacement);
router.put("/updatePlacement", auth, isAdminTPO, updatePlacement);
router.put("/deleteImage", auth, isAdminTPO, deleteImage);

router.post("/createCompany", auth, isAdminTPO, createCompany);
router.delete("/deleteCompany", auth, isAdminTPO, deleteCompany);
router.get("/getAllCompany", auth, isAdminTPO, getAllCompany);
router.put("/updateCompany", auth, isAdminTPO, updateCompany);

router.patch("/approveUser", auth, isTPO, approveUser);
router.delete("/deleteStudent", auth, isTPO, deleteStudent);

router.get("/getAllApprovedStudent", auth, isAdminTPO, getAllApprovedStudent);
router.get("/getAllPendingStudent", auth, isAdminTPO, getAllPendingStudent);
router.get("/getStudentBySession", auth, isAdminTPO, getStudentBySession);

router.get("/getAllApprovedAlumni", auth, isAdminTPO, getAllApprovedAlumni);
router.get("/getAllPendingAlumni", auth, isAdminTPO, getAllPendingAlumni);
router.patch("/approveAlumni", auth, isAdminTPO, approveAlumni);
router.delete("/deleteAlumni", auth, isAdminTPO, deleteAlumni);

// Create Recruiter credentials

router.post(
  "/createRecruiterCredential",
  auth,
  isAdminTPO,
  createRecruiterCredential
);

//Feedback

router.get("/getAllFeedback", auth, isAdminTPO, getAllFeedback);
router.delete("/deleteFeedback", auth, isAdminTPO, deleteFeedback);

// TNP officer
router.post(
  "/createTnPOfficerCredential",
  auth,
  isAdminTPO,
  createTnPOfficerCredential
);
router.get("/getAllTnPOfficers", auth, isAdminTPO, getAllTnPOfficers);


// Banner API

router.post("/uploadBanner",auth,isAdminTPO,uploadBanner);
router.get("/getAllBanners", getAllBanner);
router.delete("/deleteBanner", auth, isAdminTPO, deleteBanner);

module.exports = router;
