// Import the Mongoose library
const mongoose = require("mongoose");

// Define the Job schema using the Mongoose Schema constructor
const jobsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    }, 
    branch: [{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "department",
    }],
    company: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "company",
    },
    package: {
      type: String, 
      trim: true,
    },
    role: {
      type: String,  
    },
    postedBy : {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    placementDrive : {
      type : Boolean,
      required: true,
    },
    applyLink : {
      type: String,
    },
    session : {
      type: String,
      required: true,
    },
    marks10th : {
      type : Number,
    },
    marks12th : {
      type : Number
    },
    currCGPA : {
      type : Number
    },
    backlog : {
      type : Number
    },
    lastDate : {
      type : Date, 
    },
    applicants : [{
      type: mongoose.Schema.Types.ObjectId, 
      ref: "user", 
      select :false,
    }],
    deleted:{
      type:Boolean,
      default:false,
      select :false,
    },
    approved : {
      type : Boolean,
      default:false,
      select :false,
    }
  },

  { timestamps: true }
);

// Export the Mongoose model for the job schema, using the name "user"
module.exports = mongoose.model("job", jobsSchema);
