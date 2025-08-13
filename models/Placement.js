// Import the Mongoose library
const mongoose = require("mongoose");

// Define the user schema using the Mongoose Schema constructor
const placementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    regNo: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    contactNo: {
      type: String,
      trim: true,
    },
    session: {
      type: String,
      required: true,
      trim: true,
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "department",
    },
    placementDetails: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "placementdetails",
      },
    ],
    image: {
      type: String,
    },
    show: {
      type: Boolean,
      required: true,
      default: false,
    },
    userId : {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "user",
    }
  },

  { timestamps: true }
);

// Export the Mongoose model for the user schema, using the name "user"
module.exports = mongoose.model("placement", placementSchema);
