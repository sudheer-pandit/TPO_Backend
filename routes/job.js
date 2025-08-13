const express = require("express");
const { applyJob, createJob, deleteJob, getAllJobs, getAllJobApplicant, updateJob, deleteApplication } = require("../controllers/Jobs");
const { auth, isStudent, isAdminTPO } = require("../middleware/auth");
const router = express.Router()

router.patch("/applyJob",auth,isStudent,applyJob);
router.post("/createJob",auth,isAdminTPO,createJob);
router.delete("/deleteJob",auth,isAdminTPO,deleteJob);
router.put("/updateJob",auth,isAdminTPO,updateJob);
router.get("/getAllJobs",auth,isAdminTPO,getAllJobs);
router.get("/getAllJobApplicant/:jobId",getAllJobApplicant);

router.patch("/deleteApplication",auth,isAdminTPO,deleteApplication);



module.exports = router