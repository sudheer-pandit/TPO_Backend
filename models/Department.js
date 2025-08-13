const mongoose = require("mongoose");
 
const departmentSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      required: true,
      trim: true,
    },
    departmentName: {
      type: String,
      required: true,
      trim: true,
    },
    departmentCode: {
      type: String,
      required: true,
      trim: true,
    },
    departmentAbbr: {
      type: String,
      required: true,
      trim: true,
    },
  },

  { timestamps: true }
);
 
module.exports = mongoose.model("department", departmentSchema);
