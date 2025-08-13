const mongoose = require("mongoose");

const studentResultSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "job",
    },
    roundName: {
      type: String,
      required: true,
    },
    students: [{
      type: mongoose.Schema.Types.ObjectId, 
      ref: "placementDriveResult",
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("studentResultSchema", studentResultSchema);
