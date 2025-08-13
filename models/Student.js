// Import the Mongoose library
const e = require("express");
const mongoose = require("mongoose");

// Define the user schema using the Mongoose Schema constructor
const studentSchema = new mongoose.Schema(
  {
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "department",
    },
    regNo: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    marks10th: {
      type: Number,
      trim: true,
    },
    marks12th: {
      type: Number,
      trim: true,
    },
    currCGPA: {
      type: Number,
      trim: true,
    },
    backlog: {
      type: Number,
      trim: true,
    },
    resumeLink: {
      type: String,
    },
    session: {
      type: String,
      required: true,
      trim: true,
    },
    degree: {
      type: String,
      enum: ["B.Tech", "M.Tech"],
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "job",
        select: false,
      },
    ],
    placements: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "placement",
      select: false,
    },
  },

  { timestamps: true }
);

// Export the Mongoose model for the user schema, using the name "user"
module.exports = mongoose.model("student", studentSchema);
