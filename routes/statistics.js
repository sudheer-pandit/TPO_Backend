const express = require("express") 
const { getBranchWiseStudent, getBranchWisePlacement } = require("../controllers/Statistic");
const { auth } = require("../middleware/auth");
const router = express.Router()

// ********** Statistics ************// 

router.get("/getBranchWiseStudent",auth,getBranchWiseStudent)
router.get("/getBranchWisePlacement",auth,getBranchWisePlacement)



module.exports = router