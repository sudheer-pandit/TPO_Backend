const express = require("express");
const { validateInviteToken, registerUsingCredential, getRecruiterJob, createJobByRecruiter } = require("../controllers/Recruiter");
const { auth } = require("../middleware/auth");

const router = express.Router()

router.get("/validateInviteToken",validateInviteToken);
router.post("/recruiterRegister",registerUsingCredential);

router.get("/getRecruiterJob",auth,getRecruiterJob);
router.post("/createJobByRecruiter",auth,createJobByRecruiter);



module.exports = router