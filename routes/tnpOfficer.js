const express = require("express");
const { auth, isAdminTPO, isDepartmentTPO } = require("../middleware/auth");
const { validateInviteToken, tnpSignup, getMyProfile } = require("../controllers/TnPOfficer");
const {
  getBranchWisePendingStudent,
  getBranchWiseApprovedStudent,
} = require("../controllers/Student");
const router = express.Router();

router.get("/validateInviteToken", validateInviteToken);
router.post("/tnpOfficerRegister", tnpSignup);
router.get(
  "/getBranchWisePendingStudent",
  auth,
  isDepartmentTPO,
  getBranchWisePendingStudent
);
router.get(
  "/getBranchWiseApprovedStudent",
  auth,
  isDepartmentTPO,
  getBranchWiseApprovedStudent
);
router.get(
  "/getMyProfile",
  auth,
  isDepartmentTPO,
  getMyProfile
);

module.exports = router;
