const Feedback = require("../models/Feedback");

exports.createFeedback = async (req, res) => {
  try {
    const { id } = req.user;
    const { subject, feedbackType, message } = req.body;

    const newFeedback = await Feedback.create({
      subject,
      message,
      feedbackType,
      givenBy: id,
    });

    return res.status(200).json({
      success: true,
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error in submitting feedback`,
    });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({}).populate({
      path: "givenBy",
      populate: "student",
    });

    return res.status(200).json({
      data: feedback,
      success: true,
      message: "Feedback fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error in fetching feedback`,
      error: error.message,
    });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.body;
    const feedback = await Feedback.findByIdAndDelete(feedbackId);
    return res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error in fetching feedback`,
      error: error.message,
    });
  }
};
