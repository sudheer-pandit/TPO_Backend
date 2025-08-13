const express = require("express")
const { login, signup, verifytoken, verifyemail, editProfile, validateToken } = require("../controllers/Auth")
const { auth } = require("../middleware/auth")
const router = express.Router()

router.post("/login",login)
router.post("/signup",signup)
router.get("/verifytoken/:token",verifytoken)
router.post("/verifyaccount",verifyemail)
router.put("/updateProfile",auth,editProfile);

router.get("/validateToken",auth,validateToken);



module.exports = router