const mongoose = require("mongoose");

const TPODetails = new mongoose.Schema(
  {
    department: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "department",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TPODetails", TPODetails);
