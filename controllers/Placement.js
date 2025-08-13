const mongoose = require("mongoose");
const Placement = require("../models/Placement");
const PlacementDetails = require("../models/PlacementDetails");
const Student = require("../models/Student");
const User = require("../models/User");
const { imageDestroyer } = require("../utils/imageDelete");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createPlacement = async (req, res) => {
  const clientSession = await mongoose.startSession();
  clientSession.startTransaction();
  try {
    const {
      name,
      regNo,
      email,
      contactNo,
      userId,
      show = false,
      session,
      branch,
      placementDetail,
    } = req.body;
    const image = req?.files?.image;
    const placementDetails = JSON.parse(placementDetail);

    if (
      !name ||
      !regNo ||
      !session ||
      !branch ||
      !placementDetails.length > 0
    ) {
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }

    const placement = await Placement.findOne({ regNo }).session(clientSession);

    if (placement) {
      // Return 409 Already Present status code with error message
      return res.status(409).json({
        success: false,
        message: `Student with same Registration No is already present`,
      });
    }

    const insertedPlacement = await PlacementDetails.insertMany(
      placementDetails,
      { session: clientSession }
    );

    const record = insertedPlacement.map((doc) => doc._id);

    let profileImage;
    if (image) {
      profileImage = await uploadImageToCloudinary(image, "TPO");
    }

    const newPlacement = new Placement({
      name,
      regNo,
      email,
      contactNo,
      session,
      branch,
      placementDetails: record,
      show,
      userId: userId || null,
      image: profileImage?.secure_url,
    });
    await newPlacement.save({ session: clientSession });
    if (userId) {
      const user = await User.findById(userId);
      const student = await Student.findByIdAndUpdate(user?.student, {
        $push: { placements: newPlacement._id },
      });
    }

    await clientSession.commitTransaction();
    clientSession.endSession();
    return res.status(200).json({
      success: true,
      message: `Placement Record Added successfully`,
      data: newPlacement,
    });
  } catch (error) {
    await clientSession.abortTransaction();
    clientSession.endSession();
    // Return 500 Internal Server Error status code with error message

    return res.status(500).json({
      success: false,
      message: `Error while Adding Placement`,
      error: error.message,
    });
  }
};

exports.deletePlacement = async (req, res) => {
  try {
    const { placementId } = req.body;
    const placement = await Placement.findById(placementId);

    if (!placement) {
      // Return 401 Unauthorized status code with error message
      return res.status(404).json({
        success: false,
        message: `Placement is not found may be deleted`,
      });
    }
    placement.placementDetails.forEach(async (id) => {
      await PlacementDetails.findByIdAndDelete(id);
    });
    if (placement?.image) {
      await imageDestroyer(placement?.image);
    }
    await Placement.findByIdAndDelete(placementId);

    return res.status(200).json({
      success: true,
      message: `Placement Deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Error while deleting Placement`,
    });
  }
};

exports.getAllPlacement = async (req, res) => {
  try {
    const placement = await Placement.find().populate("branch").populate({
      path: "placementDetails",
      populate: "company",
    });

    return res.status(200).json({
      success: true,
      message: `Placement Fetched successfully`,
      data: placement,
    });
  } catch (error) {
    console.error(error);
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Error while fetching Placement`,
    });
  }
};

exports.updatePlacement = async (req, res) => {
  try {
    const {
      placementId,
      name,
      userId,
      regNo,
      email,
      contact,
      session,
      branch,
      company,
      package,
      placementDetail,
      show,
    } = req.body;
    const image = req?.files?.image;
    const placementDetails = JSON.parse(placementDetail);
    let profileImage;
    if (image) {
      profileImage = await uploadImageToCloudinary(image, "TPO");
    }
    let record = [];
    const dbPlacement = await Placement.findById(placementId);

    for (let i = 0; i < placementDetails.length; i++) {
      const doc = placementDetails[i];
      if (!doc?._id) {
        const newrecord = await PlacementDetails.create({
          company: doc.company,
          designation: doc.designation,
          package: doc.package,
        });
        record.push(newrecord._id);
      }
    }

    // deleting the previous details and updating
    for (let i = 0; i < dbPlacement.placementDetails.length; i++) {
      const doc = dbPlacement.placementDetails[i];
      const isPresent = placementDetails.find(
        (item) => item._id === doc.toString()
      );
      if (isPresent) {
        const updated = await PlacementDetails.findByIdAndUpdate(
          isPresent._id,
          {
            company: isPresent.company,
            designation: isPresent.designation,
            package: isPresent.package,
          }
        );
        record.push(updated._id);
      } else {
        await PlacementDetails.findByIdAndDelete(doc._id);
      }
    }

    const userID = userId.length > 0 ? userId : null;

    const updated = await Placement.findByIdAndUpdate(placementId, {
      name,
      regNo,
      userId : userID,
      email,
      contact,
      session,
      branch,
      company,
      package,
      placementDetails: record,
      show,
      image: profileImage?.secure_url,
    });

    return res.status(200).json({
      success: true,
      message: `Placement Updated successfully`,
      data: updated,
    });
  } catch (err) {
    return res.status(500).json({
      success: true,
      message: `Error while updating placement`,
      error: err.message,
    });
  }
};

exports.getPlacementRecords = async (req, res) => {
  try {
    const results = await Placement.aggregate([
      {
        $match: {
          show: true, // Add this match stage to filter documents where show is true
        },
      },
      {
        $lookup: {
          from: "departments", // collection name for department
          localField: "branch",
          foreignField: "_id",
          as: "branchDetails",
        },
      },
      {
        $unwind: "$branchDetails",
      },
      {
        $lookup: {
          from: "placementdetails", // collection name for placementdetails
          localField: "placementDetails",
          foreignField: "_id",
          as: "placementDetails",
        },
      },
      {
        $unwind: "$placementDetails",
      },
      {
        $lookup: {
          from: "companies", // collection name for company
          localField: "placementDetails.company",
          foreignField: "_id",
          as: "placementDetails.companyDetails",
        },
      },
      {
        $unwind: "$placementDetails.companyDetails",
      },
      {
        $group: {
          _id: {
            session: "$session", // Group by session first
            placementId: "$_id", // Maintain placement ID for later grouping
          },
          name: { $first: "$name" },
          regNo: { $first: "$regNo" },
          branch: { $first: "$branchDetails.departmentName" },
          image: { $first: "$image" },
          placementDetails: {
            $push: {
              _id: "$placementDetails._id",
              company: "$placementDetails.companyDetails.companyName",
              package: "$placementDetails.package",
              designation: "$placementDetails.designation",
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id.session", // Second group by session
          placements: {
            $push: {
              _id: "$_id.placementId", // Maintain placement ID
              name: "$name",
              regNo: "$regNo",
              branch: "$branch",
              image: "$image",
              show: "$show",
              userId: "$userId",
              createdAt: "$createdAt",
              updatedAt: "$updatedAt",
              placementDetails: "$placementDetails",
            },
          },
        },
      },
      {
        $sort: { _id: -1 }, // sort by session if needed
      },
    ]);
    return res.status(200).json({
      success: true,
      message: `Placement fetched successfully`,
      data: results,
    });
  } catch (err) {
    return res.status(500).json({
      success: true,
      message: `Error while fetching placement`,
    });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { imageUrl, placementId } = req.body;

    const deleteImage = await imageDestroyer(imageUrl);
    if (deleteImage) {
      Placement.findByIdAndUpdate(placementId, {
        image: "",
      });
    }
    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error while deleting image`,
    });
  }
};
