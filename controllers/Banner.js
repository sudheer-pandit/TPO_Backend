const Banner = require("../models/Banner");
const { imageDestroyer } = require("../utils/imageDelete");
const { uploadImageToCloudinary } = require("../utils/imageUploader");


exports.uploadBanner = async (req, res) => {
    try {

        const image = req?.files?.image;
        if (!image) {
            return res.status(400).json({
                success: false,
                message: "Please provide image",
            });
        }
        const bannerImage = await uploadImageToCloudinary(image, "TPO");

        await Banner.create({
            image: bannerImage?.secure_url,
        });
        return res.status(200).json({
            success: true,
            message: "Banner uploaded successfully",
        });
    } catch (error) {
        // console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in uploading images",
            error: error.message,
        });
    }
};

exports.getAllBanner = async (req, res) => {

    try {
        const banners = await Banner.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            message: "Banner fetched successfully",
            data: banners,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in fetching images",
            error: error.message,
        });
    }
}

exports.deleteBanner = async (req, res) => {
    try {
        const { bannerId } = req.body;
        const banner = await Banner.findById(bannerId);
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found",
            });
        }
        await imageDestroyer(banner?.image);
        await Banner.findByIdAndDelete(bannerId);
        return res.status(200).json({
            success: true,
            message: "Banner deleted successfully",
        });
    } catch (error) {
        // console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error in uploading images",
            error: error.message,
        });
    }
}