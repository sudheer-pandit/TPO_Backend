// Import the Mongoose library
const mongoose = require("mongoose");

// Define the user schema using the Mongoose Schema constructor
const placementDetailsSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "company",
    },
    package: {
      type: Number,
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
    },
  },

  { timestamps: true }
);

// Export the Mongoose model for the user schema, using the name "user"
module.exports = mongoose.model("placementdetails", placementDetailsSchema);
