const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
    {

        image: {
            type: String,
            required: true,
        },

    },
    { timestamps: true }
);

module.exports = mongoose.model("banner", bannerSchema);
