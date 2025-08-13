const express = require("express")
const {getAllDepartment } = require("../controllers/Department");
const { getPlacementRecords } = require("../controllers/Placement");
const router = express.Router()

router.get("/getAllDepartment",getAllDepartment);
router.get("/getPlacementRecords",getPlacementRecords)


module.exports = router