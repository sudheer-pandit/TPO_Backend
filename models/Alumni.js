const mongoose = require("mongoose");

const alumniSchema = new mongoose.Schema(
  {
    hr: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "hrdetail",
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "company",
    },
    organisation : {
        type : String
    },
    organisationType : {
        type : String
    },
    designation : {
        type : String
    },
    working : {
      type :Boolean,
      required :true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("alumni", alumniSchema);
