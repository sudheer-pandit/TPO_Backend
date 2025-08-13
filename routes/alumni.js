const express = require("express");
const { auth } = require("../middleware/auth");
const { AlumniSignup, alumniverifyemail, getAllAlumni } = require("../controllers/Alumni");
const router = express.Router()

router.post("/signup",AlumniSignup); 
router.post("/verifyaccount",alumniverifyemail);



module.exports = router