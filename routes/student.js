const express = require("express"); 
const { getMyApplication, getMyProfile } = require("../controllers/Student");
const { auth,isStudent } = require("../middleware/auth");
const { getStudentJobs } = require("../controllers/Jobs");
const { createFeedback } = require("../controllers/Feedback");
const router = express.Router()

router.get("/getMyApplication",auth,isStudent,getMyApplication);

router.get("/getMyProfile",auth,isStudent,getMyProfile)
router.get("/getStudentJobs",auth,isStudent,getStudentJobs)
router.post("/feedback",auth,isStudent,createFeedback)



module.exports = router