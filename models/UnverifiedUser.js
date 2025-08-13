// Import the Mongoose library
const mongoose = require("mongoose");

// Define the user schema using the Mongoose Schema constructor
const unVerifiedUser = new mongoose.Schema({
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
    unique: true
  },
  // Define the password field with type String and required
  password: {
    type: String,
    required: true,
    select: true,
  },
  // Define the role field with type String and enum values of "Admin", "Student", or "Visitor"
  accountType: {
    type: String,
    default: "Student",
    enum: ["AdminTPO", "Student", "DepartmentTPO", "Alumni"],
    required: true,
  },
  token: {
    type: String,
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Department",
  },
  regNo: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  marks10th: {
    type: String, 
    trim: true,
  },
  marks12th: {
    type: String, 
    trim: true,
  },
  currCGPA: {
    type: String, 
    trim: true,
  },
  backlog: {
    type: Number,
    trim: true,
  },
  resumeLink : {
      type : String,
  },
  session : {
    type: String,
    required: true,
    trim: true,
  },
  degree : {
      type: String,
      enum : ["B.Tech","M.Tech"]
  },
  designation : {
    type: String,
  },
  organisation : {
    type: String,
  },
  organisationType : {
    type: String,
  },
  working : {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 60 * 60,
  },
});

// Export the Mongoose model for the user schema, using the name "user"
module.exports = mongoose.model("unVerifiedUser", unVerifiedUser);
