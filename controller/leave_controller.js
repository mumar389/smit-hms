const Leave = require("../models/leave");

module.exports.getLeaveById = async (req, res) => {
  try {
    const lid = req.params.id;
    const currentLeave = await Leave.findById(lid)
      .populate("user")
      .select("-password");
    if (!currentLeave) {
      return res.status(301).json({
        message: "Unable to Find the leave",
      });
    }
    console.log("Cu-:",currentLeave);
    return res.status(200).json({
      message: "Your Leave",
      data: currentLeave,
    });
  } catch (error) {
    return res.status(501).json({
      message: "Internal Server Error",
    });
  }
};

module.exports.approveLeaveByparent = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(301).json({
        message: "Status cannot be empty",
      });
    }
    const currentLeave = await Leave.findById(req.params.id);
    if (!currentLeave) {
      return res.status(301).json({
        message: "Unable to Find the leave",
      });
    }
    if (currentLeave.parentApproval === "Approved") {
      return res.status(301).json({
        message: "Leave Already Approved by You",
      });
    }
    currentLeave.parentApproval=status;
    currentLeave.save();
    return res.status(200).json({
      message: `You have ${status} the leave`,
    });
  } catch (error) {
    return res.status(501).json({
      message: "Internal Server Error",
    });
  }
};
