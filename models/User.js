// Import the Mongoose library
const mongoose = require("mongoose");

// Define the user schema using the Mongoose Schema constructor
const userSchema = new mongoose.Schema(
  {
    // Define the name field with type String, required, and trimmed
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // Define the email field with type String, required, and trimmed
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    contactNo: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    // Define the password field with type String and required
    password: {
      type: String,
      required: true,
      select: false,
    },
    // Define the role field with type String and enum values of "Admin", "Student", or "Visitor"
    accountType: {
      type: String,
      default: "Student",
      enum: ["AdminTPO", "Student", "DepartmentTPO", "Alumni","Recruiter"],
      required: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
    },
    alumni: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "alumni",
    },
    tpoDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TPODetails",
    },
  },

  { timestamps: true }
);

// Export the Mongoose model for the user schema, using the name "user"
module.exports = mongoose.model("user", userSchema);
