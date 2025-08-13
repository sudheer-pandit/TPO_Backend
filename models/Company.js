const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    companyDesc: {
      type: String,
      trim: true,
      select: false,
    },
    contactNo: {
      type: String,
      trim: true,
      select: false,
    },
    email: {
      type: String,
      trim: true,
      select: false,
    },
    website: {
      type: String,
      trim: true,
      select: false,
    },
    noOfEmployees: {
      type: String,
      trim: true,
      select: false,
    },
    // hr: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "hrdetial",
    //     select: false,
    //   },
    // ],
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      select: false,
    },
    managedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        select: false,
      },
    ],
    approved: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("company", companySchema);
