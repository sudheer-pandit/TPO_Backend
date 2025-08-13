const mongoose = require("mongoose");

const hrSchema = new mongoose.Schema(
  {
    hrName: {
      type: String,
      trim: true, 
    },
    hrEmail: {
      type: String,
      trim: true,
    },
    hrContactNo: {
      type: String,
      trim: true, 
    },
    company : {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("hrdetail", hrSchema);
